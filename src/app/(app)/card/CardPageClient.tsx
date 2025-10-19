'use client'

import { Suspense } from 'react';
import CardList from "./CardList";
import Pagination from "@/app/components/shared/Pagination";
import { useSearchParams, useRouter } from 'next/navigation';

export default function CardPageClient({ listings, totalPages }: { listings: any[], totalPages: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/card?${params.toString()}`);
  };

  return (
    <Suspense>
      <CardList listings={listings} />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Suspense>
  );
}
