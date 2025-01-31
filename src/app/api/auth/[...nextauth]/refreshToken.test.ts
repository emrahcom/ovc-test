import { attemptRefreshToken } from './refreshToken';
import { mockRefreshToken } from './testUtils';

describe('attemptRefreshToken', () => {
  it('should accept a valid refresh token', () => {
    expect(attemptRefreshToken(mockRefreshToken())).toEqual(mockRefreshToken());
  });

  it('should accept a valid refresh token with undefined id_token', () => {
    expect(
      attemptRefreshToken(mockRefreshToken({ id_token: undefined })),
    ).toEqual(mockRefreshToken({ id_token: undefined }));
  });

  it('should strip additional properties for refresh token', () => {
    const refreshToken = {
      ...mockRefreshToken(),
      other: 'key',
    };
    expect(attemptRefreshToken(refreshToken)).toEqual(mockRefreshToken());
  });

  it.each([null, undefined])('should reject a token %j', (data) => {
    expect(() => attemptRefreshToken(data)).toThrow();
  });

  it.each([
    { access_token: 111 },
    { access_token: undefined },
    { access_token: null },
    { access_token: '' },
    { id_token: 111 },
    { id_token: null },
    { id_token: '' },
    { refresh_token: 111 },
    { refresh_token: undefined },
    { refresh_token: null },
    { refresh_token: '' },
    { expires_in: undefined },
    { expires_in: null },
    { expires_in: '' },
    { expires_in: '123' },
  ])('should reject a refresh token with patch %j', (patch) => {
    const token = {
      ...mockRefreshToken(),
      ...patch,
    };
    expect(() => attemptRefreshToken(token)).toThrow();
  });
});
