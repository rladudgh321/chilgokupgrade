"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import DraggableItem from './DraggableItem';
import InputWithButton from './InputWithButton';

type ListManagerProps = {
  title: string;
  placeholder: string;
  buttonText: string;
  apiEndpoint?: string; // API 엔드포인트 추가
  enableImageUpload?: boolean; // 이미지 업로드 기능 활성화
};

const ListManager = ({ title, placeholder, buttonText, apiEndpoint='', enableImageUpload = false }: ListManagerProps) => {
  const [items, setItems] = useState<{ id: number; name: string; imageUrl?: string; imageName?: string }[]>([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSaveOrder = async (orderedItems: typeof items) => {
    try {
      // setLoading(true); // Optional: show loading indicator during save
      const orderedIds = orderedItems.map(item => item.id);
      const response = await fetch(`${apiEndpoint}/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderedIds }),
      });

      const result = await response.json();

      if (result.ok) {
        setError(null);
      } else {
        setError(result.error?.message || '순서 저장에 실패했습니다.');
        // Optionally revert to previous order
        // loadItems(); 
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
      // Optionally revert to previous order
      // loadItems();
    } finally {
      // setLoading(false);
    }
  };

  const debouncedSaveOrder = useCallback((orderedItems: typeof items) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      handleSaveOrder(orderedItems);
    }, 500); // 500ms delay
  }, [apiEndpoint]);


  // 데이터 로드
  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiEndpoint);
      const result = await response.json();
      
      if (result.ok) {
        // labels API: {id,name} / theme-images API: {id,label,imageUrl,imageName}
        type Row = { id: number; name?: string; label?: string; imageUrl?: string; imageName?: string };
        const rows: Row[] = Array.isArray(result.data) ? result.data : [];
        const normalized = rows.map((r: Row) => {
          if (r && typeof r === 'object' && 'label' in r) {
            return { id: r.id, name: r.label as string, imageUrl: r.imageUrl, imageName: r.imageName };
          }
          // name 기반 응답에서도 이미지 정보를 보존
          return { id: r.id, name: (r.name as string), imageUrl: r.imageUrl, imageName: r.imageName };
        });
        setItems(normalized);
        setError(null);
      } else {
        setError(result.error?.message || '데이터를 불러오는데 실패했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadItems();
  }, [apiEndpoint]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    try {
      setLoading(true);
      
      if (enableImageUpload && selectedFile) {
        // 이미지와 함께 업로드
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('label', newItem.trim());
        // 업로드 엔드포인트는 apiEndpoint 기준으로 동작
        const uploadUrl = `${apiEndpoint}/upload`;
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        
        if (result.ok) {
          // 업로드 성공 시 항목 생성 (apiEndpoint에 저장)
          const saveRes = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              label: newItem.trim(),
              imageUrl: result.data.imageUrl,
              imageName: result.data.imageName,
            }),
          });
          const saveJson = await saveRes.json();
          if (saveJson.ok) {
            setNewItem('');
            setSelectedFile(null);
            await loadItems();
            setError(null);
          } else {
            setError(saveJson.error?.message || '이미지 정보 저장에 실패했습니다.');
          }
        } else {
          setError(result.error?.message || '추가에 실패했습니다.');
        }
      } else {
        // 일반 라벨 추가
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ label: newItem.trim() }),
        });

        const result = await response.json();
        
        if (result.ok) {
          setNewItem('');
          await loadItems();
          setError(null);
        } else {
          setError(result.error?.message || '추가에 실패했습니다.');
        }
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
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
    debouncedSaveOrder(updatedItems);
  };

  const handleEditItem = async (oldName: string, newName: string) => {
    try {
      setLoading(true);
      const response = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiEndpoint === '/api/buy-types' ? { oldName: oldName, newName: newName } : { oldLabel: oldName, newLabel: newName }),
      });

      const result = await response.json();
      
      if (result.ok) {
        await loadItems(); // 데이터 다시 로드
        setError(null);
      } else {
        setError(result.error?.message || '수정에 실패했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: number, name: string) => {
    if (!confirm(`"${name}"을(를) 삭제하시겠습니까?`)) return;

    try {
      setLoading(true);
      const isBuyTypes = apiEndpoint === '/api/buy-types';
      const queryParam = isBuyTypes ? 'name' : 'label';
      const queryValue = isBuyTypes ? name : name;

      const response = await fetch(`${apiEndpoint}?${queryParam}=${encodeURIComponent(queryValue)}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.ok) {
        await loadItems(); // 데이터 다시 로드
        setError(null);
      } else {
        setError(result.error?.message || '삭제에 실패했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageEdit = async (id: number, newImageUrl: string, newImageName: string) => {
    try {
      setLoading(true);
      const response = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id, 
          imageUrl: newImageUrl, 
          imageName: newImageName 
        }),
      });

      const result = await response.json();
      
      if (result.ok) {
        await loadItems(); // 데이터 다시 로드
        setError(null);
      } else {
        setError(result.error?.message || '이미지 수정에 실패했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add new item */}
      <InputWithButton
        value={newItem}
        onChange={setNewItem}
        onAdd={handleAddItem}
        placeholder={placeholder}
        buttonText={buttonText}
        disabled={loading}
      />

      {/* Image upload section */}
      {enableImageUpload && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이미지 업로드
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={loading}
            />
            {selectedFile && (
              <span className="text-sm text-gray-600">
                선택됨: {selectedFile.name}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2">처리 중...</span>
        </div>
      )}

      {/* Item list */}
      <div className="space-y-2">
        {items.map((item) => (
          <DraggableItem
            key={item.id}
            id={item.id}
            name={item.name}
            imageUrl={item.imageUrl}
            imageName={item.imageName}
            moveItem={moveItem}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onImageEdit={enableImageUpload ? handleImageEdit : undefined}
            uploadEndpoint={enableImageUpload ? `${apiEndpoint}/upload` : undefined}
            disabled={loading}
          />
        ))}
      </div>

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          등록된 항목이 없습니다.
        </div>
      )}
    </div>
  );
};

export default ListManager;