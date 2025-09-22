import SimpleCard from '@adminComponents/dashboard/SimpleCard';
import Smile from '@svg/Smile';
import Layer from '@svg/Layer';
import Check from '@svg/Check';
import ListCard from '@adminComponents/dashboard/ListCard';
import Visit from '@adminComponents/dashboard/Visit';
import Chart from '@adminComponents/dashboard/Chart';

const Dashboard = () => {
  return (
    <div>
      <div className='flex'>
        <SimpleCard icon={<Smile className='w-8' />} title='방문 통계' buttonTitle='방문통계 초기화' contentTitle='어제 / 오늘' content='4 / 82' />
        <SimpleCard icon={<Layer className='w-8' />} title='매물 통계' buttonTitle='매물통계 초기화' contentTitle='전체매물 / 오늘 매물 조회수' content='100 / 59' />
        <SimpleCard icon={<Check className='w-8' />} title='의뢰 통계' contentTitle='매수 / 매도' content='5 / 0' />
        <SimpleCard icon={<Smile className='w-8' />} title='연락요청 통계' contentTitle='연락 요청' content='3' />
      </div>
      <div className='flex'>
        <ListCard />
        <Visit />
      </div>
      <div className='flex gap-x-4'>
        <Chart title='카테고리별 조회수' chart='카테고리 차트' />
        <Chart title='테마별 조회수' chart='테마 차트' />
      </div>
    </div>
  )
}

export default Dashboard