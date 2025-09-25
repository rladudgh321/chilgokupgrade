"use client";

import { useEffect, useMemo, useState } from "react";
import CardSlide from "./shaped/CardSlide";
import { ICardSlideProps } from "./shaped/type";

type Build = {
  visibility?: boolean;
  popularity?: string | null;
  subImage?: string[] | null;
  mainImage?: string | null;
  currentFloor?: number | null;
  floorDescription?: string | null;
  propertyType?: string | null;
  rooms?: number | null;
  title?: string | null;
  buildingName?: string | null;
  address?: string | null;
};

const RecentlyLand = () => {
  const [items, setItems] = useState<ICardSlideProps[]>([]);

  useEffect(() => {
    let aborted = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/supabase/build?limit=50`, { cache: "no-store" });
        const json = await res.json();
        if (!json?.ok || !Array.isArray(json?.data)) return;

        const mapToCard = (b: Build): ICardSlideProps => {
          const sub = Array.isArray(b?.subImage) ? b.subImage : [];
          const image = b?.mainImage || sub[0] || "/img/main.png";
          const floor = typeof b?.currentFloor === "number" ? `${b.currentFloor}층` : (b?.floorDescription || "");
          return {
            type: b?.propertyType ?? "",
            floor,
            rooms: b?.rooms != null ? String(b.rooms) : "",
            image,
            title: b?.title || b?.buildingName || b?.address || "매물",
            description: b?.floorDescription || b?.address || "",
          };
        };

        const filtered = (json.data as Build[])
          .filter((b) => b?.visibility !== false)
          .filter((b) => b?.popularity !== "급매" && b?.popularity !== "인기")
          .map(mapToCard);

        if (!aborted) setItems(filtered);
      } catch {}
    };
    load();
    return () => {
      aborted = true;
    };
  }, []);

  const properties = useMemo(() => items, [items]);

  return (
    <div className="text-center p-6">
      <h2 className="text-xl font-bold">최신매물</h2>
      <p className="text-gray-600">최신매물을 만나보세요</p>
      <CardSlide properties={properties} />
    </div>
  );
};

export default RecentlyLand