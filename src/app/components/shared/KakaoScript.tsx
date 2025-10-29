"use client"

import Script from "next/script";

const KakaoScript = () => {
  return (
    <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services,clusterer`}
          strategy="afterInteractive"
          onLoad={() => {
            // 선택적: 로드 확인용 콘솔
            console.log('kakao script loaded');
          }}
        />
  )
}

export default KakaoScript