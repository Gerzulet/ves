
import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { User } from '@/types/user';
import { UserInfo } from '@/components/dashboard/users/user-info';
import { UserDetailsForm } from '@/components/dashboard/users/user-details-form';

export const metadata = { title: `Nuevo Usuario | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const emptyUser: User = {
    name: '',
    last_name: '',
    email: '',
    dni: '',
    cuil: '',
    role: '',
    photo: '',
    email_verified_at: '',
    registry_expires_at: '',
    exams_expires_at: '',
    enabled: true,
    created_at: '',
    updated_at: '',
    accountId: '',
    phone_number: '',
    password: ''
  }

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4"></Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <UserInfo user={emptyUser} isEdit={false} />
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <UserDetailsForm user={emptyUser} isEdit={false}/>
        </Grid>
      </Grid>
    </Stack>
  );
}
