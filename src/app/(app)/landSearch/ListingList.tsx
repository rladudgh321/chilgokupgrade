import ListingCard from "./ListingCard"

type Props = {
  listings: any[];
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const ListingList = ({ listings, sortBy, onSortChange }: Props) => {

  const sortOptions = [
    { key: "latest", label: "최신순" },
    { key: "popular", label: "인기순" },
    { key: "price", label: "금액순" },
    { key: "area", label: "면적순" },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* 정렬 탭 */}
      <div className="flex border-b bg-white flex-shrink-0">
        {sortOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => onSortChange(option.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              sortBy === option.key
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 매물 리스트 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {listings.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>표시할 매물이 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y">
            {listings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ListingList
