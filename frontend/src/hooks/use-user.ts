import type { UserContextValue } from '@/contexts/user-context';
import { UserContext } from '@/contexts/user-context';
import { useContext } from 'react';

export function useUser(): UserContextValue {
  const context = useContext(UserContext);

  if (!context) {
    console.log("useUser está fuera del contexto UserProvider");
    throw new Error('useUser must be used within a UserProvider');
  }

  // console.log("useUser contexto encontrado", context);
  return context;
}
