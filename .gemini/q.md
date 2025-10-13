Error: Your project's URL and Key are required to create a Supabase client!

Check your Supabase project's API settings to find these values       

https://supabase.com/dashboard/project/_/settings/api
    at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
    at createServerClient (../../src/createServerClient.ts:139:11)    
    at createAuthClient (src\app\utils\supabase\auth-client.ts:16:38) 
    at POST (src\app\api\admin\logout\route.ts:5:50)
  14 |   });
  15 |
> 16 |   const supabase = createServerClient(supabaseUrl, supabaseKey, {
     |                                      ^
  17 |     cookies: {
  18 |       getAll() {
  19 |         return request.cookies.getAll();
 POST /api/admin/logout 500 in 578ms

 --------------------------------
 요청 URL
http://127.0.0.1:3000/api/admin/logout
요청 메서드
POST
상태 코드
500 Internal Server Error
원격 주소
127.0.0.1:3000
리퍼러 정책
strict-origin-when-cross-origin