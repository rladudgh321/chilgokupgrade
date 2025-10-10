"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

type PropertyItem = {
  name: string;
  imageUrl?: string;
};

const WhatTypeLand = () => {
  const [items, setItems] = useState<PropertyItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/listing-type', { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        const rows: Array<{ name?: string; imageUrl?: string }> = json?.data ?? [];
        const mapped = rows
          .map(r => ({ name: (r?.name ?? '').trim(), imageUrl: r?.imageUrl }))
          .filter(p => p.name.length > 0 && p.imageUrl); // Only show items with images
        if (!cancelled) setItems(mapped);
      } catch {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4 p-4">
      {items.map((property, index) => {
        const href = `/landSearch?propertyType=${encodeURIComponent(property.name)}`;
        return (
          <Link href={href} key={`${property.name}-${index}`} className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden block">
            <div
              style={{ backgroundImage: `url(${property.imageUrl})` }}
              className="h-[80px] sm:h-[100px] md:h-[115px] bg-center bg-cover"
            />
            <div className="text-center py-2 font-semibold text-sm sm:text-base">{property.name}</div>
          </Link>
        );
      })}
    </div>
  );
};

export default WhatTypeLand;
