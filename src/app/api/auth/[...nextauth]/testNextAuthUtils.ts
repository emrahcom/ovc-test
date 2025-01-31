import { Account, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { access_token1, id_token, refresh_token } from './testUtils';

export function mockJwt(): JWT {
  return {
    name: 'user1',
    email: 'user1@nordeck.net',
  };
}

export function mockUser(): User {
  return {
    id: '01cb624b-d59b-454a-8e5d-63f48407ec6d',
    name: 'user1',
    email: 'user1@nordeck.net',
  };
}

export function mockAccount(): Account {
  return {
    provider: 'keycloak',
    type: 'oauth',
    providerAccountId: '01cb624b-d59b-454a-8e5d-63f48407ec6d',
    access_token: access_token1,
    expires_at: 1725519602,
    refresh_token,
    token_type: 'Bearer',
    id_token,
    scope: 'openid email profile',
  };
}
