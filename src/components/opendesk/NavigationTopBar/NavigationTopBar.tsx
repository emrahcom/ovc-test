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

import {Button, Link} from "@mui/material";
import Image from "next/image";
import menuIcon from '../../../../public/icons/opendesk-menu.svg';
import domainIcon from '../../../../public/icons/opendesk-domain.svg';
import NavigationMenuItem from "@/components/opendesk/NavigationTopBar/NavigationMenuItem";
import React, { useState } from "react";
import {useAuth} from "@/contexts/Auth/AuthProvider";
import {CategoryEntry} from "@/components/opendesk/NavigationTopBar/types";
import useNavigationJson from "@/components/opendesk/NavigationTopBar/useNavigationJson";


export default function NavigationTopBar() {

    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        user: isAuth,
        clientEnv: {
            NEXT_PUBLIC_ICS_DOMAIN,
            NEXT_PUBLIC_PORTAL_DOMAIN,
        },
    } = useAuth();

    const navigation = useNavigationJson();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ICS_DOMAIN: string = NEXT_PUBLIC_ICS_DOMAIN;          //"https://ics.nightly.opendesk.qa"
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const PORTAL_DOMAIN: string = NEXT_PUBLIC_PORTAL_DOMAIN;    //"https://portal.nightly.opendesk.qa"

    const [ menuOpen, setMenuOpen ] = useState(false);

    const menuDisplayClass: string = menuOpen ? 'block' : 'hidden';

    const portal_link : string  = '';

    function toggleMenu() {
        setMenuOpen(!menuOpen);
    }

    return (
        <div id='opendeskTopbar' className={'gap-3.5 h-16 flex items-center bg-white'}>
            <Link className={'ml-4'} href={`${portal_link}`} target="_blank" aria-label='Show portal'>
                <Image src={domainIcon} alt={'OpenDesk'} className={'w-20 mx-4 my-2'} width={82} height={200} loading={"lazy"}/>
            </Link>
            <Button id={"opendeskMenuButton"} tabIndex={0} onClick={toggleMenu}
                    aria-label={"Toogle menu"} className={"bg-none border-none"}
                    data-collapse-toggle="opendeskMenu"
            >
                <Image src={menuIcon} alt={'openDesk menu'} className={'align-center'} loading={"lazy"}/>
                <div id="opendeskMenu"
                     className={`absolute top-10 left-6 z-10 p-2 bg-white text-slate-900 rounded border-slate-300 shadow-lg text-left ${menuDisplayClass}`}
                >
                    {
                        // loop over categories
                        navigation.categories.map((category, key) => {
                            return (
                                <div className="text-xs font-bold tracking-wider pt-4 pr-16 pb-2 pl-2" key={key}>
                                    { category.display_name }

                                    { category.entries.map((categoryEntry, key) => {
                                        // loop over category entries
                                        return(
                                            <NavigationMenuItem { ...categoryEntry as CategoryEntry } key={key}/>
                                        )
                                    })}
                                </div>
                            )})
                    }
                </div>
            </Button>
        </div>
    )
}