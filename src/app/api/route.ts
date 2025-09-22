import { createClient } from "../utils/supabase/server"
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.from("Build").select("*");

  return Response.json({data, error});
}

