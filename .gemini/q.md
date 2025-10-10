<div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <div className="border border-gray-300 rounded-lg">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center gap-2 flex-wrap">
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">소스</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">↶</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">↷</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">🔍</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50 font-bold">B</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50 italic">I</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50 underline">U</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">⬅</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">⬆</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">➡</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">⬇</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">🔗</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">🖼</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">📊</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">😊</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">🎥</button>
                <select className="px-2 py-1 text-sm bg-white border rounded">
                  <option>크기</option>
                </select>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">A-</button>
                <button type="button" className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50">A+</button>
              </div>
              
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full h-64 p-4 border-0 resize-none focus:outline-none"
                placeholder="내용을 입력하세요..."
              />
            </div>
          </div>
          -----------
          AdminBoardForm컴포넌트에서 에디터의 기능 부분을 디스플레이 취지에 맞게 기능을 넣어줘