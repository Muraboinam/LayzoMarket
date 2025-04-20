export interface Admin {
  username: string;
  password: string;
}

export const defaultAdmin: Admin = {
  username: 'admin',
  password: 'admin123'
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('adminToken') !== null;
};

export const login = (username: string, password: string): boolean => {
  // Convert both input and stored credentials to lowercase for case-insensitive comparison
  const inputUsername = username.toLowerCase();
  const inputPassword = password;
  const storedUsername = defaultAdmin.username.toLowerCase();
  const storedPassword = defaultAdmin.password;

  if (inputUsername === storedUsername && inputPassword === storedPassword) {
    localStorage.setItem('adminToken', 'admin-session-token');
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem('adminToken');
};