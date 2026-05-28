import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const ADMIN_ID = 'admin';
const ADMIN_PASS = 'password';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('admin_auth') === 'true'
  );
  const [error, setError] = useState('');

  const login = (userId, password) => {
    if (userId === ADMIN_ID && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      setError('');
      sessionStorage.setItem('admin_auth', 'true');
      return true;
    }
    setError('ユーザーIDまたはパスワードが正しくありません');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
