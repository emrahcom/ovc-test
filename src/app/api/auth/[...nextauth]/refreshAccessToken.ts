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

import { attemptRefreshToken, RefreshToken } from './refreshToken';

export async function refreshAccessToken(
  refresh_token: string,
): Promise<RefreshToken> {
  let response;
  try {
    response = await fetch(`${process.env.REFRESH_TOKEN_URL}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID || '',
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET || '',
        grant_type: 'refresh_token',
        refresh_token,
      }),
      method: 'POST',
    });
  } catch (error) {
    throw new Error('Could not fetch refresh access token', { cause: error });
  }

  if (!response.ok) {
    const text = await response.text().catch(() => undefined);
    throw new Error(
      `Could not refresh access token, status: ${response.status}, text: ${text}`,
    );
  }

  return attemptRefreshToken(await response.json());
}
