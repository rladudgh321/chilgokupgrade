`/admin/listings/listings/[id]/edit`페이지에서 
Request URL
http://127.0.0.1:3000/api/supabase/build/172
Request Method
PATCH
Status Code
200 OK
Remote Address
127.0.0.1:3000
Referrer Policy
strict-origin-when-cross-origin


buildingOptions
: 
{set: [{id: 1}, {id: 2}, {id: 3}]}

------
Request URL
http://127.0.0.1:3000/api/supabase/build/172
Request Method
GET
Status Code
200 OK
Remote Address
127.0.0.1:3000
Referrer Policy
strict-origin-when-cross-origin

` "buildingOptions": [],` 
-------------
PATCH로 저렇게 데이터를 보내도 GET으로 가지고 올 때는 빈배열을 가지고 오더라고 코드를 수정해줘