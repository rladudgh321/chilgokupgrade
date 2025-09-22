import { useMemo } from "react";
import CardSlide from "./shaped/CardSlide";
import data from './shaped/data.json';

const RecommedLand = () => {
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
      <h2 className="text-xl font-bold">이달의 추천 부동산</h2>
      <p className="text-gray-600">다부 부동산이 추천하는 이 달의 매물을 확인해보세요!</p>

      <CardSlide properties={properties} />
    </div>
  );
};

export default RecommedLand;
