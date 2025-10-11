import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data: categories, error } = await supabase
      .from('BoardCategory')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Error fetching categories', error: error.message }, { status: 500 });
  }
}