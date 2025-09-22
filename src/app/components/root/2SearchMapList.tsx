const SearchMapList = () => {
  return (
    <div className="flex justify-center text-center space-x-2 m-4">
      <div 
        className="w-[47vw] h-[100px] max-h-[160px] bg-center bg-cover bg-no-repeat border border-gray-300 bg-[url('/img/map_search.png')]" 
      />
      <div 
        className="w-[47vw] h-[100px] max-h-[160px] bg-center bg-cover bg-no-repeat border border-gray-300 bg-[url('/img/list_search.png')]" 
      />
    </div>
  );
};

export default SearchMapList;
