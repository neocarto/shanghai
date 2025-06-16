import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://kueodidcmdsxaoctjtug.supabase.co/";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1ZW9kaWRjbWRzeGFvY3RqdHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NzE0NzYsImV4cCI6MjA2NTI0NzQ3Nn0.zuRgrGhf-PwpeX_1yJaUxXda4-uKw4Fk6gxrhcelpZI";
export const supabase = createClient(supabaseUrl, supabaseKey);
const adminEmail = "admin@monapp.local";

export async function loginWithPasswordOnly(password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password,
  });
  if (error) {
    console.error("Erreur login:", error.message);
    return false;
  }
  return true;
}
