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

import InstantMeetingButton from "@/components/InstantMeeting/InstantMeetingButton";
import { Metadata } from "next";
import NavigationTopBar from "@/components/opendesk/NavigationTopBar/NavigationTopBar";

export const metadata: Metadata = {
    title: 'openDesk Video Conference',
    description: 'openDesk Video Conference',
};

export default function Conference() {
    return (
        <>
            <NavigationTopBar />
            <main
                className="flex flex-col h-screen max-h-[80vh] items-center justify-center m-4 font-[family-name:var(--font-geist-sans)]">
                <div className="flex flex-1 items-center justify-center m-4">
                    <InstantMeetingButton />
                </div>
            </main>
        </>
    );
}
