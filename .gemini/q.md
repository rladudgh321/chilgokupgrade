`/api/inquiries/orders/routes.ts`에서 `"error":"Error creating order"` 오류가 났어.
http://127.0.0.1:3000/api/inquiries/orders
요청 메서드
POST
상태 코드
500 Internal Server Error
원격 주소
127.0.0.1:3000
리퍼러 정책
strict-origin-when-cross-origin

--------------
{
  code: '23502',
  details: 'Failing row contains (10, f, 구해요, 월세, 이도령, 신축빌라, 3억 오천, 01012345678, ::ffff:127.0.0.1, 좋아요군, ㅎㅎㅎ, ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ, null, 2025-10-20 13:39:54.078, null).',
  hint: null,
  message: 'null value in column "updatedAt" of relation "Order" violates not-null constraint'
}