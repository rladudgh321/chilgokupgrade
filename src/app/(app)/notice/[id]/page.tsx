import { cookies } from 'next/headers';
import { createClient } from '@/app/utils/supabase/server';
import { notFound } from 'next/navigation';
import PostView from './PostView';
import { BoardPost } from './PostView';

export const revalidate = 3600; // Revalidate every hour

async function getPost(id: string): Promise<BoardPost> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('BoardPost')
    .select('id, title, content, views, createdAt, registrationDate')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  return {
    ...data,
    createdAt: new Date(data.createdAt).toISOString(),
    registrationDate: data.registrationDate ? new Date(data.registrationDate).toISOString() : undefined,
  };
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const { id } = await params;       // ✅ 먼저 await
  const post = await getPost(id);
  return <PostView post={post} />;
}