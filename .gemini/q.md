[Error: No response is returned from route handler '[project]/src/app/api/board/route.ts'. Ensure you return a `Response` or a `NextResponse` in all branches of your handler.]
 GET /api/board 500 in 614ms
 ⨯ SyntaxError: Unexpected end of JSON input
    at JSON.parse (<anonymous>)
    at async getPosts (src\app\(app)\notice\page.tsx:11:16)
    at async NoticePage (src\app\(app)\notice\page.tsx:31:17)
   9 |   });
  10 |
> 11 |   const data = await res.json();
     |                ^
  12 |   console.log("Fetched posts:", data);
  13 |   return data;
  14 | } {
  digest: '831585614'
}
------------
import NoticeClient from './NoticeClient';
import { BoardPost } from './NoticeClient';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

async function getPosts() {
  const res = await fetch(`${BASE_URL}/api/board`, {
    next: { revalidate: 28_800, tags: ['public', 'board'] },
  });

  const data = await res.json();
  console.log("Fetched posts:", data);
  return data;
}

function serializePosts(posts: any[]): BoardPost[] {
  return posts.map(post => ({
    ...post,
    id: post.id,
    title: post.title,
    content: post.content,
    categoryName: post.BoardCategory?.name,
    views: post.views,
    createdAt: new Date(post.createdAt).toISOString(),
    registrationDate: post.registrationDate ? new Date(post.registrationDate).toISOString() : undefined,
  }));
}


export default async function NoticePage() {
  const posts = await getPosts();
  console.log('posts', posts);
  const serializedPosts = serializePosts(posts);
  return <NoticeClient initialPosts={serializedPosts} />;
}
