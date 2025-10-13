// app/api/admin/logout/route.ts
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[LOGOUT]", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // cookieStore를 통해 설정/삭제된 세션 쿠키가 응답에 자동 반영됨
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error("[LOGOUT]", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "Internal Server Error" }, { status: 500 });
  }
}
