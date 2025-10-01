"use client";

import React, { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import ListingCard from "./ListingCard";

type Props = {
  listings: any[];
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

const ListingList = ({
  listings,
  sortBy,
  onSortChange,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: Props) => {
  const sortOptions = [
    { key: "latest", label: "최신순" },
    { key: "popular", label: "인기순" },
    { key: "price", label: "금액순" },
    { key: "area", label: "면적순" },
  ];

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? listings.length + 1 : listings.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 160, // 각 항목의 예상 높이 (조정 필요)
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (
      lastItem &&
      lastItem.index >= listings.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage?.();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    listings.length,
    isFetchingNextPage,
    virtualItems,
  ]);

  return (
    <div className="h-full flex flex-col">
      {/* 정렬 탭 */}
      <div className="flex border-b bg-white flex-shrink-0">
        {sortOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => onSortChange(option.key)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              sortBy === option.key
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 매물 리스트 */}
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {listings.length === 0 && !isFetchingNextPage ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>표시할 매물이 없습니다.</p>
          </div>
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualItems.map((virtualRow) => {
              const isLoaderRow = virtualRow.index > listings.length - 1;
              const listing = listings[virtualRow.index];

              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {isLoaderRow ? (
                    hasNextPage ? (
                      <div className="flex justify-center items-center p-4">
                        <p>불러오는 중...</p>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center p-4">
                        <p>모든 매물을 확인했습니다.</p>
                      </div>
                    )
                  ) : (
                    <ListingCard listing={listing} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingList;