import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (supabaseUrl === 'https://placeholder-project.supabase.co' || supabaseAnonKey === 'placeholder-anon-key') {
  console.warn(
    'Supabase Environment configuration missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file to connect the live database.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
