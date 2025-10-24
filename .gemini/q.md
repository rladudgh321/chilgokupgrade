<Controller
      control={control}
      name={name}
      render={({ field }) =>
        isDatePicker ? (
          <DatePicker
            id={name}
            /* 폼 값이 string | Date | null 이어도 안전하게 선택값 계산 */
            selected={(() => {
              const val = field.value;

              // 값이 없으면 null 반환
              if (!val) return null;

              // Date 객체로 변환
              if (val instanceof Date) {
                return val;
              }

              // 문자열 값이 있을 때
              if (typeof val === 'string') {
                const parts = val.split('-').map(Number);

                if (parts.length === 3) {
                  // Date 객체로 변환하고, 시간을 00:00으로 설정
                  const date = new Date(parts[0], parts[1] - 1, parts[2]);
                  date.setHours(0, 0, 0, 0); // 시간은 00:00:00으로 설정

                  return date;
                }
              }

              return new Date(val); // 기본적으로 Date 처리
            })()}
            onChange={(date: Date | null) => field.onChange(date)}
            placeholderText={placeholder || "날짜 선택"}
            dateFormat="yyyy/MM/dd"
            locale={ko}
            showYearDropdown
            showMonthDropdown
            scrollableYearDropdown
            className={clsx(
              "mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
              className
            )}
          />

          ---------
          위의 코드와 같이 작성을 하면, date-picker로 9월 2일로 누르면 브라우저에서
          9월 1일 15시간으로 되어 있더라고, 9월 2일 00시 00분으로 맞춰지길 바래.