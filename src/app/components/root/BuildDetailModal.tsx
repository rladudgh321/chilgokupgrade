'use client';

import { useEffect, useState } from 'react';
import { Build } from '@/app/interface/build';
import { BuildFindOne } from '@/app/apis/build';

interface BuildDetailModalProps {
  buildId: number;
  onClose: () => void;
}

const BuildDetailModal = ({ buildId, onClose }: BuildDetailModalProps) => {
  const [build, setBuild] = useState<Build | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">매물번호: {build?.id}</h2>
          <button onClick={onClose} className="text-black">
            &times;
          </button>
        </div>
        <div className="p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {build && (
            <div>
              {build.mainImage && (
                <img src={build.mainImage} alt={build.title} className="w-full h-64 object-cover rounded-md mb-4" />
              )}
              <h3 className="text-xl font-bold mb-2">{build.title}</h3>
              <p className="text-gray-600 mb-4">{build.address}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold">매물 종류</p>
                  <p>{build.propertyType}</p>
                </div>
                <div>
                  <p className="font-semibold">거래 종류</p>
                  <p>{build.listingType?.name}</p>
                </div>
                <div>
                  <p className="font-semibold">구매 종류</p>
                  <p>{build.buyType?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {build.isSalePriceEnabled && (
                  <div>
                    <p className="font-semibold">매매가</p>
                    <p>{build.salePrice?.toLocaleString()}만원</p>
                  </div>
                )}
                {build.isLumpSumPriceEnabled && (
                  <div>
                    <p className="font-semibold">전세가</p>
                    <p>{build.lumpSumPrice?.toLocaleString()}만원</p>
                  </div>
                )}
                {build.isRentalPriceEnabled && (
                  <div>
                    <p className="font-semibold">월세</p>
                    <p>{build.rentalPrice?.toLocaleString()}만원</p>
                  </div>
                )}
                {build.isDepositEnabled && (
                    <div>
                        <p className="font-semibold">보증금</p>
                        <p>{build.deposit?.toLocaleString()}만원</p>
                    </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold">공급 면적</p>
                  <p>{build.supplyArea} m²</p>
                </div>
                <div>
                  <p className="font-semibold">전용 면적</p>
                  <p>{build.actualArea} m²</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">층</p>
                  <p>{build.currentFloor} / {build.totalFloors}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuildDetailModal;
