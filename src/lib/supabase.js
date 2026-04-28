import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iitjzpfxvqgdjldpswxd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpdGp6cGZ4dnFnZGpsZHBzd3hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTQxMjEsImV4cCI6MjA5Mjg5MDEyMX0.wVk1uMQL3juu_5XY81eWpWgnVz0liin1ZhOrVDIfxHw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'mahmudovnihad537@gmail.com';
