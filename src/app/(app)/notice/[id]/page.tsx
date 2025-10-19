import { notFound } from 'next/navigation';
import PostView from './PostView';
import { BoardPost } from './PostView';

async function getPost(id: string): Promise<BoardPost> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/board/${id}`, {
    next: { revalidate: 28_800, tags: ['public', 'board'] }
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

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
  const { id } = await params;
  const post = await getPost(id);
  return <PostView post={post} />;
}