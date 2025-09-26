import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

// GET: 모든 옵션(buildingOptions) 집합 조회 (중복 제거)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("Build")
      .select("buildingOptions")
      .not("buildingOptions", "is", null);

    if (error) {
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    const all = (data || []).flatMap((row: any) => Array.isArray(row.buildingOptions) ? row.buildingOptions : []);
    const unique = Array.from(new Set(all.filter((v: any) => typeof v === 'string' && v.trim().length > 0))).sort();
    const items = unique.map((name, index) => ({ id: index + 1, name }));

    return NextResponse.json({ ok: true, data: items }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e?.message ?? "Unknown error" } }, { status: 500 });
  }
}

// POST: 새 옵션 추가 (샘플 Build 레코드로 삽입)
export async function POST(request: NextRequest) {
  try {
    const { label } = await request.json();
    if (!label || typeof label !== 'string' || label.trim() === '') {
      return NextResponse.json({ ok: false, error: { message: '옵션은 필수입니다.' } }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 이미 존재 여부는 단순히 스킵(중복 허용), 또는 확인 후 더미 생성
    const { error: insertError } = await supabase
      .from("Build")
      .insert([{
        buildingOptions: [label.trim()],
        address: `샘플 주소 - ${label.trim()}`,
        visibility: false,
        title: `${label.trim()} 옵션 샘플 매물`,
      }]);

    if (insertError) {
      return NextResponse.json({ ok: false, error: insertError }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: '옵션이 추가되었습니다.', data: { label: label.trim() } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e?.message ?? 'Unknown error' } }, { status: 500 });
  }
}

// PUT: 옵션명 일괄 변경 (모든 Build.buildingOptions 배열에서 교체)
export async function PUT(request: NextRequest) {
  try {
    const { oldLabel, newLabel } = await request.json();
    if (!oldLabel || !newLabel) {
      return NextResponse.json({ ok: false, error: { message: '기존/새 옵션명이 필요합니다.' } }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 해당 옵션을 포함한 레코드 조회
    const { data: rows, error: selError } = await supabase
      .from("Build")
      .select("id, buildingOptions")
      .contains("buildingOptions", [oldLabel]);
    if (selError) return NextResponse.json({ ok: false, error: selError }, { status: 400 });

    // 각 행 업데이트
    for (const row of rows || []) {
      const current: string[] = Array.isArray(row.buildingOptions) ? row.buildingOptions : [];
      const updated = current.map(v => v === oldLabel ? newLabel : v);
      const { error: upErr } = await supabase
        .from("Build")
        .update({ buildingOptions: updated })
        .eq("id", row.id);
      if (upErr) return NextResponse.json({ ok: false, error: upErr }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: '옵션이 수정되었습니다.' }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e?.message ?? 'Unknown error' } }, { status: 500 });
  }
}

// DELETE: 옵션명 일괄 제거 (모든 Build.buildingOptions 배열에서 제거)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const label = searchParams.get('label');
    if (!label) {
      return NextResponse.json({ ok: false, error: { message: '삭제할 옵션명이 필요합니다.' } }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: rows, error: selError } = await supabase
      .from("Build")
      .select("id, buildingOptions")
      .contains("buildingOptions", [label]);
    if (selError) return NextResponse.json({ ok: false, error: selError }, { status: 400 });

    for (const row of rows || []) {
      const current: string[] = Array.isArray(row.buildingOptions) ? row.buildingOptions : [];
      const updated = current.filter(v => v !== label);
      const { error: upErr } = await supabase
        .from("Build")
        .update({ buildingOptions: updated })
        .eq("id", row.id);
      if (upErr) return NextResponse.json({ ok: false, error: upErr }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: '옵션이 삭제되었습니다.' }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e?.message ?? 'Unknown error' } }, { status: 500 });
  }
}


