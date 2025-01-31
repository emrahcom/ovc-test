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

import type {
  AlertProps,
  SnackbarProps as MuiSnackbarProps,
  SnackbarOrigin,
} from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import {
  PropsWithChildren,
  ReactNode,
  SyntheticEvent,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type SnackbarProps = {
  message: ReactNode;
  type: AlertProps['severity'];
  autoHideDuration: MuiSnackbarProps['autoHideDuration'];
};

export type SnackbarState = {
  showSnackbar: (params: Partial<SnackbarProps>) => void;
};

const SnackbarContext = createContext<SnackbarState | undefined>(undefined);

type SnackbarProviderState = {
  open: boolean;
  anchorOrigin: SnackbarOrigin;
} & SnackbarProps;

const defaultState: SnackbarProviderState = {
  open: false,
  anchorOrigin: { vertical: 'top', horizontal: 'right' },
  message: '',
  type: 'info',
  autoHideDuration: 5000,
};

export function SnackbarProvider({ children }: PropsWithChildren) {
  const [{ open, anchorOrigin, type, message, autoHideDuration }, setSnackbar] =
    useState<SnackbarProviderState>(defaultState);

  const handleCloseSnackbar = useCallback(
    (_?: SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }

      setSnackbar((prev) => ({ ...prev, open: false }));
    },
    [],
  );

  const handleShowSnackbar = useCallback((values: Partial<SnackbarProps>) => {
    setSnackbar({
      ...defaultState,
      ...values,
      open: true,
    });
  }, []);

  const snackbarContext = useMemo<SnackbarState>(
    () => ({
      showSnackbar: handleShowSnackbar,
    }),
    [handleShowSnackbar],
  );

  return (
    <SnackbarContext.Provider value={snackbarContext}>
      {children}
      <Snackbar
        open={open}
        sx={{ mt: 7, mr: -1 }}
        onClose={handleCloseSnackbar}
        autoHideDuration={autoHideDuration}
        anchorOrigin={anchorOrigin}
      >
        <Alert severity={type} onClose={handleCloseSnackbar}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarState {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error(
      `Snackbar context can only be used inside of <SnackbarProvider>`,
    );
  }

  return context;
}
