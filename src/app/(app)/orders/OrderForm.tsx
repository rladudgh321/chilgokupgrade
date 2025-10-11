'use client';

import { useState, useEffect } from 'react';

type PropertyType = {
  id: number;
  name: string;
};

type BuyType = {
  id: number;
  name: string;
};

interface OrderFormProps {
  propertyTypes: PropertyType[];
  buyTypes: BuyType[];
}

const OrderForm = ({ propertyTypes, buyTypes }: OrderFormProps) => {
  const [isBanned, setIsBanned] = useState(false);
  const [formData, setFormData] = useState({
    category: '구해요',
    author: '',
    contact: '',
    region: '',
    estimatedAmount: '',
    propertyType: '',
    transactionType: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    const checkIpStatus = async () => {
      try {
        const res = await fetch('/api/ip-status');
        const data = await res.json();
        if (data.isBanned) {
          setIsBanned(true);
        }
      } catch (error) {
        console.error("Could not verify IP status:", error);
      }
    };
    checkIpStatus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBanned) {
      alert('귀하는 양식 제출이 제한되었습니다.');
      return;
    }
    try {
      const response = await fetch('/api/inquiries/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('의뢰가 성공적으로 접수되었습니다.');
        // Reset form
        setFormData({
          category: '구해요',
          author: '',
          contact: '',
          region: '',
          estimatedAmount: '',
          propertyType: '',
          transactionType: '',
          title: '',
          description: '',
        });
      } else {
        const errorData = await response.json();
        alert(`의뢰 접수에 실패했습니다: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to submit order', error);
      alert('의뢰 접수 중 오류가 발생했습니다.');
    }
  };

  if (isBanned) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-red-600">접근 제한</h2>
        <p className="text-gray-700 mt-4">귀하의 IP 주소에서는 이 양식을 제출할 수 없습니다.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
      {/* Form fields... */}
      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">구분</label>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="구해요"
              checked={formData.category === '구해요'}
              onChange={handleChange}
              className="mr-2"
            />
            구해요
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="팔아요"
              checked={formData.category === '팔아요'}
              onChange={handleChange}
              className="mr-2"
            />
            팔아요
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="기타"
              checked={formData.category === '기타'}
              onChange={handleChange}
              className="mr-2"
            />
            기타
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="author" className="block text-gray-700 font-bold mb-2">작성자</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="contact" className="block text-gray-700 font-bold mb-2">연락처</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="'-' 없이 숫자만 입력"
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="region" className="block text-gray-700 font-bold mb-2">의뢰 지역</label>
        <input
          type="text"
          id="region"
          name="region"
          value={formData.region}
          onChange={handleChange}
          className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="예: 칠곡군 석적읍"
          required
                  />
                </div>
        
                <div className="mb-6">
                  <label htmlFor="estimatedAmount" className="block text-gray-700 font-bold mb-2">희망 금액</label>
                  <input
                    type="text"
                    id="estimatedAmount"
                    name="estimatedAmount"
                    value={formData.estimatedAmount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 3억 5천만원"
                    required
                  />
                </div>
        
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">        <div>
          <label htmlFor="propertyType" className="block text-gray-700 font-bold mb-2">매물 종류</label>
          <select
            id="propertyType"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>선택하세요</option>
            {propertyTypes.map((type) => (
              <option key={type.id} value={type.name}>{type.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="transactionType" className="block text-gray-700 font-bold mb-2">거래 유형</label>
          <select
            id="transactionType"
            name="transactionType"
            value={formData.transactionType}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>선택하세요</option>
            {buyTypes.map((type) => (
              <option key={type.id} value={type.name}>{type.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">제목</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">상세 내용</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        ></textarea>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          disabled={isBanned}
        >
          의뢰하기
        </button>
      </div>
    </form>
  );
};

export default OrderForm;