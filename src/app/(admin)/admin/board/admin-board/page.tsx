'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type BoardPost = {
  id: number;
  title: string;
  content?: string;
  popupContent?: string;
  representativeImage?: string;
  externalLink?: string;
  registrationDate?: string;
  manager?: string;
  isAnnouncement: boolean;
  isPopup: boolean;
  popupWidth?: number;
  popupHeight?: number;
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
};

const AdminBoard = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 데이터 로드
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/board/posts');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '게시글을 불러오는데 실패했습니다');
      }

      setPosts(result.data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리와 제목을 기준으로 필터링
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === '전체';
    const matchesTitle = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTitle;
  });

  const handleCreatePost = () => {
    router.push('/admin/board/admin-board/create');
  };

  const handleEditPost = (id: number) => {
    router.push(`/admin/board/admin-board/edit/${id}`);
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/board/posts/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '게시글 삭제에 실패했습니다');
      }

      alert('게시글이 삭제되었습니다.');
      loadPosts(); // 목록 새로고침
    } catch (error: unknown) {
      console.error('Error deleting post:', error);
      const errorMessage = error instanceof Error ? error.message : '게시글 삭제에 실패했습니다.';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold">
          게시물: {filteredPosts.length}
        </div>
        <div className="flex space-x-4">
          {/* 카테고리 선택 */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="전체">전체</option>
            <option value="공지사항">공지사항</option>
            <option value="뉴스">뉴스</option>
            <option value="이벤트">이벤트</option>
            <option value="FAQ">FAQ</option>
          </select>

          {/* 제목 검색 */}
          <input
            type="text"
            placeholder="제목 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded"
          />

          {/* 글쓰기 버튼 */}
          <button 
            onClick={handleCreatePost}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            글쓰기
          </button>
        </div>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-center">번호</th>
            {/* 카테고리 컬럼 삭제 */}
            <th className="p-2 text-center">제목</th>
            <th className="p-2 text-center">담당자</th>
            <th className="p-2 text-center">등록일</th>
            <th className="p-2 text-center">조회수</th>
            <th className="p-2 text-center">공지</th>
            <th className="p-2 text-center">팝업</th>
            <th className="p-2 text-center">게시</th>
            <th className="p-2 text-center">비고</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.length === 0 ? (
            <tr>
              <td colSpan={10} className="p-8 text-center text-gray-500">
                게시물이 없습니다.
              </td>
            </tr>
          ) : (
            filteredPosts.map((post, index) => (
              <tr key={post.id} className={index % 2 === 0 ? 'bg-slate-200' : 'bg-slate-300'}>
                <td className="p-2 text-center">{post.id}</td>
                <td className="p-2">
                  <div className="max-w-xs truncate" title={post.title}>
                    {post.title}
                  </div>
                </td>
                <td className="p-2 text-center">{post.manager || '미지정'}</td>
                <td className="p-2 text-center">
                  {post.registrationDate 
                    ? new Date(post.registrationDate).toLocaleDateString('ko-KR')
                    : new Date(post.createdAt).toLocaleDateString('ko-KR')
                  }
                </td>
                <td className="p-2 text-center">{post.views}</td>
                <td className="p-2 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    post.isAnnouncement 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {post.isAnnouncement ? '공지' : '일반'}
                  </span>
                </td>
                <td className="p-2 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    post.isPopup 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {post.isPopup ? '팝업' : '일반'}
                  </span>
                </td>
                <td className="p-2 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    post.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {post.isPublished ? '게시' : '비공개'}
                  </span>
                </td>
                <td className="p-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEditPost(post.id)}
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBoard;
