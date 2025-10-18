import { Suspense } from 'react';
import CardList from "./CardList";

export default async function CardPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;

  const query: Record<string, string> = {};
  if (searchParams.keyword) query.keyword = searchParams.keyword as string;
  if (searchParams.theme) query.theme = searchParams.theme as string;
  if (searchParams.propertyType) query.propertyType = searchParams.propertyType as string;
  if (searchParams.buyType) query.buyType = searchParams.buyType as string;
  if (searchParams.rooms) query.rooms = searchParams.rooms as string;
  if (searchParams.bathrooms) query.bathrooms = searchParams.bathrooms as string;
  if (searchParams.sortBy) query.sortBy = searchParams.sortBy as string;

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
      <CardList listings={listingsData.listings} />
    </Suspense>
  );
}