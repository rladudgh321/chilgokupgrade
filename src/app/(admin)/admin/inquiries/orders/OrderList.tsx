'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ToggleSwitch from '@/app/components/admin/listings/ToggleSwitch';
import Pagination from '@/app/components/shared/Pagination';
import IpActions from '@/app/(admin)/shared/IpActions';

type Order = {
  id: number;
  confirm: boolean;
  category: string;
  transactionType: string;
  author: string;
  propertyType: string;
  estimatedAmount: string;
  contact: string;
  ipAddress: string;
  region: string;
  title: string;
  description: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

interface OrderListProps {
  initialOrders: Order[];
  totalPages: number;
  currentPage: number;
}

const OrderList = ({ initialOrders, totalPages, currentPage }: OrderListProps) => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [categoryFilter, setCategoryFilter] = useState<'전체' | '구해요' | '팔아요' | '기타'>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    setOrders(initialOrders);
    const initialNotes: { [key: number]: string } = {};
    initialOrders.forEach(order => {
      if (order.note) {
        initialNotes[order.id] = order.note;
      }
    });
    setNotes(initialNotes);
  }, [initialOrders]);

  const handleToggleChange = async (id: number, value: boolean) => {
    try {
      const response = await fetch(`/api/inquiries/orders/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ confirm: value }),
        });

      if (!response.ok) {
        throw new Error('Failed to update confirm status');
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id
            ? { ...order, confirm: value }
            : order
        )
      );
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleNoteChange = (id: number, note: string) => {
    setNotes((prev) => ({
      ...prev,
      [id]: note,
    }));
  };

  const handleSaveNote = async (id: number) => {
    try {
      const response = await fetch(`/api/inquiries/orders/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note: notes[id] || '' }),
        });

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      alert(`메모가 저장되었습니다.`);

    } catch (err) {
      alert('메모 저장에 실패했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말로 이 의뢰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/inquiries/orders/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      setOrders((prev) => prev.filter((order) => order.id !== id));
      alert('삭제되었습니다.');

    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  const onPageChange = (page: number) => {
    router.push(`/admin/inquiries/orders?page=${page}`);
  };

  const filteredOrders = orders.filter((order) => {
    if (categoryFilter === '전체') {
      return (
        (order.contact.includes(searchQuery) || order.title.includes(searchQuery))
      );
    }
    return (
      order.category === categoryFilter &&
      (order.contact.includes(searchQuery) || order.title.includes(searchQuery))
    );
  });

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div className="text-lg sm:text-xl font-semibold">
          의뢰수: {filteredOrders.length}건
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as '전체' | '구해요' | '팔아요' | '기타')}
            className="p-2 border rounded w-full sm:w-auto"
          >
            <option value="전체">전체</option>
            <option value="구해요">구해요</option>
            <option value="팔아요">팔아요</option>
          </select>
          <input
            type="text"
            placeholder="연락처 또는 제목 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded w-full sm:w-auto"
          />
          <button
            onClick={() => {}}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full sm:w-auto"
          >
            검색
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-xs sm:text-sm">번호</th>
              <th className="p-2 text-xs sm:text-sm">확인여부</th>
              <th className="p-2 text-xs sm:text-sm">구분</th>
              <th className="p-2 text-xs sm:text-sm">거래유형</th>
              <th className="p-2 text-xs sm:text-sm">작성자</th>
              <th className="p-2 text-xs sm:text-sm">매물종류</th>
              <th className="p-2 text-xs sm:text-sm">견적금액</th>
              <th className="p-2 text-xs sm:text-sm">연락처</th>
              <th className="p-2 text-xs sm:text-sm">IP주소</th>
              <th className="p-2 text-xs sm:text-sm">의뢰지역</th>
              <th className="p-2 text-xs sm:text-sm">제목</th>
              <th className="p-2 text-xs sm:text-sm">상세내용</th>
              <th className="p-2 text-xs sm:text-sm">등록일</th>
              <th className="p-2 text-xs sm:text-sm">비고</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.id} className={index % 2 === 0 ? 'bg-slate-200' : 'bg-slate-300'}>
                <td className="p-2 text-xs sm:text-sm">{order.id}</td>
                <td className="p-2">
                  <ToggleSwitch
                    toggle={order.confirm}
                    id={String(order.id)}
                    onToggle={(value) => handleToggleChange(order.id, value)}
                  />
                </td>
                <td className="p-2 text-xs sm:text-sm">{order.category}</td>
                <td className="p-2 text-xs sm:text-sm">{order.transactionType}</td>
                <td className="p-2 text-xs sm:text-sm">{order.author}</td>
                <td className="p-2 text-xs sm:text-sm">{order.propertyType}</td>
                <td className="p-2 text-xs sm:text-sm">{order.estimatedAmount}</td>
                <td className="p-2 text-xs sm:text-sm">{order.contact}</td>
                <td className="p-2 text-xs sm:text-sm">
                  <IpActions
                    ipAddress={order.ipAddress}
                    itemId={String(order.id)}
                    type="order"
                    onItemDeleted={(deletedItemId) => setOrders((prev) => prev.filter((o) => String(o.id) !== deletedItemId))}
                  />
                </td>
                <td className="p-2 text-xs sm:text-sm">{order.region}</td>
                <td className="p-2 text-xs sm:text-sm">
                  <p className="border p-2">{order.title}</p>
                  <textarea
                    value={notes[order.id] || ''}
                    onChange={(e) => handleNoteChange(order.id, e.target.value)}
                    placeholder="관리용메모"
                    className="p-2 border rounded w-full mt-2"
                  />
                  <button
                    onClick={() => handleSaveNote(order.id)}
                    className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
                  >
                    메모저장
                  </button>
                </td>
                <td className="p-2 text-xs sm:text-sm">
                  <button
                    className="p-2 bg-blue-500 text-white rounded w-full"
                    onClick={() => alert(`내용 보기: ${order.description}`)}
                  >
                    내용보기
                  </button>
                </td>
                <td className="p-2 text-xs sm:text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-2 text-xs sm:text-sm">
                  <button
                    className="p-2 bg-red-500 text-white rounded w-full"
                    onClick={() => handleDelete(order.id)}
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

export default OrderList;