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

import {CategoryEntry} from "@/components/opendesk/NavigationTopBar/types";
import Image from "next/image";

export default function NavigationMenuItem ({ icon_url, display_name, link, target } : CategoryEntry) {
    return (
        <div className="flex align-center gap-1 p-1 text-sx">
            <Image src={icon_url} height={0} width={0} alt={display_name} style={{width: "30px", height: "30px"}}/>
            <a href={link} target={target} className={'no-underline font-normal text-slate-900 pl-1 pt-2'}>
                {display_name}
            </a>
        </div>
    )
};
