'use client';

import { useState } from 'react';
import ToggleSwitch from '@/app/components/admin/listings/ToggleSwitch';

type Request = {
  id: number;
  confirm: boolean;
  listingNumber: string;  // 매물번호 추가
  author: string;
  manager: string;        // 담당자 추가
  contact: string;
  ipAddress: string;
  description: string;
  note: string;
  date: string;
};

const ContactRequest = () => {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 1,
      confirm: false,
      listingNumber: 'LN1234',
      author: '홍길동',
      manager: '김민수',
      contact: '010-1234-5678',
      ipAddress: '192.168.0.1',
      description: '빠른 시일 내에 아파트를 구하고 있습니다.',
      note: '',
      date: '2023-03-29',
    },
    {
      id: 2,
      confirm: true,
      listingNumber: 'LN5678',
      author: '김영희',
      manager: '이하늘',
      contact: '010-9876-5432',
      ipAddress: '192.168.0.2',
      description: '단독주택을 팔고 있습니다. 관심있으신 분 연락주세요.',
      note: '',
      date: '2023-03-30',
    },
    {
      id: 3,
      confirm: false,
      listingNumber: 'LN9101',
      author: '박수정',
      manager: '박영철',
      contact: '010-4567-1234',
      ipAddress: '192.168.0.3',
      description: '인천에 위치한 땅을 판매합니다.',
      note: '',
      date: '2023-03-31',
    },
    {
      id: 4,
      confirm: true,
      listingNumber: 'LN1123',
      author: '이민수',
      manager: '김지은',
      contact: '010-2222-3333',
      ipAddress: '192.168.0.4',
      description: '경기도에서 아파트를 구하고 있습니다.',
      note: '',
      date: '2023-04-01',
    },
  ]);
  
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

  const handleSaveNote = (id: number) => {
    alert(`메모가 저장되었습니다: ${notes[id]}`);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
    
    if (confirmDelete) {
      setRequests((prev) =>
        prev.map((request) =>
          request.id === id
            ? { ...request, confirm: false } // 삭제할 때 confirm을 false로 설정
            : request
        )
      );
      alert('삭제되었습니다.');
    }
  };

  const filteredRequests = requests.filter((request) => {
    return (
      request.listingNumber.includes(searchQuery) ||
      request.contact.includes(searchQuery) ||
      request.description.includes(searchQuery)
    );
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold">
          의뢰수: {filteredRequests.length}건
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="매물번호, 연락처, 상세내용 검색"
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
            <th className="p-2">매물번호</th>
            <th className="p-2">이름</th>
            <th className="p-2">담당자</th>
            <th className="p-2">연락처</th>
            <th className="p-2">IP</th>
            <th className="p-2">상세내용</th>
            <th className="p-2">관리용메모</th>
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
              <td className="p-2">{request.listingNumber}</td>
              <td className="p-2">{request.author}</td>
              <td className="p-2">{request.manager}</td>
              <td className="p-2">{request.contact}</td>
              <td className="p-2">{request.ipAddress}</td>
              <td className="p-2">{request.description}</td>
              <td className="p-2">
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
              <td className="p-2">{request.date}</td>
              <td className="p-2">
                <button
                  className="p-2 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(request.id)} // 삭제 버튼 클릭 시 confirm을 false로 설정
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

export default ContactRequest;
