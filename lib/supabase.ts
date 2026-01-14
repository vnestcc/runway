import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and keys lazily to avoid build-time errors
const getSupabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const getSupabaseAnonKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const getSupabaseServiceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client-side Supabase client
let supabaseInstance: any = null;
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    if (!supabaseInstance) {
      const url = getSupabaseUrl();
      const key = getSupabaseAnonKey();
      if (url && key) {
        supabaseInstance = createClient(url, key);
      }
    }
    return supabaseInstance ? supabaseInstance[prop] : undefined;
  }
});

// Server-side Supabase client with service role (for API routes)
export const getServiceSupabase = () => {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceKey();
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
