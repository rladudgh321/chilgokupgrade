import type { Metadata } from "next";
import Header from "../layout/app/Header";
import Footer from "../layout/app/Footer";

export const metadata: Metadata = {
  title: "다부 부동산",
  description: "수정 사항 있을시 편히 말씀해주세요",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
