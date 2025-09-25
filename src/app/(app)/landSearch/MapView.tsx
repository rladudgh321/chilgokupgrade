 
"use client"
import { useState } from "react"

type Props = {
  listings: { 
    id: number; 
    address?: string; 
    title?: string;
    mapLocation?: string;
  }[]
}

const MapView = ({ listings }: Props) => {
  const [mapType, setMapType] = useState("map")

  // 기본 서울 좌표
  const defaultLat = 37.5665
  const defaultLng = 126.9780

  // 매물이 있는 경우 실제 좌표 사용, 없으면 기본 서울 좌표
  const hasValidListings = listings.some(l => l.mapLocation)
  
  // OpenStreetMap을 사용한 지도 뷰 (카카오 지도 스타일)
  const generateMapUrl = () => {
    if (!hasValidListings) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${defaultLng - 0.1},${defaultLat - 0.1},${defaultLng + 0.1},${defaultLat + 0.1}&layer=mapnik`
    }

    // 서울 지역 전체를 보여주는 bbox
    const bbox = "126.7,37.4,127.2,37.7"
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`
  }

  // 매물 클러스터링 시뮬레이션 (구별로 그룹화)
  const getDistrictClusters = () => {
    const districts: { [key: string]: number } = {}
    listings.forEach(listing => {
      if (listing.address) {
        const district = listing.address.split(' ')[1] || '기타'
        districts[district] = (districts[district] || 0) + 1
      }
    })
    return districts
  }

  const clusters = getDistrictClusters()

  return (
    <div className="w-full h-full relative bg-gray-100">
      {/* 지도 컨테이너 */}
      <div className="relative w-full h-full">
        {/* 지도 iframe */}
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={generateMapUrl()}
          className="border-0"
        />
        
        {/* 지도 컨트롤 */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {/* 지도 타입 선택 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => setMapType("map")}
              className={`px-3 py-2 text-sm ${mapType === "map" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
            >
              지도
            </button>
            <button
              onClick={() => setMapType("skyview")}
              className={`px-3 py-2 text-sm ${mapType === "skyview" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
            >
              스카이뷰
            </button>
          </div>

          {/* 줌 컨트롤 */}
          <div className="bg-white rounded-lg shadow-lg">
            <button className="w-10 h-10 flex items-center justify-center text-lg font-bold hover:bg-gray-50">
              +
            </button>
            <div className="border-t"></div>
            <button className="w-10 h-10 flex items-center justify-center text-lg font-bold hover:bg-gray-50">
              −
            </button>
          </div>

          {/* 나침반 */}
          <div className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>

          {/* 전체화면 */}
          <div className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
        </div>

        {/* 매물 클러스터 마커들 */}
        <div className="absolute inset-0 pointer-events-none">
          {Object.entries(clusters).map(([district, count], index) => {
            // 각 구별로 다른 위치에 마커 배치
            const positions = [
              { top: "20%", left: "15%" },
              { top: "30%", left: "25%" },
              { top: "40%", left: "35%" },
              { top: "50%", left: "45%" },
              { top: "60%", left: "55%" },
              { top: "70%", left: "65%" },
              { top: "25%", left: "75%" },
              { top: "45%", left: "85%" },
            ]
            const position = positions[index % positions.length]
            
            return (
              <div
                key={district}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                style={position}
              >
                <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-sm font-bold shadow-lg cursor-pointer hover:bg-purple-700 transition-colors">
                  {count}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {district}
                </div>
              </div>
            )
          })}
        </div>

        {/* 스케일 표시 */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
          4km
        </div>

        {/* 카카오 지도 브랜딩 */}
        <div className="absolute bottom-4 left-16 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
          kakao
        </div>

        {/* 샘플 사이트 안내 */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded max-w-xs">
          <div>큰나무 솔루션 샘플 사이트 입니다.</div>
          <div>부동산 홈페이지제작 문의</div>
          <div className="text-blue-300">큰나무솔루션 바로가기</div>
        </div>
      </div>
    </div>
  )
}

export default MapView
