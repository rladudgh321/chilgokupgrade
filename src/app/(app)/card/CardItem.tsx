import Image from "next/image"
import {
  Building2,
  Square,
  Layers,
  BedDouble,
  Car,
  Coins,
} from "lucide-react";
import { numberToKoreanWithDigits } from "@/app/utility/NumberToKoreanWithDigits";

type Props = {
  listing: {
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
};

const CardItem = ({ listing, onClick }: Props & { onClick: (id: number) => void }) => {
  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return "";
    return numberToKoreanWithDigits(price);
  };

  const formatArea = (area: number | undefined) => {
    if (!area) return "";
    const pyeong = area / 3.305785;
    return `${pyeong.toFixed(2)}평`;
  };

  const renderPrice = (label: string, value: number | undefined) => {
    if (value === undefined || value === null) return null;
    const formattedPrice = formatPrice(value);
    if (!formattedPrice) return null;
    return (
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-base font-bold text-gray-900">{formattedPrice}</span>
      </div>
    );
  };

  return (
    <div onClick={() => onClick(listing.id)} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col">
      {/* 매물 이미지 */}
      <div className="relative h-32 sm:h-40 md:h-48 bg-gray-200">
        {listing.mainImage ? (
          <Image
            src={listing.mainImage}
            alt={listing.title || "매물 이미지"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
            <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
          </div>
        )}

        {/* 라벨들 (Existing from CardItem) */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap gap-1">
          {listing.label && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
              {listing.label}
            </span>
          )}
          {listing.popularity && (
            <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
              {listing.popularity}
            </span>
          )}
          {listing.themes && listing.themes.length > 0 && (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
              {listing.themes[0]}
            </span>
          )}
        </div>

        {/* 매물 ID (Existing from CardItem) */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          #{listing.id}
        </div>
      </div>

      {/* 매물 정보 */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-gray-800 leading-snug mb-1 line-clamp-2 h-12 sm:h-14">
          {listing.title || "제목 없음"}
        </h3>

        {/* Address */}
        <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 line-clamp-1">
          {listing.address || "주소 정보 없음"}
        </p>

        {/* Price */}
        <div className="mb-3 sm:mb-4 space-y-1 border-t pt-2 sm:pt-3">
            {listing.isSalePriceEnabled && renderPrice("매매", listing.salePrice)}
            {listing.isLumpSumPriceEnabled && renderPrice("전세", listing.lumpSumPrice)}
            {listing.isActualEntryCostEnabled && renderPrice("실입주금", listing.actualEntryCost)}
            {listing.isDepositEnabled && renderPrice("보증금", listing.deposit)}
            {listing.isRentalPriceEnabled && renderPrice("월세", listing.rentalPrice)}
            {listing.isHalfLumpSumMonthlyRentEnabled && renderPrice("반전세 월세", listing.halfLumpSumMonthlyRent)}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-2 text-xs sm:text-sm text-gray-600 border-t pt-2 sm:pt-3 mt-auto">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span>{listing.propertyType || "타입 미정"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span>
                실 {formatArea(listing.actualArea)} / 공{" "}
                {formatArea(listing.supplyArea)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span>
                {listing.currentFloor && listing.totalFloors
                  ? `${listing.currentFloor}/${listing.totalFloors}층`
                  : "층수 정보 없음"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span>
                방 {listing.rooms || "-"} / 욕실 {listing.bathrooms || "-"}
              </span>
            </div>
            {listing.parking && listing.parking.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Car className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span>{listing.parking.join(", ")}</span>
              </div>
            )}
            {listing.isManagementFeeEnabled && listing.managementFee && (
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span>
                  관리비 {formatPrice(listing.managementFee)}
                </span>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default CardItem