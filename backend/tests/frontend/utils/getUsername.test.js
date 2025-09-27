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
  global.fetch = vi.fn();
})

afterEach(() => {
  vi.clearAllMocks();
})

describe('getUsername', () => {
  it('happy path', async () => {
    const mockResponse = {
      username: 'Luan'
    }

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
      }) 

    
    await expect(getUsername()).resolves.toBe('Luan')
    expect(getAccessToken).toHaveBeenCalled();
    expect(refreshToken).not.toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  })
})