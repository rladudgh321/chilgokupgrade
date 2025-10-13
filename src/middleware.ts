import { createClient } from "@/app/utils/supabase/middlewareClient";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Run the IP ban check only for POST requests
  if (request.method === "POST") {
    const ip = request.ip ?? "127.0.0.1";

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
        return response;
      }

      // If the IP is found in the banned list, block the request.
      if (bannedIp) {
        console.log(`Blocked POST request from banned IP: ${ip}`);
        return new NextResponse("Access Denied: Your IP is blocked.", {
          status: 403,
        });
      }
    } catch (e) {
      console.error("Exception in middleware while checking IP:", e);
      return response;
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};