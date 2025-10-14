import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

// GET: 모든 SNS 설정 조회
export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("SnsSetting")
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

// POST: 새 SNS 설정 추가
export async function POST(request: NextRequest) {
  try {
    const { label, url, imageUrl, imageName } = await request.json();
    if (!label) {
      return NextResponse.json(
        { ok: false, error: { message: "이름은 필수입니다." } },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("SnsSetting")
      .insert([{ name: label.trim(), url: url?.trim(), imageUrl, imageName }])
      .select();

    if (error) {
        if (error.code === '23505') {
            return NextResponse.json(
                { ok: false, error: { message: "이미 존재하는 설정입니다." } },
                { status: 400 }
              );
        }
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "SNS 설정이 추가되었습니다.", data: data[0] },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// PUT: SNS 설정 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, newName, newUrl, imageUrl, imageName } = body;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    let response;

    if (id && (newName || newUrl)) { // From onEdit
        response = await supabase
            .from("SnsSetting")
            .update({ name: newName, url: newUrl })
            .eq("id", Number(id))
            .select();
    } else if (id && (imageUrl !== undefined || imageName !== undefined)) { // From onImageEdit
        response = await supabase
            .from("SnsSetting")
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
                { ok: false, error: { message: "이미 존재하는 설정입니다." } },
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

// DELETE: SNS 설정 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { ok: false, error: { message: "삭제할 ID가 필요합니다." } },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from("SnsSetting")
      .delete()
      .eq("id", Number(id));

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "SNS 설정이 삭제되었습니다." },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}
