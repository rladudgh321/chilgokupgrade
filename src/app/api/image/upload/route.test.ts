
import { POST } from './route';
import { NextRequest } from 'next/server';
import { S3client, supabasePublicUrl, makeObjectKey } from '@/app/api/supabase/S3';

// S3 관련 함수들 모의(mock) 설정
jest.mock('@/app/api/supabase/S3', () => ({
  S3client: {
    send: jest.fn(),
  },
  supabasePublicUrl: jest.fn((bucket, key) => `http://mock.url/${bucket}/${key}`),
  makeObjectKey: jest.fn((filename, prefix) => `${prefix}/${filename}`),
  PUBLIC_BUCKET: 'test-bucket',
}));

describe('/api/image/upload API 라우트', () => {
  beforeEach(() => {
    // 각 테스트 전에 모의 함수 호출 기록을 초기화합니다.
    (S3client.send as jest.Mock).mockClear();
    (supabasePublicUrl as jest.Mock).mockClear();
    (makeObjectKey as jest.Mock).mockClear();
  });

  describe('POST 핸들러', () => {
    test('파일을 성공적으로 업로드해야 합니다.', async () => {
      // 모의 파일 생성
      const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);

      // S3client.send가 성공적으로 해결되도록 설정
      (S3client.send as jest.Mock).mockResolvedValue({});

      const req = new NextRequest('http://localhost', { 
        method: 'POST', 
        body: formData 
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.url).toBe('http://mock.url/test-bucket/main/test.jpg');
      expect(body.key).toBe('main/test.jpg');
      expect(S3client.send).toHaveBeenCalledTimes(1);
    });

    test('formData에 file 필드가 없으면 400 에러를 반환해야 합니다.', async () => {
      const formData = new FormData(); // 파일 없는 폼 데이터
      const req = new NextRequest('http://localhost', { 
        method: 'POST', 
        body: formData 
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe('file 필드가 필요합니다.');
      expect(S3client.send).not.toHaveBeenCalled();
    });

    test('S3 업로드 중 에러가 발생하면 500 에러를 반환해야 합니다.', async () => {
      const file = new File(['test content'], 'error.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);

      // S3client.send가 에러를 던지도록 설정
      const uploadError = new Error('S3 Upload Failed');
      (S3client.send as jest.Mock).mockRejectedValue(uploadError);

      const req = new NextRequest('http://localhost', { 
        method: 'POST', 
        body: formData 
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.message).toBe('S3 Upload Failed');
    });
  });
});
