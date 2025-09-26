"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { clsx } from "clsx";

interface LandSearchPaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: { [key: string]: string | string[] | undefined };
}

const LandSearchPagination = ({ currentPage, totalPages, searchParams }: LandSearchPaginationProps) => {
  const router = useRouter();

  const [pageLimit, setPageLimit] = useState(10);

  const updatePageLimit = useCallback(() => {
    const width = window.innerWidth;

    if (width >= 1024) {
      setPageLimit(10);
    } else if (width >= 768) {
      setPageLimit(5);
    } else {
      setPageLimit(3);
    }
  }, []);

  useEffect(() => {
    updatePageLimit();
    window.addEventListener("resize", updatePageLimit);
    return () => {
      window.removeEventListener("resize", updatePageLimit);
    };
  }, [updatePageLimit]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    
    // 기존 검색 파라미터 유지
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        params.set(key, value);
      }
    });
    
    // 페이지 번호 업데이트
    params.set("page", page.toString());
    
    router.push(`/landSearch?${params.toString()}`, { scroll: false });
  };

  const getPaginationRange = (currentPage: number, totalPages: number, limit: number) => {
    const startPage = Math.max(1, Math.floor((currentPage - 1) / limit) * limit + 1);
    const endPage = Math.min(startPage + limit - 1, totalPages);
    const range = [];
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    return range;
  };

  const paginationRange = getPaginationRange(currentPage, totalPages, pageLimit);

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {/* 이전 페이지 버튼 */}
      {currentPage > 1 && (
        <button
          className={clsx(
            "px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          )}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <span className="material-icons">＜</span>
          이전
        </button>
      )}

      {/* 페이지 번호 버튼 */}
      {paginationRange.map((page) => (
        <button
          key={page}
          className={clsx(
            "px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-200 transition-all duration-300 transform hover:scale-105",
            currentPage === page
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-blue-100"
          )}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* 다음 페이지 버튼 */}
      {currentPage < totalPages && (
        <button
          className={clsx(
            "px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          )}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          다음 <span className="material-icons">＞</span>
        </button>
      )}
    </div>
  );
};

export default LandSearchPagination;
