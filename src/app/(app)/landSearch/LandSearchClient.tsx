
"use client";
import { koreanToNumber } from "@/app/utility/koreanToNumber";
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

function LandSearchClientContent({ initialListings }: Props) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const sortBy = currentSearchParams.get("sortBy") ?? "latest";

  const queryParams = useMemo(() => {
    const params: { [key: string]: string } = {};
    currentSearchParams.forEach((value, key) => {
      params[key] = value;
    });
    console.log("Current Query Params:", params);
    return params;
  }, [currentSearchParams]);

  const {
    data: paginatedData,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["listings", queryParams],
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
    queryKey: ["map-listings", queryParams],
    queryFn: fetchMapListings,
    initialData: initialListings,
  });

  const allListings = useMemo(() => (paginatedData ? paginatedData.pages.flatMap((page) => page.listings) : []), [paginatedData]);
  const [filteredIds, setFilteredIds] = useState<number[] | null>(null);

  const displayListings = useMemo(() => {
    let listings = allListings;

    const priceRange = queryParams.priceRange;
    const dealType = queryParams.dealType;

    if (priceRange && dealType) {
      let priceField = "";
      if (dealType === "전세") {
        priceField = "lumpSumPrice";
      } else if (dealType === "월세") {
        priceField = "rentalPrice";
      } else if (dealType === "매매") {
        priceField = "salePrice";
      }

      if (priceField) {
        listings = listings.filter(listing => {
          const price = listing[priceField];
          if (price === undefined || price === null) return false;

          if (priceRange.includes("~")) {
            const [minStr, maxStr] = priceRange.split("~");
            const min = koreanToNumber(minStr);
            const max = koreanToNumber(maxStr);
            let passesMin = true;
            let passesMax = true;
            if (min !== null) {
              console.log(`Comparing: ${price} >= ${min}`);
              passesMin = price >= min;
            }
            if (max !== null) {
              console.log(`Comparing: ${price} <= ${max}`);
              passesMax = price <= max;
            }
            return passesMin && passesMax;
          } else if (priceRange.includes("이상")) {
            const min = koreanToNumber(priceRange.replace("이상", ""));
            if (min !== null) {
              console.log(`Comparing: ${price} >= ${min}`);
              return price >= min;
            }
          } else if (priceRange.includes("이하")) {
            const max = koreanToNumber(priceRange.replace("이하", ""));
            if (max !== null) {
              console.log(`Comparing: ${price} <= ${max}`);
              return price <= max;
            }
          }
          return true;
        });
      }
    }

    const floor = queryParams.floor;
    if (floor) {
        listings = listings.filter(listing => {
            const currentFloor = listing.currentFloor;
            if (currentFloor === undefined || currentFloor === null) return false;

            if (floor.includes("~")) {
                const [minStr, maxStr] = floor.replace(/층/g, "").split("~");
                const min = Number(minStr);
                const max = Number(maxStr);
                let passesMin = true;
                let passesMax = true;
                if (!isNaN(min)) {
                    passesMin = currentFloor >= min;
                }
                if (maxStr && !isNaN(Number(maxStr))) {
                    passesMax = currentFloor <= Number(maxStr);
                }
                return passesMin && passesMax;
            } else if (floor.includes("이상")) {
                const min = Number(floor.replace("층이상", ""));
                if (!isNaN(min)) {
                    return currentFloor >= min;
                }
            } else {
                const singleFloor = Number(floor.replace("층", ""));
                if (!isNaN(singleFloor)) {
                    return currentFloor === singleFloor;
                }
            }
            return true;
        });
    }

    const areaRange = queryParams.areaRange;
    if (areaRange) {
        const PYEONG_TO_M2 = 3.305785;
        listings = listings.filter(listing => {
            const totalArea = listing.totalArea;
            if (totalArea === undefined || totalArea === null) return false;

            // "20평~30평"
            if (areaRange.includes("~")) {
                const [minStr, maxStr] = areaRange.replace(/평/g, "").split("~");
                const minPyeong = Number(minStr);
                const maxPyeong = Number(maxStr);
                let passesMin = true;
                let passesMax = true;
                if (!isNaN(minPyeong)) {
                    passesMin = totalArea >= minPyeong * PYEONG_TO_M2;
                }
                if (maxStr && !isNaN(Number(maxStr))) {
                    passesMax = totalArea <= maxPyeong * PYEONG_TO_M2;
                }
                return passesMin && passesMax;
            } 
            // "20평이상"
            else if (areaRange.includes("이상")) {
                const minPyeong = Number(areaRange.replace("평이상", ""));
                if (!isNaN(minPyeong)) {
                    return totalArea >= minPyeong * PYEONG_TO_M2;
                }
            } 
            // "20평이하"
            else if (areaRange.includes("이하")) {
                const maxPyeong = Number(areaRange.replace("평이하", ""));
                if (!isNaN(maxPyeong)) {
                    return totalArea <= maxPyeong * PYEONG_TO_M2;
                }
            }
            return true;
        });
    }

    if (filteredIds === null) {
      return listings;
    }
    return listings.filter((listing) => filteredIds.includes(listing.id));
  }, [allListings, filteredIds, queryParams]);


  const handleSortChange = (newSortBy: string) => {
    const params = new URLSearchParams();
    currentSearchParams.forEach((value, key) => {
        params.set(key, value);
    })
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
        <div className="flex-1 min-w-0">
          <MapView listings={mapListings} onClusterClick={handleClusterClick} />
        </div>

        <div className="w-[480px] flex-shrink-0 bg-white border-l flex flex-col h-full">
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
