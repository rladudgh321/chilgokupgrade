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

const CardItem = ({ listing }: Props) => {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      {/* 매물 이미지 */}
      <div className="relative h-48 bg-gray-200">
        {listing.mainImage ? (
          <Image 
            src={listing.mainImage} 
            alt={listing.title || "매물 이미지"} 
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
            이미지 없음
          </div>
        )}
        
        {/* 라벨들 */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
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

        {/* 매물 ID */}
        <div className="absolute top-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          #{listing.id}
        </div>
      </div>

      {/* 매물 정보 */}
      <div className="p-4">
        {/* 매물 제목 */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {listing.title || "제목 없음"}
        </h3>

        {/* 주소 */}
        <p className="text-sm text-gray-600 mb-3">
          {listing.address || "주소 정보 없음"}
        </p>

        {/* 매물 상세 정보 */}
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
          {listing.parking && listing.parking.length > 0 && (
            <span className="px-2 py-1 bg-gray-100 rounded">주차</span>
          )}
          {listing.managementFee && (
            <span className="px-2 py-1 bg-gray-100 rounded">
              관리비 {formatPrice(listing.managementFee)}
            </span>
          )}
          {listing.actualArea && (
            <span className="px-2 py-1 bg-gray-100 rounded">
              실 {formatArea(listing.actualArea)}
            </span>
          )}
          {listing.supplyArea && (
            <span className="px-2 py-1 bg-gray-100 rounded">
              공 {formatArea(listing.supplyArea)}
            </span>
          )}
        </div>

        {/* 가격 정보 */}
        <div className="space-y-1 mb-3">
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
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{listing.propertyType || "타입 미정"}</span>
          <div className="flex items-center gap-2">
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

export default CardItem
