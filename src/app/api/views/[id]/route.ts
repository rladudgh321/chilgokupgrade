import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const postId = params.id;

  if (!postId) {
    return NextResponse.json({ ok: false, error: { message: 'ID가 누락되었습니다.' } }, { status: 400 });
  }

  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ ok: false, error: { message: '인증되지 않은 사용자입니다.' } }, { status: 401 });
    }

    await prisma.$executeRaw(Prisma.raw`SELECT increment_post_views(${parseInt(postId, 10)})`);

    return NextResponse.json({ ok: true, message: '조회수가 1 증가했습니다.' });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: { message: error.message } }, { status: 500 });
  }
}