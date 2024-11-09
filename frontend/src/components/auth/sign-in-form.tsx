'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  dni: zod
    .string()
    .min(1, { message: 'DNI es obligatorio' })
    .regex(/^\d{8}$/, { message: 'DNI debe tener exactamente 8 dígitos' }),
  password: zod.string().min(1, { message: 'Password es obligatorio' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { dni: '31438216', password: 'admin' } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const { checkSession } = useUser();
  
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      // Usar authClient para autenticar
      const { error, token } = await authClient.signInWithPassword({
        dni: values.dni,
        password: values.password,
      });

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      // Si el login es exitoso, guardar el token
      if (token) {
        localStorage.setItem('authToken', token); // Guardar el token en localStorage
      }

      // Actualizar el estado de la sesión
      await checkSession?.();

      // Redirigir a /dashboard
      router.refresh();
    },
    [checkSession, router, setError]
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Inicia sesión</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="dni"
            render={({ field }) => (
              <FormControl error={Boolean(errors.dni)}>
                <InputLabel>DNI</InputLabel>
                <OutlinedInput
                  {...field}
                  label="DNI"
                  inputProps={{ maxLength: 8 }} // Limita la longitud a 8 caracteres
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, ''); // Solo permitir números
                    field.onChange(value.slice(0, 8)); // Limita a 8 caracteres numéricos
                  }}
                />
                {errors.dni ? <FormHelperText>{errors.dni.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Contraseña</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <div>
            <Link component={RouterLink} href={paths.auth.resetPassword} variant="body2">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Iniciar Sesión
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
