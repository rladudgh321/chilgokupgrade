
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
  }),
  headers: () => ({
    get: jest.fn(),
  }),
}));
