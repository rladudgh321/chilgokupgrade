import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

// GET: 모든 배너 조회
export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("WebViewBanner")
      .select("*")
      .order("order", { ascending: true, nullsLast: true });

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// POST: 새 배너 추가
export async function POST(request: NextRequest) {
  try {
    const { imageUrl, imageName } = await request.json();
    if (!imageUrl || !imageName) {
      return NextResponse.json(
        { ok: false, error: { message: "이미지 정보가 필요합니다." } },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("WebViewBanner")
      .insert([{ imageUrl, imageName }])
      .select();

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "배너가 추가되었습니다.", data: data[0] },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// DELETE: 배너 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { ok: false, error: { message: "삭제할 ID가 필요합니다." } },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from("WebViewBanner")
      .delete()
      .eq("id", Number(id));

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "배너가 삭제되었습니다." },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}
