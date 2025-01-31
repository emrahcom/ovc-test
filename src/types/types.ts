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

export type Meeting = {
  id: string;
  type: MeetingType;
  parent_id?: string;
  owner_id: string;
  name: string;
  info?: string;
  start_time?: string;
  end_time?: string;
  recurrence?: Recurrence;
  excluded_dates?: string[];
  password: string;
  lobby_enabled: boolean;
  conference_pin: string;
  phone_number: string;
  sip_jibri_link: string;
  participants: ParticipantNew[];
};

export type BasicMeeting = Pick<
  Meeting,
  'id' | 'type' | 'name' | 'start_time' | 'end_time' | 'recurrence'
>;

export enum MeetingType {
  Normal = 'NORMAL',
  Instant = 'INSTANT',
  Static = 'STATIC',
}

export type ParticipantNew = {
  id?: string;
  role: Role;
  email: string;
  status?: 'deleted' | 'updated';
};

export enum Role {
  Organizer = 'ORGANIZER',
  Moderator = 'MODERATOR',
}

export type Recurrence = {
  frequency: Frequency;
  end_date: string;
  week_days?: WeekDays;
};

export type WeekDays = {
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;
};

export enum Frequency {
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Monthly = 'MONTHLY',
}

export type MeetingPermissions = {
  meeting_id: string;
  user_id: string;
  user_can_read?: boolean;
  user_can_edit?: boolean;
  user_is_participant?: boolean;
};

export enum NotificationType {
  DeleteCandidate = 'delete-candidate',
  PasswordChangeCandidate = 'password-change-candidate',
  ParticipantAdded = 'participant-added',
  ParticipantDeleted = 'participant-deleted',
  PasswordChanged = 'password-changed',
}

export type Notification = {
  id: string;
  message: string;
  user_id: string;
  type: NotificationType;
  viewed: boolean;
  created_at: string;
  viewed_at?: string;
  meeting_id: string;
  room_name: string;
  password_change_due_date?: string;
  room_deletion_due_date?: string;
};

export type ResponseError = {
  message: string;
  apiError?: ApiError;
};

export type ApiError = {
  id: string;
  status: string;
  code: number;
  timestamp: string;
  message: string;
  infoMessage: string;
  path: string;
};

export type SessionType = {
  access_token: string;
  expires: string;
  id_token: string;
  roles?: string[];
  user: UserType;
  refresh_token_expired?: boolean;
};

export type UserType = {
  name: string;
  email: string;
};

export type SendEventOpts<T> = {
  clientIds?: string[];
  type: string;
  sender: string;
  content: T;
};

/**
 * User's session token.
 */
export type SessionToken = {
    name: string;
    email: string;
    decoded: SessionAccessToken;
    access_token: string;
    id_token: string;
    expires_at: number;
    refresh_token: string;
    refresh_token_expired?: boolean;
};

/**
 * Access token part stored in a session token.
 */
export type SessionAccessToken = {
  realm_access?: {
    roles?: string[];
  };
};
