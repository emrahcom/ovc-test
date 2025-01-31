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

'use client'

import React, { MouseEvent, useState } from "react";
import Popup from "@/components/InstantMeeting/Popup";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import "../../../i18n"
import {useGetOrCreateInstantMeeting} from "@/components/InstantMeeting/useGetOrCreateInstantMeeting";


export default function InstantMeetingButton() {

    const {meeting, isLoading, error, getOrCreateMeeting} = useGetOrCreateInstantMeeting();

    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        await getOrCreateMeeting();
    }

    return (
        <>
            {anchorEl && (
                <Popup anchor={anchorEl}
                       onClose={() => setAnchorEl(null)}
                       meeting={meeting}
                       isLoading={isLoading}
                       error={error}
                />
            )}

            <Button
                variant="contained"
                onClick={handleClick}
                sx={{
                    width: '100%',
                    minWidth: '20%',
                }}
                disabled={!!anchorEl}
            >
                {t('conference.start_label', 'conference.start_label')}
            </Button>
        </>
    )
};