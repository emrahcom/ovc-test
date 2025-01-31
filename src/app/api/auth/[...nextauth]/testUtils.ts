/*
 * Copyright 2024 Nordeck IT + Consulting GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Account } from './account';
import { RefreshToken } from './refreshToken';

import {SessionToken} from "@/types/types";

/**
 * {
 *   "exp": 1704099600,
 *   "typ": "Bearer",
 *   "realm_access": {
 *     "roles": [
 *       "default-roles-vk-bund"
 *     ]
 *   },
 *   "name": "user1",
 *   "email": "user1@nordeck.net"
 * }
 */
export const access_token1 =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDQwOTk2MDAsInR5cCI6IkJlYXJlciIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLXZrLWJ1bmQiXX0sIm5hbWUiOiJ1c2VyMSIsImVtYWlsIjoidXNlcjFAbm9yZGVjay5uZXQifQ.tsPrUQveKGiXMArYriQOCwXegQZ4z_JpNOGBc4I12Iw';

/**
 * {
 *   "exp": 1704099900,
 *   "typ": "Bearer",
 *   "realm_access": {
 *     "roles": [
 *       "default-roles-vk-bund"
 *     ]
 *   },
 *   "name": "user1",
 *   "email": "user1@nordeck.net"
 * }
 */
export const access_token2 =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDQwOTk5MDAsInR5cCI6IkJlYXJlciIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLXZrLWJ1bmQiXX0sIm5hbWUiOiJ1c2VyMSIsImVtYWlsIjoidXNlcjFAbm9yZGVjay5uZXQifQ.OQDof_VgFW4B9CjlQblGuNITMisif7pyFId5jjAxthg';

/**
 * {
 *   "exp": 1704186000,
 *   "jti": "73aed45a-fa4a-4210-b9f9-c2ef401f31d1",
 *   "name": "user1",
 *   "email": "user1@nordeck.net"
 * }
 */
export const id_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDQxODYwMDAsImp0aSI6IjczYWVkNDVhLWZhNGEtNDIxMC1iOWY5LWMyZWY0MDFmMzFkMSIsIm5hbWUiOiJ1c2VyMSIsImVtYWlsIjoidXNlcjFAbm9yZGVjay5uZXQifQ.UKmaiQshJWysTz3rSc-YQ8RO8VySgU52E06kK7ehA0o';

/**
 * {
 *   "exp": 1704099900,
 *   "jti": "5db4a488-6ba1-482f-bea6-176d9399500b",
 *   "typ": "Refresh"
 * }
 */
export const refresh_token =
  'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjNmNTI1MTIwLTMxOTYtNDY0ZS05YWZlLTllNTkwNDBkMGRhMCJ9.eyJleHAiOjE3MDQwOTk5MDAsImp0aSI6IjVkYjRhNDg4LTZiYTEtNDgyZi1iZWE2LTE3NmQ5Mzk5NTAwYiIsInR5cCI6IlJlZnJlc2gifQ.-UB7yZn5mCo1wnMvqnjhDAHJAU-uZFyHqF60ugV5_favPMPgNnLgprZd-wgvj3nkE07gKgw89sRbAqUdqmsKmA';

export function mockAccount(): Account {
  return {
    access_token: access_token1,
    id_token,
    refresh_token,
    expires_at: 1704103200,
  };
}

export function mockSessionToken(
  patch: Partial<SessionToken> = {},
): SessionToken {
  return {
    name: 'user1',
    email: 'user1@nordeck.net',
    decoded: {
      realm_access: {
        roles: ['default-roles-vk-bund'],
      },
    },
    access_token: access_token1,
    id_token,
    expires_at: 1704099600,
    refresh_token,
    ...patch,
  };
}

export function mockRefreshToken(
  patch: Partial<RefreshToken> = {},
): RefreshToken {
  return {
    access_token: access_token1,
    expires_in: 60,
    refresh_token,
    id_token,
    ...patch,
  };
}
