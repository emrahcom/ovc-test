import { attemptSessionToken } from './sessionToken';
import { mockSessionToken } from './testUtils';

describe('attemptSessionToken', () => {
  it('should accept a valid session token', () => {
    expect(attemptSessionToken(mockSessionToken())).toEqual(mockSessionToken());
  });

  it('should strip additional properties from session token', () => {
    const sessionToken = {
      ...mockSessionToken(),
      other: 'key',
    };
    expect(attemptSessionToken(sessionToken)).toEqual(mockSessionToken());
  });

  it.each([null, undefined])('should reject a session token %j', (data) => {
    expect(() => attemptSessionToken(data)).toThrow();
  });

  it.each([
    { name: 111 },
    { name: undefined },
    { name: null },
    { email: 111 },
    { email: undefined },
    { email: null },
    { decoded: 111 },
    { decoded: undefined },
    { decoded: null },
    { access_token: 111 },
    { access_token: undefined },
    { access_token: null },
    { id_token: 111 },
    { id_token: undefined },
    { id_token: null },
    { expires_at: 'one' },
    { expires_at: '111' },
    { expires_at: undefined },
    { expires_at: null },
    { refresh_token: 111 },
    { refresh_token: undefined },
    { refresh_token: null },
    { refresh_token_expired: 'ok' },
    { refresh_token_expired: null },
  ])('should reject a session token with patch %j', (patch) => {
    const sessionToken = {
      ...mockSessionToken(),
      ...patch,
    };
    expect(() => attemptSessionToken(sessionToken)).toThrow();
  });
});
