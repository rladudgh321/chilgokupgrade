// app/components/MapView.tsx
"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    kakao?: any;
  }
}

type Listing = {
  id: number;
  title?: string;
  address?: string;       // 옵션: 주소가 있으면 지오코딩
  mapLocation?: string;   // "lat,lng" (좌표가 있으면 이 값을 우선 사용)
};

type Props = {
  listings: Listing[];
  width?: number | string;
  height?: number | string;
};

const MapView = ({ listings, width = "100%", height = 680 }: Props) => {
  const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const clustererRef = useRef<any>(null);
  const autoZoomingRef = useRef(false);

  // 원형 숫자 뱃지 스타일
  const circleStyle = (size: number, bg: string) => ({
    width: `${size}px`,
    height: `${size}px`,
    background: bg,
    color: "#fff",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: `${size + 1}px`,
    textAlign: "center" as const,
    borderRadius: `${Math.round(size / 2)}px`,
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.25), inset 0 0 0 2px rgba(255,255,255,0.85)",
  });

  // 마커(및 클러스터) 갱신
  const refreshMarkers = async (items: Listing[]) => {
    const kakao = window.kakao;
    const map = mapRef.current;
    const clusterer = clustererRef.current;
    if (!kakao?.maps || !map || !clusterer) return;

    // 기존 제거
    clusterer.clear();
    if (!items?.length) return;

    const geocoder = new kakao.maps.services.Geocoder();

    const toMarker = (it: Listing) =>
      new Promise<any>((resolve) => {
        // 1) 좌표 문자열 우선
        if (it.mapLocation && it.mapLocation.includes(",")) {
          const [lat, lng] = it.mapLocation.split(",").map(Number);
          if (Number.isFinite(lat) && Number.isFinite(lng)) {
            const pos = new kakao.maps.LatLng(lat, lng);
            const marker = new kakao.maps.Marker({ position: pos, title: it.title ?? "" });
            resolve(marker);
            return;
          }
        }
        // 2) 주소 지오코딩 (옵션)
        if (it.address) {
          geocoder.addressSearch(it.address, (result: any[], status: any) => {
            if (status === kakao.maps.services.Status.OK && result?.[0]) {
              const pos = new kakao.maps.LatLng(result[0].y, result[0].x);
              const marker = new kakao.maps.Marker({ position: pos, title: it.title ?? "" });
              resolve(marker);
            } else {
              resolve(null);
            }
          });
          return;
        }
        resolve(null);
      });

    const markers = (await Promise.all(items.map(toMarker))).filter(Boolean);
    if (!markers.length) return;

    clusterer.addMarkers(markers);
    map.panTo(markers[0].getPosition());
  };

  // 지도/클러스터 초기화
  const initMap = () => {
    const kakao = window.kakao;
    if (!kakao?.maps || !containerRef.current) return;

    const map = new kakao.maps.Map(containerRef.current, {
      center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울시청
      level: 8,
    });
    mapRef.current = map;

    // 기본 컨트롤(옵션)
    const mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    // 클러스터러: 숫자를 오래 유지하고, 클릭 시 끝까지 확대되도록 구성
    const clusterer = new kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: 1,        // 확대해도 최대한 군집 유지
      gridSize: 70,       // 같은 클러스터로 묶는 픽셀 거리
      disableClickZoom: true, // 클릭 시 우리가 직접 확대
      calculator: [10, 30, 50, 100, 200], // 단계 임계치
      styles: [
        circleStyle(36, "#7F56D9"), // 0~9
        circleStyle(42, "#6E59A5"), // 10~29
        circleStyle(48, "#5B4A8A"), // 30~49
        circleStyle(56, "#4B3B76"), // 50~99
        circleStyle(64, "#3A2C62"), // 100~199
        circleStyle(76, "#2A1E4E"), // 200+
      ],
    });
    clustererRef.current = clusterer;

    // 클러스터 클릭 시: 레벨 1까지 자동 줌인 반복
    kakao.maps.event.addListener(clusterer, "clusterclick", (cluster: any) => {
      if (autoZoomingRef.current) return;
      autoZoomingRef.current = true;

      const anchor = cluster.getCenter();

      const step = () => {
        const level = map.getLevel();
        if (level <= 1) {
          autoZoomingRef.current = false;
          return;
        }
        map.setLevel(level - 1, { anchor });

        const onIdle = () => {
          kakao.maps.event.removeListener(map, "idle", onIdle);
          step();
        };
        kakao.maps.event.addListener(map, "idle", onIdle);
      };

      step();
    });

    // 최초 마커 세팅
    void refreshMarkers(listings);
  };

  // SDK 로드 → kakao.maps.load 후 init
  useEffect(() => {
    if (!KAKAO_KEY || !containerRef.current) return;

    const scriptId = "kakao-maps-sdk";
    const exists = document.getElementById(scriptId) as HTMLScriptElement | null;

    const onReady = () => window.kakao?.maps?.load?.(initMap);

    if (exists) {
      // 이미 로드됨
      onReady();
      return;
    }

    const s = document.createElement("script");
    s.id = scriptId;
    s.async = true;
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services,clusterer&autoload=false`;
    s.onload = onReady;
    s.onerror = () => console.error("Kakao SDK load error");
    document.head.appendChild(s);

    return () => {
      // 개발 중 핫리로드 시 누수 방지 목적의 클린업(필수는 아님)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [KAKAO_KEY]);

  // 목록이 바뀌면 마커 갱신
  useEffect(() => {
    void refreshMarkers(listings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings]);

  if (!KAKAO_KEY) {
    return (
      <div style={{ padding: 12, color: "#b91c1c" }}>
        환경변수 <code>NEXT_PUBLIC_KAKAO_MAP_KEY</code>가 비어 있습니다.
      </div>
    );
  }

  return <div ref={containerRef} style={{ width, height }} />;
};

export default MapView;
