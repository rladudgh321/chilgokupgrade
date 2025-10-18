"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import CardItem from "./CardItem"
import SearchBar from "../landSearch/SearchBar"
import { useRouter, useSearchParams } from "next/navigation"
import BuildDetailModalClient from '@/app/components/root/BuildDetailModal'
import { koreanToNumber } from '@/app/utility/koreanToNumber'

const LIMIT = 12

const fetchListings = async ({ pageParam = 1, queryKey }: any) => {
  const [, searchParams] = queryKey;
  const params = new URLSearchParams();

  // We only pass filters that the API can handle
  params.set("page", pageParam.toString());
  params.set("limit", LIMIT.toString());
  if (searchParams.keyword) params.set("keyword", searchParams.keyword);
  if (searchParams.theme) params.set("theme", searchParams.theme);
  if (searchParams.propertyType) params.set("propertyType", searchParams.propertyType);
  if (searchParams.buyType) params.set("buyType", searchParams.buyType);
  if (searchParams.rooms) params.set("rooms", searchParams.rooms);
  if (searchParams.bathrooms) params.set("bathrooms", searchParams.bathrooms);
  if (searchParams.sortBy) params.set("sortBy", searchParams.sortBy);

  const res = await fetch(`/api/listings?${params.toString()}`, {
    next: { revalidate: 28_800, tags: ['public', 'card'] }
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const CardList = ({ initialData }: { initialData: any }) => {
  const [selectedBuildId, setSelectedBuildId] = useState<number | null>(null);

  const handleCardClick = (id: number) => {
    setSelectedBuildId(id);
  };

  const router = useRouter()
  const searchParams = useSearchParams()

  const sortBy = searchParams.get("sortBy") || "recommended"

  const queryParams = useMemo(() => {
    const params: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  const handleCloseModal = () => {
    setSelectedBuildId(null);
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } = useInfiniteQuery({
    queryKey: ["listings", queryParams],
    queryFn: fetchListings,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    initialData: { pages: [initialData], pageParams: [1] },
  });

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 500
    ) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const handleSortChange = (newSortBy: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", newSortBy);
    router.push(`/card?${params.toString()}`);
  };

  const allListings = useMemo(() => {
    if (!data) return [];
    const listings = data.pages.flatMap((page) => page.listings);
    return Array.from(new Map(listings.map(item => [item.id, item])).values());
  }, [data]);

  const displayListings = useMemo(() => {
    let listings = allListings;

    const priceRange = queryParams.priceRange;
    const buyType = queryParams.buyType;

    if (priceRange && buyType) {
      let priceField = "";
      if (buyType === "전세") priceField = "lumpSumPrice";
      else if (buyType === "월세") priceField = "rentalPrice";
      else if (buyType === "매매") priceField = "salePrice";

      if (priceField) {
        listings = listings.filter(listing => {
          const price = listing[priceField];
          if (price === undefined || price === null) return false;

          if (priceRange.includes("~")) {
            const [minStr, maxStr] = priceRange.split("~");
            const min = koreanToNumber(minStr);
            const max = koreanToNumber(maxStr);
            if (min !== null && price < min) return false;
            if (max !== null && price > max) return false;
          } else if (priceRange.includes("이상")) {
            const min = koreanToNumber(priceRange.replace("이상", ""));
            if (min !== null && price < min) return false;
          } else if (priceRange.includes("이하")) {
            const max = koreanToNumber(priceRange.replace("이하", ""));
            if (max !== null && price > max) return false;
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
                if (!isNaN(min) && currentFloor < min) return false;
                if (maxStr && !isNaN(Number(maxStr)) && currentFloor > Number(maxStr)) return false;
            } else if (floor.includes("이상")) {
                const min = Number(floor.replace("층이상", ""));
                if (!isNaN(min) && currentFloor < min) return false;
            } else {
                const singleFloor = Number(floor.replace("층", ""));
                if (!isNaN(singleFloor) && currentFloor !== singleFloor) return false;
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

            if (areaRange.includes("~")) {
                const [minStr, maxStr] = areaRange.replace(/평/g, "").split("~");
                const minPyeong = Number(minStr);
                const maxPyeong = Number(maxStr);
                if (!isNaN(minPyeong) && totalArea < minPyeong * PYEONG_TO_M2) return false;
                if (maxStr && !isNaN(Number(maxStr)) && totalArea > maxPyeong * PYEONG_TO_M2) return false;
            }
            else if (areaRange.includes("이상")) {
                const minPyeong = Number(areaRange.replace("평이상", ""));
                if (!isNaN(minPyeong) && totalArea < minPyeong * PYEONG_TO_M2) return false;
            }
            else if (areaRange.includes("이하")) {
                const maxPyeong = Number(areaRange.replace("평이하", ""));
                if (!isNaN(maxPyeong) && totalArea > maxPyeong * PYEONG_TO_M2) return false;
            }
            return true;
        });
    }

    return listings;
  }, [allListings, queryParams]);

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">데이터를 불러오는 중 오류가 발생했습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <SearchBar />
      </div>

      <div className="p-2 sm:p-4 md:p-6">
        <div className="flex border-b bg-white mb-6 overflow-x-auto">
          {[
            { key: "latest", label: "최신순" },
            { key: "popular", label: "인기순" },
            { key: "price-desc", label: "금액순↓" },
            { key: "area-desc", label: "면적순↓" },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => handleSortChange(option.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                sortBy === option.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayListings.map((listing) => (
            <CardItem key={listing.id} listing={listing} onClick={() => handleCardClick(listing.id)} />
          ))}
        </div>

        {displayListings.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>표시할 매물이 없습니다.</p>
          </div>
        )}

        {isFetchingNextPage && (
          <div className="flex items-center justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">더 많은 매물을 불러오는 중...</span>
          </div>
        )}

        {!hasNextPage && displayListings.length > 0 && (
          <div className="flex items-center justify-center mt-8 text-gray-500">
            <p>모든 매물을 불러왔습니다.</p>
          </div>
        )}
      </div>
      {selectedBuildId && (
        <BuildDetailModalClient
          build={allListings.find((listing) => listing.id === selectedBuildId)}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default CardList