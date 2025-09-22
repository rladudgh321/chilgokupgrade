/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limitIn = parseInt(searchParams.get("limit") ?? "10", 10);
    const limit = Math.min(100, Math.max(1, limitIn || 10));
    const keyword = searchParams.get("keyword")?.trim() || undefined;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = createClient(cookies());

    // 기본: deletedAt IS NULL
    let q = supabase
      .from("Build")                              // 테이블명 대소문자 주의
      .select("*", { count: "exact" })
      .is("deletedAt", null)
      .order("createdAt", { ascending: false })
      .range(from, to);

    // keyword: 숫자면 id 정확히, 아니면 address ILIKE
    if (keyword) {
      if (/^\d+$/.test(keyword)) q = q.eq("id", Number(keyword));
      else q = q.ilike("address", `%${keyword}%`);
    }

    const { data, error, count } = await q;
    if (error) return NextResponse.json({ ok: false, error }, { status: 400 });

    return NextResponse.json({
      ok: true,
      totalItems: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
      currentPage: page,
      data: data ?? [],
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const body = await request.json();

    const { data, error } = await supabase
      .from("Build")       // 테이블명: 대소문자 정확히!
      .insert([body])      // 여러 건이면 배열에 더 넣으면 됨
      .select();           // 방금 삽입된 행을 함께 반환

    if (error) {
      // RLS 정책 위반/필드 오류 등
      return NextResponse.json(
        { ok: false, error },
        { status: 400 }
      );
    }

    // 3) 캐시 무효화(방문자에게 동일 화면 유지하다가, 쓰기 시 즉시 갱신)
    //    읽기 fetch에서 next:{tags:['builds']} 를 썼다는 가정
    // revalidateTag("builds");
    // 필요 시 특정 경로 HTML ISR도 동시 무효화
    // revalidatePath("/builds");
    // revalidatePath("/");

       return NextResponse.json(
        { ok: true, data },
        { status: 201 }
      );
    } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

