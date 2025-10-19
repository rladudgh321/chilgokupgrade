import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const id = params.id;

    const { data, error } = await supabase
      .from('BoardPost')
      .select('id, title, content, views, createdAt, registrationDate, BoardCategory(name)')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching post:', error);
      return NextResponse.json({ message: "Error fetching post", error }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "서버 오류" }, { status: 500 });
  }
}
