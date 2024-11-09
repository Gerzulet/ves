'use client';

import * as React from 'react';
import type { User } from '@/types/user'; // Importar la interfaz User desde el archivo de tipos
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
    user: null,
    error: null,
    isLoading: true,
  });

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      // Obtener el usuario logueado desde la API o servicio de autenticación
      const { data, error } = await authClient.getUser();
      console.log("Datos obtenidos de authClient.getUser():", data); // <-- Verifica los datos recibidos
      console.log("Error en la obtención de datos:", error);         // <-- Verifica si hubo algún error

      if (error) {
        logger.error(error);
        setState((prev) => ({ ...prev, user: null, error: 'Error al cargar la sesión', isLoading: false }));
        return;
      }

      // Asignar todas las propiedades de `userObject` a `userData` directamente
      const userData: User | null = data ? { ...data } : null;

      console.log("userData después de la asignación:", userData);  // <-- Verifica la estructura del userData

      setState((prev) => ({ ...prev, user: userData, error: null, isLoading: false }));
    } catch (err) {
      logger.error(err);
      setState((prev) => ({ ...prev, user: null, error: 'Error al cargar la sesión', isLoading: false }));
    }
  }, []);

  React.useEffect(() => {
    checkSession().catch((err: unknown) => {
      logger.error(err);
    });
  }, [checkSession]);

  return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
