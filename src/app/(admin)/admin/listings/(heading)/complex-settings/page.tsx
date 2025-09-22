"use client"

import { useState } from 'react';

type Unit = {
  id: number;
  name: string;
  region: string;
  category: string;
  registrationDate: string;
  notes: string;
};

const ComplexSettings = () => {
  const [units, setUnits] = useState<Unit[]>([
    { id: 1, name: '단지 1', region: '서울', category: '주거', registrationDate: '2023-01-01', notes: '비고 1' },
    { id: 2, name: '단지 2', region: '경기', category: '상업', registrationDate: '2023-02-01', notes: '비고 2' },
    { id: 3, name: '단지 3', region: '인천', category: '주거', registrationDate: '2023-03-01', notes: '비고 3' },
  ]);

  const [selectedUnits, setSelectedUnits] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUnits(units.map(unit => unit.id)); // 모든 항목 선택
    } else {
      setSelectedUnits([]); // 모든 항목 해제
    }
  };

  const handleSelectUnit = (unitId: number) => {
    setSelectedUnits(prev => {
      if (prev.includes(unitId)) {
        return prev.filter(id => id !== unitId); // 이미 선택된 항목은 해제
      } else {
        return [...prev, unitId]; // 선택되지 않은 항목은 추가
      }
    });
  };

  const handleDeleteSelected = () => {
    const isConfirmed = window.confirm("선택한 단지를 삭제하시겠습니까?");
    if (isConfirmed) {
      setUnits(prev => prev.filter(unit => !selectedUnits.includes(unit.id)));
      setSelectedUnits([]); // 삭제 후 선택 해제
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddUnit = () => {
    const newUnit = {
      id: units.length + 1,
      name: `단지 ${units.length + 1}`,
      region: '지역',
      category: '카테고리',
      registrationDate: '2023-01-01',
      notes: '비고',
    };
    setUnits([...units, newUnit]);
  };

  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">단지 관리</h1>

      {/* 검색 입력 */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="단지명을 검색하세요"
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded-md mr-4 w-1/3"
        />
        <button
          onClick={handleAddUnit}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          단지 추가
        </button>
      </div>

      {/* 테이블 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="font-semibold">{filteredUnits.length} 개 단지</span>
        </div>
        <div>
          <button
            onClick={handleDeleteSelected}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            선택 삭제
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">
              <input
                type="checkbox"
                checked={selectedUnits.length === filteredUnits.length}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-4 py-2">단지 번호</th>
            <th className="px-4 py-2">단지명</th>
            <th className="px-4 py-2">지역</th>
            <th className="px-4 py-2">분류</th>
            <th className="px-4 py-2">등록일</th>
            <th className="px-4 py-2">비고</th>
            <th className="px-4 py-2">작업</th>
          </tr>
        </thead>
        <tbody>
          {filteredUnits.map((unit) => (
            <tr key={unit.id} className="border-b hover:bg-gray-50 text-center">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedUnits.includes(unit.id)}
                  onChange={() => handleSelectUnit(unit.id)}
                />
              </td>
              <td className="px-4 py-2">{unit.id}</td>
              <td className="px-4 py-2">{unit.name}</td>
              <td className="px-4 py-2">{unit.region}</td>
              <td className="px-4 py-2">{unit.category}</td>
              <td className="px-4 py-2">{unit.registrationDate}</td>
              <td className="px-4 py-2">{unit.notes}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => alert(`수정 기능 (단지 ID: ${unit.id})`)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 mr-2"
                >
                  수정
                </button>
                <button
                  onClick={() => {
                    const isConfirmed = window.confirm("정말로 이 단지를 삭제하시겠습니까?");
                    if (isConfirmed) {
                      setUnits(units.filter(u => u.id !== unit.id));
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplexSettings;
