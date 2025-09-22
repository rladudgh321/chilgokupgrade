'use client';

import { useState } from 'react';

type BoardPost = {
  id: number;
  category: string;
  title: string;
  author: string;
  date: string;
};

const AdminBoard = () => {
  const [posts, setPosts] = useState<BoardPost[]>([
    {
      id: 1,
      category: '양수양도 게시판',
      title: '서울 아파트 양도',
      author: '관리자',
      date: '2023-03-29',
    },
    {
      id: 2,
      category: '공지사항',
      title: '2023년 세금 안내',
      author: '관리자',
      date: '2023-03-28',
    },
    {
      id: 3,
      category: '부동산 질문과 답변',
      title: '경기도 아파트 구매 질문',
      author: '관리자',
      date: '2023-03-27',
    },
    {
      id: 4,
      category: '계약후기',
      title: '계약 후기: 서울 아파트 매매',
      author: '관리자',
      date: '2023-03-26',
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 카테고리와 제목을 기준으로 필터링
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === '전체' || post.category === selectedCategory;
    const matchesTitle = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTitle;
  });

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
            <option value="양수양도 게시판">양수양도 게시판</option>
            <option value="공지사항">공지사항</option>
            <option value="부동산 질문과 답변">부동산 질문과 답변</option>
            <option value="계약후기">계약후기</option>
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
          <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            글쓰기
          </button>
        </div>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">번호</th>
            <th className="p-2">카테고리</th>
            <th className="p-2">제목</th>
            <th className="p-2">작성자</th>
            <th className="p-2">등록일</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post, index) => (
            <tr key={post.id} className={index % 2 === 0 ? 'bg-slate-200' : 'bg-slate-300'}>
              <td className="p-2">{post.id}</td>
              <td className="p-2">{post.category}</td>
              <td className="p-2">{post.title}</td>
              <td className="p-2">{post.author}</td>
              <td className="p-2">{post.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBoard;
