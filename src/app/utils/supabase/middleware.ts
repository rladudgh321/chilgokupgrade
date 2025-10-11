import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/app/utils/supabase/middlewareClient";

// 다양한 배포 환경에서 IP를 안정적으로 추출
function getClientIp(req: NextRequest): string | null {
  const pick = (val: string | null) => (val ? val.split(",")[0].trim() : null);

  const xff = pick(req.headers.get("x-forwarded-for"));
  const vercel = pick(req.headers.get("x-vercel-forwarded-for"));
  const real = req.headers.get("x-real-ip");
  const cf = req.headers.get("cf-connecting-ip");
  const fly = req.headers.get("fly-client-ip");
  // @ts-expect-error: NextRequest.ip가 환경에 따라 있을 수 있음
  const direct = req.ip as string | undefined;

  return xff || vercel || real || cf || fly || direct || null;
}

export async function middleware(request: NextRequest) {
  // POST만 검사(요구사항 유지)
  if (request.method !== "POST") {
    return NextResponse.next();
  }

  // ✔ createClient 큰 틀 유지: supabase + response 동시 획득
  const { supabase, response } = createClient(request);

  const ipAddress = getClientIp(request);
  if (ipAddress) {
    try {
      // BannedIp 테이블에서 해당 IP가 존재하는지 확인
      const { data, error } = await supabase
        .from("BannedIp")
        .select("ipAddress")
        .eq("ipAddress", ipAddress)
        .maybeSingle();

      if (error) {
        // DB 조회 에러가 나도 요청 자체는 흘려보냄(로깅만)
        console.error("Supabase middleware query error:", error);
      } else if (data) {
        console.warn(`Blocked POST request from banned IP: ${ipAddress}`);
        // 차단 응답(쿠키 동기화 필요 없으므로 새 응답으로 반환)
        return new NextResponse("Your IP address has been banned.", { status: 403 });
      }
    } catch (e) {
      console.error("Middleware banned IP check failed:", e);
      // 실패 시에도 요청은 진행(안전한 기본값)
    }
  }

  // ✔ 쿠키 동기화된 response로 계속 진행
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};

// --------
//  이전 API
// import { createServerClient } from "@supabase/ssr";
// import { type NextRequest, NextResponse } from "next/server";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// export const createClient = (request: NextRequest) => {
//   // Create an unmodified response
//   let supabaseResponse = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   });

//   const supabase = createServerClient(
//     supabaseUrl!,
//     supabaseKey!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll()
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
//           supabaseResponse = NextResponse.next({
//             request,
//           })
//           cookiesToSet.forEach(({ name, value, options }) =>
//             supabaseResponse.cookies.set(name, value, options)
//           )
//         },
//       },
//     },
//   );

//   return supabaseResponse
// };
