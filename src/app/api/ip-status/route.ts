import { supabaseAdmin } from "@/app/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";

  if (!supabaseAdmin) {
    console.error("Supabase admin client not initialized. Cannot check IP status.");
    // Return a non-banned status if the server is misconfigured, to avoid blocking legitimate users.
    return NextResponse.json({ isBanned: false });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("BannedIp")
      .select("id")
      .eq("ipAddress", ip)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return NextResponse.json({ isBanned: !!data });

  } catch (error) {
    console.error("Error checking IP status:", error);
    // Return a non-banned status in case of database error.
    return NextResponse.json({ isBanned: false });
  }
}
