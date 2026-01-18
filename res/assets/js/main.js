import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://irvazdxcjjnjvilkpoqj.supabase.co";
const supabaseKey = "sb_publishable_Wh3FU7a6kxGTG2hbOETZBA_tcTNe-Ba";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test query
const { data, error } = await supabase
  .from("guests")
  .select("name, surname");

if (error) {
  console.error("Supabase error:", error);
} else {
  console.log("Guests:", data);
}
