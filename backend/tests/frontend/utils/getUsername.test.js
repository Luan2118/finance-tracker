import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import getUsername from '../../../../frontend/script/utils/getUsername';
import refreshToken from '../../../../frontend/script/utils/refreshToken';
import getAccessToken from '../../../../frontend/script/utils/getAccessToken';



vi.mock('../../../../frontend/script/utils/getAccessToken', () => {
  return {
    default: vi.fn().mockReturnValue('FAKE_ACCESS_TOKEN')
  }
})


vi.mock('../../../../frontend/script/utils/refreshToken', () => {
  return {
    default: vi.fn().mockResolvedValue('FAKE_REFRESH_TOKEN')
  }
})

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn();
  sessionStorage.clear();
})


const mockResponse = {
  username: 'Luan'
}

describe('getUsername', () => {
  it('happy path', async () => {

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
      }) 

    
    await expect(getUsername()).resolves.toBe('Luan');
    expect(getAccessToken).toHaveBeenCalled();
    expect(refreshToken).not.toHaveBeenCalled();

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('uses refresh token after 401 response', async () => {
    global.fetch
    .mockResolvedValueOnce({
      ok:false,
      status: 401,
      json: () => Promise.resolve(mockResponse),
    })

    .mockResolvedValueOnce({
      ok:true,
      status: 200,
      json: () => Promise.resolve(mockResponse)
    })
    
    const name = await getUsername();

    expect(name).toBe('Luan')
    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem('accessToken')).toBe('FAKE_REFRESH_TOKEN');
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      expect.any(String),
      expect.objectContaining({
        headers:{Authorization: 'Bearer FAKE_ACCESS_TOKEN'}
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      expect.any(String),
      expect.objectContaining({
        headers:{Authorization: 'Bearer FAKE_REFRESH_TOKEN'}
      })
    );
  });

  it('throw error after 401 response', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 401
    })

    await expect(getUsername()).rejects.toThrow('failed to get username');
    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(getAccessToken).toHaveBeenCalledTimes(1)
  });

  it('throw error on 500 error; refresh token not called', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500
    })

    await expect(getUsername()).rejects.toThrow('failed to get username');
    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(refreshToken).not.toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  })
})