"use client"

import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

type DraggableItemProps = {
  id: number;
  name: string;
  moveItem: (draggedId: number, hoveredId: number) => void;
};

const DraggableItem = ({ id, name, moveItem }: DraggableItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: 'item',
    item: { id },
  });

  const [, drop] = useDrop({
    accept: 'item',
    drop: (item: { id: number }) => {
      if (item.id !== id) {
        moveItem(item.id, id);
        item.id = id; // Update dragged item's id to current one
      }
    },
    hover: (item: { id: number }) => {
      if (item.id !== id) {
        // Optionally highlight the hovered item
      }
    },
  });

  // Combine drag and drop refs
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="p-4 mb-2 border rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all"
    >
      {name}
    </div>
  );
};

export default DraggableItem;
