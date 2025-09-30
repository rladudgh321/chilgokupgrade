
import { cookies } from 'next/headers';
import { createClient } from '@/app/utils/supabase/server';
import MainPicture from "../components/root/1MainPicture";
import SearchMapList from "../components/root/2SearchMapList";
import WhatTypeLand from "../components/root/3WhatTypeLand";
import IfLandType from "../components/root/4IfLandType";
import RecommedLand from "../components/root/5RecommedLand";
import QuickSale from "../components/root/6QuickSale";
import RecentlyLand from "../components/root/7RecentlyLand";
import Contact from "../components/root/8Contact";
import ContactForm from "../components/root/8Contact/ContactForm";
import Institue from "../components/root/9Institue";
import Popup from "../components/root/Popup";
import { PopupPost } from "../components/root/Popup";

async function getPopupPosts(): Promise<PopupPost[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('BoardPost')
    .select('id, representativeImage, popupWidth, popupHeight')
    .eq('isPopup', true);

  if (error) {
    console.error('Error fetching popup posts:', error);
    return [];
  }

  return data;
}

const Home = async () => {
  const popups = await getPopupPosts();

  return (
    <main>
      <Popup popups={popups} />
      <MainPicture />
      <SearchMapList />
      <WhatTypeLand />
      <IfLandType />
      <RecommedLand />
      <QuickSale />
      <RecentlyLand />
      <Contact>
        <ContactForm />
      </Contact>
      <Institue />
    </main>
  );
}

export default Home;
