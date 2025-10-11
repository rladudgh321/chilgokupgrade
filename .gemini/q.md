const MainPicture = () => {
  return (
    <section 
      className="w-full h-[120px] sm:h-[150px] md:h-[180px] bg-center bg-cover bg-no-repeat bg-[url(/img/main.png)]">
    </section>
  );
};

export default MainPicture;
---------
컴포넌트에서 가로폭은 100wh를 유지한채로 세로 비율은 이미지의 고유 비율대로 늘려줘