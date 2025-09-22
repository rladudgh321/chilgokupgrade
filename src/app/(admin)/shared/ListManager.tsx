"use client"

import { useState } from 'react';
import DraggableItem from './DraggableItem';
import InputWithButton from './InputWithButton';

type ListManagerProps = {
  title: string;
  placeholder: string;
  buttonText: string;
};

const ListManager = ({ title, placeholder, buttonText }: ListManagerProps) => {
  const [items, setItems] = useState<{ id: number; name: string }[]>([]);
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim()) {
      const newItemObj = {
        id: items.length + 1,
        name: newItem,
      };
      setItems([...items, newItemObj]);
      setNewItem('');
    }
  };

  const moveItem = (draggedId: number, hoveredId: number) => {
    const draggedIndex = items.findIndex((item) => item.id === draggedId);
    const hoveredIndex = items.findIndex((item) => item.id === hoveredId);
    const updatedItems = [...items];

    // Swap positions of the dragged and hovered items
    [updatedItems[draggedIndex], updatedItems[hoveredIndex]] = [
      updatedItems[hoveredIndex],
      updatedItems[draggedIndex],
    ];
    setItems(updatedItems);
  };

  const handleSave = () => {
    console.log(`${title} saved:`, items);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      {/* Add new item */}
      <InputWithButton
        value={newItem}
        onChange={setNewItem}
        onAdd={handleAddItem}
        placeholder={placeholder}
        buttonText={buttonText}
      />

      {/* Item list */}
      <div className="space-y-2">
        {items.map((item) => (
          <DraggableItem
            key={item.id}
            id={item.id}
            name={item.name}
            moveItem={moveItem}
          />
        ))}
      </div>

      {/* Save button */}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleSave}
          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default ListManager;
