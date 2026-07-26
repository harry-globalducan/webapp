import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import * as api from '../lib/api'
import type { AuthUser, RegisterInput, LoginInput } from '../lib/api'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthed: boolean
  register: (input: RegisterInput) => Promise<AuthUser>
  login: (input: LoginInput) => Promise<AuthUser>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const STORAGE_KEY = 'ducan-auth'

interface StoredAuth {
  token: string
  user: AuthUser
}

function load(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredAuth) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(load)

  // Keep the API client's bearer token in sync with stored auth.
  useEffect(() => {
    api.setAuthToken(auth?.token ?? null)
    try {
      if (auth) localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // memory only
    }
  }, [auth])

  /**
   * The signin/signup responses only carry a JWT, so fetch the real profile
   * from GET /users/me. Falls back to the seed user if that call fails.
   */
  const hydrate = async (token: string, seed: AuthUser): Promise<AuthUser> => {
    api.setAuthToken(token)
    try {
      const me = await api.getMe()
      const name = [me.firstName, me.lastName].filter(Boolean).join(' ').trim() || undefined
      return {
        id: me.id != null ? String(me.id) : undefined,
        email: me.email ?? seed.email,
        firstName: me.firstName,
        lastName: me.lastName,
        phone: me.phone,
        name,
      }
    } catch {
      return seed
    }
  }

  const register: AuthContextValue['register'] = async (input) => {
    const res = await api.register(input)
    const user = await hydrate(res.token, res.user)
    setAuth({ token: res.token, user })
    return user
  }

  const login: AuthContextValue['login'] = async (input) => {
    const res = await api.login(input)
    const user = await hydrate(res.token, res.user)
    setAuth({ token: res.token, user })
    return user
  }

  const logout = () => setAuth(null)

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user ?? null,
        token: auth?.token ?? null,
        isAuthed: !!auth?.token,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
