import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

// GET: 모든 테마 이미지 조회
export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("ThemeImage")
      .select("*")
      .is("deletedAt", null)
      .order("createdAt", { ascending: false });

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return new NextResponse(JSON.stringify({
      ok: true,
      data: data || []
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// POST: 새 테마 이미지 추가
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { label, imageUrl, imageName } = await request.json();

    if (!label || !imageUrl) {
      return NextResponse.json(
        { ok: false, error: { message: "라벨과 이미지 URL은 필수입니다." } },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("ThemeImage")
      .insert([{
        label: label.trim(),
        imageUrl: imageUrl.trim(),
        imageName: imageName?.trim() || null,
        isActive: true
      }])
      .select();

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return new NextResponse(JSON.stringify({
      ok: true,
      message: "테마 이미지가 추가되었습니다.",
      data: data?.[0]
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// PUT: 테마 이미지 수정
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { id, label, imageUrl, imageName, isActive } = await request.json();

    if (!id) {
      return NextResponse.json(
        { ok: false, error: { message: "ID는 필수입니다." } },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (label !== undefined) updateData.label = label.trim();
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim();
    if (imageName !== undefined) updateData.imageName = imageName?.trim() || null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const { data, error } = await supabase
      .from("ThemeImage")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return new NextResponse(JSON.stringify({
      ok: true,
      message: "테마 이미지가 수정되었습니다.",
      data: data?.[0]
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

// DELETE: 테마 이미지 삭제
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { ok: false, error: { message: "ID는 필수입니다." } },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("ThemeImage")
      .update({ deletedAt: new Date().toISOString() })
      .eq("id", parseInt(id));

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return new NextResponse(JSON.stringify({
      ok: true,
      message: "테마 이미지가 삭제되었습니다."
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}
