// app/layout/admin/RootLayout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "../layout/admin/Header";
import AdminNav from "../components/admin/nav";
import TanstackProvider from "../components/shared/TanstackProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "다부 부동산 관리자 페이지지",
  description: "수정 사항 있을시 편히 말씀해주세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackProvider>
          <div className="relative z-10 flex">
            <Header />
          </div>
          <div className="relative flex -z-0">
            {/* AdminNav가 화면 왼쪽에 고정되고 Header의 높이만큼 아래로 내려오도록 calc 함수 사용 */}
            <div className="fixed left-0 w-64 h-full bg-gray-800 z-20">
              <AdminNav />
            </div>
            <div className="ml-64 w-full pt-14">{children}</div> {/* 왼쪽 여백을 AdminNav의 너비만큼 줌 */}
          </div>
        </TanstackProvider>
      </body>
    </html>
  );
}
