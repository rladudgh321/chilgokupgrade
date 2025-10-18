import type { Metadata } from "next";
import Header, { HeaderProps } from "../layout/app/Header";
import Footer from "../layout/app/Footer";
import SnsIcon, { SnsSetting } from "@/app/components/SnsIcon";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!

async function getHeaderInfo(): Promise<HeaderProps> {
  const res = await fetch(`${BASE_URL}/api/logo`, { next: { tags: ['public', 'headerInfo'] } });
  if(!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json();
  return data.data;
}

async function getSnsSettings(): Promise<SnsSetting[]> {
  const res = await fetch(`${BASE_URL}/api/sns-settings`, { next: { tags: ["public", "sns-settings"] } });
  if (!res.ok) throw new Error("Network response was not ok");
  const data = await res.json();
  return data.data;
}

export const metadata: Metadata = {
  title: "부동산",
  description: "수정 사항 있을시 편히 말씀해주세요",
};

export default async function AppLayout({
  children, modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
   const [headerPromise, snsSettings] = await Promise.all([getHeaderInfo(), getSnsSettings()]);
  return (
    <>
      <Header headerPromise={headerPromise} />
      <main className="flex-grow">{children}</main>
       {Boolean(snsSettings?.length) && <SnsIcon snsSettings={snsSettings} />}
      <Footer headerPromise={headerPromise} />
      {modal}
    </>
  );
}
