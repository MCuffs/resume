import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from './_lib/rateLimit';

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabaseAdmin: any = null;
if (supabaseUrl && supabaseKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const CONSULTING_PRICE_USD_BY_SERVICE: Record<string, string> = {
  'Korean Resume Review': '21.99',
  'Custom Interview Questions': '49.99',
};

function sanitizeText(v: unknown, max = 2000): string {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

function normalizeAmount(amount: unknown): string {
  const num = Number(amount);
  if (!Number.isFinite(num)) return '';
  return num.toFixed(2);
}

function getPayPalApiBase() {
  const mode = String(process.env.PAYPAL_ENV || '').trim().toLowerCase();
  return mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
}

async function getPayPalAccessToken() {
  const clientId = sanitizeText(process.env.PAYPAL_CLIENT_ID, 200);
  const secret = sanitizeText(process.env.PAYPAL_CLIENT_SECRET, 200);
  if (!clientId || !secret) throw new Error('PayPal server credentials are not configured');

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const response = await fetch(`${getPayPalApiBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const payload: any = await response.json();
  if (!response.ok || !payload?.access_token) {
    throw new Error(payload?.error_description || payload?.error || 'Failed to get PayPal access token');
  }

  return payload.access_token as string;
}

async function verifyConsultingPayment(orderId: string, service: string) {
  if (!orderId) throw new Error('Missing PayPal order id');
  const expectedAmount = CONSULTING_PRICE_USD_BY_SERVICE[service];
  if (!expectedAmount) throw new Error('Unsupported consulting service');

  const token = await getPayPalAccessToken();
  const response = await fetch(`${getPayPalApiBase()}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const order: any = await response.json();
  if (!response.ok) throw new Error(order?.message || 'Failed to fetch PayPal order');
  if (order?.status !== 'COMPLETED') throw new Error(`Payment is not completed (status: ${order?.status || 'unknown'})`);

  const unit = Array.isArray(order?.purchase_units) ? order.purchase_units[0] : null;
  const currency = unit?.amount?.currency_code;
  const amount = normalizeAmount(unit?.amount?.value);
  if (currency !== 'USD' || amount !== normalizeAmount(expectedAmount)) {
    throw new Error('PayPal amount/currency mismatch');
  }

  return {
    orderId: order.id,
    amount,
    currency,
    status: order.status,
  };
}

function isLikelyPdf(file: any) {
  const mime = String(file?.mimetype || '').toLowerCase();
  const name = String(file?.originalFilename || file?.newFilename || '').toLowerCase();
  return mime.includes('pdf') || name.endsWith('.pdf');
}

function buildSafeFileName(name: string) {
  return String(name || 'resume.pdf')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 120);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if ((req.method || 'GET').toUpperCase() !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const limiter = rateLimit(req, 'consulting-request', { limit: 15, windowMs: 10 * 60 * 1000 });
  if (!limiter.ok) {
    return res.status(429).json({ ok: false, error: 'Too many requests. Please retry later.' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ ok: false, error: 'Supabase admin is not configured' });
  }

  const form = formidable({ maxFileSize: 15 * 1024 * 1024, multiples: true });
  let files: any = null;

  const cleanup = () => {
    const target = files
      ? [
          ...(Array.isArray(files.englishResume) ? files.englishResume : files.englishResume ? [files.englishResume] : []),
          ...(Array.isArray(files.koreanResume) ? files.koreanResume : files.koreanResume ? [files.koreanResume] : []),
        ]
      : [];
    for (const file of target) {
      try {
        fs.unlinkSync(file.filepath);
      } catch {}
    }
  };

  try {
    const [fields, parsedFiles] = (await form.parse(req)) as any;
    files = parsedFiles;
    const englishResume = Array.isArray(parsedFiles.englishResume) ? parsedFiles.englishResume[0] : parsedFiles.englishResume;
    const koreanResume = Array.isArray(parsedFiles.koreanResume) ? parsedFiles.koreanResume[0] : parsedFiles.koreanResume;
    if (!englishResume || !koreanResume) {
      cleanup();
      return res.status(400).json({ ok: false, error: 'Both English and Korean resume PDFs are required' });
    }
    if (!isLikelyPdf(englishResume) || !isLikelyPdf(koreanResume)) {
      cleanup();
      return res.status(400).json({ ok: false, error: 'Only PDF files are allowed' });
    }

    const service = sanitizeText(Array.isArray(fields.service) ? fields.service[0] : fields.service, 120);
    const servicePrice = sanitizeText(Array.isArray(fields.servicePrice) ? fields.servicePrice[0] : fields.servicePrice, 40);
    const name = sanitizeText(Array.isArray(fields.name) ? fields.name[0] : fields.name, 120);
    const email = sanitizeText(Array.isArray(fields.email) ? fields.email[0] : fields.email, 180);
    const targetCompany = sanitizeText(Array.isArray(fields.targetCompany) ? fields.targetCompany[0] : fields.targetCompany, 200);
    const brief = sanitizeText(Array.isArray(fields.brief) ? fields.brief[0] : fields.brief, 4000);
    const paymentReference = sanitizeText(Array.isArray(fields.paymentReference) ? fields.paymentReference[0] : fields.paymentReference, 120);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!service || !name || !email || !targetCompany || !brief) {
      cleanup();
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }
    if (!emailRegex.test(email)) {
      cleanup();
      return res.status(400).json({ ok: false, error: 'Invalid email format' });
    }
    const payment = await verifyConsultingPayment(paymentReference, service);

    const requestId = `CONSULT-${Date.now()}`;
    const bucket = process.env.SUPABASE_CONSULTING_BUCKET || 'consulting-resumes';
    const { data: existingBucket } = await supabaseAdmin.storage.getBucket(bucket);
    if (!existingBucket) {
      const { error: bucketErr } = await supabaseAdmin.storage.createBucket(bucket, { public: false });
      if (bucketErr && !String(bucketErr.message || '').toLowerCase().includes('already exists')) {
        throw new Error(`Failed to create storage bucket: ${bucketErr.message}`);
      }
    }

    const now = new Date();
    const basePath = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${requestId}`;

    const uploadFile = async (file: any, label: string) => {
      const safeName = `${label}_${buildSafeFileName(file.originalFilename || file.newFilename || 'resume.pdf')}`;
      const storagePath = `${basePath}/${safeName}`;
      const fileBuffer = fs.readFileSync(file.filepath);
      const { error: uploadErr } = await supabaseAdmin.storage.from(bucket).upload(storagePath, fileBuffer, {
        contentType: file.mimetype || 'application/pdf',
        upsert: false,
      });
      if (uploadErr) throw new Error(`Failed to upload ${label} resume: ${uploadErr.message}`);

      const { data: signed, error: signErr } = await supabaseAdmin.storage.from(bucket).createSignedUrl(storagePath, 60 * 60 * 24 * 14);
      if (signErr) throw new Error(`Failed to sign ${label} resume: ${signErr.message}`);

      return {
        fileName: file.originalFilename || file.newFilename || 'resume.pdf',
        size: file.size || 0,
        storagePath,
        signedUrl: signed?.signedUrl || null,
      };
    };

    const englishFile = await uploadFile(englishResume, 'english');
    const koreanFile = await uploadFile(koreanResume, 'korean');
    cleanup();

    const { error: insertErr } = await supabaseAdmin.from('consulting_requests').insert({
      request_id: requestId,
      service,
      service_price: servicePrice,
      applicant_name: name,
      applicant_email: email,
      target_company: targetCompany,
      client_notes: brief,
      payment_reference: paymentReference || null,
      payment_status: payment.status || 'paid_submitted',
      english_file_name: englishFile.fileName,
      english_file_size: englishFile.size,
      english_storage_path: englishFile.storagePath,
      korean_file_name: koreanFile.fileName,
      korean_file_size: koreanFile.size,
      korean_storage_path: koreanFile.storagePath,
    });
    if (insertErr) throw new Error(`Database insert failed: ${insertErr.message}`);

    return res.status(200).json({ ok: true, requestId, paymentVerification: payment, files: { englishResume: englishFile, koreanResume: koreanFile } });
  } catch (error: any) {
    cleanup();
    return res.status(500).json({ ok: false, error: error?.message || 'Failed to process consulting request' });
  }
}
