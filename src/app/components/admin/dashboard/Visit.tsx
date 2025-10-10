const Visit = () => {
  return (
    <div className='grow p-2 sm:p-4'>
      <div className='p-3 sm:p-4 flex justify-between bg-slate-400 rounded-t-xl text-sm sm:text-base'>
        <div>2025년 방문자수</div>
      </div>
      <div className='bg-slate-300 p-4 sm:p-0'>
        <div className="text-center">차트</div>
        <div className="border-t border-slate-200 flex flex-col sm:flex-row justify-between px-4 sm:px-10 items-center py-2 sm:py-4 gap-2">
          <div className="flex flex-col justify-center items-center w-full">
            <div className="text-sm sm:text-base">1595</div>
            <div className="text-xs sm:text-sm">이번달 접속수</div>
          </div>
          <div className="border-r border-slate-200 w-full sm:w-2 min-h-px sm:min-h-10" />
          <div className="w-full flex flex-col justify-center items-center">
            <div className="text-sm sm:text-base">95</div>
            <div className="text-xs sm:text-sm">오늘 접속수</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Visit