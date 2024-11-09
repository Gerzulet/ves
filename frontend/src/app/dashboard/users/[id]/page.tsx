import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { UserDetailsForm } from '@/components/dashboard/users/user-details-form';
import { UserInfo } from '@/components/dashboard/users/user-info';
import { getUserById } from '@/services/user.service';

export default async function Page({ params }: { params: { id: string } }) {

  const user = await getUserById(params.id);

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
