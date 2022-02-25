import React from 'react';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

interface AuthProviderProps {
  children: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthorizationResponse {
  params: {
    access_token: string,
  };
  type: string;
}

interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
  userStorageLoading: boolean;
}

const AuthContext = React.createContext({} as IAuthContextData);

export const AuthProvider = ({
  children,

}: AuthProviderProps) => {
  const [user, setUser] = React.useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = React.useState(true);
  const userStorageKey = '@gofinances:user';

  const signInWithGoogle = async () => {
    try {
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { params ,type } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;

      if(type === 'success') {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`)
        const userInfo = await response.json();
        setUser({
          email: userInfo.email,
          id: userInfo.id,
          name: userInfo.given_name,
          photo: userInfo.picture,
        })
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userInfo));
      }

    } catch (error: any) {
      throw new Error(error)
    }
  }

  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      })
      if(credential) {
        const name = credential.fullName?.givenName!;
        const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;
        const userLogged = {
          id: String(credential.user),
          email: credential.email!,
          name,
          photo,
        }
        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  const signOut = async () => {
    setUser({} as User);
    await AsyncStorage.removeItem(userStorageKey);
  }

  React.useEffect(() => {
    const loadUserStorageData = async () => {
      const userStoraged = await AsyncStorage.getItem(userStorageKey);

      if(userStoraged) {
        const userLogged = JSON.parse(userStoraged) as User;
        setUser(userLogged);
      }
      setUserStorageLoading(false);
    }
    loadUserStorageData();
  },[])
  
  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
      signInWithApple,
      signOut,
      userStorageLoading,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext);