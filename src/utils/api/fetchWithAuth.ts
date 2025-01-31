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

import { getAuthServerSession } from '@/lib/getAuthServerSession';
import { NextResponse } from 'next/server';

export type FetchRequest = {
  relativeUrl: string;
  requestInit?: RequestInit;
  allowedWithoutAuth?: boolean;
};

export async function fetchWithAuth({
  relativeUrl,
  requestInit,
  allowedWithoutAuth,
}: FetchRequest): Promise<Response> {
  const session = await getAuthServerSession();
  if (session === undefined && !allowedWithoutAuth) {
    return NextResponse.json(null, { status: 401 });
  }

  const token = session?.access_token;

  const fetchUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${relativeUrl}`;
  let response;

  try {
    response = await fetch(fetchUrl, {
      ...requestInit,
      headers: {
        Accept: 'application/json',
        Authorization: token ? 'Bearer ' + token : '',
        'Content-Type': 'application/json',
        ...requestInit?.headers,
      },
    });
  } catch (error) {
    const message: string =
      error instanceof Error ? error.message : String(error);
    console.error(`Could not fetch url ${fetchUrl} error message: ${message}`);
    return NextResponse.json(null, { status: 404 });
  }

  return response;
}
