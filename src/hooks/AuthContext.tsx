import React from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
}

const AuthContext = React.createContext({} as IAuthContextData);

export const AuthProvider = ({
  children,

}: AuthProviderProps) => {
  const user = {
    id: '1231467123',
    name: 'Nitael Morais',
    email: 'Nitael@gmail.com',
  }
  
  return (
    <AuthContext.Provider value={{
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext);