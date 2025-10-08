import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

// PUT: Update a preset
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { name } = await request.json();
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { ok: false, error: { message: "이름은 필수입니다." } },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("PricePreset")
      .update({ name: name.trim() })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "금액이 수정되었습니다.", data: data[0] },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// DELETE: Delete a preset
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.from("PricePreset").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "금액이 삭제되었습니다." },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}
