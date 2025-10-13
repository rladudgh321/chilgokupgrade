import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("--- LOGIN API ROUTE EXECUTED ---"); // DEBUG
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "이메일과 비밀번호를 입력하세요." },
        { status: 400 }
      );
    }

    // signup 라우트와 동일하게 cookieStore 기반 서버 클라이언트 사용
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // 이메일 미인증/자격증명 오류 등은 여기서 잡힙니다.
      // error.status가 undefined인 경우가 있어 기본 401로 처리
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.status || 401 }
      );
    }

    // 성공 시: createClient(cookieStore) 내부에서 cookieStore.set(...)로
    // 세션 쿠키가 응답에 자동 반영됩니다(별도 헤더 복사 불필요).
    // 필요 시 user 반환
    return NextResponse.json(
      { ok: true, user: data.user },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("[LOGIN]", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
