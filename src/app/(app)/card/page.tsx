import { Suspense } from 'react';
import CardPageClient from "./CardPageClient";

export default async function CardPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sh = await searchParams;
  const query: Record<string, string> = {};
  if (sh.keyword) query.keyword = sh.keyword as string;
  if (sh.theme) query.theme = sh.theme as string;
  if (sh.propertyType) query.propertyType = sh.propertyType as string;
  if (sh.buyType) query.buyType = sh.buyType as string;
  if (sh.rooms) query.rooms = sh.rooms as string;
  if (sh.bathrooms) query.bathrooms = sh.bathrooms as string;
  if (sh.sortBy) query.sortBy = sh.sortBy as string;
  if (sh.page) query.page = sh.page as string;
  query.limit = "12";

  const params = new URLSearchParams(query);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/listings?${params.toString()}`, {
    next: { revalidate: 28_800, tags: ['public', 'card'] }
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const listingsData = await res.json();

  return (
    <Suspense>
      <CardPageClient listings={listingsData.listings} totalPages={listingsData.totalPages} />
    </Suspense>
  );
}