import MainPicture, { Banner } from "../components/root/1MainPicture";
import SearchMapList from "../components/root/2SearchMapList";
import WhatTypeLand, { ListingTypeProps } from "../components/root/3WhatTypeLand";
import IfLandType, { ThemeImageProps } from "../components/root/4IfLandType";
import ListingSection, { Listing } from "../components/root/ListingSection";
import Contact from "../components/root/8Contact";
import ContactForm from "../components/root/8Contact/ContactForm";
import Institue from "../components/root/9Institue";
import Popup from "../components/root/Popup";
import { PopupPost } from "../components/root/Popup";

export const revalidate = 0;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!

async function getPopupPosts(): Promise<PopupPost[]> {
  const res = await fetch(`${BASE_URL}/api/popup`, { next: { tags: ['public', 'popup'] } });
  if(!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json();
  return data.data;
}

async function getBanners(): Promise<Banner[]> {
    const res = await fetch(`${BASE_URL}/api/admin/webView/banner`);
    if(!res.ok) {
      throw new Error('Network response was not ok');
    }
    const banners = await res.json()
    return banners.data;
}

async function getListingType(): Promise<ListingTypeProps[]> {
    const res = await fetch(`${BASE_URL}/api/listing-type`);
    if(!res.ok) {
      throw new Error('Network response was not ok');
    }
    const json = await res.json();
    const rows: Array<{ name?: string; imageUrl?: string }> = json?.data ?? [];
    return rows
      .map(r => ({ name: (r?.name ?? '').trim(), imageUrl: r?.imageUrl }))
      .filter(p => p.name.length > 0 && p.imageUrl); // Only show items with images
}

async function getThemeImage(): Promise<ThemeImageProps[]> {
    const res = await fetch(`${BASE_URL}/api/theme-images`);
    if(!res.ok) {
      throw new Error('Network response was not ok');
    }
    const json = await res.json();
    const data: Array<{ label?: string; imageUrl?: string; isActive?: boolean }> = json?.data;
    const active = data.filter(x => (x.isActive === undefined || x.isActive === true) && x.label);
    return active.map(x => {
      const label = String(x.label);
      const image = x.imageUrl?.trim();
      return {
        name: label,
        image,
        theme: label,
      };
    });
}

async function getIpStatus(): Promise<{isBanned: boolean}> {
  const res = await fetch(`${BASE_URL}/api/ip-status`, { next: { tags: ['public', 'popup'] } });
  if(!res.ok) {
    throw new Error('Network response was not ok');
  }
  return await res.json();
}

export type ListingSectionProps = {
  currentPage: number; 
  listings: Listing[]; 
  totalPage: number;
}

async function getPopular(): Promise<ListingSectionProps | undefined> {
  const res = await fetch(`${BASE_URL}/api/listings?sortBy=popular&limit=10`, { next: { tags: ['public', 'popup'] } });
  if(!res.ok) {
    throw new Error('Network response was not ok');
  }
  const json = await res.json();
  if (!json?.listings || !Array.isArray(json?.listings)) return;

  return json;
}

async function getQuickSale(): Promise<ListingSectionProps | undefined> {
  const res = await fetch(`${BASE_URL}/api/listings?label=급매&limit=10`, { next: { tags: ['public', 'popup'] } });
  if(!res.ok) {
    throw new Error('Network response was not ok');
  }
  const json = await res.json();
  if (!json?.listings || !Array.isArray(json?.listings)) return;
  return json;
}

async function getRecently(): Promise<ListingSectionProps | undefined> {
  const res = await fetch(`${BASE_URL}/api/listings?sortBy=latest&limit=10`, { next: { tags: ['public', 'popup'] } });
  if(!res.ok) {
    throw new Error('Network response was not ok');
  }
  const json = await res.json();
  if (!json?.listings || !Array.isArray(json?.listings)) return;
  return json;
}


const Home = async () => {
  const popups = await getPopupPosts();
  const banners = await getBanners();
  const listingType = await getListingType();
  const themeImage = await getThemeImage();
  const isBanned = await getIpStatus();
  const RecommendData = await getPopular();
  const QuickSaleData = await getQuickSale();
  const RecentlyData = await getRecently();
  return (
    <main>
      <Popup popups={popups} />
      <MainPicture banners={banners} />
      <SearchMapList />
      <WhatTypeLand listingType={listingType} />
      <IfLandType themeImage={themeImage} />
      <ListingSection RecommendData={RecommendData!} QuickSaleData={QuickSaleData!} RecentlyData={RecentlyData!} />
      <Contact>
        <ContactForm isBanned={isBanned.isBanned} />
      </Contact>
      <Institue />
    </main>
  );
}

export default Home;