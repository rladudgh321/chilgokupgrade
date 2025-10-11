'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BannedIp {
  id: string;
  ipAddress: string;
  reason: string;
  contact: string;
  details: string;
  createdAt: string;
}

interface BannedIpListProps {
  initialBannedIps: BannedIp[];
}

const BannedIpList = ({ initialBannedIps }: BannedIpListProps) => {
  const router = useRouter();
  const [bannedIps, setBannedIps] = useState<BannedIp[]>(initialBannedIps);

  const handleUnban = async (id: string) => {
    const confirmUnban = window.confirm('정말로 차단을 해제하시겠습니까?');
    if (!confirmUnban) return;

    try {
      const res = await fetch(`/api/admin/banned-ips?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '차단 해제 실패');
      }

      alert('IP 차단이 해제되었습니다.');
      setBannedIps((prev) => prev.filter((ip) => ip.id !== id));
      router.refresh();
    } catch (error) {
      console.error('Error unbanning IP:', error);
      alert((error as Error).message || 'IP 차단 해제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div className="text-lg sm:text-xl font-semibold">
          차단된 IP: {bannedIps.length}건
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-xs sm:text-sm">등록일</th>
              <th className="p-2 text-xs sm:text-sm">차단 IP주소</th>
              <th className="p-2 text-xs sm:text-sm">연락처</th>
              <th className="p-2 text-xs sm:text-sm">상세내용</th>
              <th className="p-2 text-xs sm:text-sm">차단사유</th>
              <th className="p-2 text-xs sm:text-sm">비고</th>
            </tr>
          </thead>
          <tbody>
            {bannedIps.map((ip, index) => (
              <tr key={ip.id} className={index % 2 === 0 ? 'bg-slate-200' : 'bg-slate-300'}>
                <td className="p-2 text-xs sm:text-sm">{ip.createdAt}</td>
                <td className="p-2 text-xs sm:text-sm">{ip.ipAddress}</td>
                <td className="p-2 text-xs sm:text-sm">{ip.contact}</td>
                <td className="p-2 text-xs sm:text-sm">{ip.details}</td>
                <td className="p-2 text-xs sm:text-sm">{ip.reason}</td>
                <td className="p-2">
                  <button
                    className="p-2 bg-blue-500 text-white rounded w-full"
                    onClick={() => handleUnban(ip.id)}
                  >
                    차단 해제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BannedIpList;
