'use client';

import { useEffect, useState } from 'react';
import { BuildFindOne } from '@/app/apis/build';
import KakaoMapMarker from '@/app/components/shared/KakaoMapMarker';
import { IBuild } from '@/app/interface/build';
import ImageSlider from '@/app/components/shared/ImageSlider';
import OptionIcon from '@/app/components/shared/OptionIcon';

interface BuildDetailModalProps {
  buildId: number;
  onClose: () => void;
}


const BuildDetailModal = ({ buildId, onClose }: BuildDetailModalProps) => {
  const [build, setBuild] = useState<IBuild | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [areaUnit, setAreaUnit] = useState<'m2' | 'pyeong'>('m2');



  useEffect(() => {
    const fetchBuild = async () => {
      try {
        setLoading(true);
        const data = await BuildFindOne(buildId);
        setBuild(data);
      } catch (err) {
        setError('Failed to fetch building details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuild();
  }, [buildId]);

  const convertToPyeong = (m2: number) => (m2 / 3.305785).toFixed(2);

  const renderInfoRow = (label: string, value: React.ReactNode) => (
    <>
      <div className="bg-gray-100 px-4 py-3 font-semibold text-sm">{label}</div>
      <div className="px-4 py-3 text-sm">{value || '-'}</div>
    </>
  );

  const formatPrice = (price: number | string | undefined | null) => {
    if (price === null || price === undefined) return '-';
    const numPrice = Number(price);
    if (isNaN(numPrice)) return '-';
    return `${numPrice.toLocaleString()} 만원`;
  };

  const getFloorString = (floor: number | undefined | null) => {
    if (floor === null || floor === undefined) return '-';
    if (floor > 0) return `지상 ${floor}층`;
    if (floor < 0) return `지하 ${Math.abs(floor)}층`;
    return `${floor}층`;
  };

  const allImages = build?.mainImage ? [build.mainImage, ...(Array.isArray(build.subImage) ? build.subImage : [])] : [];

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center p-2 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-3 sm:p-4 border-b flex justify-between items-center bg-purple-800 text-white rounded-t-lg">
          <h2 className="text-lg sm:text-xl font-bold">매물 상세 정보 (번호: {build?.id})</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl font-bold">&times;</button>
        </div>
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
          {loading && <div className="text-center py-10">Loading...</div>}
          {error && <div className="text-center py-10 text-red-500">{error}</div>}
          {build && (
            <>
              <ImageSlider images={allImages} />

              <div className="pb-4 border-b">
                <h3 className="text-xl sm:text-2xl font-bold">{build.title}</h3>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">{build.address}</p>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-3 text-purple-800">매물 정보</h4>
                <div className="border rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
                    {renderInfoRow('매물 종류', build.propertyType)}
                    {renderInfoRow('거래 종류', build.dealType)}
                    {build.isSalePriceEnabled && renderInfoRow('매매가', formatPrice(build.salePrice))}
                    {build.isLumpSumPriceEnabled && renderInfoRow('전세가', formatPrice(build.lumpSumPrice))}
                    {build.isRentalPriceEnabled && renderInfoRow('월세', `${formatPrice(build.deposit)} / ${formatPrice(build.rentalPrice)}`)}
                    {build.managementFee && renderInfoRow('관리비', `${formatPrice(build.managementFee)} (포함: ${build.managementEtc || '-'})`)}
                    {renderInfoRow('층수', `${getFloorString(build.currentFloor)} / ${getFloorString(build.totalFloors)}`)}
                    {renderInfoRow('방/화장실 수', `${build.rooms || '-'}개 / ${build.bathrooms || '-'}개`)}
                    {renderInfoRow('면적', 
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm">
                          {areaUnit === 'm2'
                            ? `공급 ${build.supplyArea || '-'}m² / 전용 ${build.actualArea || '-'}m²`
                            : `공급 ${convertToPyeong(build.actualArea || 0)}평 / 전용 ${convertToPyeong(build.actualArea || 0)}평`}
                        </span>
                        <button onClick={() => setAreaUnit(areaUnit === 'm2' ? 'pyeong' : 'm2')} className="text-xs bg-gray-200 hover:bg-gray-300 rounded px-2 py-1 transition-colors">
                          {areaUnit === 'm2' ? '평으로 보기' : 'm²로 보기'}
                        </button>
                      </div>
                    )}
                    {renderInfoRow('주차 옵션', `총 ${build.totalParking || '-'}대 (세대당 ${build.parkingPerUnit || '-'}대), 주차비: ${formatPrice(build.parkingFee)}`)}
                    {renderInfoRow('엘리베이터', build.elevatorType ? `${build.elevatorType} (${build.elevatorCount || '-'}대)` : '-')}
                    {renderInfoRow('난방 방식', build.heatingType)}
                    {renderInfoRow('입주 가능일', build.moveInDate ? `${new Date(build.moveInDate).toLocaleDateString()} (${build.moveInType})` : '-')}
                    {renderInfoRow('건축 년도', build.constructionYear ? new Date(build.constructionYear).toLocaleDateString() : '-')}
                    {renderInfoRow('방향', build.direction ? `${build.direction} (기준: ${build.directionBase})` : '-')}
                    {build.themes && build.themes.length > 0 && renderInfoRow('테마', build.themes.join(', '))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h4 className="text-base sm:text-lg font-semibold mb-3 text-purple-800">옵션 정보</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4 pt-2">
                  {build.buildingOptions && build.buildingOptions.map(opt => <OptionIcon key={`building-${opt.id}`} option={opt} />)}
                  {/* {build.roomOption && build.roomOption.id && <OptionIcon key={`room-${build.roomOption.id}`} option={build.roomOption} />} */}
                  {/* {build.bathroomOption && build.bathroomOption.id && <OptionIcon key={`bathroom-${build.bathroomOption.id}`} option={build.bathroomOption} />} */}
                  {build.floorOption && build.floorOption.id && <OptionIcon key={`floor-${build.floorOption.id}`} option={build.floorOption} />}
                </div>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-3 text-purple-800">상세 설명</h4>
                <div className="prose max-w-none text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: build.editorContent || '' }} />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-3 text-purple-800">위치 및 주변 편의시설</h4>
                {build.address && <KakaoMapMarker address={build.address} />}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuildDetailModal;