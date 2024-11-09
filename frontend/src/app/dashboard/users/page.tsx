import * as React from 'react';
import type { Metadata } from 'next';
import RouterLink from 'next/link';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { config } from '@/config';
import { UsersFilters } from '@/components/dashboard/users/users-filters';
import { UsersTable } from '@/components/dashboard/users/users-table';
import type { User } from '@/types/user';

import { paths } from '@/paths';



export const metadata = { title: `Usuarios | ${config.site.name}` } satisfies Metadata;


export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;
  const users: User[] = [];
  const paginatedUsers = applyPagination(users, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Usuarios</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {/*<Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>*/}
          </Stack>
        </Stack>
        <div>
          <Button component={RouterLink} href={paths.dashboard.new} 
          startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Agregar
          </Button>
        </div>
      </Stack>
      <UsersFilters />
      <UsersTable
        count={paginatedUsers.length}
        page={page}
        rows={paginatedUsers}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: User[], page: number, rowsPerPage: number): User[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
