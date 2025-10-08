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
        <div className="p-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {build && (
            <div>
              {/* Detailed content will go here */}
              <p>{build.title}</p>
              <p>{build.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuildDetailModal;
