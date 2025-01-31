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

import { ApiError, ResponseError } from '@/types/types';
import Axios, { AxiosResponse } from 'axios';
import { authLogin } from './requests/auth.api';

export const API = Axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export type Response<T> =
  | {
      data?: T;
      error?: ResponseError;
    }
  | {
      data: T;
      error: undefined;
    }
  | {
      data: undefined;
      error: ResponseError;
    };

export async function CatchAxiosError<T>(
  func: () => Promise<AxiosResponse<T>>,
): Promise<Response<T>> {
  try {
    const response = await func();
    return { data: response.data };
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      if (
        error.response?.status === 401 &&
        !error.request?.responseURL?.includes('logout')
      ) {
        await authLogin(window.location.pathname);
      }
      const apiError = error.response?.data as ApiError;
      return { error: { message: error.message, apiError } };
    } else if (error instanceof Error) {
      return { error: { message: error.message } };
    } else {
      return { error: { message: String(error) } };
    }
  }
}
