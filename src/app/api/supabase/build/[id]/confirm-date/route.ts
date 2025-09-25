/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/supabase/build/[id]/confirm-date/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";
import { z } from "zod";

const TABLE = "Build";
const ID_COL = "id";

const zDateISO = z.preprocess((v) => {
  if (v === "" || v === undefined || v === null) return null;
  const d = new Date(v as any);
  return isNaN(d.getTime()) ? null : d.toISOString();
}, z.string().datetime().nullable());

const ConfirmDateSchema = z.object({
  confirmDate: zDateISO,
});

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

    const { confirmDate } = ConfirmDateSchema.parse(raw);

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from(TABLE)
      .update({ 
        confirmDate
      })
      .eq(ID_COL, idNum)
      .select("id, confirmDate")
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ message: "업데이트 실패 또는 대상 없음" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "현장 확인일 업데이트 완료", 
      id: data.id, 
      confirmDate: data.confirmDate 
    });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "서버 오류" }, { status: 500 });
  }
}
