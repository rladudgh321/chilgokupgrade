"use client";

import { useEffect, useMemo, useState } from "react";
import CardSlide from "./shaped/CardSlide";

type Listing = {
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

const RecommedLand = () => {
  const [items, setItems] = useState<Listing[]>([]);

  useEffect(() => {
    let aborted = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/listings?sortBy=popular&limit=10`, { cache: "no-store" });
        const json = await res.json();
        if (!json?.listings || !Array.isArray(json?.listings)) return;

        if (!aborted) setItems(json.listings);
      } catch (e) {
        console.error(e);
      }
    };
    load();
    return () => {
      aborted = true;
    };
  }, []);

  const listings = useMemo(() => items, [items]);

  return (
    <div className="text-center p-6">
      <h2 className="text-xl font-bold">이달의 인기 부동산</h2>
      <p className="text-gray-600">이 달의 인기 매물을 확인해보세요!</p>
      <CardSlide listings={listings} />
    </div>
  );
};

export default RecommedLand;
