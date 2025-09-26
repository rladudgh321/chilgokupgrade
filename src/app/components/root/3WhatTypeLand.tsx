"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type PropertyItem = {
  name: string;
  imageUrl?: string;
};

const fallbackImageByName: Record<string, string> = {
  '아파트': '/img/1/apart.png',
  '신축빌라': '/img/1/villa.png',
  '원룸': '/img/1/oneroom.png',
  '투룸': '/img/1/oneroom.png',
  '쓰리룸': '/img/1/oneroom.png',
  '원/투/쓰리룸': '/img/1/oneroom.png',
  '사무실': '/img/1/office.png',
  '상가': '/img/1/store.png',
  '오피스텔': '/img/1/officetel.png',
};

const WhatTypeLand = () => {
  const [items, setItems] = useState<PropertyItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/property-types', { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        const rows: Array<{ name?: string; imageUrl?: string }> = json?.data ?? [];
        const mapped = rows
          .map(r => ({ name: (r?.name ?? '').trim(), imageUrl: r?.imageUrl }))
          .filter(p => p.name.length > 0);
        if (!cancelled) setItems(mapped);
      } catch {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const properties = useMemo(() => {
    if (items.length > 0) return items;
    // 기본 하드코어드 (데이터 없을 때)
    return [
      { name: '아파트', imageUrl: fallbackImageByName['아파트'] },
      { name: '신축빌라', imageUrl: fallbackImageByName['신축빌라'] },
      { name: '원/투/쓰리룸', imageUrl: fallbackImageByName['원/투/쓰리룸'] },
      { name: '사무실', imageUrl: fallbackImageByName['사무실'] },
      { name: '상가', imageUrl: fallbackImageByName['상가'] },
      { name: '오피스텔', imageUrl: fallbackImageByName['오피스텔'] },
    ];
  }, [items]);

  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      {properties.map((property, index) => {
        const bg = property.imageUrl || fallbackImageByName[property.name] || '';
        const href = `/landSearch?propertyType=${encodeURIComponent(property.name)}`;
        return (
          <Link href={href} key={`${property.name}-${index}`} className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden block">
            <div 
              style={{ backgroundImage: `url(${bg})` }} 
              className="h-[115px] bg-center bg-cover"
            />
            <div className="text-center py-2 font-semibold">{property.name}</div>
          </Link>
        );
      })}
    </div>
  );
};

export default WhatTypeLand;
