"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query";

const fetchSettings = async () => {
  const res = await fetch("/api/admin/search-bar-settings");
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json();
  return data.data;
};

const SearchBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isInitialMount = useRef(true)

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["search-bar-settings"],
    queryFn: fetchSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const [searchTerm, setSearchTerm] = useState(searchParams.get("keyword") || "")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "")
  const [buyType, setbuyType] = useState(searchParams.get("buyType") || "")
  const [priceRange, setPriceRange] = useState(searchParams.get("priceRange") || "")
  const [areaRange, setAreaRange] = useState(searchParams.get("areaRange") || "")
  const [theme, setTheme] = useState(searchParams.get("theme") || "")
  const [rooms, setRooms] = useState(searchParams.get("rooms") || "")
  const [floor, setFloor] = useState(searchParams.get("floor") || "")
  const [bathrooms, setBathrooms] = useState(searchParams.get("bathrooms") || "")
  const [subwayLine, setSubwayLine] = useState(searchParams.get("subwayLine") || "")
  const [themeOptions, setThemeOptions] = useState<string[]>([])
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<string[]>([])
  const [buyTypeOptions, setBuyTypeOptions] = useState<Array<{id: number, name: string}>>([])
  const [roomOptions, setRoomOptions] = useState<string[]>([])
  const [pricePresets, setPricePresets] = useState<Array<{id: number, name: string}>>([]);

  // Fetch price presets when buyType changes
  useEffect(() => {
    if (buyType) {
      const selectedBuyType = buyTypeOptions.find(bt => bt.name === buyType);
      if (selectedBuyType) {
        let isMounted = true;
        (async () => {
          try {
            const res = await fetch(`/api/price-presets?buyTypeId=${selectedBuyType.id}`);
            if (!res.ok) return;
            const json = await res.json();
            if (isMounted && json.ok) {
              setPricePresets(json.data);
            }
          } catch {
            // ignore
          }
        })();
        return () => { isMounted = false };
      }
    } else {
      setPricePresets([]);
    }
  }, [buyType, buyTypeOptions]);
  const [bathroomOptions, setBathroomOptions] = useState<string[]>([])
  const [floorOptions, setFloorOptions] = useState<string[]>([])
  const [areaOptions, setAreaOptions] = useState<string[]>([])

  // 방 갯수 옵션 로드
  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/room-options", { cache: "no-store" })
        if (!res.ok) return
        const json = await res.json()
        const items: Array<{ name?: string }> = json?.data ?? []
        const names = items.map(x => x?.name).filter((v): v is string => typeof v === 'string' && v.length > 0)
        const uniq = Array.from(new Set<string>(names))
        if (isMounted) setRoomOptions(uniq)
      } catch {
        // ignore
      }
    })()
    return () => { isMounted = false }
  }, [])



  // 화장실 갯수 옵션 로드
  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/bathroom-options", { cache: "no-store" })
        if (!res.ok) return
        const json = await res.json()
        const items: Array<{ name?: string }> = json?.data ?? []
        const names = items.map(x => x?.name).filter((v): v is string => typeof v === 'string' && v.length > 0)
        const uniq = Array.from(new Set<string>(names))
        if (isMounted) setBathroomOptions(uniq)
      } catch {
        // ignore
      }
    })()
    return () => { isMounted = false }
  }, [])

  // 층 단위 옵션 로드
  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/floor-options", { cache: "no-store" })
        if (!res.ok) return
        const json = await res.json()
        const items: Array<{ name?: string }> = json?.data ?? []
        const names = items.map(x => x?.name).filter((v): v is string => typeof v === 'string' && v.length > 0)
        const uniq = Array.from(new Set<string>(names))
        if (isMounted) setFloorOptions(uniq)
      } catch {
        // ignore
      }
    })()
    return () => { isMounted = false }
  }, [])

  // 면적 옵션 로드
  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/area", { cache: "no-store" })
        if (!res.ok) return
        const json = await res.json()
        const items: Array<{ name?: string }> = json?.data ?? []
        const names = items.map(x => x?.name).filter((v): v is string => typeof v === 'string' && v.length > 0)
        const uniq = Array.from(new Set<string>(names))
        if (isMounted) setAreaOptions(uniq)
      } catch {
        // ignore
      }
    })()
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/theme-images", { cache: "no-store" })
        if (!res.ok) return
        const json = await res.json()
        const items: Array<{ label?: string; isActive?: boolean }> = json?.data ?? []
        const labels = items
          .filter((x) => x && x.label && (x.isActive === undefined || x.isActive === true))
          .map((x) => String(x.label))
        if (isMounted) setThemeOptions(labels)
      } catch {
        // ignore
      }
    })()
    return () => {
      isMounted = false
    }
  }, [])

  // 매물종류 옵션 로드
  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/listing-type", { cache: "no-store" })
        if (!res.ok) return
        const json = await res.json()
        const items: Array<{ name?: string }> = json?.data ?? []
        const names = items.map(x => x?.name).filter((v): v is string => typeof v === 'string' && v.length > 0)
        const uniq = Array.from(new Set<string>(names))
        if (isMounted) setPropertyTypeOptions(uniq)
      } catch {
        // ignore
      }
    })()
    return () => { isMounted = false }
  }, [])

  // 거래유형 옵션 로드
  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/buy-types", { cache: "no-store" })
        if (!res.ok) return
        const json = await res.json()
        const items: Array<{ id: number, name?: string }> = json?.data ?? []
        const options = items.map(x => ({ id: x.id, name: x.name || '' })).filter(x => x.name);
        if (isMounted) setBuyTypeOptions(options)
      } catch {
        // ignore
      }
    })()
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  const pathname = usePathname()
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const query: { [key:string]: string } = { page: "1" };

    if (debouncedSearchTerm) query.keyword = debouncedSearchTerm;
    if (propertyType) query.propertyType = propertyType;
    if (buyType) query.buyType = buyType;
    if (priceRange) query.priceRange = priceRange;
    if (areaRange) query.areaRange = areaRange;
    if (theme) query.theme = theme;
    if (rooms) query.rooms = rooms;
    if (floor) query.floor = floor;
    if (bathrooms) query.bathrooms = bathrooms;
    if (subwayLine) query.subwayLine = subwayLine;

    router.push(`${pathname}?${new URLSearchParams(query).toString()}`);
  }, [debouncedSearchTerm, propertyType, buyType, priceRange, areaRange, theme, rooms, floor, bathrooms, subwayLine, router, pathname])

  const handleReset = () => {
    setSearchTerm("")
    setPropertyType("")
    setbuyType("")
    setPriceRange("")
    setAreaRange("")
    setTheme("")
    setRooms("")
    setFloor("")
    setBathrooms("")
    setSubwayLine("")
    router.push(pathname)
  }

  if (isLoadingSettings) {
    return <div className="p-4">검색 필터 로딩 중...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-2 sm:p-4">
      {settings?.showKeyword && (
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-4">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="관심지역 또는 매물번호를 입력"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors w-full sm:w-auto"
          >
            초기화
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
        {settings?.showPropertyType && (
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          >
            <option value="">매물 종류</option>
            {(propertyTypeOptions && propertyTypeOptions.length > 0
              && propertyTypeOptions || []
            ).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}

        {settings?.showbuyType && (
          <select
            value={buyType}
            onChange={(e) => setbuyType(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          >
            <option value="">거래유형</option>
            {buyTypeOptions.map((opt) => (
              <option key={opt.id} value={opt.name}>{opt.name}</option>
            ))}
          </select>
        )}

        {settings?.showPriceRange && (
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
            disabled={!buyType || pricePresets.length === 0}
          >
            <option value="">금액</option>
            {pricePresets.map((preset) => (
              <option key={preset.id} value={preset.name}>{preset.name}</option>
            ))}
          </select>
        )}

        {settings?.showAreaRange && (
          <select
            value={areaRange}
            onChange={(e) => setAreaRange(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          >
            <option value="">면적</option>
            {areaOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}

        {settings?.showTheme && (
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          >
            <option value="">테마</option>
            {themeOptions.map((label) => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
        )}

        {settings?.showRooms && (
          <select
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          >
            <option value="">방</option>
            {roomOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}

        {settings?.showFloor && (
          <select
            value={floor}
            onChange={(e) => {
              const newFloor = e.target.value;
              console.log("Selected floor:", newFloor);
              setFloor(newFloor);
            }}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          >
            <option value="">층수</option>
            {floorOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}

        {settings?.showBathrooms && (
          <select
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          >
            <option value="">화장실</option>
            {bathroomOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}

        {settings?.showSubwayLine && (
          <select
            value={subwayLine}
            onChange={(e) => setSubwayLine(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
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
        )}
      </div>
    </div>
  )
}

export default SearchBar