"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import MapView from "./MapView";
import ListingList from "./ListingList";
import LandSearchPagination from "./LandSearchPagination";
import SearchBar from "./SearchBar";

// Assuming the type for a listing is similar to what's in MapView and ListingCard
type Listing = {
  id: number;
  // ... other properties
  [key: string]: any;
};

type Props = {
  initialListings: Listing[];
  totalPages: number;
  currentPage: number;
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function LandSearchClient({ initialListings, totalPages, currentPage, searchParams }: Props) {
  const [displayListings, setDisplayListings] = useState(initialListings);
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const sortBy = currentSearchParams.get('sortBy') ?? 'latest';

  useEffect(() => {
    setDisplayListings(initialListings);
  }, [initialListings]);

  const handleSortChange = (newSortBy: string) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set('sortBy', newSortBy);
    router.push(`?${params.toString()}`);
  };

  const handleClusterClick = (listingIds: number[]) => {
    const filtered = initialListings.filter(listing => listingIds.includes(listing.id));
    setDisplayListings(filtered);
  };

  const handleResetFilter = () => {
    setDisplayListings(initialListings);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <SearchBar />
      </div>
      
      <div className="flex h-[calc(100vh-120px)]">
        <div className="w-1/2">
          <MapView 
            listings={initialListings} 
            onClusterClick={handleClusterClick}
          />
        </div>
        
        <div className="w-1/2 bg-white border-l flex flex-col h-full">
          {displayListings.length < initialListings.length && (
            <div className="p-2 text-center border-b">
              <button onClick={handleResetFilter} className="text-sm text-blue-600 hover:underline">
                {displayListings.length}개의 매물만 표시 중입니다. 전체 목록으로 돌아가기
              </button>
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <ListingList listings={displayListings} sortBy={sortBy} onSortChange={handleSortChange} />
          </div>
          
          {totalPages > 1 && (
            <div className="border-t bg-white p-4 flex-shrink-0">
              <LandSearchPagination 
                currentPage={currentPage} 
                totalPages={totalPages}
                searchParams={searchParams}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}