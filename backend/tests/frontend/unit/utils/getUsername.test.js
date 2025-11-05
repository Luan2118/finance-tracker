import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';

beforeEach(() => {
  vi.clearAllMocks();
  delete global.fetch;
})

vi.mock('../../../../../frontend/script/utils/getAccessToken.js', () => {
  return {
    default: vi.fn().mockReturnValue('FAKE_ACCESS_TOKEN')
  }
});

vi.mock('../../../../../frontend/script/utils/refreshToken.js', () => {
  return{
    default: vi.fn().mockResolvedValue('FAKE_REFRESH_TOKEN')
  }
});

import getUsername from '../../../../../frontend/script/utils/getUsername.js';
import getAccessToken from '../../../../../frontend/script/utils/getAccessToken.js';
import refreshToken from '../../../../../frontend/script/utils/refreshToken.js';

describe('getUsername', () => {
  it('should return username when access token is valid', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({username: 'testuser'})
    })

    const username =  await getUsername();

    expect(username).toBe('testuser');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1, 'http://localhost:3000/login/user',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer FAKE_ACCESS_TOKEN'
        }
    }));
    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(refreshToken).not.toHaveBeenCalled();
  });

  it('should return username after 401 success fetch', async () => {
    global.fetch = vi.fn()
    .mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({username: 'testuser'})
    })
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({username: 'testuser'})
    })

    const username = await getUsername();

    expect(username).toBe('testuser');
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1, 'http://localhost:3000/login/user',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer FAKE_ACCESS_TOKEN'
        }
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2, 'http://localhost:3000/login/user',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer FAKE_REFRESH_TOKEN'
        }
      })
    )
    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(refreshToken).toHaveBeenCalledTimes(1);
  });

  it('should throw error when fetch fails after 401', async () => {

    global.fetch = vi.fn()
    .mockResolvedValueOnce({ok: false,status: 401})
    .mockRejectedValueOnce(new Error('failed to get username'));

    await expect(getUsername()).rejects.toThrow('failed to get username');
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1, 'http://localhost:3000/login/user',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer FAKE_ACCESS_TOKEN'
        }
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2, 'http://localhost:3000/login/user',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer FAKE_REFRESH_TOKEN'
        }
      })
    )
    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(refreshToken).toHaveBeenCalledTimes(1);

  });

  it('throw network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network error'));

    await expect(getUsername()).rejects.toThrow('network error');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(refreshToken).not.toHaveBeenCalled();
    expect(global.fetch).toHaveBeenNthCalledWith(
      1, 'http://localhost:3000/login/user',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer FAKE_ACCESS_TOKEN'
        }
      })
    );
  })
});