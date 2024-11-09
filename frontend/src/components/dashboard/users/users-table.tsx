'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Trash as TrashIcon, Pencil as PencilIcon } from '@phosphor-icons/react';
import { useSelection } from '@/hooks/use-selection';
import dayjs from 'dayjs';
import { User } from '@/types/user';
import Link from 'next/link';
import { deleteUser, getUsers } from '@/services/user.service';


export interface UsersTableProps {
  count?: number;
  page?: number;
  rows?: User[];
  rowsPerPage?: number;
}


export function UsersTable({
  count = 0,
  rows: propRows = [],
  page = 0,
  rowsPerPage = 5,
}: UsersTableProps): React.JSX.Element {
  // Estados para controlar las filas de la tabla y el paginado
  const [rows, setRows] = useState<User[]>(propRows);
  const [totalCount, setTotalCount] = useState(0); // Estado para controlar el total de usuarios
  const [currentPage, setCurrentPage] = useState(page);
  const [rowsPerPageState, setRowsPerPageState] = useState(rowsPerPage);

  const rowIds = React.useMemo(() => {
    return rows.map((users) => users.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  // Obtener datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { users, totalCount } = await getUsers(currentPage + 1, rowsPerPageState);
        setRows(users); // Actualizar las filas con los datos obtenidos de la API
        setTotalCount(totalCount); // Ajustar el conteo total
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };
  
    fetchData();
  }, [currentPage, rowsPerPageState]);

  // Función para abrir el diálogo de confirmación
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setOpen(true);
  };

  // Función para cerrar el diálogo
  const handleClose = () => {
    setOpen(false);
  };

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    try {
      if (selectedUser) {
        await deleteUser(selectedUser.id);

        // Eliminar el usuario localmente después de la confirmación
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedUser.id));
        console.log(`Usuario ${selectedUser.name} eliminado.`);
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
    setOpen(false);
  };

  // Función para manejar el cambio de página
  const handleChangePage = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  // Función para cambiar el número de filas por página
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPageState(parseInt(event.target.value, 10));
    setCurrentPage(0); // Reiniciar la página al cambiar la cantidad de filas
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>DNI</TableCell>
              <TableCell>Fecha de Alta</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.photo ?? '/assets/avatar.png'} />
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>{row.dni}</TableCell>
                  <TableCell>{dayjs(row.created_at).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>
                    <Button color="primary" size="small" startIcon={<PencilIcon />}>
                    <Link href={'/dashboard/users/'+row.id}>
                      Modificar
                    </Link>
                    </Button>
                    <Button color="error" size="small" startIcon={<TrashIcon />} onClick={() => handleDeleteClick(row)}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={totalCount}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        page={currentPage}
        rowsPerPage={rowsPerPageState}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Diálogo de confirmación */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Está seguro que desea eliminar al usuario {selectedUser?.name}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
