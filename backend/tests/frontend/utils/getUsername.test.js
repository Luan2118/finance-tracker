import {describe, it, expect, vi} from 'vitest';
import getUsername from '../../../../frontend/script/utils/getUsername';


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

afterEach(() => {
  vi.clearAllMocks();
})

describe('getUsername', () => {
  it('happy path', async () => {
    const mockResponse = {
      username: 'Luan'
    }

    global.fetch = vi.fn(() => {
     return  Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse)
      })
    })

    expect(await getUsername()).toBe('Luan')

  })
})