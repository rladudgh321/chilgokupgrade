import BoardClient from './BoardClient';
import { cookies } from 'next/headers';
import { createClient } from '@/app/utils/supabase/server';
import { BoardPost } from './BoardClient';

async function getPosts() {
  const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("BoardPost")
    .select(`*`)
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
    popupContent: post.popupContent,
    representativeImage: post.representativeImage,
    externalLink: post.externalLink,
    registrationDate: post.registrationDate ? new Date(post.registrationDate).toISOString() : undefined,
    manager: post.manager,
    isAnnouncement: post.isAnnouncement,
    isPopup: post.isPopup,
    popupWidth: post.popupWidth,
    popupHeight: post.popupHeight,
    isPublished: post.isPublished,
    views: post.views,
    createdAt: new Date(post.createdAt).toISOString(),
    updatedAt: new Date(post.updatedAt).toISOString(),
  }));
}


export default async function AdminBoardPage() {
  const posts = await getPosts();
  const serializedPosts = serializePosts(posts);
  return <BoardClient initialPosts={serializedPosts} />;
}