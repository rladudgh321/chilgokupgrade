import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

// GET: 모든 매물 유형 조회
export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("ListingType")
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

// POST: 새 매물 유형 추가
export async function POST(request: NextRequest) {
  try {
    const { label, imageUrl, imageName } = await request.json();
    if (!label) {
      return NextResponse.json(
        { ok: false, error: { message: "이름은 필수입니다." } },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("ListingType")
      .insert([{ name: label.trim(), imageUrl, imageName }])
      .select();

    if (error) {
        if (error.code === '23505') {
            return NextResponse.json(
                { ok: false, error: { message: "이미 존재하는 유형입니다." } },
                { status: 400 }
              );
        }
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "매물 유형이 추가되었습니다.", data: data[0] },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// PUT: 매물 유형 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, oldLabel, newLabel, imageUrl, imageName } = body;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    let response;

    if (oldLabel && newLabel) { // From onEdit
        response = await supabase
            .from("ListingType")
            .update({ name: newLabel })
            .eq("name", oldLabel)
            .select();
    } else if (id && (imageUrl !== undefined || imageName !== undefined)) { // From onImageEdit
        response = await supabase
            .from("ListingType")
            .update({ imageUrl, imageName })
            .eq("id", Number(id))
            .select();
    } else {
        return NextResponse.json({ ok: false, error: { message: "Invalid request" } }, { status: 400 });
    }

    const { data, error } = response;

    if (error) {
        if (error.code === '23505') {
            return NextResponse.json(
                { ok: false, error: { message: "이미 존재하는 유형입니다." } },
                { status: 400 }
              );
        }
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, data: data[0] }, { status: 200 });

  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// DELETE: 매물 유형 삭제
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

    const { error } = await supabase
      .from("ListingType")
      .delete()
      .eq("name", label);

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "매물 유형이 삭제되었습니다." },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}