"use client"

import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

type DraggableItemProps = {
  id: number;
  name: string;
  imageUrl?: string;
  imageName?: string;
  moveItem: (draggedId: number, hoveredId: number) => void;
  onEdit?: (oldName: string, newName: string) => void;
  onDelete?: (name: string) => void;
  onImageEdit?: (id: number, newImageUrl: string, newImageName: string) => void;
  disabled?: boolean;
  uploadEndpoint?: string;
};

const DraggableItem = ({ id, name, imageUrl, imageName, moveItem, onEdit, onDelete, onImageEdit, disabled = false, uploadEndpoint }: DraggableItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const [, drag] = useDrag({
    type: 'item',
    item: { id },
    canDrag: !disabled && !isEditing,
  });

  const [, drop] = useDrop({
    accept: 'item',
    drop: (item: { id: number }) => {
      if (item.id !== id && !disabled && !isEditing) {
        moveItem(item.id, id);
        item.id = id;
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

  const handleEdit = () => {
    if (isEditing) {
      if (editValue.trim() && editValue.trim() !== name && onEdit) {
        onEdit(name, editValue.trim());
      }
      setIsEditing(false);
    } else {
      setEditValue(name);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditValue(name);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleImageEdit = async () => {
    if (!selectedImageFile || !onImageEdit || !uploadEndpoint) return;

    try {
      const formData = new FormData();
      formData.append('file', selectedImageFile);
      formData.append('label', name);
      const response = await fetch(uploadEndpoint, { method: 'POST', body: formData });
      const result = await response.json();
      if (result.ok) {
        onImageEdit(id, result.data.imageUrl, result.data.imageName);
        setIsImageEditing(false);
        setSelectedImageFile(null);
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    }
  };

  const handleImageCancel = () => {
    setIsImageEditing(false);
    setSelectedImageFile(null);
  };

  return (
    <div
      ref={ref}
      className={`p-4 mb-2 border rounded-lg transition-all ${
        disabled ? 'bg-gray-50 opacity-50' : 'bg-gray-100 hover:bg-gray-200'
      } ${isEditing ? 'bg-blue-50 border-blue-300' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* 이미지 표시 */}
          {imageUrl && (
            <div className="w-16 h-16 flex-shrink-0">
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover rounded border"
              />
            </div>
          )}
          
          {/* 텍스트 편집 */}
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <span className="text-lg font-medium">{name}</span>
            )}
            
            {/* 이미지 편집 섹션 */}
            {isImageEditing && (
              <div className="mt-2 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImageFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
                />
                {selectedImageFile && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleImageEdit}
                      disabled={disabled}
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50"
                    >
                      이미지 저장
                    </button>
                    <button
                      onClick={handleImageCancel}
                      disabled={disabled}
                      className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50"
                    >
                      취소
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          {isEditing ? (
            <>
              <button
                onClick={handleEdit}
                disabled={disabled}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
              >
                저장
              </button>
              <button
                onClick={handleCancel}
                disabled={disabled}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 disabled:opacity-50"
              >
                취소
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                disabled={disabled}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                수정
              </button>
              {onImageEdit && (
                <button
                  onClick={() => setIsImageEditing(!isImageEditing)}
                  disabled={disabled}
                  className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 disabled:opacity-50"
                >
                  이미지 {isImageEditing ? '취소' : (imageUrl ? '변경' : '추가')}
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(name)}
                  disabled={disabled}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
                >
                  삭제
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraggableItem;
