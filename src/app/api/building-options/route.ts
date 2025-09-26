import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

// GET: 모든 옵션 조회
export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("BuildingOption")
      .select("*")
      .order("name", { ascending: true });

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

// POST: 새 옵션 추가
export async function POST(request: NextRequest) {
  try {
    const { label } = await request.json();
    if (!label || typeof label !== "string" || label.trim() === "") {
      return NextResponse.json(
        { ok: false, error: { message: "옵션은 필수입니다." } },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("BuildingOption")
      .insert([{ name: label.trim() }])
      .select();

    if (error) {
        if (error.code === '23505') { // unique constraint violation
            return NextResponse.json(
                { ok: false, error: { message: "이미 존재하는 옵션입니다." } },
                { status: 400 }
              );
        }
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "옵션이 추가되었습니다.", data: data[0] },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// PUT: 옵션 수정
export async function PUT(request: NextRequest) {
  try {
    const { oldLabel, newLabel } = await request.json();
    if (!oldLabel || !newLabel || typeof oldLabel !== "string" || typeof newLabel !== "string") {
      return NextResponse.json(
        { ok: false, error: { message: "기존 옵션과 새 옵션이 필요합니다." } },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("BuildingOption")
      .update({ name: newLabel.trim() })
      .eq("name", oldLabel.trim())
      .select();

    if (error) {
        if (error.code === '23505') { // unique constraint violation
            return NextResponse.json(
                { ok: false, error: { message: "이미 존재하는 옵션입니다." } },
                { status: 400 }
              );
        }
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "옵션이 수정되었습니다.", data: data[0] },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// DELETE: 옵션 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const label = searchParams.get("label");
    if (!label) {
      return NextResponse.json(
        { ok: false, error: { message: "삭제할 옵션이 필요합니다." } },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from("BuildingOption")
      .delete()
      .eq("name", label);

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "옵션이 삭제되었습니다." },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}
