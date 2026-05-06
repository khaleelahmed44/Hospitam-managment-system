import { createClient } from '@supabase/supabase-js';

// These variables should be defined in your .env.local or Vercel environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lkyipwnpktbppfvehmas.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Supabase Client
 * 
 * Ready for migration or dual-database usage. 
 * Ensure VITE_SUPABASE_ANON_KEY is set in your environment variables.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
