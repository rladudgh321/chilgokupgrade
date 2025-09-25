"use client"
import { useState } from "react"

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [dealType, setDealType] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [areaRange, setAreaRange] = useState("")
  const [theme, setTheme] = useState("")
  const [rooms, setRooms] = useState("")
  const [floor, setFloor] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [subwayLine, setSubwayLine] = useState("")

  const handleReset = () => {
    setSearchTerm("")
    setPropertyType("")
    setDealType("")
    setPriceRange("")
    setAreaRange("")
    setTheme("")
    setRooms("")
    setFloor("")
    setBathrooms("")
    setSubwayLine("")
  }

  return (
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
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
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
          value={dealType}
          onChange={(e) => setDealType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">거래유형</option>
          <option value="sale">매매</option>
          <option value="jeonse">전세</option>
          <option value="monthly">월세</option>
        </select>

        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
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
          value={areaRange}
          onChange={(e) => setAreaRange(e.target.value)}
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
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
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
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
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
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
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
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">화장실</option>
          <option value="1">1개</option>
          <option value="2">2개</option>
          <option value="3">3개</option>
          <option value="4+">4개 이상</option>
        </select>

        <select
          value={subwayLine}
          onChange={(e) => setSubwayLine(e.target.value)}
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
  )
}

export default SearchBar
