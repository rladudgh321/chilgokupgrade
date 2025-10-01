
import { Prisma } from '@prisma/client';
import { POST } from '../route';
import { NextRequest } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import prisma from '@/lib/prisma';

// Supabase 클라이언트 모킹
jest.mock('@/app/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

// Prisma 클라이언트 모킹
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    $executeRaw: jest.fn(),
  },
}));

// next/headers 모킹
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

describe('/api/views/[id] API', () => {
  let supabaseClient: any;
  const mockGetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    supabaseClient = {
      auth: {
        getUser: mockGetUser,
      },
    };
    (createClient as jest.Mock).mockReturnValue(supabaseClient);
  });

  describe('POST /api/views/[id]', () => {
    it('성공: 인증된 사용자가 게시물 ID를 전송하면 조회수를 1 증가시켜야 합니다.', async () => {
      // given
      const postId = '123';
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
      (prisma.$executeRaw as jest.Mock).mockResolvedValue(1);

      const request = new NextRequest(`http://localhost/api/views/${postId}`, {
        method: 'POST',
      });

      // when
      const response = await POST(request, { params: { id: postId } });
      const responseBody = await response.json();

      // then
      expect(response.status).toBe(200);
      expect(responseBody.ok).toBe(true);
      expect(responseBody.message).toBe('조회수가 1 증가했습니다.');
      expect(supabaseClient.auth.getUser).toHaveBeenCalledTimes(1);
      expect(prisma.$executeRaw).toHaveBeenCalledWith(Prisma.raw`SELECT increment_post_views(${postId})`);
    });

    it('실패: 게시물 ID가 누락되면 400 상태 코드와 에러 메시지를 반환해야 합니다.', async () => {
        // given
        const request = new NextRequest('http://localhost/api/views/', { // ID 없음
          method: 'POST',
        });
  
        // when
        const response = await POST(request, { params: { id: '' } }); // 빈 ID
        const responseBody = await response.json();
  
        // then
        expect(response.status).toBe(400);
        expect(responseBody.ok).toBe(false);
        expect(responseBody.error.message).toBe('ID가 누락되었습니다.');
      });

    it('실패: 사용자가 인증되지 않은 경우 401 상태 코드와 에러 메시지를 반환해야 합니다.', async () => {
      // given
      const postId = '123';
      mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Unauthorized' } });

      const request = new NextRequest(`http://localhost/api/views/${postId}`, {
        method: 'POST',
      });

      // when
      const response = await POST(request, { params: { id: postId } });
      const responseBody = await response.json();

      // then
      expect(response.status).toBe(401);
      expect(responseBody.ok).toBe(false);
      expect(responseBody.error.message).toBe('인증되지 않은 사용자입니다.');
    });

    it('실패: 데이터베이스 함수 실행 중 오류가 발생하면 500 상태 코드를 반환해야 합니다.', async () => {
        // given
        const postId = '123';
        const dbError = new Error('DB function error');
        mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
        (prisma.$executeRaw as jest.Mock).mockRejectedValue(dbError);
  
        const request = new NextRequest(`http://localhost/api/views/${postId}`, {
          method: 'POST',
        });
  
        // when
        const response = await POST(request, { params: { id: postId } });
        const responseBody = await response.json();
  
        // then
        expect(response.status).toBe(500);
        expect(responseBody.ok).toBe(false);
        expect(responseBody.error.message).toBe(dbError.message);
      });
  });
});
