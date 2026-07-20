import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react'
import Logo from '../components/Logo'

export default function Login() {
  const [tab, setTab] = useState<'signin' | 'register'>('signin')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mx-auto">
        <Logo />
      </div>
      <h1 className="mt-8 text-center text-3xl font-bold tracking-tight">
        {tab === 'signin' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
        {tab === 'signin'
          ? 'Sign in to keep shopping the world.'
          : 'One account for every Indian store, worldwide.'}
      </p>

      <div className="mt-8 grid grid-cols-2 rounded-full border border-navy-900/10 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-black">
        {(['signin', 'register'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
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

      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        {tab === 'register' && (
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
            <input
              placeholder="Full name"
              className="w-full rounded-2xl border border-navy-900/10 bg-white py-3.5 dark:border-white/10 dark:bg-black dark:text-white pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-navy-400"
            />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-2xl border border-navy-900/10 bg-white py-3.5 dark:border-white/10 dark:bg-black dark:text-white pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-navy-400"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full rounded-2xl border border-navy-900/10 bg-white py-3.5 dark:border-white/10 dark:bg-black dark:text-white pl-11 pr-12 text-sm shadow-sm outline-none transition focus:border-navy-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-500"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {tab === 'signin' && (
          <div className="text-right">
            <button type="button" className="text-xs font-semibold text-navy-500 hover:text-navy-700">
              Forgot password?
            </button>
          </div>
        )}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-navy-800 py-3.5 text-sm font-semibold text-white shadow-xl shadow-navy-800/25 transition hover:bg-navy-700"
        >
          {tab === 'signin' ? 'Sign in' : 'Create account'} <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <Link to="/" className="mt-5 text-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-navy-800">
        Continue as guest
      </Link>
    </main>
  )
}
