import { refreshAccessToken } from './refreshAccessToken';
import { authOptions, cookiesOptions } from './route';
import { attemptSessionToken } from './sessionToken';
import { mockAccount, mockJwt, mockUser } from './testNextAuthUtils';
import {
  access_token1,
  access_token2,
  id_token,
  mockRefreshToken,
  mockSessionToken,
  refresh_token,
} from './testUtils';

vi.mock('./refreshAccessToken');

afterEach(() => {
  vi.useRealTimers();
  vi.mocked(refreshAccessToken).mockReset();
});

describe('authOptions', () => {
  const {
    callbacks: {
      jwt = () => Promise.reject(),
      session = () => Promise.reject(),
    } = {},
  } = authOptions;

  describe('callback jwt', () => {
    it('should generate a session token', async () => {
      const token = await jwt({
        token: mockJwt(),
        user: mockUser(),
        account: mockAccount(),
      });

      expect(token).toEqual({
        name: 'user1',
        email: 'user1@nordeck.net',
        decoded: {
          realm_access: {
            roles: ['default-roles-vk-bund'],
          },
        },
        access_token: access_token1,
        id_token,
        expires_at: 1725519602,
        refresh_token,
      });

      expect(attemptSessionToken(token)).toBeDefined();
    });

    it('should fail to generate a session token when jwt token missing name', async () => {
      await expect(
        jwt({
          token: { ...mockJwt(), name: undefined },
          user: mockUser(),
          account: mockAccount(),
        }),
      ).rejects.toThrow();
    });

    it('should fail to generate a session token when account missing access token', async () => {
      await expect(
        jwt({
          token: mockJwt(),
          user: mockUser(),
          account: { ...mockAccount(), access_token: undefined },
        }),
      ).rejects.toThrow();
    });

    it('should return unchanged session token if not expired', async () => {
      const sessionToken = mockSessionToken({
        expires_at: Math.floor(Date.now() / 1000) + 60,
      });
      await expect(
        jwt({ token: sessionToken, user: mockUser(), account: null }),
      ).resolves.toEqual(sessionToken);
    });

    it('should fail if session token is not valid', async () => {
      const sessionToken = {
        ...mockSessionToken({
          expires_at: Math.floor(Date.now() / 1000) + 60,
        }),
        name: undefined,
      };
      await expect(
        jwt({ token: sessionToken, user: mockUser(), account: null }),
      ).rejects.toThrow();
    });

    it('should set token status to expired if session and refresh tokens are expired', async () => {
      vi.useFakeTimers();
      const nowTsSec = 1704099600;
      vi.setSystemTime((nowTsSec + 600) * 1000);

      const sessionToken = mockSessionToken();
      await expect(
        jwt({ token: sessionToken, user: mockUser(), account: null }),
      ).resolves.toEqual({
        ...sessionToken,
        refresh_token_expired: true,
      });
    });

    it('should refresh token if expired', async () => {
      vi.useFakeTimers();
      vi.mocked(refreshAccessToken).mockResolvedValue(
        mockRefreshToken({ access_token: access_token2 }),
      );
      const nowTsSec = 1704099600;
      vi.setSystemTime(nowTsSec * 1000);
      const sessionToken = mockSessionToken({
        expires_at: nowTsSec - 60,
      });
      await expect(
        jwt({ token: sessionToken, user: mockUser(), account: null }),
      ).resolves.toEqual(
        mockSessionToken({
          access_token: access_token2,
          expires_at: nowTsSec + 60,
        }),
      );
      expect(refreshAccessToken).toHaveBeenLastCalledWith(refresh_token);
    });

    it('should set token status to expired if could not refresh', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      try {
        vi.useFakeTimers();
        const nowTsSec = 1704099600;
        vi.setSystemTime(nowTsSec * 1000);
        const sessionToken = mockSessionToken({
          expires_at: Math.floor(Date.now() / 1000) - 60,
        });
        vi.mocked(refreshAccessToken).mockRejectedValue(new Error());
        await expect(
          jwt({ token: sessionToken, user: mockUser(), account: null }),
        ).resolves.toEqual({
          ...sessionToken,
          refresh_token_expired: true,
        });
        expect(refreshAccessToken).toHaveBeenLastCalledWith(refresh_token);
      } finally {
        vi.mocked(console.error).mockRestore();
      }
    });

    it('should set token status to expired if refresh token is expired', async () => {
      vi.useFakeTimers();
      const nowTsSec = 1704099900 + 10;
      vi.setSystemTime(nowTsSec * 1000);
      const sessionToken = mockSessionToken({
        expires_at: Math.floor(Date.now() / 1000) - 60,
      });
      await expect(
        jwt({ token: sessionToken, user: mockUser(), account: null }),
      ).resolves.toEqual({
        ...sessionToken,
        refresh_token_expired: true,
      });
      expect(refreshAccessToken).toHaveBeenCalledTimes(0);
    });
  });

  describe('callback session', () => {
    it('should generate session', async () => {
      const params = {
        session: { expires: '2024-01-01T09:00:00.000Z' },
        token: mockSessionToken(),
      };
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      await expect(session(params as any)).resolves.toEqual({
        expires: '2024-01-01T09:00:00.000Z',
        access_token: access_token1,
        id_token,
        roles: ['default-roles-vk-bund'],
        user: {
          name: 'user1',
          email: 'user1@nordeck.net',
        },
      });
    });
  });
});

