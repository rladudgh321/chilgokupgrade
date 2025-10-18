"use client"
import { useState, useMemo } from "react"
import CardItem from "./CardItem"
import SearchBar from "../landSearch/SearchBar"
import { useRouter, useSearchParams } from "next/navigation"
import BuildDetailModalClient from '@/app/components/root/BuildDetailModal'
import { koreanToNumber } from '@/app/utility/koreanToNumber'

const CardList = ({ listings }: { listings: any[] }) => {
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

  const handleSortChange = (newSortBy: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", newSortBy);
    router.push(`/card?${params.toString()}`);
  };

  const displayListings = useMemo(() => {
    let filteredListings = listings;

    const priceRange = queryParams.priceRange;
    const buyType = queryParams.buyType;

    if (priceRange && buyType) {
      let priceField = "";
      if (buyType === "전세") priceField = "lumpSumPrice";
      else if (buyType === "월세") priceField = "rentalPrice";
      else if (buyType === "매매") priceField = "salePrice";

      if (priceField) {
        filteredListings = filteredListings.filter(listing => {
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
        filteredListings = filteredListings.filter(listing => {
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
        filteredListings = filteredListings.filter(listing => {
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

    return filteredListings;
  }, [listings, queryParams]);

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
          {displayListings.map((listing, index) => (
            <CardItem key={listing.id} listing={listing} onClick={() => handleCardClick(listing.id)} priority={index < 3} />
          ))}
        </div>

        {displayListings.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>표시할 매물이 없습니다.</p>
          </div>
        )}
      </div>
      {selectedBuildId && (
        <BuildDetailModalClient
          build={listings.find((listing) => listing.id === selectedBuildId)}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default CardList
