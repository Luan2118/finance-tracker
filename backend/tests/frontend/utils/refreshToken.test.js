import {describe, it, expect, beforeEach, vi} from 'vitest';
import refreshToken from '../../../../frontend/script/utils/refreshToken';


beforeEach(() => {
  global.fetch = vi.fn();
  vi.clearAllMocks();
})

describe('refreshToken', () => {
  it('happy path', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => Promise.resolve({accessToken: 'FAKE_REFRESH_TOKEN'})
    })


    await expect(refreshToken()).resolves.toBe('FAKE_REFRESH_TOKEN');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('response status is false, throw error', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500
    })

    await expect(refreshToken()).rejects.toThrow('failed to fetch refresh token');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  })
})