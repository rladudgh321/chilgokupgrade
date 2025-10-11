import { supabaseAdmin } from "@/app/utils/supabase/admin";
import { createClient } from "@/app/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Run the IP ban check only for POST requests
  if (request.method === "POST") {
    const ip = request.ip ?? "127.0.0.1";

    let supabase;
    // Prefer the admin client for its ability to bypass RLS, ensuring the check always works.
    if (supabaseAdmin) {
      supabase = supabaseAdmin;
    } else {
      // As a fallback, use the user-session client. 
      // This may fail if RLS policies prevent anonymous users from reading the BannedIp table.
      console.warn("Supabase admin client not initialized. Falling back to user-session client for IP check. This may not work for anonymous users if RLS is restrictive.");
      supabase = createClient(request.cookies);
    }

    try {
      const { data: bannedIp, error } = await supabase
        .from("BannedIp")
        .select("ipAddress")
        .eq("ipAddress", ip)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 means "The result contains 0 rows", which is not an error in this case.
        console.error("Error checking banned IP (middleware):", error.message);
        // Fail-open: If the DB check fails, allow the request to prevent blocking legitimate users.
        return NextResponse.next();
      }

      // If the IP is found in the banned list, block the request.
      if (bannedIp) {
        console.log(`Blocked POST request from banned IP: ${ip}`);
        return new NextResponse("Access Denied: Your IP is blocked.", { status: 403 });
      }
    } catch (e) {
      console.error("Exception in middleware while checking IP:", e);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};