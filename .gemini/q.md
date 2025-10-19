"use client";
import { useEffect, useRef, useState, startTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type OptionName = { name: string };
type BuyType = { id: number; name: string };

export default function SearchBar({
  settings,
  roomOptions: roomOpts0,            // Array<OptionName>
  bathroomOptions: bathOpts0,        // Array<OptionName>
  floorOptions: floorOpts0,          // Array<OptionName>
  areaOptions: areaOpts0,            // Array<OptionName>
  themeOptions: themeOpts0,          // string[] or Array<{label:string}>
  propertyTypeOptions: propTypeOpts0,// Array<OptionName>
  buyTypeOptions: buyTypeOpts,       // Array<BuyType>
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const isInitial = useRef(true);

  // ── 옵션은 파생값으로 즉시 변환 (state 불필요)
  const roomOptions = roomOpts0.map(x => x.name);
  const bathroomOptions = bathOpts0.map(x => x.name);
  const floorOptions = floorOpts0.map(x => x.name);
  const areaOptions = areaOpts0.map(x => x.name);
  const themeOptions =
    Array.isArray(themeOpts0) && typeof themeOpts0[0] === "string"
      ? (themeOpts0 as string[])
      : (themeOpts0 as any[]).map(x => x.label); // 서버 shape에 따라 택1
  const propertyTypeOptions = propTypeOpts0.map(x => x.name);

  // ── 검색 상태만 state
  const [searchTerm, setSearchTerm] = useState(sp.get("keyword") ?? "");
  const [debounced, setDebounced] = useState(searchTerm);
  const [propertyType, setPropertyType] = useState(sp.get("propertyType") ?? "");
  const [buyType, setBuyType] = useState(sp.get("buyType") ?? "");
  const [priceRange, setPriceRange] = useState(sp.get("priceRange") ?? "");
  const [areaRange, setAreaRange] = useState(sp.get("areaRange") ?? "");
  const [theme, setTheme] = useState(sp.get("theme") ?? "");
  const [rooms, setRooms] = useState(sp.get("rooms") ?? "");
  const [floor, setFloor] = useState(sp.get("floor") ?? "");
  const [bathrooms, setBathrooms] = useState(sp.get("bathrooms") ?? "");
  const [subwayLine, setSubwayLine] = useState(sp.get("subwayLine") ?? "");

  const [pricePresets, setPricePresets] = useState<Array<{id:number;name:string}>>([]);

  // 디바운스
  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchTerm), 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // buyType 변경 시 프리셋
  useEffect(() => {
    if (!buyType) { setPricePresets([]); return; }
    const bt = buyTypeOpts.find(x => x.name === buyType);
    if (!bt) { setPricePresets([]); return; }
    let alive = true;
    (async () => {
      const r = await fetch(`/api/price-presets?buyTypeId=${bt.id}`);
      if (!r.ok) return;
      const j = await r.json();
      if (alive && j?.ok) setPricePresets(j.data ?? []);
    })();
    return () => { alive = false; };
  }, [buyType, buyTypeOpts]);

  // URL 반영
  useEffect(() => {
    if (isInitial.current) { isInitial.current = false; return; }
    const q: Record<string,string> = {};
    if (debounced) q.keyword = debounced;
    if (propertyType) q.propertyType = propertyType;
    if (buyType) q.buyType = buyType;
    if (priceRange) q.priceRange = priceRange;
    if (areaRange) q.areaRange = areaRange;
    if (theme) q.theme = theme;
    if (rooms) q.rooms = rooms;
    if (floor) q.floor = floor;
    if (bathrooms) q.bathrooms = bathrooms;
    if (subwayLine) q.subwayLine = subwayLine;
    // page는 필터 변경 시 1로
    q.page = "1";

    const next = `${pathname}?${new URLSearchParams(q).toString()}`;
    // 같은 URL이면 푸시하지 않음
    if (next !== `${pathname}?${sp.toString()}`) {
      startTransition(() => router.push(next));
    }
  }, [debounced, propertyType, buyType, priceRange, areaRange, theme, rooms, floor, bathrooms, subwayLine, router, pathname, sp]);

  // ...
}
-------------
추가로 위 ①~③(특히 “props→state 복사 useEffect 제거”와 “themeOptions shape 일치”)를 반영하면 렌더/메모리·불필요 동기화를 더 줄일 수 있고, 가격 프리셋 캐시 전략을 보완하면 체감 반응성도 더 좋아지니까 코드를 수정해줘