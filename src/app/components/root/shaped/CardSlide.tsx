"use client"

import { memo, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import CardItem from "../../../(app)/card/CardItem";

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


const CardSlide = ({listings, onCardClick}: {listings: Listing[], onCardClick: (id: number) => void}) => {
  const computeSlides = () => (globalThis.innerWidth < 768 ? 2 : 4);
  const computeMaxItems = () => {
    const w = globalThis.innerWidth;
    if (w >= 1024) return 10; // PC
    if (w >= 768) return 7;   // Tablet
    return 5;                 // Mobile
  };

  const [slidesPerView, setSlidesPerView] = useState(computeSlides);
  const [maxItems, setMaxItems] = useState(computeMaxItems);
  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(computeSlides());
      setMaxItems(computeMaxItems());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={10}
        slidesPerView={slidesPerView}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        className="mt-6"
      >
        {listings.slice(0, maxItems).map((listing) => (
          <SwiperSlide key={listing.id}>
            <CardItem listing={listing} onClick={onCardClick} />
          </SwiperSlide>
        ))}
      </Swiper>
  )
}

export default memo(CardSlide)