import { attemptSignInToken } from './signInToken';

describe('attemptSignInToken', () => {
  it('should accept a valid sign in token', () => {
    const token = {
      name: 'user1 user1',
      email: 'user1@nordeck.net',
    };
    expect(attemptSignInToken(token)).toEqual(token);
  });

  it('should strip additional properties from sign in token', () => {
    expect(
      attemptSignInToken({
        name: 'user1 user1',
        email: 'user1@nordeck.net',
        other: 'key',
      }),
    ).toEqual({
      name: 'user1 user1',
      email: 'user1@nordeck.net',
    });
  });

  it.each([null, undefined])('should reject a sign in token %j', (data) => {
    expect(() => attemptSignInToken(data)).toThrow();
  });

  it.each([
    { name: 111 },
    { name: undefined },
    { name: null },
    { email: 111 },
    { email: undefined },
    { email: null },
  ])('should reject a sign in token for patch %j', (patch) => {
    const data = {
      name: 'user1 user1',
      email: 'user1@nordeck.net',
      ...patch,
    };
    expect(() => attemptSignInToken(data)).toThrow();
  });
});
