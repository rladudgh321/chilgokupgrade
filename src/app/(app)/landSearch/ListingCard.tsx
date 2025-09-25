import Image from "next/image"

type Props = {
  listing: {
    id: number
    title?: string
    address?: string
    salePrice?: number
    actualEntryCost?: number
    rentalPrice?: number
    managementFee?: number
    propertyType?: string
    currentFloor?: number
    totalFloors?: number
    rooms?: number
    bathrooms?: number
    actualArea?: number
    supplyArea?: number
    mainImage?: string
    label?: string
    popularity?: string
    themes?: string[]
    buildingOptions?: string[]
    parking?: string[]
    isAddressPublic?: string
    visibility?: boolean
  }
}

const ListingCard = ({ listing }: Props) => {
  const formatPrice = (price: number | undefined) => {
    if (!price) return ""
    if (price >= 10000) {
      return `${Math.floor(price / 10000)}억 ${(price % 10000).toLocaleString()}`
    }
    return price.toLocaleString()
  }

  const formatArea = (area: number | undefined) => {
    if (!area) return ""
    return `${area}`
  }

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex gap-4">
        {/* 매물 이미지 */}
        <div className="flex-shrink-0">
          <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
            {listing.mainImage ? (
              <Image 
                src={listing.mainImage} 
                alt={listing.title || "매물 이미지"} 
                width={128} 
                height={96} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                이미지 없음
              </div>
            )}
          </div>
        </div>

        {/* 매물 정보 */}
        <div className="flex-1 min-w-0">
          {/* 라벨들 */}
          <div className="flex flex-wrap gap-1 mb-2">
            {listing.label && (
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                {listing.label}
              </span>
            )}
            {listing.popularity && (
              <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                {listing.popularity}
              </span>
            )}
            {listing.themes && listing.themes.length > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                {listing.themes[0]}
              </span>
            )}
          </div>

          {/* 매물 제목 */}
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {listing.title || "제목 없음"}
          </h3>

          {/* 매물 ID와 주소 */}
          <p className="text-sm text-gray-600 mb-2">
            [{listing.id}] {listing.address || "주소 정보 없음"}
          </p>

          {/* 매물 상세 정보 */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
            {listing.parking && listing.parking.length > 0 && (
              <span>주차</span>
            )}
            {listing.managementFee && (
              <span>관리비 {formatPrice(listing.managementFee)}</span>
            )}
            {listing.actualArea && (
              <span>실 {formatArea(listing.actualArea)}</span>
            )}
            {listing.supplyArea && (
              <span>공 {formatArea(listing.supplyArea)}</span>
            )}
          </div>

          {/* 가격 정보 */}
          <div className="space-y-1 mb-2">
            {listing.salePrice && (
              <div className="text-lg font-bold text-blue-600">
                분 {formatPrice(listing.salePrice)} 실 {formatPrice(listing.actualEntryCost)}
              </div>
            )}
            {listing.rentalPrice && (
              <div className="text-sm text-gray-700">
                전 {formatPrice(listing.rentalPrice)}
              </div>
            )}
            {listing.actualEntryCost && !listing.salePrice && (
              <div className="text-sm text-gray-700">
                보 {formatPrice(listing.actualEntryCost)} 월 {formatPrice(listing.managementFee)}
              </div>
            )}
          </div>

          {/* 매물 타입과 층수 */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{listing.propertyType || "타입 미정"}</span>
            {listing.currentFloor && listing.totalFloors && (
              <span>현재층 {listing.currentFloor}층</span>
            )}
            {listing.rooms && listing.bathrooms && (
              <span>방{listing.rooms}/화{listing.bathrooms}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingCard
