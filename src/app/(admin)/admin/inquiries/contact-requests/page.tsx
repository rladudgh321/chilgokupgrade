'use client';

import { useEffect, useMemo, useState } from 'react';
import ToggleSwitch from '@/app/components/admin/listings/ToggleSwitch';

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

const ContactRequest = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<{ [key: number]: string }>({});

  const fetchList = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/supabase/contact-requests?limit=100', { cache: 'no-store' });
      const json = await res.json();
      if (!json?.ok) throw new Error(json?.error?.message ?? '목록 불러오기 실패');
      const rows = (json.data as {
        id: number; confirm?: boolean; author?: string; contact?: string; ipAddress?: string; description?: string; note?: string | null; date?: string;
      }[]).map((r) => ({
        id: r.id,
        confirm: !!r.confirm,
        author: r.author ?? '',
        contact: r.contact ?? '',
        ipAddress: r.ipAddress ?? '',
        description: r.description ?? '',
        note: r.note ?? '',
        date: r.date ? String(r.date).slice(0, 10) : '',
      })) as Request[];
      setRequests(rows);

      const initialNotes = rows.reduce((acc, r) => {
        acc[r.id] = r.note;
        return acc;
      }, {} as { [key:number]: string });
      setNotes(initialNotes);

    } catch (e) {
      setError((e as Error)?.message ?? '에러 발생');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

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
      // 목록 갱신
      fetchList();
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold">
          의뢰수: {filteredRequests.length}건
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="연락처, 상세내용 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading && <div className="mb-2">불러오는 중...</div>}
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">번호</th>
            <th className="p-2">확인여부</th>
            <th className="p-2">이름</th>
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
                  onToggle={(checked) => handleToggleChange(String(request.id), checked)}
                />
              </td>
              <td className="p-2">{request.author}</td>
              <td className="p-2">{request.contact}</td>
              <td className="p-2">{request.ipAddress}</td>
              <td className="p-2">{request.description}</td>
              <td className="p-2">
                <textarea
                  value={notes[request.id] ?? ''}
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
