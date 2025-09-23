// 소프트 딜리트 복원

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";

export async function PUT(_req: NextRequest, ctx: { params: { id: string } }) {
  const idNum = Number(ctx.params.id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return NextResponse.json({ message: "유효하지 않은 ID" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const table = "Build";          // ← 실제 테이블명
  const deletedCol = "deletedAt";  // ← snake_case면 "deleted_at"

  // 현재 삭제 상태인지 확인
  const { data: found, error: findErr } = await supabase
    .from(table)
    .select(`id, ${deletedCol}`)
    .eq("id", idNum)
    .maybeSingle();
  if (findErr) return NextResponse.json({ message: findErr.message }, { status: 500 });
  if (!found) return NextResponse.json({ message: "없는 매물" }, { status: 404 });
  if (found[deletedCol] == null) {
    return NextResponse.json({ message: "이미 활성 상태" }, { status: 400 });
  }

  const { data: updated, error: updErr } = await supabase
    .from(table)
    .update({ [deletedCol]: null })
    .eq("id", idNum)
    .not(deletedCol, "is", null)   // 삭제된 것만 복원
    .select("id")
    .maybeSingle();

  if (updErr) return NextResponse.json({ message: updErr.message }, { status: 500 });
  if (!updated) return NextResponse.json({ message: "복원 대상 없음" }, { status: 409 });

  return NextResponse.json({
    message: "복원 완료",
    restoredId: updated.id,
    restoredAt: new Date().toISOString(),
  });
}
