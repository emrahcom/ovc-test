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

import Joi from 'joi';

/**
 * Refreshed access token.
 */
export type RefreshToken = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  id_token?: string;
};

const refreshTokenSchema = Joi.object<RefreshToken, true>({
  access_token: Joi.string().required(),
  refresh_token: Joi.string().required(),
  expires_in: Joi.number().strict().required(),
  id_token: Joi.string(),
}).required();

export function attemptRefreshToken(token: unknown): RefreshToken {
  return Joi.attempt(token, refreshTokenSchema, { stripUnknown: true });
}
