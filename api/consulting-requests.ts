import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from './_lib/supabaseAdmin';

function sanitizeString(v: unknown, max = 200) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

function extractDashboardKey(req: VercelRequest) {
  const headerKey = sanitizeString(req.headers['x-dashboard-key']);
  if (headerKey) return headerKey;

  const authHeader = sanitizeString(req.headers.authorization, 400);
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    return sanitizeString(authHeader.slice(7));
  }

  return '';
}

async function createSignedUrlSafe(supabase: any, bucket: string, storagePath: string | null, expiresInSec = 60 * 60 * 24 * 14) {
  if (!storagePath) return null;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(storagePath, expiresInSec);
  if (error) return null;
  return data?.signedUrl || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if ((req.method || 'GET').toUpperCase() !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const expectedKey = sanitizeString(process.env.DASHBOARD_ADMIN_KEY);
  if (!expectedKey) {
    return res.status(503).json({ ok: false, error: 'Dashboard admin key is not configured on server' });
  }

  const providedKey = extractDashboardKey(req);
  if (!providedKey || providedKey !== expectedKey) {
    return res.status(401).json({ ok: false, error: 'Unauthorized dashboard access' });
  }

  try {
    const supabase = getSupabaseAdmin();
    const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 200);
    const bucket = process.env.SUPABASE_CONSULTING_BUCKET || 'consulting-resumes';

    const { data, error } = await supabase
      .from('consulting_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new Error(`Failed to load consulting requests: ${error.message}`);

    const items = [];
    for (const row of data || []) {
      items.push({
        id: row.id,
        requestId: row.request_id,
        createdAt: row.created_at,
        service: row.service,
        servicePrice: row.service_price,
        applicantName: row.applicant_name,
        applicantEmail: row.applicant_email,
        targetCompany: row.target_company,
        clientNotes: row.client_notes,
        paymentReference: row.payment_reference,
        paymentStatus: row.payment_status,
        englishFileName: row.english_file_name,
        englishFileSize: row.english_file_size,
        englishUrl: await createSignedUrlSafe(supabase, bucket, row.english_storage_path),
        koreanFileName: row.korean_file_name,
        koreanFileSize: row.korean_file_size,
        koreanUrl: await createSignedUrlSafe(supabase, bucket, row.korean_storage_path),
      });
    }

    return res.status(200).json({ ok: true, items });
  } catch (error: any) {
    return res.status(500).json({ ok: false, error: error?.message || 'Failed to load consulting requests' });
  }
}
