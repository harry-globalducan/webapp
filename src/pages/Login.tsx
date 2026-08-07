import { useMemo, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Gift,
  ChevronDown,
  Loader2,
  AlertCircle,
  MailCheck,
} from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'

type Tab = 'signin' | 'register'

export default function Login() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { register, login } = useAuth()

  // Mobile-app referral links arrive as /register?referralCode=XXXX
  const incomingReferral = params.get('referralCode') ?? params.get('ref') ?? ''
  const wantsRegister = pathname === '/register' || params.get('mode') === 'register'

  const [tab, setTab] = useState<Tab>(wantsRegister ? 'register' : 'signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [referral, setReferral] = useState(incomingReferral)
  const [referralOpen, setReferralOpen] = useState(!!incomingReferral)
  const [agree, setAgree] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const isRegister = tab === 'register'

  const passwordMismatch = useMemo(
    () => isRegister && confirm.length > 0 && password !== confirm,
    [isRegister, confirm, password],
  )

  const switchTab = (t: Tab) => {
    setTab(t)
    setError(null)
    setNotice(null)
  }

  const handleForgotPassword = async () => {
    setError(null)
    setNotice(null)
    if (!email.trim()) {
      setError('Enter your email address first, then tap “Forgot password?”.')
      return
    }
    setBusy(true)
    try {
      await api.forgotPassword(email.trim())
      setNotice(`If an account exists for ${email.trim()}, we've sent a password reset link.`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send the reset email.')
    } finally {
      setBusy(false)
    }
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }
    if (isRegister) {
      if (password.length < 8) {
        setError('Password must be at least 8 characters.')
        return
      }
      if (password !== confirm) {
        setError('Passwords do not match.')
        return
      }
      if (!agree) {
        setError('Please accept the Terms & Conditions and Privacy Policy.')
        return
      }
    }

    setBusy(true)
    try {
      if (isRegister) {
        await register({
          email: email.trim(),
          password,
          referralCode: referral.trim() || undefined,
        })
      } else {
        await login({ email: email.trim(), password })
      }
      const redirect = params.get('redirect')
      navigate(redirect ? decodeURIComponent(redirect) : '/account')
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setBusy(false)
    }
  }

  const inputBase =
    'w-full rounded-2xl border bg-white py-3.5 pl-11 pr-12 text-sm shadow-sm outline-none transition focus:border-navy-400 dark:bg-black dark:text-white'

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mx-auto">
        <Logo />
      </div>
      <h1 className="mt-8 text-center text-3xl font-bold tracking-tight">
        {isRegister ? 'Create account' : 'Welcome back'}
      </h1>
      <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
        {isRegister
          ? 'Join Global Ducan and shop India, worldwide.'
          : 'Sign in to keep shopping the world.'}
      </p>

      <div className="mt-8 grid grid-cols-2 rounded-full border border-navy-900/10 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-black">
        {(['signin', 'register'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => switchTab(t)}
            className={`rounded-full py-2.5 text-sm font-semibold transition ${
              tab === t
                ? 'bg-navy-800 text-white shadow dark:bg-white dark:text-navy-900'
                : 'text-navy-800/60 hover:text-navy-900 dark:text-white dark:hover:text-cream-50'
            }`}
          >
            {t === 'signin' ? 'Sign in' : 'Register'}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-5 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {notice && (
        <div className="mt-5 flex items-start gap-2 rounded-2xl border border-leaf-300 bg-leaf-50 px-4 py-3 text-sm text-leaf-800 dark:border-leaf-500/30 dark:bg-leaf-500/10 dark:text-leaf-300">
          <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={`${inputBase} border-navy-900/10 dark:border-white/10`}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
          <input
            type={showPassword ? 'text' : 'password'}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={`${inputBase} border-navy-900/10 dark:border-white/10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-500"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {isRegister && (
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
            <input
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              className={`${inputBase} ${
                passwordMismatch
                  ? 'border-red-300 focus:border-red-400 dark:border-red-500/40'
                  : 'border-navy-900/10 dark:border-white/10'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-500"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        )}

        {isRegister && (
          <div className="overflow-hidden rounded-2xl border border-navy-900/10 dark:border-white/10">
            <button
              type="button"
              onClick={() => setReferralOpen((v) => !v)}
              className="flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold text-navy-700 transition hover:bg-navy-50 dark:text-white dark:hover:bg-white/5"
            >
              <Gift className="h-4 w-4 text-tangerine-500" />
              Have a referral code?
              <ChevronDown
                className={`h-4 w-4 text-navy-400 transition ${referralOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {referralOpen && (
              <div className="border-t border-navy-900/8 p-3 dark:border-white/10">
                <input
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                  placeholder="Enter referral code (optional)"
                  className="w-full rounded-xl border border-navy-900/10 bg-white px-4 py-3 text-sm uppercase tracking-wide shadow-sm outline-none transition focus:border-navy-400 dark:border-white/10 dark:bg-black dark:text-white"
                />
              </div>
            )}
          </div>
        )}

        {isRegister && (
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-navy-900/20 accent-tangerine-500"
            />
            <span>
              I agree to the{' '}
              <Link to="/terms" className="font-semibold text-navy-600 hover:underline dark:text-navy-200">
                Terms &amp; Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="font-semibold text-navy-600 hover:underline dark:text-navy-200">
                Privacy Policy
              </Link>
            </span>
          </label>
        )}

        {!isRegister && (
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={busy}
              className="text-xs font-semibold text-navy-500 transition hover:text-navy-700 disabled:opacity-60 dark:text-navy-300"
            >
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-navy-800 py-3.5 text-sm font-semibold text-white shadow-xl shadow-navy-800/25 transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-tangerine-500 dark:shadow-tangerine-500/20 dark:hover:bg-tangerine-400"
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isRegister ? 'Creating account…' : 'Signing in…'}
            </>
          ) : (
            <>
              {isRegister ? 'Create account' : 'Sign in'}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        {isRegister ? 'Already have an account?' : 'New to Global Ducan?'}{' '}
        <button
          type="button"
          onClick={() => switchTab(isRegister ? 'signin' : 'register')}
          className="font-semibold text-navy-700 hover:underline dark:text-tangerine-300"
        >
          {isRegister ? 'Sign in' : 'Create one'}
        </button>
      </p>

      <Link
        to="/"
        className="mt-3 text-center text-sm font-medium text-slate-500 transition hover:text-navy-800 dark:text-slate-400"
      >
        Continue as guest
      </Link>
    </main>
  )
}
