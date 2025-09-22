"use client"

import { memo, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Check from "../../svg/Check";
import Layer from "../../svg/Layer";
import Smile from "../../svg/Smile";
import { ICardSlideProps } from "./type";

const CardSlide = ({properties}: {properties: ICardSlideProps[]}) => {
  const [slidesPerView, setSlidesPerView] = useState(() =>
    globalThis.innerWidth < 768 ? 2 : 4
  );
  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(globalThis.innerWidth < 768 ? 2 : 4);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={10}
        slidesPerView={slidesPerView}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        className="mt-6"
      >
        {properties.map((property, index) => (
          <SwiperSlide key={index}>
            <div className="border rounded-lg shadow-md overflow-hidden">
              <div
                className="h-[150px] bg-cover bg-center"
                style={{ backgroundImage: `url(${property.image})` }}
              />
              <div className="p-4">
                <h3 className="font-semibold">{property.title}</h3>
                <p className="text-sm text-gray-500">{property.description}</p>
                <div className="flex justify-around mt-3 text-sm text-gray-700">
                  <div className="text-center">
                    <Check className="mx-auto mb-1 w-5" />
                    {property.type}
                  </div>
                  <div className="text-center">
                    <Layer className="mx-auto mb-1 w-5" />
                    {property.floor}
                  </div>
                  <div className="text-center">
                    <Smile className="mx-auto mb-1 w-5" />
                    {property.rooms}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
  )
}

export default memo(CardSlide)