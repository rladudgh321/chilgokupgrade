import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

// GET: 모든 라벨 조회
export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("Label")
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

// POST: 새 라벨 추가
export async function POST(request: NextRequest) {
  try {
    const { label } = await request.json();
    if (!label || typeof label !== "string" || label.trim() === "") {
      return NextResponse.json(
        { ok: false, error: { message: "라벨은 필수입니다." } },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("Label")
      .insert([{ name: label.trim() }])
      .select();

    if (error) {
        if (error.code === '23505') { // unique constraint violation
            return NextResponse.json(
                { ok: false, error: { message: "이미 존재하는 라벨입니다." } },
                { status: 400 }
              );
        }
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "라벨이 추가되었습니다.", data: data[0] },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// PUT: 라벨 수정
export async function PUT(request: NextRequest) {
  try {
    const { oldLabel, newLabel } = await request.json();
    if (!oldLabel || !newLabel || typeof oldLabel !== "string" || typeof newLabel !== "string") {
      return NextResponse.json(
        { ok: false, error: { message: "기존 라벨과 새 라벨이 필요합니다." } },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("Label")
      .update({ name: newLabel.trim() })
      .eq("name", oldLabel.trim())
      .select();

    if (error) {
        if (error.code === '23505') { // unique constraint violation
            return NextResponse.json(
                { ok: false, error: { message: "이미 존재하는 라벨입니다." } },
                { status: 400 }
              );
        }
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "라벨이 수정되었습니다.", data: data[0] },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// DELETE: 라벨 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const label = searchParams.get("label");
    if (!label) {
      return NextResponse.json(
        { ok: false, error: { message: "삭제할 라벨이 필요합니다." } },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // The schema has `onDelete: SetNull`, so Supabase should handle unsetting the foreign key in Build table.
    const { error } = await supabase
      .from("Label")
      .delete()
      .eq("name", label);

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "라벨이 삭제되었습니다." },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}