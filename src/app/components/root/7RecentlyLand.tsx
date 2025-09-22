import { useMemo } from "react";
import CardSlide from "./shaped/CardSlide";
import data from './shaped/data.json';

const RecentlyLand = () => {
 const properties = useMemo(()=>{
  return data.map(({type, floor, rooms, image, title, description})=> ({
    type,
    floor,
    rooms,
    image,
    title,
    description,
  }))
 },[]);
  return (
    <div className="text-center p-6">
      <h2 className="text-xl font-bold">최신매물</h2>
      <p className="text-gray-600">최신매물을 만나보세요</p>

      <CardSlide properties={properties} />
    </div>
  );
};

export default RecentlyLand