
"use client";

import { useState } from "react";
import RecommedLand from "./5RecommedLand";
import QuickSale from "./6QuickSale";
import RecentlyLand from "./7RecentlyLand";
import BuildDetailModal from "./BuildDetailModal";

const ListingSection = () => {
  const [selectedBuildId, setSelectedBuildId] = useState<number | null>(null);

  const handleCardClick = (id: number) => {
    setSelectedBuildId(id);
  };

  const handleCloseModal = () => {
    setSelectedBuildId(null);
  };

  return (
    <>
      <RecommedLand onCardClick={handleCardClick} />
      <QuickSale onCardClick={handleCardClick} />
      <RecentlyLand onCardClick={handleCardClick} />
      {selectedBuildId && (
        <BuildDetailModal
          buildId={selectedBuildId}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ListingSection;
