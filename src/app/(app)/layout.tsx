import type { Metadata } from "next";
import Header from "../layout/app/Header";
import Footer from "../layout/app/Footer";



export const metadata: Metadata = {
  title: "다부 부동산",
  description: "수정 사항 있을시 편히 말씀해주세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
