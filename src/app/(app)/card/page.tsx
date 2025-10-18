import { Suspense } from 'react';
import CardList from "./CardList";

const LIMIT = 12;

const fetchListings = async (searchParams: any) => {
  const params = new URLSearchParams();
  params.set("page", "1");
  params.set("limit", LIMIT.toString());
  if (searchParams.keyword) params.set("keyword", searchParams.keyword);
  if (searchParams.theme) params.set("theme", searchParams.theme);
  if (searchParams.propertyType) params.set("propertyType", searchParams.propertyType);
  if (searchParams.buyType) params.set("buyType", searchParams.buyType);
  if (searchParams.rooms) params.set("rooms", searchParams.rooms);
  if (searchParams.bathrooms) params.set("bathrooms", searchParams.bathrooms);
  if (searchParams.sortBy) params.set("sortBy", searchParams.sortBy);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/listings?${params.toString()}`, {
    next: { revalidate: 28_800, tags: ['public', 'card'] }
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export default async function CardPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const initialData = await fetchListings(searchParams);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardList initialData={initialData} />
    </Suspense>
  );
}
