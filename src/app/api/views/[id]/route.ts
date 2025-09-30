
import { createClient } from '@/app/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return new NextResponse('Post ID is required', { status: 400 });
  }

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.rpc('increment_post_views', { post_id: parseInt(id) });

    if (error) {
      console.error('Error incrementing post views:', error);
      return new NextResponse('Error incrementing post views', { status: 500 });
    }

    return new NextResponse('View count incremented', { status: 200 });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
