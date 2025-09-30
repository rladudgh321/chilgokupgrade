
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Assuming BoardPost is defined elsewhere and imported
export type BoardPost = {
  id: number;
  title: string;
  content?: string;
  views: number;
  createdAt: string;
  registrationDate?: string;
};

export default function PostView({ post }: { post: BoardPost }) {
  const [views, setViews] = useState(post.views);

  useEffect(() => {
    const viewedKey = `viewed_post_${post.id}`;
    const hasViewed = sessionStorage.getItem(viewedKey);

    if (!hasViewed) {
      sessionStorage.setItem(viewedKey, 'true');
      setViews(v => v + 1);

      const url = `/api/views/${post.id}`;
      const data = new Blob([JSON.stringify({ id: post.id })], { type: 'application/json' });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, data);
      } else {
        fetch(url, {
          method: 'POST',
          body: data,
          keepalive: true,
        });
      }
    }
  }, [post.id]);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
            <span>
              등록일: {new Date(post.registrationDate || post.createdAt).toLocaleDateString('ko-KR')}
            </span>
            <span suppressHydrationWarning>조회수: {views}</span>
          </div>
          <div 
            className="prose max-w-none" 
            dangerouslySetInnerHTML={{ __html: post.content || '' }} 
          />
        </div>
        <div className="p-4 bg-gray-50 text-right">
          <Link href="/notice" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
