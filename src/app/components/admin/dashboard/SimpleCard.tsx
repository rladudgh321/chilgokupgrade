import React from 'react'

interface ISimpleCardProps {
  icon: React.ReactNode;
  title: string;
  buttonTitle?: string;
  contentTitle: string;
  content: string;
}

const SimpleCard = ({icon, title, buttonTitle, contentTitle, content}: ISimpleCardProps) => {
  return (
    <div className='grow p-2 sm:p-4'>
      <div className='p-3 sm:p-4 flex justify-between bg-slate-400 rounded-t-xl text-sm sm:text-base'>
        <div>{title}</div>
        <button className={`bg-slate-300 border border-none rounded-md ${buttonTitle && 'px-2'}`}>{buttonTitle}</button>
      </div>
      <div className='flex justify-between items-center bg-slate-300 p-4 sm:p-8 min-h-32 sm:min-h-40'>
        {icon}
        <div className='text-right text-sm sm:text-base'>
          <div>{contentTitle}</div>
          <div>{content}</div>
        </div>
      </div>
    </div>
  )
}

export default SimpleCard