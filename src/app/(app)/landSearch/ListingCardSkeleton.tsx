const ListingCardSkeleton = () => {
  return (
    <div className="border bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-48 h-48 md:h-auto bg-gray-300"></div>

        {/* Content Section */}
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          {/* Labels */}
          <div className="flex gap-2 mb-2">
            <div className="h-4 bg-gray-300 rounded-full w-16"></div>
            <div className="h-4 bg-gray-300 rounded-full w-20"></div>
          </div>

          {/* Title */}
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>

          {/* Address */}
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>

          {/* Price */}
          <div className="mb-3 space-y-2">
            <div className="h-5 bg-gray-300 rounded w-1/3"></div>
            <div className="h-5 bg-gray-300 rounded w-1/4"></div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 border-t pt-3 mt-auto">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCardSkeleton;
