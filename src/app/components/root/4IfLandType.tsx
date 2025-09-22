const landTypes = [
  { name: '반려동물', image: '/img/2/pet.png' },
  { name: '저보증금 원룸', image: '/img/2/oneroom.png' },
  { name: '전세 자금 대출', image: '/img/2/loan.png' },
  { name: '복층', image: '/img/2/upper.png' },
  { name: '주차가능', image: '/img/2/parkinglot.png' },
  { name: '옥탑', image: '/img/2/rooftop.png' },
  { name: '역세권', image: '/img/2/train.png' },
  { name: '신축', image: '/img/2/new.png' }
];

const IfLandType = () => {
  return (
    <div className="text-center p-4">
      <h2 className="text-xl font-bold">조건별 매물 찾아보기</h2>
      <p className="text-gray-600">테마를 활용한 조건별 매물을 빠르게 찾아보아요!</p>
      <div className="grid grid-cols-2 gap-3 mt-4 px-2">
        {landTypes.map((item, index) => (
          <div key={index} className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
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
