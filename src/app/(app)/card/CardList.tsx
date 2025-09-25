"use client"
import { useState, useEffect, useCallback } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import CardItem from "./CardItem"
import { BuildFindAll } from "@/app/apis/build"

const LIMIT = 12

const CardList = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recommended")
  const [filters, setFilters] = useState({
    propertyType: "",
    dealType: "",
    priceRange: "",
    areaRange: "",
    theme: "",
    rooms: "",
    floor: "",
    bathrooms: "",
    subwayLine: "",
  })

  // 무한 스크롤 쿼리
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["builds", "card", searchTerm, sortBy, filters],
    queryFn: ({ pageParam = 1 }) => 
      BuildFindAll(pageParam, LIMIT, searchTerm),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length < LIMIT) return undefined
      return pages.length + 1
    },
    initialPageParam: 1,
  })

  // 무한 스크롤 감지
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 500
    ) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // 필터 초기화
  const handleReset = () => {
    setSearchTerm("")
    setFilters({
      propertyType: "",
      dealType: "",
      priceRange: "",
      areaRange: "",
      theme: "",
      rooms: "",
      floor: "",
      bathrooms: "",
      subwayLine: "",
    })
  }

  // 필터 변경
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // 모든 매물 데이터 수집
  const allListings = data?.pages.flatMap(page => page.data) || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">매물을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">데이터를 불러오는 중 오류가 발생했습니다.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 검색 바 */}
      <div className="bg-white shadow-sm border-b">
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            {/* 검색 입력 */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="관심지역 또는 매물번호를 입력"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* 초기화 버튼 */}
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              초기화
            </button>
          </div>

          {/* 필터 옵션들 */}
          <div className="grid grid-cols-5 gap-4">
            <select 
              value={filters.propertyType}
              onChange={(e) => handleFilterChange("propertyType", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">매물 종류</option>
              <option value="apartment">아파트</option>
              <option value="villa">빌라</option>
              <option value="officetel">오피스텔</option>
              <option value="house">단독주택</option>
              <option value="commercial">상가</option>
            </select>

            <select 
              value={filters.dealType}
              onChange={(e) => handleFilterChange("dealType", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">거래유형</option>
              <option value="sale">매매</option>
              <option value="jeonse">전세</option>
              <option value="monthly">월세</option>
            </select>

            <select 
              value={filters.priceRange}
              onChange={(e) => handleFilterChange("priceRange", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">금액</option>
              <option value="0-1">1억 이하</option>
              <option value="1-2">1억-2억</option>
              <option value="2-3">2억-3억</option>
              <option value="3-5">3억-5억</option>
              <option value="5-10">5억-10억</option>
              <option value="10+">10억 이상</option>
            </select>

            <select 
              value={filters.areaRange}
              onChange={(e) => handleFilterChange("areaRange", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">면적</option>
              <option value="0-20">20평 이하</option>
              <option value="20-30">20-30평</option>
              <option value="30-40">30-40평</option>
              <option value="40-50">40-50평</option>
              <option value="50+">50평 이상</option>
            </select>

            <select 
              value={filters.theme}
              onChange={(e) => handleFilterChange("theme", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">테마</option>
              <option value="new">신축</option>
              <option value="urgent">급매</option>
              <option value="recommended">추천</option>
              <option value="parking">주차가능</option>
              <option value="subway">역세권</option>
            </select>

            <select 
              value={filters.rooms}
              onChange={(e) => handleFilterChange("rooms", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">방</option>
              <option value="1">1룸</option>
              <option value="2">2룸</option>
              <option value="3">3룸</option>
              <option value="4">4룸</option>
              <option value="5+">5룸 이상</option>
            </select>

            <select 
              value={filters.floor}
              onChange={(e) => handleFilterChange("floor", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">층수</option>
              <option value="1-3">1-3층</option>
              <option value="4-6">4-6층</option>
              <option value="7-10">7-10층</option>
              <option value="11-20">11-20층</option>
              <option value="20+">20층 이상</option>
            </select>

            <select 
              value={filters.bathrooms}
              onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">화장실</option>
              <option value="1">1개</option>
              <option value="2">2개</option>
              <option value="3">3개</option>
              <option value="4+">4개 이상</option>
            </select>

            <select 
              value={filters.subwayLine}
              onChange={(e) => handleFilterChange("subwayLine", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">호선 검색</option>
              <option value="1">1호선</option>
              <option value="2">2호선</option>
              <option value="3">3호선</option>
              <option value="4">4호선</option>
              <option value="5">5호선</option>
              <option value="6">6호선</option>
              <option value="7">7호선</option>
              <option value="8">8호선</option>
              <option value="9">9호선</option>
            </select>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="p-6">
        {/* 정렬 탭 */}
        <div className="flex border-b bg-white mb-6">
          {[
            { key: "latest", label: "최신순" },
            { key: "popular", label: "인기순" },
            { key: "recommended", label: "추천순" },
            { key: "price-asc", label: "금액순↑" },
            { key: "area-asc", label: "면적순↑" },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setSortBy(option.key)}
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

        {/* 3열 그리드 */}
        <div className="grid grid-cols-3 gap-6">
          {allListings.map((listing) => (
            <CardItem key={listing.id} listing={listing} />
          ))}
        </div>

        {/* 매물이 없을 때 */}
        {allListings.length === 0 && (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>표시할 매물이 없습니다.</p>
          </div>
        )}

        {/* 로딩 인디케이터 */}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">더 많은 매물을 불러오는 중...</span>
          </div>
        )}

        {/* 더 이상 로드할 데이터가 없을 때 */}
        {!hasNextPage && allListings.length > 0 && (
          <div className="flex items-center justify-center mt-8 text-gray-500">
            <p>모든 매물을 불러왔습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CardList
