import { User } from '../types/user';

export const login = (email: string, password: string): boolean => {
  const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem('userToken', JSON.stringify({ id: user.id, email: user.email }));
    return true;
  }
  return false;
};

export const isUserAuthenticated = (): boolean => {
  return localStorage.getItem('userToken') !== null;
};

export const getCurrentUser = (): User | null => {
  const userToken = localStorage.getItem('userToken');
  if (!userToken) return null;

  const { email } = JSON.parse(userToken);
  const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  return users.find(u => u.email === email) || null;
};

export const logout = (): void => {
  localStorage.removeItem('userToken');
};