import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://jtbwhrrunmgmxjfkavmy.supabase.co/";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0YndocnJ1bm1nbXhqZmthdm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMjg5NzYsImV4cCI6MjA1NTYwNDk3Nn0.X3Ic9Uv1L-qWwl09oB2kw5YlPwgbjontSclTDYIGvHQ";

// ✅ Adding types for better error handling
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
