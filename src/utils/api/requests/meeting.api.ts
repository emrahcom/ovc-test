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

import { encodeParams } from '@/lib/encodeParams';
import { API, CatchAxiosError, Response } from '@/utils/api/api';
import {
  BasicMeeting,
  Meeting,
  MeetingPermissions,
  MeetingType,
  ParticipantNew,
  Role,
} from '@/types/types';

export async function getMeetingById(
  meetingId: string,
): Promise<Response<Meeting>> {
  return await CatchAxiosError(() =>
    API.get<Meeting>(`/meetings/${meetingId}`),
  );
}

export async function getBasicMeeting(
  meetingId: string,
): Promise<Response<BasicMeeting>> {
  return await CatchAxiosError(() =>
    API.get<BasicMeeting>(`/meetings/${meetingId}/basic`),
  );
}

export type UpdateMeeting = Omit<CreateMeeting, 'participants'>;

export async function updateMeeting(
  meeting: UpdateMeeting,
  meetingId: string,
): Promise<Response<void>> {
  return await CatchAxiosError(() =>
    API.put<void>(`/meetings/${meetingId}`, meeting),
  );
}

export async function deleteMeeting(
  meetingId: string,
): Promise<Response<void>> {
  return await CatchAxiosError(() =>
    API.delete<void>(`/meetings/${meetingId}`),
  );
}

type MeetingsPage = {
  content: Meeting[];
};

export async function getMeetings(params: {
  type: MeetingType;
  start?: string;
  end?: string;
  offset?: number;
  order?: 'asc' | 'desc';
  limit?: number;
}): Promise<Response<MeetingsPage>> {
  return await CatchAxiosError(() =>
    API.get<MeetingsPage>(`/meetings?` + encodeParams(params)),
  );
}

export type CreateMeeting = Pick<
  Meeting,
  | 'type'
  | 'name'
  | 'info'
  | 'start_time'
  | 'end_time'
  | 'recurrence'
  | 'password'
  | 'lobby_enabled'
  | 'participants'
>;

export async function createMeeting(
  meeting: CreateMeeting,
): Promise<Response<Meeting>> {
  return await CatchAxiosError(() => API.post<Meeting>('/meetings', meeting));
}

export async function updateParticipant(
  meetingId: string,
  participantId: string,
  participant: { role: Role; email: string },
): Promise<Response<void>> {
  return await CatchAxiosError(() =>
    API.put<void>(
      `/meetings/${meetingId}/participants/${participantId}`,
      participant,
    ),
  );
}

export async function createParticipant(
  meetingId: string,
  participant: {
    role: Role;
    email: string;
  },
): Promise<Response<ParticipantNew>> {
  return await CatchAxiosError(() =>
    API.post<ParticipantNew>(
      `/meetings/${meetingId}/participants`,
      participant,
    ),
  );
}

export async function deleteParticipant(
  meetingId: string,
  participantId: string,
): Promise<Response<void>> {
  return await CatchAxiosError(() =>
    API.delete<void>(`/meetings/${meetingId}/participants/${participantId}`),
  );
}

export async function getJitsiLink(
  meetingId: string,
  data: {
    password: string;
    email: string | undefined;
    user_display_name: string;
    timezone: string;
  },
): Promise<Response<string>> {
  return await CatchAxiosError(() =>
    API.post<string>(`/meetings/${meetingId}/jitsi-link`, data),
  );
}

export async function updateLastVisitDate(
  meetingId: string,
): Promise<Response<void>> {
  return await CatchAxiosError(() =>
    API.patch<void>(`/meetings/${meetingId}/last-visit-date`),
  );
}

export async function getMeetingPermissions(
  meetingId: string,
): Promise<Response<MeetingPermissions>> {
  return await CatchAxiosError(() =>
    API.get<MeetingPermissions>(`/meetings/${meetingId}/permissions`),
  );
}

export async function getNextOfSeries(
  meetingId: string,
): Promise<Response<BasicMeeting>> {
  return await CatchAxiosError(() =>
    API.get<Meeting>(`/meetings/${meetingId}/next-of-series`),
  );
}
