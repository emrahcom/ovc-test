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

'use client';

import { useGetEnvironment } from '@/contexts/Auth/useGetEnvironment';
import { authLogin, authLogout } from '@/utils/api/requests/auth.api';
import { CircularProgress } from '@mui/material';
import { isEqual } from 'lodash';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {SessionType, UserType} from "@/types/types";

function isPagePublic(page: string): boolean {
  return ['/login', '/meetings/meeting/join/'].some((path) =>
    page.startsWith(path),
  );
}

export type AuthState = {
  login: (callbackUrl: string) => void;
  logout: () => void;
  user?: UserType;
  clientEnv: Record<string, string>;
};

export const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren<object>) {
  const pathname = usePathname();

  const { data: session, status } = useSession();
  const { isLoading: isEnvironmentLoading, data: environment } =
    useGetEnvironment();

  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserType | undefined>();

  const login = useCallback(async (callbackUrl: string) => {
    await authLogin(callbackUrl);
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
  }, []);

  const authContext = useMemo<AuthState>(
    () => ({
      login,
      logout,
      user,
      clientEnv: environment,
    }),
    [login, logout, user, environment],
  );

  useEffect(() => {
    if (
      (status !== 'loading' &&
        session &&
        (session as SessionType).refresh_token_expired &&
        !pathname.startsWith('/login')) ||
      (status === 'unauthenticated' && !isPagePublic(pathname))
    ) {
      login(window.location.pathname);
      return;
    }

    if (status === 'unauthenticated' && isPagePublic(pathname)) {
      setIsUserLoading(false);
    }

    if (status === 'authenticated' && session) {
      const sessionUser = session?.user as UserType;
      setUser((prev) => (isEqual(prev, sessionUser) ? prev : sessionUser));
      setIsUserLoading(false);
    }
  }, [login, pathname, session, status]);

  const isShowChildren =
    (user || (isPagePublic(pathname) && !isUserLoading)) &&
    !isEnvironmentLoading;

  return (
    <AuthContext.Provider value={authContext}>
      {isShowChildren ? (
        children
      ) : (
        <div
          style={{
            top: '50%',
            left: '50%',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CircularProgress size={100} />
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(`useAuth can only be used inside of <AuthProvider>`);
  }

  return context;
}

export function useAuthLoggedUser(): UserType {
  const { user } = useAuth();

  if (!user) {
    throw new Error(`User is not logged in`);
  }

  return user;
}
