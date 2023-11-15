import Stack from '@mui/material/Stack';
import React, { PropsWithChildren } from 'react';

export const ActionButtonContainer = (
  props: PropsWithChildren<Record<string, unknown>>
) => (
  <Stack
    marginTop={3}
    spacing={2}
    justifyContent="flex-end"
    direction={{ xs: 'column', sm: 'row' }}
  >
    {props.children}
  </Stack>
);
