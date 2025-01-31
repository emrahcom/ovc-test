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

import { Meeting } from '@/types/types';
import { TFunction } from 'i18next';
import { DateTime } from 'luxon';

const FORMAT = 'dd.MM.yyyy HH:mm:ss';

export type MeetingText = {
  plain: string;
  html: string;
};

export function makeMeetingText(t: TFunction, meeting: Meeting, jitsiDomain: string): MeetingText {

  const {
    id,
    type,
    name,
    owner_id,
    end_time,
    start_time,
    phone_number,
    sip_jibri_link,
    conference_pin
  } = meeting;

  const message = t(
    'copy.meetingInformation',
    `$t(copy.baseMeetingInformation_instant, {"context": "{{baseMeetingInformationContext}}"})$t(copy.phoneInfo)`,
    {
      baseMeetingInformationContext: type.toLowerCase(),
      owner_id,
      name,
      start: start_time
        ? DateTime.fromISO(start_time).toFormat(FORMAT)
        : undefined,
      end: end_time ? DateTime.fromISO(end_time).toFormat(FORMAT) : undefined,
      meetingLink: `${jitsiDomain}${id}`,
      phone_number,
      sip_jibri_link,
      conference_pin,
    },
  );

  return {
    plain: message.replace(/<[^>]+>/g, ''),
    html: message,
  };

}