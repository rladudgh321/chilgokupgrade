
import { cookies } from 'next/headers';
import { createClient } from '@/app/utils/supabase/server';
import NoticeClient from './NoticeClient';
import { BoardPost } from './NoticeClient';

async function getPosts() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('BoardPost')
    .select('id, title, content, isAnnouncement, views, createdAt, registrationDate')
    .eq('isPublished', true)
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data;
}

function serializePosts(posts: any[]): BoardPost[] {
  return posts.map(post => ({
    ...post,
    id: post.id,
    title: post.title,
    content: post.content,
    isAnnouncement: post.isAnnouncement,
    views: post.views,
    createdAt: new Date(post.createdAt).toISOString(),
    registrationDate: post.registrationDate ? new Date(post.registrationDate).toISOString() : undefined,
  }));
}


export default async function NoticePage() {
  const posts = await getPosts();
  const serializedPosts = serializePosts(posts);
  return <NoticeClient initialPosts={serializedPosts} />;
}
