import { GET } from './route';
import { createClient } from '@/app/utils/supabase/server';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const mockSupabase = createClient(cookies());

describe('GET /api/board/posts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch posts with default pagination', async () => {
    const req = new NextRequest('http://localhost/api/board/posts');
    (mockSupabase.range as jest.Mock).mockResolvedValueOnce({ data: [{ id: 1, title: 'Test Post' }], error: null, count: 1 });

    const response = await GET(req);
    const { data, count } = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(count).toBe(1);
    expect(mockSupabase.from).toHaveBeenCalledWith('BoardPost');
    expect(mockSupabase.select).toHaveBeenCalledWith('*' , { count: 'exact' });
    expect(mockSupabase.range).toHaveBeenCalledWith(0, 9);
  });

  it('should fetch posts with custom pagination', async () => {
    const req = new NextRequest('http://localhost/api/board/posts?page=2&limit=20');
    (mockSupabase.range as jest.Mock).mockResolvedValueOnce({ data: [], error: null, count: 0 });

    await GET(req);

    expect(mockSupabase.range).toHaveBeenCalledWith(20, 39);
  });

  it('should handle errors', async () => {
    const req = new NextRequest('http://localhost/api/board/posts');
    (mockSupabase.range as jest.Mock).mockResolvedValueOnce({ data: null, error: { message: 'Test Error' } });

    const response = await GET(req);
    const { message } = await response.json();

    expect(response.status).toBe(500);
    expect(message).toBe('Test Error');
  });
});