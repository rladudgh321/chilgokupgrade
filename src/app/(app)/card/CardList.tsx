"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import CardItem from "./CardItem"
import SearchBar from "../landSearch/SearchBar"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import BuildDetailModal from "../../components/root/BuildDetailModal";

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
  if (searchParams.dealType) params.set("dealType", searchParams.dealType);
  if (searchParams.rooms) params.set("rooms", searchParams.rooms);
  if (searchParams.bathrooms) params.set("bathrooms", searchParams.bathrooms);
  if (searchParams.sortBy) params.set("sortBy", searchParams.sortBy);


  const { data } = await axios.get(`/api/listings?${params.toString()}`);
  return data;
};


const CardList = () => {
  const [selectedBuildId, setSelectedBuildId] = useState<number | null>(null);

  const handleCardClick = (id: number) => {
    setSelectedBuildId(id);
  };

  const handleCloseModal = () => {
    setSelectedBuildId(null);
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


  // 무한 스크롤 쿼리
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["listings", queryParams],
    queryFn: fetchListings,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  })

  // 무한 스크롤 감지
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


  // 모든 매물 데이터 수집
  const allListings = useMemo(() => {
    if (!data) return [];
    const listings = data.pages.flatMap((page) => page.listings);
    const uniqueListings = Array.from(new Map(listings.map(item => [item.id, item])).values());
    return uniqueListings;
  }, [data]);

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
            let passesMin = true;
            let passesMax = true;
            if (min !== null) {
              passesMin = price >= min;
            }
            if (max !== null) {
              passesMax = price <= max;
            }
          } else if (priceRange.includes("이상")) {
            const min = koreanToNumber(priceRange.replace("이상", ""));
            if (min !== null) {
              return price >= min;
            }
          } else if (priceRange.includes("이하")) {
            const max = koreanToNumber(priceRange.replace("이하", ""));
            if (max !== null) {
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
            else if (areaRange.includes("이상")) {
                const minPyeong = Number(areaRange.replace("평이상", ""));
                if (!isNaN(minPyeong)) {
                    return totalArea >= minPyeong * PYEONG_TO_M2;
                }
            }
            else if (areaRange.includes("이하")) {
                const maxPyeong = Number(areaRange.replace("평이하", ""));
                if (!isNaN(maxPyeong)) {
                    return totalArea <= maxPyeong * PYEONG_TO_M2;
                }
            }
            return true;
        });
    }

    return listings;
  }, [allListings, queryParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">매물을 불러오는 중...</p>
        </div>
      </div>
    )
  }

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
      {/* 검색 바 */}
      <div className="bg-white shadow-sm border-b">
        <SearchBar />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="p-2 sm:p-4 md:p-6">
        {/* 정렬 탭 */}
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

        {/* 반응형 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayListings.map((listing) => (
            <CardItem key={listing.id} listing={listing} onClick={handleCardClick} />
          ))}
        </div>

        {/* 매물이 없을 때 */}
        {displayListings.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>표시할 매물이 없습니다.</p>
          </div>
        )}

        {/* 로딩 인디케이터 */}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">더 많은 매물을 불러오는 중...</span>
          </div>
        )}

        {/* 더 이상 로드할 데이터가 없을 때 */}
        {!hasNextPage && displayListings.length > 0 && (
          <div className="flex items-center justify-center mt-8 text-gray-500">
            <p>모든 매물을 불러왔습니다.</p>
          </div>
        )}
      </div>
      {selectedBuildId && (
        <BuildDetailModal buildId={selectedBuildId} onClose={handleCloseModal} />
      )}
    </div>
  )
}

export default CardList
