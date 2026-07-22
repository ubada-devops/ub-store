import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use format-compliant placeholders to prevent createClient from throwing an uncaught exception on load.
// If the user hasn't configured variables, requests will fail gracefully with normal network errors instead of crashing the site.
const activeUrl = supabaseUrl && supabaseUrl.trim() !== ''
  ? supabaseUrl
  : 'https://placeholder-project.supabase.co';

const activeKey = supabaseAnonKey && supabaseAnonKey.trim() !== ''
  ? supabaseAnonKey
  : 'placeholder-anon-key';

export const supabase = createClient(activeUrl, activeKey);
export default supabase;
