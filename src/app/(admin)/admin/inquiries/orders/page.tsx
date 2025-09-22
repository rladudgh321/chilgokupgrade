'use client';

import { useState } from 'react';
import ToggleSwitch from '@/app/components/admin/listings/ToggleSwitch';

type Request = {
  id: number;
  confirm: boolean;
  category: '구해요' | '팔아요' | '기타';
  transactionType: '분양' | '매매' | '기타';
  author: string;
  propertyType: '아파트' | '단독주택' | '땅' | '기타';
  estimatedAmount: string;
  contact: string;
  ipAddress: string;
  region: string;
  title: string;
  description: string;
  date: string;
};

const Orders = () => {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 1,
      confirm: false,
      category: '구해요',
      transactionType: '분양',
      author: '홍길동',
      propertyType: '아파트',
      estimatedAmount: '1억',
      contact: '010-1234-5678',
      ipAddress: '192.168.0.1',
      region: '서울',
      title: '서울 아파트 구해요',
      description: '빠른 시일 내에 아파트를 구하고 있습니다.',
      date: '2023-03-29',
    },
    {
      id: 2,
      confirm: true,
      category: '팔아요',
      transactionType: '매매',
      author: '김영희',
      propertyType: '단독주택',
      estimatedAmount: '2억',
      contact: '010-9876-5432',
      ipAddress: '192.168.0.2',
      region: '부산',
      title: '부산 단독주택 팔아요',
      description: '단독주택을 팔고 있습니다. 관심있으신 분 연락주세요.',
      date: '2023-03-30',
    },
    {
      id: 3,
      confirm: false,
      category: '기타',
      transactionType: '기타',
      author: '박수정',
      propertyType: '땅',
      estimatedAmount: '5억',
      contact: '010-4567-1234',
      ipAddress: '192.168.0.3',
      region: '인천',
      title: '인천 땅 판매',
      description: '인천에 위치한 땅을 판매합니다.',
      date: '2023-03-31',
    },
    {
      id: 4,
      confirm: true,
      category: '구해요',
      transactionType: '분양',
      author: '이민수',
      propertyType: '아파트',
      estimatedAmount: '3억',
      contact: '010-2222-3333',
      ipAddress: '192.168.0.4',
      region: '경기도',
      title: '경기도 아파트 구해요',
      description: '경기도에서 아파트를 구하고 있습니다.',
      date: '2023-04-01',
    },
  ]);
  
  const [categoryFilter, setCategoryFilter] = useState<'전체' | '구해요' | '팔아요' | '기타'>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<{ [key: number]: string }>({});
  const [userTitles, setUserTitles] = useState<{ [key: number]: string }>({});

  const handleToggleChange = (id: string, value: boolean) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === parseInt(id)
          ? { ...request, confirm: value }
          : request
      )
    );
  };

  const handleNoteChange = (id: number, note: string) => {
    setNotes((prev) => ({
      ...prev,
      [id]: note,
    }));
  };

  const handleUserTitleChange = (id: number, title: string) => {
    setUserTitles((prev) => ({
      ...prev,
      [id]: title,
    }));
  };

  const handleSaveNote = (id: number) => {
    // 여기에 메모 저장 처리 로직을 추가할 수 있습니다.
    alert(`메모가 저장되었습니다: ${notes[id]}`);
  };

  const filteredRequests = requests.filter((request) => {
    if (categoryFilter === '전체') {
      return (
        (request.contact.includes(searchQuery) || request.title.includes(searchQuery))
      );
    }
    return (
      request.category === categoryFilter &&
      (request.contact.includes(searchQuery) || request.title.includes(searchQuery))
    );
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold">
          의뢰수: {filteredRequests.length}건
        </div>
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as '전체' | '구해요' | '팔아요' | '기타')}
            className="p-2 border rounded"
          >
            <option value="전체">전체</option>
            <option value="구해요">구해요</option>
            <option value="팔아요">팔아요</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="연락처 또는 제목 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={() => {}}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            검색
          </button>
        </div>
      </div>

      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">번호</th>
            <th className="p-2">확인여부</th>
            <th className="p-2">구분</th>
            <th className="p-2">거래유형</th>
            <th className="p-2">작성자</th>
            <th className="p-2">매물종류</th>
            <th className="p-2">견적금액</th>
            <th className="p-2">연락처</th>
            <th className="p-2">IP주소</th>
            <th className="p-2">의뢰지역</th>
            <th className="p-2">제목</th>
            <th className="p-2">상세내용</th>
            <th className="p-2">등록일</th>
            <th className="p-2">비고</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request, index) => (
            <tr key={request.id} className={index % 2 === 0 ? 'bg-slate-200' : 'bg-slate-300'}>
              <td className="p-2">{request.id}</td>
              <td className="p-2">
                <ToggleSwitch
                  toggle={request.confirm}
                  id={`confirm${request.id}`}
                  onChange={handleToggleChange}
                />
              </td>
              <td className="p-2">{request.category}</td>
              <td className="p-2">{request.transactionType}</td>
              <td className="p-2">{request.author}</td>
              <td className="p-2">{request.propertyType}</td>
              <td className="p-2">{request.estimatedAmount}</td>
              <td className="p-2">{request.contact}</td>
              <td className="p-2">{request.ipAddress}</td>
              <td className="p-2">{request.region}</td>
              <td className="p-2">
                {/* 사용자가 입력한 제목을 읽기 전용 텍스트로 표시 */}
                <p className="border p-2">{userTitles[request.id] || request.title}</p>
                <textarea
                  value={notes[request.id] || ''}
                  onChange={(e) => handleNoteChange(request.id, e.target.value)}
                  placeholder="관리용메모"
                  className="p-2 border rounded w-full mt-2"
                />
                <button
                  onClick={() => handleSaveNote(request.id)}
                  className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  메모저장
                </button>
              </td>
              <td className="p-2">
                <button
                  className="p-2 bg-blue-500 text-white rounded"
                  onClick={() => alert(`내용 보기: ${request.description}`)}
                >
                  내용보기
                </button>
              </td>
              <td className="p-2">{request.date}</td>
              <td className="p-2">
                <button
                  className="p-2 bg-red-500 text-white rounded"
                  onClick={() => alert('삭제되었습니다.')}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
