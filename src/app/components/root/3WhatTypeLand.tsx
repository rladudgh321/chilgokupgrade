const properties = [
  { name: '아파트', image: '/img/1/apart.png' },
  { name: '신축빌라', image: '/img/1/villa.png' },
  { name: '원/투/쓰리룸', image: '/img/1/oneroom.png' },
  { name: '사무실', image: '/img/1/office.png' },
  { name: '상가', image: '/img/1/store.png' },
  { name: '오피스텔', image: '/img/1/officetel.png' }
];

const WhatTypeLand = () => {
  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      {properties.map((property, index) => (
        <div key={index} className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
          <div 
            style={{ backgroundImage: `url(${property.image})` }} 
            className="h-[115px] bg-center bg-cover"
          />
          <div className="text-center py-2 font-semibold">{property.name}</div>
        </div>
      ))}
    </div>
  );
};

export default WhatTypeLand;
