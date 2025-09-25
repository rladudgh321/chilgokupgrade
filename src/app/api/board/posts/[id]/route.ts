import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const idNum = Number(id);
    
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return NextResponse.json({ message: "유효하지 않은 ID" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from("BoardPost")
      .delete()
      .eq("id", idNum);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "게시글이 성공적으로 삭제되었습니다" 
    });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "서버 오류" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const idNum = Number(id);
    
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return NextResponse.json({ message: "유효하지 않은 ID" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("BoardPost")
      .select(`*`)
      .eq("id", idNum)
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ message: "게시글을 찾을 수 없습니다" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "서버 오류" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const idNum = Number(id);
    
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return NextResponse.json({ message: "유효하지 않은 ID" }, { status: 400 });
    }

    const raw = await req.json().catch(() => null);
    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ message: "잘못된 요청 본문" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("BoardPost")
      .update(raw)
      .eq("id", idNum)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ message: "게시글을 찾을 수 없습니다" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "게시글이 성공적으로 수정되었습니다", 
      data 
    });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "서버 오류" }, { status: 500 });
  }
}
