import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl = 'https://irvazdxcjjnjvilkpoqj.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

let { data: guests, error } = await supabase
  .from('guests')
  .select('name,surname')

console.log(guests);
