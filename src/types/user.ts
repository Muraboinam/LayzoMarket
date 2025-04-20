export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  password: string;
  createdAt: string;
}