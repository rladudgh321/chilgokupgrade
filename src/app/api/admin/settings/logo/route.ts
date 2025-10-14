import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

// GET: 로고 정보 조회
export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("WorkInfo")
      .select("logoUrl, logoName")
      .eq("id", "main")
      .single();

    if (error) {
      // If the main row doesn't exist, it might not be an error
      if (error.code === 'PGRST116') { 
        return NextResponse.json({ ok: true, data: null }, { status: 200 });
      }
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

// PUT: 로고 정보 수정
export async function PUT(request: NextRequest) {
  try {
    const { logoUrl, logoName } = await request.json();
    if (!logoUrl || !logoName) {
      return NextResponse.json(
        { ok: false, error: { message: "로고 정보가 필요합니다." } },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("WorkInfo")
      .update({ logoUrl, logoName, updatedAt: new Date() })
      .eq("id", "main")
      .select();

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "로고가 수정되었습니다.", data: data[0] },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}
