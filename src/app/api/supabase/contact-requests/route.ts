/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";

const TABLE = "ContactRequest";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10) || 50));

    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("createdAt", { ascending: false })
      .limit(limit);

    if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
    return NextResponse.json({ ok: true, data: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e?.message ?? "Unknown error" } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const body = await req.json();
    
    // Extract client IP from common proxy headers
    const headers = req.headers;
    const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const realIp = headers.get("x-real-ip");
    const cfIp = headers.get("cf-connecting-ip");
    const vercelFwd = headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
    const flyIp = headers.get("fly-client-ip");
    const clientIp = forwardedFor || realIp || cfIp || vercelFwd || flyIp || "";

    const row = {
      confirm: !!body?.confirm,
      author: String(body?.author ?? "").trim(),
      contact: String(body?.contact ?? "").trim(),
      ipAddress: clientIp,
      description: String(body?.description ?? "").trim(),
      note: body?.note ? String(body.note) : null,
      date: body?.date ? new Date(body.date) : new Date(),
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase.from(TABLE).insert([row]).select();
    if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e?.message ?? "Unknown error" } }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const body = await req.json();
    const id = Number(body?.id);
    if (!id) return NextResponse.json({ ok: false, error: { message: "id required" } }, { status: 400 });

    const patch: Record<string, any> = {};
    if (typeof body?.confirm === "boolean") patch.confirm = body.confirm;
    if (typeof body?.note === "string") patch.note = body.note;
    if (typeof body?.author === "string") patch.author = body.author;
    if (typeof body?.contact === "string") patch.contact = body.contact;
    if (typeof body?.ipAddress === "string") patch.ipAddress = body.ipAddress;
    if (typeof body?.description === "string") patch.description = body.description;
    if (body?.date) patch.date = new Date(body.date);
    patch.updatedAt = new Date().toISOString();

    const { data, error } = await supabase
      .from(TABLE)
      .update(patch)
      .eq("id", id)
      .select();

    if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e?.message ?? "Unknown error" } }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ ok: false, error: { message: "id required" } }, { status: 400 });

    const { data, error } = await supabase.from(TABLE).delete().eq("id", id).select();
    if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e?.message ?? "Unknown error" } }, { status: 500 });
  }
}


