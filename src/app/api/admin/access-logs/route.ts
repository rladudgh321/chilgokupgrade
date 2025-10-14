import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
      const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from('access_logs')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching access logs:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in access logs route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
