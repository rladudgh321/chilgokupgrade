
import { GET, POST } from './route';
import { NextRequest } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

// Supabase 클라이언트 모의(mock) 설정
jest.mock('@/app/utils/supabase/server', () => ({
  createClient: jest.fn().mockImplementation(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      range: jest.fn().mockResolvedValue({ data: [], count: 0, error: null }),
      eq: jest.fn().mockReturnThis(),
    })),
  })),
}));

describe('/api/board/posts API 라우트', () => {


  // POST /api/board/posts
  describe('POST 핸들러', () => {
    test('유효한 데이터로 게시글을 성공적으로 생성해야 합니다.', async () => {
      const validPostData = {
        title: '새로운 게시글 제목',
        content: '게시글 내용입니다.',
        isPublished: true,
      };

      const req = new NextRequest('http://localhost/api/board/posts', {
        method: 'POST',
        body: JSON.stringify(validPostData),
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.message).toBe('게시글이 성공적으로 생성되었습니다');
      expect(body.data.title).toBe(validPostData.title);
    });

    test('유효성 검사에 실패하면 400 에러를 반환해야 합니다.', async () => {
      const invalidPostData = { content: '내용만 있고 제목은 없습니다.' }; // title is required

      const req = new NextRequest('http://localhost/api/board/posts', {
        method: 'POST',
        body: JSON.stringify(invalidPostData),
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe('입력 데이터가 올바르지 않습니다');
      expect(body.errors).toBeDefined();
    });

    test('데이터베이스 에러가 발생하면 500 에러를 반환해야 합니다.', async () => {
      const req = new NextRequest('http://localhost/api/board/posts', {
        method: 'POST',
        body: JSON.stringify({ title: '유효한 제목' }),
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.message).toBe('DB Insert Error');
    });
  });

  // GET /api/board/posts
  describe('GET 핸들러', () => {
    test('게시글 목록을 성공적으로 가져와야 합니다.', async () => {
      const { createClient } = require('@/app/utils/supabase/server');
      const mockPosts = [{ id: 1, title: '첫번째 글' }, { id: 2, title: '두번째 글' }];
      const rangeMock = jest.fn().mockResolvedValue({ data: mockPosts, error: null, count: 2 });
      const orderMock = jest.fn(() => ({ range: rangeMock }));
      const selectMock = jest.fn(() => ({ order: orderMock }));
      const fromMock = jest.fn(() => ({ select: selectMock }));
      (createClient as jest.Mock).mockReturnValue({ from: fromMock });

      const req = new NextRequest('http://localhost/api/board/posts?page=1&limit=10');
      const response = await GET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data).toEqual(mockPosts);
      expect(body.count).toBe(2);
      expect(fromMock).toHaveBeenCalledWith('BoardPost');
      expect(selectMock).toHaveBeenCalledWith('*' , { count: 'exact' });
      expect(rangeMock).toHaveBeenCalledWith(0, 9);
    });

    test('publishedOnly=true 쿼리가 있으면 공개된 게시글만 가져와야 합니다.', async () => {
      const { createClient } = require('@/app/utils/supabase/server');
      const rangeMock = jest.fn().mockResolvedValue({ data: [], error: null, count: 0 });
      const orderMock = jest.fn(() => ({ range: rangeMock }));
      const eqMock = jest.fn(() => ({ order: orderMock }));
      const selectMock = jest.fn(() => ({ order: orderMock, eq: eqMock }));
      const fromMock = jest.fn(() => ({ select: selectMock }));
      (createClient as jest.Mock).mockReturnValue({ from: fromMock });
      
      const req = new NextRequest('http://localhost/api/board/posts?publishedOnly=true');
      await GET(req);

      expect(eqMock).toHaveBeenCalledWith('isPublished', true);
    });

    test('데이터베이스 에러가 발생하면 500 에러를 반환해야 합니다.', async () => {
      const { createClient } = require('@/app/utils/supabase/server');
      const rangeMock = jest.fn().mockResolvedValue({ data: null, error: { message: 'DB Select Error' }, count: 0 });
      const orderMock = jest.fn(() => ({ range: rangeMock }));
      const selectMock = jest.fn(() => ({ order: orderMock }));
      const fromMock = jest.fn(() => ({ select: selectMock }));
      (createClient as jest.Mock).mockReturnValue({ from: fromMock });

      const req = new NextRequest('http://localhost/api/board/posts');
      const response = await GET(req);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.message).toBe('DB Select Error');
    });
  });
});
