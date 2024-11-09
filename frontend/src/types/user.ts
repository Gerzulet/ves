export interface User {
  id?: number;
  name: string;
  last_name: string;
  email: string;
  password?: string;
  dni: string;
  cuil: string;
  role: string;
  photo: string;
  email_verified_at: string;
  registry_expires_at: string;
  exams_expires_at: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  accountId: string;
  address?: string;
  phone_number: string;
}
