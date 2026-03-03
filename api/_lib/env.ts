export function mustGetEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function getEnv(name: string): string | undefined {
  return process.env[name] || undefined;
}

// Backward-compat helpers (this repo previously used VITE_* in serverless code).
export function getSupabaseUrl(): string | undefined {
  return getEnv('SUPABASE_URL') ?? getEnv('VITE_SUPABASE_URL');
}

export function getSupabaseAnonKey(): string | undefined {
  return getEnv('SUPABASE_ANON_KEY') ?? getEnv('VITE_SUPABASE_ANON_KEY');
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return getEnv('SUPABASE_SERVICE_ROLE_KEY');
}

export function getThreadsAppId(): string | undefined {
  return getEnv('VITE_THREADS_APP_ID') ?? getEnv('THREADS_APP_ID');
}

export function getThreadsRedirectUri(): string | undefined {
  return getEnv('VITE_THREADS_REDIRECT_URI') ?? getEnv('THREADS_REDIRECT_URI');
}

export function getThreadsAppSecret(): string | undefined {
  return getEnv('THREADS_APP_SECRET');
}

