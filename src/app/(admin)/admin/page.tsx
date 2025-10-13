import SimpleCard from '@adminComponents/dashboard/SimpleCard';
import Smile from '@svg/Smile';
import Layer from '@svg/Layer';
import Check from '@svg/Check';
import Visit from '@adminComponents/dashboard/Visit';
import Chart from '@adminComponents/dashboard/Chart';

const Dashboard = () => {
  return (
    <div className="p-2 sm:p-4 space-y-4">
      <div className='flex flex-col sm:flex-row gap-4'>
        <SimpleCard icon={<Layer className='w-8' />} title='매물 통계' buttonTitle='매물통계 초기화' contentTitle='전체매물 / 공개된 매물 총조회수' content='100 / 5875' />
        <SimpleCard icon={<Check className='w-8' />} title='의뢰 통계' contentTitle='매수 / 매도 / 기타' content='5 / 2 /1' />
        <SimpleCard icon={<Smile className='w-8' />} title='연락요청 통계' contentTitle='연락 요청' content='3' />
      </div>
      <div className='flex flex-col sm:flex-row gap-4'>
        <Chart title='카테고리별 조회수' chart='카테고리 차트' />
        <Chart title='테마별 조회수' chart='테마 차트' />
      </div>
    </div>
  )
}

export default Dashboard