describe('cookiesOptions', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('should return undefined if no cookie environment variables are set', () => {
    expect(cookiesOptions()).toBeUndefined();
  });

  it.each([undefined, 'true'])(
    'should configure secure pkce cookie if pkce max age is set and use secure cookies is %j',
    (useSecureCookies) => {
      process.env.NEXTAUTH_PKCE_MAX_AGE = '1200';
      process.env.NEXTAUTH_USE_SECURE_COOKIES = useSecureCookies;
      expect(cookiesOptions()).toEqual({
        pkceCodeVerifier: {
          name: `__Secure-next-auth.pkce.code_verifier`,
          options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: true,
            maxAge: 1200,
          },
        },
      });
    },
  );

  it('should configure NOT secure pkce cookie if pkce max age is set and use secure cookies is false', () => {
    process.env.NEXTAUTH_PKCE_MAX_AGE = '1200';
    process.env.NEXTAUTH_USE_SECURE_COOKIES = 'false';
    expect(cookiesOptions()).toEqual({
      pkceCodeVerifier: {
        name: `next-auth.pkce.code_verifier`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: false,
          maxAge: 1200,
        },
      },
    });
  });

  it('should configure secure state cookie if state max age is set', () => {
    process.env.NEXTAUTH_STATE_MAX_AGE = '1200';
    expect(cookiesOptions()).toEqual({
      state: {
        name: `__Secure-next-auth.state`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
          maxAge: 1200,
        },
      },
    });
  });

  it('should configure pkce and state cookies if pkce and state max ages are set', () => {
    process.env.NEXTAUTH_PKCE_MAX_AGE = '1200';
    process.env.NEXTAUTH_STATE_MAX_AGE = '1200';
    expect(cookiesOptions()).toEqual({
      pkceCodeVerifier: {
        name: `__Secure-next-auth.pkce.code_verifier`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
          maxAge: 1200,
        },
      },
      state: {
        name: `__Secure-next-auth.state`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: true,
          maxAge: 1200,
        },
      },
    });
  });

  it.each([
    { pkceMaxAge: 'small', stateMaxAge: 'big' },
    { pkceMaxAge: 'small', stateMaxAge: undefined },
    { pkceMaxAge: undefined, stateMaxAge: 'big' },
  ])(
    'should return undefined for invalid values %j',
    ({ pkceMaxAge, stateMaxAge }) => {
      process.env.NEXTAUTH_PKCE_MAX_AGE = pkceMaxAge;
      process.env.NEXTAUTH_STATE_MAX_AGE = stateMaxAge;
      expect(cookiesOptions()).toBeUndefined();
    },
  );
});
