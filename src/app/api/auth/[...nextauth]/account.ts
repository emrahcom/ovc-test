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
 * Next auth account passed to jwt callback when user signs in.
 */
export type Account = {
  access_token: string;
  id_token: string;
  refresh_token: string;
  expires_at: number;
};

const accountSchema = Joi.object<Account, true>({
  access_token: Joi.string().required(),
  id_token: Joi.string().required(),
  refresh_token: Joi.string().required(),
  expires_at: Joi.number().strict().required(),
}).required();

export function attemptAccount(account: unknown): Account {
  return Joi.attempt(account, accountSchema, { stripUnknown: true });
}
