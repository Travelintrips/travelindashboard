import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

let url: string;
let key: string;

if (import.meta.env.PROD) {
  url = import.meta.env.VITE_SUPABASE_URL;
  key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase environment variables are required in production');
  }
} else {
  url = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
  key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
  
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('Supabase environment variables missing - using development placeholders');
  }
}

export const supabase = createClient<Database>(url, key);

export type SupabaseClient = typeof supabase;
