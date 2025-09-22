import { useMemo } from "react";
import CardSlide from "./shaped/CardSlide";
import data from './shaped/data.json';

const QuickSale = () => {
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
      <h2 className="text-xl font-bold">급매물</h2>
      <p className="text-gray-600">급매 매물 모음입니다</p>

      <CardSlide properties={properties} />
    </div>
  );
};

export default QuickSale;
