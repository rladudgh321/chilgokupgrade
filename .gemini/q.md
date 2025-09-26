  <select
    value={propertyType}
    onChange={(e) => setPropertyType(e.target.value)}
    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">매물 종류</option>
    {(propertyTypeOptions && propertyTypeOptions.length > 0
      && propertyTypeOptions || []
    ).map((opt) => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>

위와 같은 코드가 landSearch/SearchBar.tsx에 있는 것인데, 나는 ListingType모델에 있는 데이터로 바꾸고 싶어