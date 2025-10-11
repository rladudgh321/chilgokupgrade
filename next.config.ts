import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // Supabase Storage 공개 URL
      {
        protocol: 'https',
        hostname: 'pijtsbicrnsbdaewosgt.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // 너 데이터에 예시로 들어간 example.com 이미지
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**', // 필요 경로에 맞게 조정
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
