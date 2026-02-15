import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://irvazdxcjjnjvilkpoqj.supabase.co";
const supabaseKey = "sb_publishable_Wh3FU7a6kxGTG2hbOETZBA_tcTNe-Ba";

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getWeddingGuests(name, surname) {
  const { data, error } = await supabase
      .from("guests")
      .select("name,surname,invite_code,invite_type,presence")
      .ilike("name", '%' + name + '%')
      .ilike("surname", '%' + surname + '%');
  return data;
}

export async function getGuestData(inviteCode) {
  const { data, error } = await supabase
      .from("guests")
      .select("presence, menu, allergies, transport, return_time")
      .eq('invite_code', inviteCode);
  return data[0];
}

export async function getMenuList() {
  const { data, error } = await supabase
      .from("menu")
      .select("*");
  return data;
}

export async function updateGuestData(inviteCode, presence, menu, allergies, needTransportation) {
  const { data, error } = await supabase
      .from('guests')
      .update({
        presence: presence,
        menu: menu,
        allergies: allergies,
        transport: needTransportation
      })
      .eq('invite_code', inviteCode)
      .select();
}
