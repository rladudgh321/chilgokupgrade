// src/app/api/admin/banned-ips/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";

/**
 * 테이블 가정(확실하지 않음 → 스키마에 맞게 컬럼명 조정 필요할 수 있음):
 * - table: "BannedIp"
 * - columns: id (PK), ipAddress (unique), reason, contact, details, createdAt (default now())
 */

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("BannedIp")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching banned IPs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch banned IPs" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    const { ipAddress, reason, contact, details } = await req.json();

    if (!ipAddress) {
      return NextResponse.json(
        { success: false, message: "IP address is required" },
        { status: 400 }
      );
    }

    // 기존 차단 여부 확인
    const { data: existing, error: existErr } = await supabase
      .from("BannedIp")
      .select("id, ipAddress")
      .eq("ipAddress", ipAddress)
      .maybeSingle();

    if (existErr) {
      console.error("Error checking existing banned IP:", existErr);
      return NextResponse.json(
        { success: false, message: "Failed to check existing ban" },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { success: false, message: "IP address is already banned" },
        { status: 409 }
      );
    }

    // 새 차단 추가
    const { data, error } = await supabase
      .from("BannedIp")
      .insert([{ ipAddress, reason, contact, details }])
      .select()
      .single();

    if (error) {
      console.error("Error banning IP:", error);
      return NextResponse.json(
        { success: false, message: "Failed to ban IP" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Error banning IP (parse/body):", error);
    return NextResponse.json(
      { success: false, message: "Failed to ban IP" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    // 삭제 후 결과 반환(없으면 404)
    const { data, error } = await supabase
      .from("BannedIp")
      .delete()
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error removing IP ban:", error);
      return NextResponse.json(
        { success: false, message: "Failed to remove IP ban" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "IP ban removed successfully",
      data,
    });
  } catch (error) {
    console.error("Error removing IP ban:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove IP ban" },
      { status: 500 }
    );
  }
}
