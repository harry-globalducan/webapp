import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** Redirects to the login page (with a return path) when the user is not signed in. */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthed } = useAuth()
  const location = useLocation()

  if (!isAuthed) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }
  return <>{children}</>
}
