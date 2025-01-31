import { refreshAccessToken } from './refreshAccessToken';
import { access_token1, mockRefreshToken } from './testUtils';

vi.spyOn(global, 'fetch');

describe('refreshAccessToken', () => {
  it('should refresh access token', async () => {
    vi.mocked(fetch).mockResolvedValue(Response.json(mockRefreshToken()));

    await expect(refreshAccessToken(access_token1)).resolves.toEqual(
      mockRefreshToken(),
    );
  });

  it('should fail if could not fetch refresh token', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network Problem'));

    await expect(refreshAccessToken(access_token1)).rejects.toThrow(
      /^Could not fetch refresh access token$/,
    );
  });

  it('should fail if refresh token response status code is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response('something wrong', { status: 400 }),
    );

    await expect(refreshAccessToken(access_token1)).rejects.toThrow(
      /^Could not refresh access token, status: 400, text: something wrong$/,
    );
  });
});
