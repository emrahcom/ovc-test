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

import { useSnackbar } from '@/contexts/Snackbar/SnackbarContext';
import { COLORS } from '@/utils/constants/theme.constants';
import { makeMeetingText } from "@/components/InstantMeeting/makeMeetingText";
import Image from 'next/image';
import { useTranslation } from "react-i18next";
import { Meeting } from "@/types/types";

import {
  IconButton,
  Stack,
  SxProps,
  Tooltip,
} from '@mui/material';
import { useAuth } from '@/contexts/Auth/AuthProvider';


interface Props {
  meeting: Meeting | undefined,
  color?: string,
  sx?: SxProps,
}

export function CopyInfoButton({
  meeting,
  sx,
  color = COLORS.STAR_COMMAND_BLUE,
}: Props) {

  const {
    clientEnv: {
      NEXT_PUBLIC_JITSI_LINK,
    },
  } = useAuth();

  const { t } = useTranslation();

  const { showSnackbar } = useSnackbar();

  const handleCopy = async () => {

    const { plain, html } = meeting ? makeMeetingText(t, meeting, NEXT_PUBLIC_JITSI_LINK) : { plain: '', html: '' };

    const textBlob = new Blob([plain], { type: 'text/plain', });

    const htmlBlob = new Blob([html], { type: 'text/html', });

    const clipboardItem = new ClipboardItem({
      [textBlob.type]: textBlob,
      [htmlBlob.type]: htmlBlob,
    });

    await navigator.clipboard.write([clipboardItem]);

    showSnackbar({
      message: t('copy.clipboardSuccess', 'copy.clipboardSuccess'),
      autoHideDuration: 3000,
      type: 'info',
    });
  };

  return (
    <>
      <Tooltip
        title={t('conference.start_label', 'conference.start_label')}
        placement="top"
      >
        <Stack>
          <IconButton id={meeting?.id} sx={{ alignSelf: 'center', ...sx }} onClick={handleCopy} disabled={meeting === undefined}>
            <Image color={'info'} width={1} height={1} alt="CopyInfoButton"
              style={{
                height: '1rem',
                width: '1rem',
              }}
              src={color === COLORS.STAR_COMMAND_BLUE ? '/icons/copy-light-blue.svg' : '/icons/copy-dark-blue.svg'}
            />
          </IconButton >
        </Stack>
      </Tooltip>
    </>
  )
}
