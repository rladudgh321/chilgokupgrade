
"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery, useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MapView from "./MapView";
import ListingList from "./ListingList";
import SearchBar from "./SearchBar";
import axios from "axios";

// Assuming the type for a listing is similar to what's in MapView and ListingCard
type Listing = {
  id: number;
  // ... other properties
  [key: string]: any;
};

type Props = {
  initialListings: Listing[];
  searchParams: { [key: string]: string | string[] | undefined };
};

const fetchListings = async ({ pageParam = 1, queryKey }: any) => {
  const [_, searchParams] = queryKey;
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && typeof value === "string") {
      params.set(key, value);
    }
  });
  params.set("page", pageParam.toString());

  const { data } = await axios.get(`/api/listings?${params.toString()}`);
  return data;
};

const fetchMapListings = async ({ queryKey }: any) => {
  const [_, searchParams] = queryKey;
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && typeof value === "string") {
      params.set(key, value);
    }
  });

  const { data } = await axios.get(`/api/listings/map?${params.toString()}`);
  return data.data; // The new endpoint wraps data in a `data` property
};

function LandSearchClientContent({ initialListings, searchParams }: Props) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const sortBy = currentSearchParams.get("sortBy") ?? "latest";

  const {
    data: paginatedData,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["listings", searchParams],
    queryFn: fetchListings,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialData: () => {
        return {
          pageParams: [1],
          pages: [{
            listings: initialListings,
            totalPages: 1, // We don't know total pages on client, so we start with 1
            currentPage: 1
          }]
        }
    },
    initialPageParam: 1,
  });

  const { data: mapListings = [] } = useQuery({
    queryKey: ["map-listings", searchParams],
    queryFn: fetchMapListings,
  });

  const allListings = useMemo(() => (paginatedData ? paginatedData.pages.flatMap((page) => page.listings) : []), [paginatedData]);
  const [filteredIds, setFilteredIds] = useState<number[] | null>(null);

  const displayListings = useMemo(() => {
    if (filteredIds === null) {
      return allListings;
    }
    return allListings.filter((listing) => filteredIds.includes(listing.id));
  }, [allListings, filteredIds]);


  const handleSortChange = (newSortBy: string) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set("sortBy", newSortBy);
    // Reset pagination when sorting changes
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const handleClusterClick = (listingIds: number[]) => {
    setFilteredIds(listingIds);
  };

  const handleResetFilter = () => {
    setFilteredIds(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <SearchBar />
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        <div className="w-1/2">
          <MapView listings={mapListings} onClusterClick={handleClusterClick} />
        </div>

        <div className="w-1/2 bg-white border-l flex flex-col h-full">
          {filteredIds !== null && (
            <div className="p-2 text-center border-b">
              <button
                onClick={handleResetFilter}
                className="text-sm text-blue-600 hover:underline"
              >
                {displayListings.length}개의 매물만 표시 중입니다. 전체
                목록으로 돌아가기
              </button>
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <ListingList
              listings={displayListings}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

export default function LandSearchClient(props: Props) {
    return (
        <QueryClientProvider client={queryClient}>
            <LandSearchClientContent {...props} />
        </QueryClientProvider>
    )
}
