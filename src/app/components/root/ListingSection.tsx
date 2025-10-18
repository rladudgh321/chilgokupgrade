"use client";

import { useRouter } from "next/navigation";
import RecommedLand from "./5RecommedLand";
import QuickSale from "./6QuickSale";
import RecentlyLand from "./7RecentlyLand";
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
const ListingSection = ({ RecommendData, QuickSaleData, RecentlyData }:{
  RecommendData: ListingSectionProps; QuickSaleData: ListingSectionProps; RecentlyData: ListingSectionProps;
}) => {
  const router = useRouter();
  const handleCardClick = (id: number) => {
    router.push(`/build/${id}`, { scroll: false }); // ← 모달 인터셉트 라우트로 이동
  };

  return (
    <>
      <RecommedLand RecommendData={RecommendData.listings} onCardClick={handleCardClick} />
      <QuickSale QuickSaleData={QuickSaleData.listings} onCardClick={handleCardClick} />
      <RecentlyLand RecentlyData={RecentlyData.listings} onCardClick={handleCardClick} />
    </>
  );
};
export default ListingSection;