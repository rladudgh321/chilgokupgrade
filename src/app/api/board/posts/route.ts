import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";
import { z } from "zod";

const CreatePostSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  content: z.string().optional(),
  popupContent: z.string().optional(),
  representativeImage: z.string().optional(),
  externalLink: z.string().url().optional().or(z.literal("")),
  registrationDate: z.string().optional(),
  manager: z.string().optional(),
  isAnnouncement: z.boolean().default(false),
  isPopup: z.boolean().default(false),
  popupWidth: z.number().optional(),
  popupHeight: z.number().optional(),
  isPublished: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json().catch(() => null);
    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ message: "잘못된 요청 본문" }, { status: 400 });
    }

    const validatedData = CreatePostSchema.parse(raw);

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("BoardPost")
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "게시글이 성공적으로 생성되었습니다", 
      data 
    });
  } catch (e: any) {
    if (e.name === 'ZodError') {
      return NextResponse.json({ 
        message: "입력 데이터가 올바르지 않습니다", 
        errors: e.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ message: e?.message ?? "서버 오류" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("BoardPost")
      .select(`*`)
      .order('createdAt', { ascending: false });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? "서버 오류" }, { status: 500 });
  }
}
