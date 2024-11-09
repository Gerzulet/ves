'use client';

import { storeCookie } from '@/services/auth.service';
import type { User } from '@/types/user';

// Genera un token aleatorio
 /*function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}*/

// Usuario por defecto
/*const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;*/

// Interfaces para los diferentes parámetros de autenticación
export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  dni: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

// Clase de cliente de autenticación con métodos para autenticación y manejo de sesiones
class AuthClient {
 /* async signUp(_: SignUpParams): Promise<{ error?: string }> {
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);
    return {};
  }*/

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string; token?: string }> {
    const { dni, password } = params;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni, password }),
      });

            console.log('Response status:', response.status); // Ver el código de estado de la respuesta

      if (!response.ok) {
        const errorResponse = await response.json();
        return { error: errorResponse.message || 'Credenciales inválidas' };
      }

      const data = await response.json();

      if (data && data.token) {
        localStorage.setItem('custom-auth-token', data.token);
       storeCookie(data.token);
        return { token: data.token };
      }

      return { error: 'No se recibió un token de autenticación' };
    } catch (error) {
      return { error: 'Error en el servidor. Inténtalo de nuevo.' };
    }
  }

  // Nuevo método getUser para obtener la información del usuario desde el backend
  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    try {
      // Hacer una solicitud al backend para obtener los datos del usuario autenticado
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/getUser`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token en los headers
        },
      });

      if (!response.ok) {
        return { error: 'No se pudo obtener la información del usuario.' };
      }

      // Obtener los datos del usuario del backend
      const userData = await response.json();
      console.log("userData recibido desde el backend:", JSON.stringify(userData, null, 2)); // <-- Verificar la estructura exacta

      return { data: userData };
    } catch (error) {
      return { error: 'Error al obtener la información del usuario desde el servidor.' };
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    return {};
  }
}

export const authClient = new AuthClient();
