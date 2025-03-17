import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

// Use default values if environment variables are not available
// This prevents the app from crashing during development
const url = supabaseUrl || "https://placeholder-url.supabase.co";
const key = supabaseAnonKey || "placeholder-key";

export const supabase = createClient<Database>(url, key);

export type SupabaseClient = typeof supabase;
