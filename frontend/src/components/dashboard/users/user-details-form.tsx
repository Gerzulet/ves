'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import { User } from '@/types/user';
import { createUser, saveUser } from '@/services/user.service';
import RouterLink from 'next/link';
import { paths } from '@/paths';
import { Modal, Box, Typography, TextField, Switch, FormControlLabel } from '@mui/material';

export function UserDetailsForm({ user, isEdit = true }: { user: User, isEdit?: boolean }): React.JSX.Element {
  const { handleSubmit, control, watch, formState: { errors } } = useForm({ defaultValues: user });
  const selectedRole = watch("role");

  const [isModalOpen, setModalOpen] = React.useState(false);  // Estado para manejar el modal
  const [newPassword, setNewPassword] = React.useState('');   // Nueva contraseña
  const [confirmPassword, setConfirmPassword] = React.useState(''); // Confirmación de contraseña


  const onSubmit = async (data: User) => {
    try {
      let response;

      if (isEdit) {
        // En el caso de edición, no enviar la contraseña si no se ha cambiado
        if (!newPassword) {
          delete data.password; // Si no se cambia la contraseña, no enviar ese campo
        }
        response = await saveUser(data);
      } else {
        response = await createUser(data);
      }
  
      const responseBody = response;
      console.log('Response:', responseBody);
  
      if (response && response.id) {
        alert('Usuario actualizado correctamente');
      } else {
        alert('Error al actualizar: ' + responseBody.message);
      }
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      alert('Ocurrió un error al guardar los datos');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword === confirmPassword) {
      try {
        // Guardar la nueva contraseña
        const response = await saveUser({ ...user, password: newPassword });
        const responseBody = await response.json();

        if (response.ok) {
          alert('Contraseña actualizada correctamente');
          setModalOpen(false);  // Cerrar el modal después de guardar
        } else {
          alert('Error al actualizar la contraseña: ' + responseBody.message);
        }
      } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        alert('Ocurrió un error al actualizar la contraseña');
      }
    } else {
      alert('Las contraseñas no coinciden');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="Puedes modificar la info de tu perfil" title="Perfil" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {/* Campos del formulario */}
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Nombre</InputLabel>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'El nombre es obligatorio' }}
                  render={({ field }) => <OutlinedInput {...field} label="Nombre" />}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Apellido</InputLabel>
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => <OutlinedInput {...field} label="Apellido" />}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required error={!!errors.dni}>
                <InputLabel>DNI</InputLabel>
                <Controller
                  name="dni"
                  control={control}
                  rules={{
                    required: 'El DNI es obligatorio',
                    pattern: {
                      value: /^[0-9]{8}$/,
                      message: 'Debe contener exactamente 8 dígitos sin puntos'
                    }
                  }}
                  render={({ field }) => <OutlinedInput {...field} label="DNI" />}
                />
                {errors.dni && <p style={{ color: 'red' }}>{errors.dni.message}</p>}
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required error={!!errors.cuil}>
                <InputLabel>CUIL</InputLabel>
                <Controller
                  name="cuil"
                  control={control}
                  rules={{
                    required: 'El CUIL es obligatorio',
                    pattern: {
                      value: /^[0-9]{11}$/,
                      message: 'Debe contener exactamente 11 dígitos sin guiones'
                    }
                  }}
                  render={({ field }) => <OutlinedInput {...field} label="CUIL" />}
                />
                {errors.cuil && <p style={{ color: 'red' }}>{errors.cuil.message}</p>}
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
                  <Controller
                    name="created_at"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Fecha de Alta"
                        value={dayjs(field.value)}
                        onChange={(date) => field.onChange(date?.toISOString())}
                        format="DD/MM/YYYY"
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Email</InputLabel>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => <OutlinedInput {...field} label="Email" />}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Celular</InputLabel>
                <Controller
                  name="phone_number"
                  control={control}
                  render={({ field }) => <OutlinedInput {...field} label="Celular" />}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Dirección</InputLabel>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => <OutlinedInput {...field} label="Dirección" />}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Rol">
                      <MenuItem value="Administrator">Administrador</MenuItem>
                      <MenuItem value="Sales">Vendedor</MenuItem>
                      <MenuItem value="Mechanic">Chofer</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            {selectedRole === 'Mechanic' && (
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
                    <Controller
                      name="registry_expires_at"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="Vencimiento Registro"
                          value={dayjs(field.value)}
                          onChange={(date) => field.onChange(date?.toISOString())}
                          format="DD/MM/YYYY"
                        />
                      )}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
            )}
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="enabled"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          {...field}
                          checked={field.value === true}
                          onChange={(e) => field.onChange(e.target.checked)}
                          color="primary"
                        />
                      }
                      label={<Typography>{field.value ? "Activo" : "Inactivo"}</Typography>}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            {/* Mostrar campo contraseña solo si no es edición */}
            {!isEdit && (
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Contraseña</InputLabel>
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: 'La contraseña es obligatoria' }}
                    render={({ field }) => <OutlinedInput {...field} type="password" label="Contraseña" />}
                  />
                </FormControl>
              </Grid>
            )}

            {/* Mostrar bloque de contraseña solo si es edición */}
            {isEdit && (
              <>
                <Grid md={12} xs={12}>
                  <Divider></Divider>
                </Grid>
                <Grid md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Contraseña</InputLabel>
                    <OutlinedInput type="password" value="********" label="Contraseña" disabled />
                  </FormControl>
                </Grid>
                <Grid md={6} xs={12}>
                  <Button variant="outlined" onClick={() => setModalOpen(true)}>Cambiar contraseña</Button>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
        <Divider />

        {/* Sección de botones de acción */}
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant='contained'>Guardar cambios</Button>
          <Button component={RouterLink} href={paths.dashboard.users} variant='outlined'>Cancelar</Button>
        </CardActions>
      </Card>

      {/* Modal para cambiar contraseña */}
      <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
        <Card sx={{ maxWidth: 400, margin: 'auto', marginTop: '10%', padding: 2 }}>
          <CardContent>
            <Typography variant="h6">Cambiar Contraseña</Typography>
            <TextField
              fullWidth
              label="Nueva contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Reingresar nueva contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </CardContent>
          <CardActions>
            <Button variant="contained" onClick={handlePasswordChange}>Guardar</Button>
            <Button onClick={() => setModalOpen(false)} variant="outlined">Cancelar</Button>
          </CardActions>
        </Card>
      </Modal>
    </form>
  );
}