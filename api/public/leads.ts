import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from '../_lib/supabaseAdmin';
import { rateLimit } from '../_lib/rateLimit';

type CreatorLead = {
  formType: 'CreatorApplication';
  name: string;
  phone: string;
  email: string;
  platform: 'threads';
  channelUrl: string;
  followers: string;
  engagement: string;
  category: string;
  agreed: boolean;
  handle?: string;
};

type BrandLead = {
  formType: 'BrandApplication';
  companyName: string;
  contactName: string;
  email: string;
  website?: string;
  productName: string;
  campaignGoal: 'sales' | 'branding' | 'traffic';
  budget: string;
  message?: string;
};

type Lead = (CreatorLead | BrandLead) & { timestamp?: string };

function isPost(req: VercelRequest) {
  return (req.method || 'GET').toUpperCase() === 'POST';
}

function jsonBody(req: VercelRequest): any {
  if (typeof req.body === 'string') return JSON.parse(req.body);
  return req.body;
}

function isEmail(v: unknown): v is string {
  return typeof v === 'string' && v.includes('@') && v.length <= 254;
}

function sanitizeString(v: unknown, max = 4000): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  if (!s) return null;
  return s.slice(0, max);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isPost(req)) return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const rl = rateLimit(req, 'public_leads', { limit: 10, windowMs: 10 * 60 * 1000 });
    if (!rl.ok) return res.status(429).json({ ok: false, error: 'Too many requests. Try again later.' });

    const body = jsonBody(req) as Lead;
    const now = new Date().toISOString();
    const ip =
      (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ||
      (req.socket as any)?.remoteAddress ||
      null;

    if (!body?.formType) return res.status(400).json({ ok: false, error: 'Missing formType' });

    const supabase = getSupabaseAdmin();

    if (body.formType === 'CreatorApplication') {
      const name = sanitizeString(body.name, 200);
      const phone = sanitizeString(body.phone, 50);
      const email = isEmail(body.email) ? body.email : null;
      const channelUrl = sanitizeString(body.channelUrl, 300);
      const followers = sanitizeString(body.followers, 100);
      const engagement = sanitizeString(body.engagement, 200);
      const category = sanitizeString(body.category, 80);
      const agreed = !!body.agreed;
      const handle = sanitizeString(body.handle, 120);

      if (!name || !phone || !email || !channelUrl || !followers || !engagement || !category || !agreed) {
        return res.status(400).json({ ok: false, error: 'Missing required fields' });
      }

      const payload = {
        created_at: now,
        ip,
        name,
        phone,
        email,
        platform: 'threads',
        channel_url: channelUrl,
        handle,
        followers,
        engagement,
        category,
        agreed,
      };

      const { error } = await supabase.from('creator_applications').insert(payload);
      if (error) throw new Error(error.message);
      return res.status(200).json({ ok: true });
    }

    if (body.formType === 'BrandApplication') {
      const companyName = sanitizeString(body.companyName, 200);
      const contactName = sanitizeString(body.contactName, 200);
      const email = isEmail(body.email) ? body.email : null;
      const website = sanitizeString(body.website, 300);
      const productName = sanitizeString(body.productName, 200);
      const budget = sanitizeString(body.budget, 80);
      const message = sanitizeString(body.message, 4000);
      const goal = body.campaignGoal;

      if (!companyName || !contactName || !email || !productName || !budget) {
        return res.status(400).json({ ok: false, error: 'Missing required fields' });
      }
      if (!['sales', 'branding', 'traffic'].includes(goal)) {
        return res.status(400).json({ ok: false, error: 'Invalid campaignGoal' });
      }

      const payload = {
        created_at: now,
        ip,
        company_name: companyName,
        contact_name: contactName,
        email,
        website,
        product_name: productName,
        campaign_goal: goal,
        budget,
        message,
      };

      const { error } = await supabase.from('brand_inquiries').insert(payload);
      if (error) throw new Error(error.message);
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ ok: false, error: 'Unknown formType' });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Internal server error' });
  }
}
