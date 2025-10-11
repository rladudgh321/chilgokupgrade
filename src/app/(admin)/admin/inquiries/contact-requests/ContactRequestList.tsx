'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ToggleSwitch from '@/app/components/admin/listings/ToggleSwitch';
import Pagination from '@/app/components/shared/Pagination';
import IpActions from '@/app/(admin)/shared/IpActions';

type Request = {
  id: number;
  confirm: boolean;
  author: string;
  contact: string;
  ipAddress: string;
  description: string;
  note: string;
  date: string;
};

interface ContactRequestListProps {
  initialRequests: Request[];
  totalPages: number;
  currentPage: number;
}

const ContactRequestList = ({ initialRequests, totalPages, currentPage }: ContactRequestListProps) => {
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    setRequests(initialRequests);
    const initialNotes = initialRequests.reduce((acc, r) => {
      acc[r.id] = r.note;
      return acc;
    }, {} as { [key:number]: string });
    setNotes(initialNotes);
  }, [initialRequests]);

  const handleToggleChange = async (id: string, value: boolean) => {
    const numericId = parseInt(id, 10);
    setRequests((prev) => prev.map((r) => (r.id === numericId ? { ...r, confirm: value } : r)));
    try {
      await fetch('/api/supabase/contact-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: numericId, confirm: value }),
      });
    } catch {
      // 실패 시 롤백
      setRequests((prev) => prev.map((r) => (r.id === numericId ? { ...r, confirm: !value } : r)));
      alert('확인여부 변경 실패');
    }
  };

  const handleNoteChange = (id: number, note: string) => {
    setNotes((prev) => ({
      ...prev,
      [id]: note,
    }));
  };

  const handleSaveNote = async (id: number) => {
    const note = notes[id] ?? '';
    try {
      const res = await fetch('/api/supabase/contact-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, note }),
      });
      if (!res.ok) throw new Error('메모 저장 실패');
      alert('메모가 저장되었습니다');
      router.refresh();
    } catch (e) {
      alert((e as Error)?.message ?? '메모 저장 실패');
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/supabase/contact-requests?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('삭제 실패');
      alert('삭제되었습니다.');
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      alert((e as Error)?.message ?? '삭제 실패');
    }
  };

  const filteredRequests = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return requests;
    return requests.filter((request) => request.contact.includes(q) || request.description.includes(q));
  }, [requests, searchQuery]);

  const onPageChange = (page: number) => {
    router.push(`/admin/inquiries/contact-requests?page=${page}`);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div className="text-lg sm:text-xl font-semibold">
          의뢰수: {filteredRequests.length}건
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="연락처, 상세내용 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-xs sm:text-sm">번호</th>
              <th className="p-2 text-xs sm:text-sm">확인여부</th>
              <th className="p-2 text-xs sm:text-sm">이름</th>
              <th className="p-2 text-xs sm:text-sm">연락처</th>
              <th className="p-2 text-xs sm:text-sm">IP</th>
              <th className="p-2 text-xs sm:text-sm">상세내용</th>
              <th className="p-2 text-xs sm:text-sm">관리용메모</th>
              <th className="p-2 text-xs sm:text-sm">등록일</th>
              <th className="p-2 text-xs sm:text-sm">비고</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request, index) => (
              <tr key={request.id} className={index % 2 === 0 ? 'bg-slate-200' : 'bg-slate-300'}>
                <td className="p-2 text-xs sm:text-sm">{request.id}</td>
                <td className="p-2">
                  <ToggleSwitch
                    toggle={request.confirm}
                    id={`confirm${request.id}`}
                    onToggle={(checked) => handleToggleChange(String(request.id), checked)}
                  />
                </td>
                <td className="p-2 text-xs sm:text-sm">{request.author}</td>
                <td className="p-2 text-xs sm:text-sm">{request.contact}</td>
                <td className="p-2 text-xs sm:text-sm">
                  <IpActions
                    ipAddress={request.ipAddress}
                    itemId={String(request.id)}
                    type="contact-request"
                    onItemDeleted={(deletedItemId) => setRequests((prev) => prev.filter((r) => String(r.id) !== deletedItemId))}
                  />
                </td>
                <td className="p-2 text-xs sm:text-sm">{request.description}</td>
                <td className="p-2">
                  <textarea
                    value={notes[request.id] ?? ''}
                    onChange={(e) => handleNoteChange(request.id, e.target.value)}
                    placeholder="관리용메모"
                    className="p-2 border rounded w-full mt-2 text-xs sm:text-sm"
                  />
                  <button
                    onClick={() => handleSaveNote(request.id)}
                    className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
                  >
                    메모저장
                  </button>
                </td>
                <td className="p-2 text-xs sm:text-sm">{request.date}</td>
                <td className="p-2">
                  <button
                    className="p-2 bg-red-500 text-white rounded w-full"
                    onClick={() => handleDelete(request.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination 
        totalPages={totalPages} 
        currentPage={currentPage} 
        onPageChange={onPageChange} 
      />
    </div>
  );
};

export default ContactRequestList;
