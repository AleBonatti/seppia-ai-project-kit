import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye01Icon, EyeOffIcon, Moon02Icon, Sun03Icon } from '@/lib/icons'
import { useLogin } from '../hooks/useLogin'
import { useTheme } from '@/components/layout/useTheme'

const schema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(1, 'Required'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const { theme, setTheme } = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const login = useLogin()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (values: FormValues) => {
    login.mutate(values)
  }

  return (
    <div
      className="min-h-screen grid place-items-center p-8"
      style={{ background: 'var(--bg)' }}
    >
      {/* Theme toggle */}
      <button
        type="button"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        title="Toggle theme"
        className="fixed top-[18px] right-[18px] w-10 h-10 grid place-items-center rounded-[10px] border border-[--border] text-[--muted] cursor-pointer hover:text-[--ink] transition-colors"
        style={{ background: 'var(--box)' }}
      >
        {theme === 'dark'
          ? <Sun03Icon size={19} strokeWidth={1.8} />
          : <Moon02Icon size={19} strokeWidth={1.8} />
        }
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full"
        style={{
          maxWidth: 388,
          background: 'var(--box)',
          border: '1px solid var(--border)',
          borderRadius: 13,
          padding: '34px 32px 30px',
          boxShadow: '0 24px 60px -24px rgba(0,0,0,.6)',
        }}
      >
        {/* Brand */}
        <div className="flex items-center justify-center gap-1 mb-[30px]">
          <span className="w-[46px] h-[46px] text-[--accent] grid place-items-center" style={{ color: 'var(--accent)' }}>
            <svg viewBox="0 0 512 512" fill="currentColor" className="w-full h-full block" aria-hidden="true">
              <path d="M455.6 349.2c-45.891-39.09-36.67-77.877-16.095-128.11C475.16 134.04 415.967 34.14 329.93 8.3C237.04-19.6 134.252 24.341 99.677 117.147a180.9 180.9 0 0 0-10.988 73.544c1.733 29.543 14.717 52.97 24.09 80.3c17.2 50.161-28.1 92.743-66.662 117.582c-46.806 30.2-36.319 39.857-8.428 41.858c23.378 1.68 44.478-4.548 65.265-15.045c9.2-4.647 40.687-18.931 45.13-28.588c-12.184 26.59-36.962 72.702-21.463 102.102c19.1 36.229 67.112-31.77 76.709-45.812c8.591-12.572 42.963-81.279 63.627-46.926c18.865 31.361 8.6 76.391 35.738 104.622c32.854 34.2 51.155-18.312 51.412-44.221c.163-16.411-6.1-95.852 29.9-59.944c21.421 21.381 52.905 71.181 88.561 67.023c38.736-4.516-22.123-67.967-28.262-78.695c5.393 4.279 53.665 34.128 53.818 9.52c.11-18.789-30.085-34.667-42.524-45.267" />
            </svg>
          </span>
          {/* Replace "Project Name" with the actual project name from the spec */}
          <span className="text-[40px] font-medium tracking-[-0.04em] text-[--ink]">Project Name</span>
        </div>

        <h1 className="text-center text-[23px] font-medium tracking-[-0.02em] text-[--selected] m-0 mb-1.5">
          Sign in
        </h1>
        <p className="text-center text-[--muted] text-[14px] m-0 mb-6">
          Welcome back
        </p>

        {/* Email */}
        <div className="mb-[18px]">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="email" className="text-[13.5px] font-semibold text-[--ink]">
              Email
            </label>
          </div>
          <input
            id="email"
            type="text"
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email')}
            className="w-full px-[15px] py-3.5 text-[14.5px] rounded-[7px] outline-none transition-[border-color,box-shadow] text-[--ink] focus:border-[--accent] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_22%,transparent)]"
            style={{
              background: 'var(--field)',
              border: errors.email ? '1px solid #e5484d' : '1px solid var(--field-border)',
            }}
          />
          {errors.email && (
            <p className="mt-1.5 text-[12.5px] text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="text-[13.5px] font-semibold text-[--ink]">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[13px] text-[--muted] no-underline hover:text-[--accent] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
              className="w-full px-[15px] py-3.5 pr-[46px] text-[14.5px] rounded-[7px] outline-none transition-[border-color,box-shadow] text-[--ink]"
              style={{
                background: 'var(--field)',
                border: errors.password ? '1px solid #e5484d' : '1px solid var(--field-border)',
                boxShadow: 'none',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.boxShadow = 'color-mix(in srgb, var(--accent) 22%, transparent) 0 0 0 3px'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = errors.password ? '#e5484d' : 'var(--field-border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-2 w-[38px] h-[38px] grid place-items-center bg-transparent border-none text-[--muted] cursor-pointer rounded-lg hover:text-[--ink] transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword
                ? <EyeOffIcon size={20} strokeWidth={1.8} />
                : <Eye01Icon size={20} strokeWidth={1.8} />
              }
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-[12.5px] text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Login error */}
        {login.isError && (
          <p className="mb-4 text-[13px] text-red-400 text-center">
            Invalid email or password.
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={login.isPending}
          className="w-full py-3.5 text-[15px] font-bold rounded-[7px] border-none cursor-pointer transition-[filter] hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
        >
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
