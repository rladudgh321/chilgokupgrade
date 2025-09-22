const Visit = () => {
  return (
    <div className='grow p-4'>
      <div className='p-4 flex justify-between bg-slate-400 rounded-t-xl'>
        <div>2025년 방문자수</div>
      </div>
      <div className='bg-slate-300'>
        <div className="text-center">차트</div>
        <div className="border-t border-slate-200 flex justify-between px-10 items-center py-4">
          <div className="flex flex-col justify-center items-center w-full">
            <div>1595</div>
            <div>이번달 접속수</div>
          </div>
          <div className="border-r border-slate-200 w-2 min-h-10" />
          <div className="w-full flex flex-col justify-center items-center">
            <div>95</div>
            <div>오늘 접속수</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Visit