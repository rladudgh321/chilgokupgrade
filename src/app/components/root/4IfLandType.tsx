"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type LandTypeItem = { name: string; image: string; theme: string };

// 기본 폴백 이미지 매핑 (라벨 → 로컬 이미지)
const fallbackImageByLabel: Record<string, string> = {
  "반려동물": "/img/2/pet.png",
  "저보증금 원룸": "/img/2/oneroom.png",
  "전세자금대출": "/img/2/loan.png",
  "전세 자금 대출": "/img/2/loan.png",
  "복층": "/img/2/upper.png",
  "주차가능": "/img/2/parkinglot.png",
  "옥탑": "/img/2/rooftop.png",
  "역세권": "/img/2/train.png",
  "신축": "/img/2/new.png",
};

// 화면 최초 표시를 위한 폴백 리스트
const defaultLandTypes: LandTypeItem[] = [
  { name: '반려동물', image: fallbackImageByLabel['반려동물'], theme: '반려동물' },
  { name: '저보증금 원룸', image: fallbackImageByLabel['저보증금 원룸'], theme: '저보증금 원룸' },
  { name: '전세 자금 대출', image: fallbackImageByLabel['전세 자금 대출'], theme: '전세자금대출' },
  { name: '복층', image: fallbackImageByLabel['복층'], theme: '복층' },
  { name: '주차가능', image: fallbackImageByLabel['주차가능'], theme: '주차가능' },
  { name: '옥탑', image: fallbackImageByLabel['옥탑'], theme: '옥탑' },
  { name: '역세권', image: fallbackImageByLabel['역세권'], theme: '역세권' },
  { name: '신축', image: fallbackImageByLabel['신축'], theme: '신축' },
];

const IfLandType = () => {
  const router = useRouter();
  const [items, setItems] = useState<LandTypeItem[]>(defaultLandTypes);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/theme-images", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const data: Array<{ label?: string; imageUrl?: string; isActive?: boolean }> = json?.data ?? [];
        const active = data.filter(x => (x.isActive === undefined || x.isActive === true) && x.label);
        const mapped: LandTypeItem[] = active.map(x => {
          const label = String(x.label);
          const image = x.imageUrl?.trim() || fallbackImageByLabel[label] || "/img/2/new.png";
          return {
            name: label,
            image,
            theme: label,
          };
        });
        if (isMounted && mapped.length > 0) setItems(mapped);
      } catch {
        // ignore
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleThemeClick = (theme: string) => {
    router.push(`/landSearch?theme=${encodeURIComponent(theme)}`);
  };

  return (
    <div className="mx-auto max-w-7xl text-center p-4">
      <h2 className="text-lg sm:text-xl font-bold">조건별 매물 찾아보기</h2>
      <p className="text-gray-600 text-sm sm:text-base">테마를 활용한 조건별 매물을 빠르게 찾아보아요!</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 mt-4 px-2">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleThemeClick(item.theme)}
          >
            <div 
              className="h-[80px] sm:h-[100px] md:h-[115px] bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className="text-center py-2 font-semibold text-sm sm:text-base">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IfLandType;
