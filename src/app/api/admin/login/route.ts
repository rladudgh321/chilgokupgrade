import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("--- LOGIN API ROUTE EXECUTED ---"); // DEBUG
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "이메일과 비밀번호를 입력하세요." },
        { status: 400 }
      );
    }

    // signup 라우트와 동일하게 cookieStore 기반 서버 클라이언트 사용
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // 이메일 미인증/자격증명 오류 등은 여기서 잡힙니다.
      // error.status가 undefined인 경우가 있어 기본 401로 처리
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.status || 401 }
      );
    }

    if (data.user) {
      await createAccessLog(request, supabase);
    }

    // 성공 시: createClient(cookieStore) 내부에서 cookieStore.set(...)로
    // 세션 쿠키가 응답에 자동 반영됩니다(별도 헤더 복사 불필요).
    // 필요 시 user 반환
    return NextResponse.json(
      { ok: true, user: data.user },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("[LOGIN]", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}

function getClientIp(req: NextRequest) {
  const h = req.headers;
  const ip =
    h.get("cf-connecting-ip") ||                      // Cloudflare
    h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || // Vercel
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || // 일반 프록시
    h.get("x-real-ip") ||                              // Nginx 등
    h.get("fly-client-ip") ||                          // Fly.io
    "unknown";
  return ip;
}

async function createAccessLog(request: NextRequest, supabase: any) {
  console.log("--- createAccessLog started ---");
  try {
    const ip = getClientIp(request);
    console.log("IP Address:", ip);

    const userAgent = request.headers.get("user-agent");
    console.log("User Agent:", userAgent);

    const referrer = request.headers.get("referer");
    console.log("Referrer:", referrer);

    let browser = "Unknown";
    let os = "Unknown";

    if (userAgent) {
      const browserRegex = /(firefox|msie|chrome|safari|trident|edg)[\/ ]?([\d\.]+)/i;
      const osRegex = /(windows|macintosh|linux|android|ios)/i;
      
      const browserMatch = userAgent.match(browserRegex);
      if (browserMatch) {
        browser = browserMatch[1];
      }

      const osMatch = userAgent.match(osRegex);
      if (osMatch) {
        os = osMatch[1];
      }
    }
    console.log("Browser:", browser, "OS:", os);

    let location = null;
    if (ip && ip !== 'unknown') {
        try {
            console.log(`Fetching geolocation for ${ip}...`);
            const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
            const geoData = await geoRes.json();
            console.log("Geolocation API response:", geoData);
            if (geoData.status === 'success') {
              location = `${geoData.country}, ${geoData.regionName}, ${geoData.city}, ${geoData.zip}`;
            } else {
              console.warn("Geolocation fetch was not successful:", geoData.message);
            }
        } catch (e) {
            console.error("!!! Exception fetching geolocation:", e);
        }
    }
    console.log("Final location:", location);

    const logData = {
      ip,
      browser,
      os,
      referrer,
      location,
    };

    console.log("Attempting to insert log into Supabase with data:", logData);
    const { data: insertData, error: logError } = await supabase.from("access_logs").insert(logData).select();

    if (logError) {
      console.error("!!! Supabase insert error:", logError);
    } else {
      console.log("+++ Supabase insert successful:", insertData);
    }

  } catch (e) {
    console.error("!!! Critical error in createAccessLog:", e);
  }
  console.log("--- createAccessLog finished ---");
}
