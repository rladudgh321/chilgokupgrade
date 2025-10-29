const CardItemSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse flex flex-col">
      {/* 매물 이미지 */}
      <div className="relative h-32 sm:h-40 md:h-48 bg-gray-300"></div>

      {/* 매물 정보 */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Title */}
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-1 line-clamp-2 h-12 sm:h-14"></div>

        {/* Address */}
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2 sm:mb-3"></div>

        {/* Price */}
        <div className="mb-3 sm:mb-4 space-y-1 border-t pt-2 sm:pt-3">
          <div className="h-5 bg-gray-300 rounded w-1/3"></div>
          <div className="h-5 bg-gray-300 rounded w-1/4"></div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-2 text-xs sm:text-sm text-gray-600 border-t pt-2 sm:pt-3 mt-auto">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default CardItemSkeleton;
