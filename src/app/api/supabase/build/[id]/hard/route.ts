// build 영구 삭제

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const idNum = Number(ctx.params.id);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    return NextResponse.json({ message: "유효하지 않은 ID" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const table = "Build"; // ← 실제 테이블명

  const { data: deleted, error } = await supabase
    .from(table)
    .delete()
    .eq("id", idNum)
    .select("id")
    .maybeSingle();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!deleted) return NextResponse.json({ message: "삭제 대상 없음" }, { status: 404 });

  return NextResponse.json({ message: "영구 삭제 완료", deletedId: deleted.id });
}
