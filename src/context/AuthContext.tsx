import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import * as SecureStore from 'expo-secure-store'
import * as authApi from '@/src/api/auth'

const TOKEN_KEY = 'auth_token'

interface AuthState {
  token: string | null
  user: unknown | null
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_KEY)
      .then((token) => {
        setState({ token, user: null, isLoading: false })
      })
      .catch(() => {
        setState({ token: null, user: null, isLoading: false })
      })
  }, [])

  const login = async (email: string, password: string) => {
    const { token, user } = await authApi.login(email, password)
    await SecureStore.setItemAsync(TOKEN_KEY, token)
    setState({ token, user, isLoading: false })
  }

  const register = async (email: string, password: string, name: string) => {
    const { token, user } = await authApi.register(email, password, name)
    await SecureStore.setItemAsync(TOKEN_KEY, token)
    setState({ token, user, isLoading: false })
  }

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
    setState({ token: null, user: null, isLoading: false })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
