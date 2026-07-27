import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import * as api from '../lib/api'
import type { AuthUser, RegisterInput, LoginInput } from '../lib/api'

interface AuthContextValue {
  /** True when a 401/403 forced a sign-out, so the UI can explain it. */
  sessionExpired: boolean
  clearSessionExpired: () => void
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
    const stored = raw ? (JSON.parse(raw) as StoredAuth) : null
    // Prime the client synchronously. Child providers fetch in their own
    // effects, which React runs *before* this provider's effects — without
    // this the first requests after a refresh would go out with no token,
    // 403, and trip the auth-failure handler into signing the user out.
    api.setAuthToken(stored?.token ?? null)
    return stored
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(load)
  const [sessionExpired, setSessionExpired] = useState(false)

  // Only a 401 means the stored token is dead. Clear it so the UI drops back
  // to the signed-out state, and flag it so we can explain the sign-out rather
  // than doing it silently. A 403 is surfaced as an error and leaves the
  // session intact.
  useEffect(() => {
    api.setAuthFailureHandler(() => {
      setAuth((prev) => {
        if (prev) setSessionExpired(true)
        return null
      })
    })
    return () => api.setAuthFailureHandler(null)
  }, [])

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

  const logout = () => {
    setAuth(null)
    setSessionExpired(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user ?? null,
        token: auth?.token ?? null,
        isAuthed: !!auth?.token,
        register,
        login,
        logout,
        sessionExpired,
        clearSessionExpired: () => setSessionExpired(false),
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
