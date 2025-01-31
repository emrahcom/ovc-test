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

import { isPopupBlocked } from '@/lib/isPopupBlocked';
import { COLORS } from '@/utils/constants/theme.constants';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from '@/contexts/Snackbar/SnackbarContext';
import { CopyInfoButton } from "@/components/InstantMeeting/CopyInfoButton";
import { Button, IconButton, Popover, Stack, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/Auth/AuthProvider';
import "../../../i18n"
import {Meeting, ResponseError} from "@/types/types";


interface Props {
  anchor: HTMLElement | null,
  onClose: () => void,
  isLoading: boolean,
  meeting?:Meeting,
  error?:ResponseError
}

export default function Popup({ anchor, onClose, isLoading, meeting, error }: Props) {

  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  const {
    clientEnv: {
      NEXT_PUBLIC_JITSI_LINK,
    },
  } = useAuth();

  const isOpen: boolean = !!anchor;

  const id = isOpen ? 'sofortmeeting-starten-popup' : '';

  if (!isLoading && error) {
    showSnackbar({
      message: error.message,
      type: 'error',
    });
  }

  const handleJoinMeeting = () => {

    const link: string = NEXT_PUBLIC_JITSI_LINK + meeting?.id;

    if (link) {
      const w = window.open(link, '_blank');
      if (isPopupBlocked(w)) {
        window.location.href = link;
      }
    }
  };

  return (
    <Popover
      id={id}
      open={isOpen}
      onClose={onClose}
      anchorEl={anchor}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      sx={{ mt: -22 }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 5,
          },
        },
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Stack borderRadius={24} maxWidth={350} gap={2} m={2}>
        <Stack>
          <Typography fontSize={'0,85rem'} fontWeight={500}>
            {t('conference.info_text', 'conference.info_text')}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">

          <Stack direction="row">
            <CopyInfoButton meeting={meeting} />
          </Stack>

          <Tooltip title={t('common.cancel', 'Cancel')} placement="top">
            <IconButton aria-label="cancel button" onClick={onClose}>
              <CloseIcon
                aria-label="close icon"
                sx={{ color: COLORS.STAR_COMMAND_BLUE }}
              />
            </IconButton>
          </Tooltip>

        </Stack>
        <Stack gap={2} direction="row">
          <Button
            variant="contained"
            sx={{ width: '100%' }}
            onClick={handleJoinMeeting}
            disabled={meeting === undefined}
          >
            {t('conference.start_label', 'conference.start_label')}
          </Button>
        </Stack>
      </Stack>
    </Popover >
  );
}