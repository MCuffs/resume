import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from '../_lib/supabaseAdmin';
import { rateLimit } from '../_lib/rateLimit';

const ALLOWED_ISSUES = new Set([
  'tone',
  'accuracy',
  'missing_keywords',
  'format',
  'too_generic',
  'grammar',
  'other',
]);

type FeedbackBody = {
  rating?: number;
  issues?: string[];
  comment?: string;
  sessionId?: string;
  generationModel?: string;
  generationAttempt?: number;
  formType?: 'ResumeFeedback';
};

function sanitizeString(v: unknown, max = 2000): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  if (!s) return null;
  return s.slice(0, max);
}

function sanitizeIssues(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter((x) => x && ALLOWED_ISSUES.has(x))
    .slice(0, 5);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if ((req.method || 'GET').toUpperCase() !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const rl = rateLimit(req, 'resume_feedback', { limit: 8, windowMs: 10 * 60 * 1000 });
    if (!rl.ok) return res.status(429).json({ ok: false, error: 'Too many requests. Try again later.' });

    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as FeedbackBody;
    const rating = Number(body?.rating);
    const issues = sanitizeIssues(body?.issues);
    const comment = sanitizeString(body?.comment, 2000);
    const sessionId = sanitizeString(body?.sessionId, 100);
    const generationModel = sanitizeString(body?.generationModel, 120);
    const generationAttempt = Number(body?.generationAttempt || 0);
    const ip =
      (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ||
      (req.socket as any)?.remoteAddress ||
      null;
    const ua = sanitizeString(req.headers['user-agent'], 400);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ ok: false, error: 'rating must be an integer from 1 to 5' });
    }

    const supabase = getSupabaseAdmin();
    const payload = {
      created_at: new Date().toISOString(),
      ip,
      user_agent: ua,
      session_id: sessionId,
      rating,
      issues,
      comment,
      generation_model: generationModel,
      generation_attempt: Number.isFinite(generationAttempt) ? generationAttempt : null,
    };

    const { error } = await supabase.from('resume_feedback_events').insert(payload);
    if (error) throw new Error(error.message);

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Internal server error' });
  }
}
