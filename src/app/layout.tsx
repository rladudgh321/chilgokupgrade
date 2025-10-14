import TanstackProvider from "./components/shared/TanstackProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";
import Script from "next/script";
import localFont from 'next/font/local'

const myFontWoff2 = localFont({
  src: [
    {
      path: '../assets/font/NanumSquareB.woff2',
    }
  ],
  preload: true,
  display: 'block',
  variable: "--font-nanum-b",
})

const myFontFallback = localFont({
  src: [
    {
      path: '../assets/font/NanumSquareB.woff',
    },
    {
      path: '../assets/font/NanumSquareB.ttf',
    }
  ],
  preload: false,
  display: 'block',
  variable: "--font-nanum-b",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning className="h-full">
      <body
        className={`${myFontWoff2.variable} ${myFontFallback.variable} antialiased h-full flex flex-col`}
      >
        <TanstackProvider>{children}</TanstackProvider>

        {/* 카카오맵 SDK */}
        <Script
          strategy="beforeInteractive"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`}
        />

      </body>
    </html>
  );
}
