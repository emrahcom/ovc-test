import { attemptAccount } from './account';
import { mockAccount } from './testUtils';

describe('attemptAccount', () => {
  it('should accept a valid account', () => {
    expect(attemptAccount(mockAccount())).toEqual(mockAccount());
  });

  it('should strip additional properties for account', () => {
    const account = {
      provider: 'keycloak',
      type: 'oauth',
      ...mockAccount(),
    };
    expect(attemptAccount(account)).toEqual(mockAccount());
  });

  it.each([null, undefined])('should reject an account %j', (data) => {
    expect(() => attemptAccount(data)).toThrow();
  });

  it.each([
    { access_token: 111 },
    { access_token: undefined },
    { access_token: null },
    { access_token: '' },
    { id_token: 111 },
    { id_token: undefined },
    { id_token: null },
    { id_token: '' },
    { refresh_token: 111 },
    { refresh_token: undefined },
    { refresh_token: null },
    { refresh_token: '' },
    { expires_at: undefined },
    { expires_at: null },
    { expires_at: '' },
    { expires_at: '123' },
  ])('should reject an account with patch %j', (patch) => {
    const data = {
      ...mockAccount(),
      ...patch,
    };
    expect(() => attemptAccount(data)).toThrow();
  });
});
