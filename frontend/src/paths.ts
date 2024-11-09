import { profile } from "console";

export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    //account: '/dashboard/account',
    profile: '/dashboard/profile',
    users: '/dashboard/users',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    new: '/dashboard/users/new',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
