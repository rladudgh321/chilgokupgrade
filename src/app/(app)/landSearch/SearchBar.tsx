"use client";
import { useDeferredValue, useEffect, useMemo, useRef, useState, startTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type OptionName = { name: string };
type BuyType = { id: number; name: string };

type Props = {
  settings: {
    showKeyword?: boolean;
    showPropertyType?: boolean;
    showbuyType?: boolean;
    showPriceRange?: boolean;
    showAreaRange?: boolean;
    showTheme?: boolean;
    showRooms?: boolean;
    showFloor?: boolean;
    showBathrooms?: boolean;
    showSubwayLine?: boolean;
  };
  roomOptions: OptionName[];
  bathroomOptions: OptionName[];
  floorOptions: OptionName[];
  areaOptions: OptionName[];
  themeOptions: string[] | Array<{ label: string }>;
  propertyTypeOptions: OptionName[];
  buyTypeOptions: BuyType[];
};

export default function SearchBar({
  settings,
  roomOptions: roomOpts0,
  bathroomOptions: bathOpts0,
  floorOptions: floorOpts0,
  areaOptions: areaOpts0,
  themeOptions: themeOpts0,
  propertyTypeOptions: propTypeOpts0,
  buyTypeOptions: buyTypeOpts,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const isInitial = useRef(true);

  // ── 옵션 파생값: 메모이즈로 고정 (렌더마다 새 배열 생성 방지)
  const roomOptions = useMemo(
    () => roomOpts0.map((x) => x.name),
    [roomOpts0]
  );
  const bathroomOptions = useMemo(
    () => bathOpts0.map((x) => x.name),
    [bathOpts0]
  );
  const floorOptions = useMemo(
    () => floorOpts0.map((x) => x.name),
    [floorOpts0]
  );
  const areaOptions = useMemo(
    () => areaOpts0.map((x) => x.name),
    [areaOpts0]
  );
  const themeOptions = useMemo(() => {
    if (Array.isArray(themeOpts0) && typeof themeOpts0[0] === "string") {
      return themeOpts0 as string[];
    }
    return (themeOpts0 as Array<{ label: string }>).map((x) => x.label);
  }, [themeOpts0]);
  const propertyTypeOptions = useMemo(
    () => propTypeOpts0.map((x) => x.name),
    [propTypeOpts0]
  );

  // ── URL 동기화가 필요한 필터 상태만 state로 관리
  const [searchTerm, setSearchTerm] = useState(sp.get("keyword") ?? "");
  const deferredSearch = useDeferredValue(searchTerm); // 디바운스 대체
  const [propertyType, setPropertyType] = useState(sp.get("propertyType") ?? "");
  const [buyType, setBuyType] = useState(sp.get("buyType") ?? "");
  const [priceRange, setPriceRange] = useState(sp.get("priceRange") ?? "");
  const [areaRange, setAreaRange] = useState(sp.get("areaRange") ?? "");
  const [theme, setTheme] = useState(sp.get("theme") ?? "");
  const [rooms, setRooms] = useState(sp.get("rooms") ?? "");
  const [floor, setFloor] = useState(sp.get("floor") ?? "");
  const [bathrooms, setBathrooms] = useState(sp.get("bathrooms") ?? "");
  const [subwayLine, setSubwayLine] = useState(sp.get("subwayLine") ?? "");

  const [pricePresets, setPricePresets] = useState<Array<{ id: number; name: string }>>([]);
  const pricePresetsCache = useRef<Record<number, Array<{ id: number; name: string }>>>({});

  // ── buyType 변경 시 프리셋 (로컬 캐시 적용)
  useEffect(() => {
    if (!buyType) {
      setPricePresets([]);
      return;
    }
    const bt = buyTypeOpts.find((x) => x.name === buyType);
    if (!bt) {
      setPricePresets([]);
      return;
    }
    // 캐시 HIT
    if (pricePresetsCache.current[bt.id]) {
      setPricePresets(pricePresetsCache.current[bt.id]);
      return;
    }
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/price-presets?buyTypeId=${bt.id}`);
        if (!r.ok) return;
        const j = await r.json();
        if (alive && j?.ok) {
          pricePresetsCache.current[bt.id] = j.data ?? [];
          setPricePresets(j.data ?? []);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      alive = false;
    };
  }, [buyType, buyTypeOpts]);

  // ── 정렬된 쿼리 문자열 빌더 (키 순서 고정 → 불필요 push 방지)
  const buildSortedQueryString = (q: Record<string, string>) => {
    const entries = Object.entries(q).filter(([, v]) => v && v.length > 0);
    entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return new URLSearchParams(entries).toString();
  };

  // ── URL 반영 (정렬/가드 포함)
  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    const q: Record<string, string> = {
      page: "1",
      ...(deferredSearch ? { keyword: deferredSearch } : {}),
      ...(propertyType ? { propertyType } : {}),
      ...(buyType ? { buyType } : {}),
      ...(priceRange ? { priceRange } : {}),
      ...(areaRange ? { areaRange } : {}),
      ...(theme ? { theme } : {}),
      ...(rooms ? { rooms } : {}),
      ...(floor ? { floor } : {}),
      ...(bathrooms ? { bathrooms } : {}),
      ...(subwayLine ? { subwayLine } : {}),
    };
    const nextQS = buildSortedQueryString(q);
    const currentQS = buildSortedQueryString(Object.fromEntries(sp.entries()));

    if (nextQS !== currentQS) {
      startTransition(() => router.push(`${pathname}?${nextQS}`));
    }
  }, [
    deferredSearch,
    propertyType,
    buyType,
    priceRange,
    areaRange,
    theme,
    rooms,
    floor,
    bathrooms,
    subwayLine,
    router,
    pathname,
    sp,
  ]);

  const handleReset = () => {
    setSearchTerm("");
    setPropertyType("");
    setBuyType("");
    setPriceRange("");
    setAreaRange("");
    setTheme("");
    setRooms("");
    setFloor("");
    setBathrooms("");
    setSubwayLine("");
    // 초기화는 replace로 히스토리 오염 방지
    startTransition(() => router.replace(pathname));
  };

  if (!settings) {
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
            {propertyTypeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {settings?.showbuyType && (
          <select
            value={buyType}
            onChange={(e) => setBuyType(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          >
            <option value="">거래유형</option>
            {buyTypeOpts.map((opt) => (
              <option key={opt.id} value={opt.name}>
                {opt.name}
              </option>
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
              <option key={preset.id} value={preset.name}>
                {preset.name}
              </option>
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
              <option key={opt} value={opt}>
                {opt}
              </option>
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
              <option key={label} value={label}>
                {label}
              </option>
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
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {settings?.showFloor && (
          <select
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          >
            <option value="">층수</option>
            {floorOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
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
              <option key={opt} value={opt}>
                {opt}
              </option>
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
  );
}
