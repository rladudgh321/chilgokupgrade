`/admin/inquiries/contact-requests`페이지와
`/admin/inquiries/orders` 페이지에서 IP주소 항목이 있는데 그 아래에 버튼을 만들어서, IP주소에 해당되는 컴퓨터를 차단시켜서 더이상의 POST요청을 못 하도록 api를 구현해줘.
그리고 버튼을 누를 때 `전부 삭제`, 해당 `항목 삭제`, `차단 취소` 항목을 만들어서 각각의 기능에 따라 supabase로 처리해줘.

그리고 차단했으면 차단한 사람의 최근일자를 `등록일`과 `차단 IP주소`와 `연락처`와 `상세내용`을 `BanPage`에 디자인을 `/admin/inquiries/contact-requests` 페이지를 참고하여 만들어줘

------------
너가 작성해준 것 중에서 prisma api가 있다면 supabase로 수정해줬으면 좋겠어