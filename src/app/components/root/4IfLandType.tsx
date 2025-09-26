"use client"

import { useRouter } from "next/navigation"

const landTypes = [
  { name: '반려동물', image: '/img/2/pet.png', theme: '반려동물' },
  { name: '저보증금 원룸', image: '/img/2/oneroom.png', theme: '저보증금 원룸' },
  { name: '전세 자금 대출', image: '/img/2/loan.png', theme: '전세자금대출' },
  { name: '복층', image: '/img/2/upper.png', theme: '복층' },
  { name: '주차가능', image: '/img/2/parkinglot.png', theme: '주차가능' },
  { name: '옥탑', image: '/img/2/rooftop.png', theme: '옥탑' },
  { name: '역세권', image: '/img/2/train.png', theme: '역세권' },
  { name: '신축', image: '/img/2/new.png', theme: '신축' }
];

const IfLandType = () => {
  const router = useRouter();

  const handleThemeClick = (theme: string) => {
    router.push(`/landSearch?theme=${encodeURIComponent(theme)}`);
  };

  return (
    <div className="text-center p-4">
      <h2 className="text-xl font-bold">조건별 매물 찾아보기</h2>
      <p className="text-gray-600">테마를 활용한 조건별 매물을 빠르게 찾아보아요!</p>
      <div className="grid grid-cols-2 gap-3 mt-4 px-2">
        {landTypes.map((item, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleThemeClick(item.theme)}
          >
            <div 
              className="h-[115px] bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className="text-center py-2 font-semibold">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IfLandType;
