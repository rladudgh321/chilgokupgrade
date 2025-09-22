"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const Institue = () => {
  const [width, setWidth] = useState(2); // 기본값을 모바일 기준으로 설정
  const [getWidth, setGetWidth] = useState("50vw"); // 기본값 설정

  useEffect(() => {
    const updateSize = () => {
      if (typeof window !== "undefined") {
        setWidth(window.innerWidth < 768 ? 2 : 6);
        setGetWidth(window.innerWidth < 768 ? "50vw" : "15vw");
      }
    };
    
    updateSize(); // 초기 설정
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <Swiper
      style={{ margin: "10px" }}
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={10}
      slidesPerView={width}
      pagination={{ clickable: true }}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <SwiperSlide key={`institu${i + 1}`}>
          <div
            className="h-[70px] border border-gray-300 bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage: `url("/img/4/${i + 1}.png")`,
              width: getWidth,
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Institue;
