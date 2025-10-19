import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('BoardPost')
    .select('id, title, content, views, createdAt, registrationDate, BoardCategory(name)')
    .eq('isPublished', true)
    .order('createdAt', { ascending: false });
    
  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  console.log('datadata',data);
  return data;
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "서버 오류" }, { status: 500 });
  }
}
