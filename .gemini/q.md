Could not find the 'isAnnouncement' column of 'BoardPost' in the schema cache

src/app/(admin)/admin/board/admin-board/components/AdminBoardForm.tsx (104:15) @ AdminBoardForm.useMutation[postMutation] [as mutationFn]


  102 |       const result = await response.json();
  103 |       if (!response.ok) {
> 104 |         throw new Error(result.message || `게시글 ${isEdit ? '수정' : '저장'}에 실패했습니다`);
      |               ^
  105 |       }
  106 |       return result;
  107 |     },
Call Stack
1

AdminBoardForm.useMutation[postMutation] [as mutationFn]
src/app/(admin)/admin/board/admin-board/components/AdminBoardForm.tsx (104:15)