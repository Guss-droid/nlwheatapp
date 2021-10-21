import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session'
import { api } from '../services/api';

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string
}

type AuthContextData = {
  user: User | null;
  isSignIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

type AuthProviderProps = {
  children: React.ReactNode
}

type AuthResponse = {
  token: string;
  user: User
}

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string
  };
  type?: string;

}

const CLIENT_ID = '5d4a9fe6daf16a09e113'
const SCOPE = 'read:user'
const USER_STORAGE = '@nlwheat:user'
const TOKEN_STORAGE = '@nlwheat:token'

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {

  const [isSignIn, setIsSignIn] = useState(true)
  const [user, setUser] = useState<User | null>(null)


  async function signIn() {
    try {
      setIsSignIn(true)
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`
      const authSessionRes = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse

      if (authSessionRes.type === 'success' && authSessionRes.params.error !== 'access_denied') {
        const authResponse = await api.post('/authenticate', { code: authSessionRes.params.code })
        const { user, token } = authResponse.data as AuthResponse

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
        await AsyncStorage.setItem(TOKEN_STORAGE, token)

        setUser(user)
      }

    } catch (error) {
      console.log(error)
    } finally {
      setIsSignIn(false)
    }
  }

  async function signOut() {
    setUser(null)
    await AsyncStorage.removeItem(USER_STORAGE)
    await AsyncStorage.removeItem(TOKEN_STORAGE)
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userStorage = await AsyncStorage.getItem(USER_STORAGE)
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE)

      if (USER_STORAGE && TOKEN_STORAGE) {
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`
        setUser(JSON.parse(userStorage!))
      }

      setIsSignIn(false)
    }

    loadUserStorageData()
  }, [])

  return (
    <AuthContext.Provider value={{
      isSignIn,
      signIn,
      signOut,
      user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext)

  return context
}

export { AuthProvider, useAuth }