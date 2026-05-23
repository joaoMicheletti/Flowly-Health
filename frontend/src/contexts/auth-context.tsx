import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { api } from '@/services/api';

interface User {
  id: string;

  name: string;

  email: string;

  role: string;
}

interface AuthContextData {
  user: User | null;

  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext =
  createContext(
    {} as AuthContextData,
  );

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  async function loadUser() {
    try {
      const response =
        await api.get('/auth/me');

      setUser(response.data);
      console.log(response)
    } catch (error) {
      console.error(error);
    }
  }

  function signOut() {
    localStorage.removeItem(
      'token',
    );

    setUser(null);
  }

  useEffect(() => {
    const token =
      localStorage.getItem('token');

    if (token) {
      loadUser();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}