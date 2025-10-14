'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

type Banner = {
  id: number;
  imageUrl: string;
  imageName: string;
};

const MainPicture = () => {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/admin/webView/banner');
        const result = await response.json();
        if (result.ok) {
          setBanners(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      }
    };

    fetchBanners();
  }, []);

  return (
    <section className="w-full mt-14">
      {banners.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <Image
                src={banner.imageUrl}
                alt={banner.imageName}
                width={1920} 
                height={400} 
                sizes="100vw"
                className="w-full h-auto"
                priority
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default MainPicture;