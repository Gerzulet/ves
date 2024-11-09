'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { config } from '@/config';
import { UserDetailsForm } from '@/components/dashboard/users/user-details-form';
import { UserInfo } from '@/components/dashboard/users/user-info';
import { useUser } from '@/hooks/use-user';

export default function Page(): React.JSX.Element {
  const {user} = useUser();

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4"></Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
        {user && <UserInfo user={user} isEdit={true} />}
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          {user && <UserDetailsForm user={user}/>}
        </Grid>
      </Grid>
    </Stack>
  );
}
