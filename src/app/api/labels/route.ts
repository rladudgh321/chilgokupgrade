import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

// GET: 모든 라벨 조회
export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("Build")
      .select("label")
      .not("label", "is", null)
      .not("label", "eq", "");

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    // 중복 제거하고 정렬
    const uniqueLabels = Array.from(
      new Set(data?.map(item => item.label).filter(Boolean))
    ).sort();

    return new NextResponse(JSON.stringify({
      ok: true,
      data: uniqueLabels.map((label, index) => ({
        id: index + 1,
        name: label
      }))
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

// POST: 새 라벨 추가 (실제로는 Build 레코드에 라벨이 포함된 매물을 추가해야 함)
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { label } = await request.json();

    if (!label || typeof label !== "string" || label.trim() === "") {
      return NextResponse.json(
        { ok: false, error: { message: "라벨은 필수입니다." } },
        { status: 400 }
      );
    }

    // 라벨이 이미 존재하는지 확인
    const { data: existingLabels } = await supabase
      .from("Build")
      .select("label")
      .eq("label", label.trim())
      .limit(1);

    if (existingLabels && existingLabels.length > 0) {
      return NextResponse.json(
        { ok: false, error: { message: "이미 존재하는 라벨입니다." } },
        { status: 400 }
      );
    }

    // 새 라벨을 가진 더미 Build 레코드 생성
    const { data, error: insertError } = await supabase
      .from("Build")
      .insert([{
        label: label.trim(),
        address: `샘플 주소 - ${label.trim()}`,
        propertyType: "샘플",
        visibility: false, // 더미 데이터이므로 비공개로 설정
        title: `${label.trim()} 샘플 매물`
      }])
      .select();

    if (insertError) {
      return NextResponse.json({ ok: false, error: insertError }, { status: 400 });
    }

    return new NextResponse(JSON.stringify({
      ok: true,
      message: "라벨이 추가되었습니다.",
      data: { label: label.trim() }
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

// PUT: 라벨 수정
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { oldLabel, newLabel } = await request.json();

    if (!oldLabel || !newLabel || typeof oldLabel !== "string" || typeof newLabel !== "string") {
      return NextResponse.json(
        { ok: false, error: { message: "기존 라벨과 새 라벨이 필요합니다." } },
        { status: 400 }
      );
    }

    // 해당 라벨을 가진 모든 Build 레코드 업데이트
    const { error } = await supabase
      .from("Build")
      .update({ label: newLabel.trim() })
      .eq("label", oldLabel.trim());

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return new NextResponse(JSON.stringify({
      ok: true,
      message: "라벨이 수정되었습니다.",
      data: { oldLabel: oldLabel.trim(), newLabel: newLabel.trim() }
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

// DELETE: 라벨 삭제
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { searchParams } = new URL(request.url);
    const label = searchParams.get("label");

    if (!label) {
      return NextResponse.json(
        { ok: false, error: { message: "삭제할 라벨이 필요합니다." } },
        { status: 400 }
      );
    }

    // 해당 라벨을 가진 모든 Build 레코드에서 라벨 제거 (null로 설정)
    const { error } = await supabase
      .from("Build")
      .update({ label: null })
      .eq("label", label.trim());

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return new NextResponse(JSON.stringify({
      ok: true,
      message: "라벨이 삭제되었습니다.",
      data: { label: label.trim() }
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
