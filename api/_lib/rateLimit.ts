import type { VercelRequest } from '@vercel/node';

type Entry = { resetAt: number; count: number };

// Best-effort in-memory limiter (per serverless instance). Still useful against bursts.
const buckets = new Map<string, Entry>();

function nowMs() {
  return Date.now();
}

function getIp(req: VercelRequest): string {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.trim()) return xf.split(',')[0].trim();
  return (req.socket as any)?.remoteAddress || 'unknown';
}

export function rateLimit(req: VercelRequest, key: string, opts: { limit: number; windowMs: number }) {
  const ip = getIp(req);
  const bucketKey = `${key}:${ip}`;
  const t = nowMs();
  const e = buckets.get(bucketKey);

  if (!e || e.resetAt <= t) {
    buckets.set(bucketKey, { resetAt: t + opts.windowMs, count: 1 });
    return { ok: true as const, remaining: opts.limit - 1, resetAt: t + opts.windowMs };
  }

  if (e.count >= opts.limit) {
    return { ok: false as const, remaining: 0, resetAt: e.resetAt };
  }

  e.count += 1;
  return { ok: true as const, remaining: opts.limit - e.count, resetAt: e.resetAt };
}

