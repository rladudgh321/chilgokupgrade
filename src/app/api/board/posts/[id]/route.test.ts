
import { PUT, DELETE } from './route';
import { NextRequest } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

// Supabase 클라이언트 모의(mock) 설정
jest.mock('@/app/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

describe('/api/board/posts/[id] API 라우트', () => {
  let fromMock: any;
  let updateMock: any;
  let deleteMock: any;
  let eqMock: any;
  let selectMock: any;
  let singleMock: any;

  beforeEach(() => {
    singleMock = jest.fn();
    selectMock = jest.fn(() => ({ single: singleMock }));
    eqMock = jest.fn(() => ({ select: selectMock }));
    updateMock = jest.fn(() => ({ eq: eqMock }));
    deleteMock = jest.fn(() => ({ eq: jest.fn() })); // DELETE는 보통 반환값이 중요하지 않음

    fromMock = jest.fn(() => ({
      update: updateMock,
      delete: deleteMock,
    }));

    (createClient as jest.Mock).mockReturnValue({ from: fromMock });
  });

  // PUT /api/board/posts/[id]
  describe('PUT 핸들러', () => {
    const postId = '1';
    const validUpdateData = { title: '수정된 제목', content: '수정된 내용' };

    test('유효한 데이터로 게시글을 성공적으로 수정해야 합니다.', async () => {
      singleMock.mockResolvedValue({ data: { id: postId, ...validUpdateData }, error: null });

      const req = new NextRequest(`http://localhost/api/board/posts/${postId}`,
        {
          method: 'PUT',
          body: JSON.stringify(validUpdateData),
        }
      );

      const response = await PUT(req, { params: { id: postId } });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.message).toBe('게시글이 성공적으로 수정되었습니다');
      expect(body.data.title).toBe(validUpdateData.title);
      expect(fromMock).toHaveBeenCalledWith('BoardPost');
      expect(updateMock).toHaveBeenCalledWith(expect.objectContaining(validUpdateData));
      expect(eqMock).toHaveBeenCalledWith('id', postId);
    });

    test('유효성 검사에 실패하면 400 에러를 반환해야 합니다.', async () => {
      const invalidUpdateData = { title: '' }; // Title cannot be empty

      const req = new NextRequest(`http://localhost/api/board/posts/${postId}`,
        {
          method: 'PUT',
          body: JSON.stringify(invalidUpdateData),
        }
      );

      const response = await PUT(req, { params: { id: postId } });
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe('입력 데이터가 올바르지 않습니다');
    });

    test('데이터베이스 업데이트 중 에러가 발생하면 500 에러를 반환해야 합니다.', async () => {
      singleMock.mockResolvedValue({ data: null, error: { message: 'DB Update Error' } });

      const req = new NextRequest(`http://localhost/api/board/posts/${postId}`,
        {
          method: 'PUT',
          body: JSON.stringify(validUpdateData),
        }
      );

      const response = await PUT(req, { params: { id: postId } });
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.message).toBe('DB Update Error');
    });
  });

  // DELETE /api/board/posts/[id]
  describe('DELETE 핸들러', () => {
    const postId = '1';

    test('게시글을 성공적으로 삭제해야 합니다.', async () => {
      // DELETE의 eq 모의 함수를 성공 케이스로 설정
      const deleteEqMock = jest.fn().mockResolvedValue({ error: null });
      deleteMock.mockImplementation(() => ({ eq: deleteEqMock }));

      const req = new NextRequest(`http://localhost/api/board/posts/${postId}`, { method: 'DELETE' });
      const response = await DELETE(req, { params: { id: postId } });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.message).toBe('게시글이 성공적으로 삭제되었습니다');
      expect(fromMock).toHaveBeenCalledWith('BoardPost');
      expect(deleteMock).toHaveBeenCalled();
      expect(deleteEqMock).toHaveBeenCalledWith('id', postId);
    });

    test('데이터베이스 삭제 중 에러가 발생하면 500 에러를 반환해야 합니다.', async () => {
      // DELETE의 eq 모의 함수를 에러 케이스로 설정
      const deleteEqMock = jest.fn().mockResolvedValue({ error: { message: 'DB Delete Error' } });
      deleteMock.mockImplementation(() => ({ eq: deleteEqMock }));

      const req = new NextRequest(`http://localhost/api/board/posts/${postId}`, { method: 'DELETE' });
      const response = await DELETE(req, { params: { id: postId } });
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.message).toBe('DB Delete Error');
    });
  });
});
