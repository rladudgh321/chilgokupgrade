// next.config.ts
import type { NextConfig } from "next";
// CJS 모듈이므로 타입 경고를 피하기 위해 any 캐스팅
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = (bundleAnalyzer as any)({
  enabled: process.env.ANALYZE === "true", // ANALYZE=true 일 때만 활성화
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // 타입 에러가 있어도 프로덕션 빌드 강행
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // Supabase Storage 공개 URL
      {
        protocol: "https",
        hostname: "pijtsbicrnsbdaewosgt.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // 예시 이미지 도메인
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/images/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default withBundleAnalyzer(nextConfig);
