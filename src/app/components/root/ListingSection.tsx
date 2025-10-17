"use client";

import { useState } from "react";
import RecommedLand from "./5RecommedLand";
import QuickSale from "./6QuickSale";
import RecentlyLand from "./7RecentlyLand";
import BuildDetailModal from "./BuildDetailModal";
import { ListingSectionProps } from "@/app/(app)/page";

export type Listing = {
  id: number;
  title?: string;
  address?: string;
  salePrice?: number;
  isSalePriceEnabled?: boolean;
  lumpSumPrice?: number;
  isLumpSumPriceEnabled?: boolean;
  actualEntryCost?: number;
  isActualEntryCostEnabled?: boolean;
  rentalPrice?: number;
  isRentalPriceEnabled?: boolean;
  halfLumpSumMonthlyRent?: number;
  isHalfLumpSumMonthlyRentEnabled?: boolean;
  deposit?: number;
  isDepositEnabled?: boolean;
  managementFee?: number;
  isManagementFeeEnabled?: boolean;
  propertyType?: string;
  currentFloor?: number;
  totalFloors?: number;
  rooms?: number;
  bathrooms?: number;
  actualArea?: number;
  supplyArea?: number;
  mainImage?: string;
  label?: string;
  popularity?: string;
  themes?: string[];
  buildingOptions?: string[];
  parking?: string[];
  isAddressPublic?: string;
  visibility?: boolean;
};

const ListingSection = ({ RecommendData, QuickSaleData, RecentlyData }: { RecommendData:ListingSectionProps, QuickSaleData: ListingSectionProps, RecentlyData: ListingSectionProps}) => {
  const [selectedBuildId, setSelectedBuildId] = useState<number | null>(null);

  const handleCardClick = (id: number) => {
    setSelectedBuildId(id);
  };

  const handleCloseModal = () => {
    setSelectedBuildId(null);
  };
  return (
    <>
      <RecommedLand RecommendData={RecommendData.listings} onCardClick={handleCardClick} />
      <QuickSale QuickSaleData={QuickSaleData.listings} onCardClick={handleCardClick} />
      <RecentlyLand RecentlyData={RecentlyData.listings} onCardClick={handleCardClick} />
      {selectedBuildId && (
        <BuildDetailModal
          buildId={selectedBuildId}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ListingSection;
