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
const Home = () => {
  return (
    <main>
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