import { attemptSessionAccessToken } from './sessionAccessToken';

describe('attemptSessionAccessToken', () => {
  it.each([
    {},
    {
      realm_access: {},
    },
    {
      realm_access: {
        roles: [],
      },
    },
    {
      realm_access: {
        roles: ['role1'],
      },
    },
  ])('should accept valid session access token: %j', (accessToken) => {
    expect(attemptSessionAccessToken(accessToken)).toEqual(accessToken);
  });

  it('should strip additional properties for session access token', () => {
    expect(
      attemptSessionAccessToken({
        other: 'key',
        realm_access: {
          roles: ['role1'],
        },
      }),
    ).toEqual({
      realm_access: {
        roles: ['role1'],
      },
    });
  });

  it.each([
    null,
    undefined,
    {
      realm_access: 111,
    },
    {
      realm_access: {
        roles: 111,
      },
    },
    {
      realm_access: {
        roles: 'role1, role2',
      },
    },
    {
      realm_access: {
        roles: null,
      },
    },
  ])('should reject a token %j', (accessToken) => {
    expect(() => attemptSessionAccessToken(accessToken)).toThrow();
  });
});
