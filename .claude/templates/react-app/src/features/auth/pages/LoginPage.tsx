import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { EyeIcon, EyeOffIcon, Moon02Icon, Sun03Icon } from '@/lib/icons'
import { useLogin } from '../hooks/useLogin'
import { useTheme } from '@/components/layout/useTheme'

const schema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(1, 'Required'),
})

type FormValues = z.infer<typeof schema>

// Login page has its own token set — separate from the admin shell.
// --card is the card background; --bg is the page background.
// These differ from the admin shell's --box / --bg values.
const loginTokens = `
  html[data-theme="dark"] {
    --login-bg: #09090b;
    --login-card: #18181b;
    --login-border: #27272a;
    --login-field: #18181b;
    --login-mark: var(--accent);
  }
  html[data-theme="light"] {
    --login-bg: #F4F4F5;
    --login-card: #FFFFFF;
    --login-border: #E7E7E9;
    --login-field: #FAFAFA;
    --login-mark: #1c1c1f;
  }
`

export default function LoginPage() {
  const { theme, setTheme } = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const login = useLogin()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (values: FormValues) => {
    login.mutate(values)
  }

  return (
    <>
      <style>{loginTokens}</style>

      <div
        className="min-h-screen grid place-items-center"
        style={{ background: 'var(--login-bg)', color: 'var(--ink)', padding: 32 }}
      >
        {/* Theme toggle — fixed top-right, uses --login-card background */}
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle theme"
          aria-label="Toggle theme"
          className="fixed top-[18px] right-[18px] w-10 h-10 grid place-items-center rounded-[10px] border text-(--muted) cursor-pointer hover:text-(--ink) transition-colors"
          style={{ background: 'var(--login-card)', borderColor: 'var(--login-border)' }}
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
            background: 'var(--login-card)',
            border: '1px solid var(--login-border)',
            borderRadius: 13,
            padding: '34px 32px 30px',
            boxShadow: '0 24px 60px -24px rgba(0,0,0,.6)',
          }}
        >
          {/* Brand — mark uses --login-mark (accent in dark, dark ink in light) */}
          <div className="flex items-center justify-center gap-1 mb-[30px]">
            <span className="w-[46px] h-[46px] grid place-items-center" style={{ color: 'var(--login-mark)' }}>
              <svg viewBox="0 0 512 512" fill="currentColor" className="w-full h-full block" aria-hidden="true">
                <path d="M455.6 349.2c-45.891-39.09-36.67-77.877-16.095-128.11C475.16 134.04 415.967 34.14 329.93 8.3C237.04-19.6 134.252 24.341 99.677 117.147a180.9 180.9 0 0 0-10.988 73.544c1.733 29.543 14.717 52.97 24.09 80.3c17.2 50.161-28.1 92.743-66.662 117.582c-46.806 30.2-36.319 39.857-8.428 41.858c23.378 1.68 44.478-4.548 65.265-15.045c9.2-4.647 40.687-18.931 45.13-28.588c-12.184 26.59-36.962 72.702-21.463 102.102c19.1 36.229 67.112-31.77 76.709-45.812c8.591-12.572 42.963-81.279 63.627-46.926c18.865 31.361 8.6 76.391 35.738 104.622c32.854 34.2 51.155-18.312 51.412-44.221c.163-16.411-6.1-95.852 29.9-59.944c21.421 21.381 52.905 71.181 88.561 67.023c38.736-4.516-22.123-67.967-28.262-78.695c5.393 4.279 53.665 34.128 53.818 9.52c.11-18.789-30.085-34.667-42.524-45.267" />
              </svg>
            </span>
            {/* Replace "Project Name" with the actual project name from the spec */}
            <span className="text-[40px] font-medium tracking-[-0.04em] text-(--ink)">Project Name</span>
          </div>

          <h1 className="text-center text-[23px] font-medium tracking-[-0.02em] text-(--selected) m-0 mb-1.5">
            Sign in
          </h1>

          {/* Google sign-in button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-[11px] text-[14.5px] font-semibold rounded-[7px] cursor-pointer transition-[border-color] mt-[22px]"
            style={{
              padding: 13,
              background: 'var(--login-field)',
              color: 'var(--ink)',
              border: '1px solid var(--login-border)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--muted)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--login-border)' }}
          >
            <svg viewBox="0 0 48 48" className="w-[19px] h-[19px] flex-none">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 16.3 4.5 9.7 8.8 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 43.5c5.4 0 10.3-2.1 14-5.4l-6.5-5.5c-2 1.5-4.7 2.4-7.5 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.1 16.2 43.5 24 43.5z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.5 5.5c-.5.4 7.3-5.3 7.3-15.6 0-1.2-.1-2.3-.4-3.5z"/>
            </svg>
            Sign in with Google
          </button>

          {/* OR divider */}
          <div
            className="flex items-center gap-3.5 text-[12px] tracking-[.08em] my-[22px]"
            style={{ color: 'var(--faint)' }}
          >
            <span className="flex-1 h-px" style={{ background: 'var(--login-border)' }} />
            OR
            <span className="flex-1 h-px" style={{ background: 'var(--login-border)' }} />
          </div>

          {/* Email */}
          <div className="mb-[18px]">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="email" className="text-[13.5px] font-semibold whitespace-nowrap" style={{ color: 'var(--ink)' }}>
                Email
              </label>
            </div>
            <input
              id="email"
              type="text"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email')}
              className="w-full text-[14.5px] rounded-[7px] outline-none"
              style={{
                padding: '14px 15px',
                background: 'var(--login-field)',
                color: 'var(--ink)',
                border: errors.email ? '1px solid #e5484d' : '1px solid #3f3f47',
                transition: 'border-color .14s, box-shadow .14s',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent)'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = errors.email ? '#e5484d' : '#3f3f47'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            {errors.email && (
              <p className="mt-1.5 text-[12.5px] text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-[18px]">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="text-[13.5px] font-semibold whitespace-nowrap" style={{ color: 'var(--ink)' }}>
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[13px] no-underline transition-colors whitespace-nowrap"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)' }}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register('password')}
                className="w-full text-[14.5px] rounded-[7px] outline-none"
                style={{
                  padding: '14px 15px',
                  paddingRight: 46,
                  background: 'var(--login-field)',
                  color: 'var(--ink)',
                  border: errors.password ? '1px solid #e5484d' : '1px solid #3f3f47',
                  transition: 'border-color .14s, box-shadow .14s',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = errors.password ? '#e5484d' : '#3f3f47'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-2 w-[38px] h-[38px] grid place-items-center bg-transparent border-none cursor-pointer rounded-lg transition-colors"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--ink)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword
                  ? <EyeOffIcon size={20} strokeWidth={1.8} />
                  : <EyeIcon size={20} strokeWidth={1.8} />
                }
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-[12.5px] text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me */}
          <label
            className="flex items-center gap-2.5 cursor-pointer select-none text-[14px] mb-6"
            style={{ margin: '4px 0 24px' }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="absolute opacity-0 w-0 h-0"
            />
            <span
              className="w-5 h-5 rounded-md border grid place-items-center flex-none transition-[background,border-color]"
              style={{
                background: rememberMe ? 'var(--accent)' : 'var(--login-field)',
                borderColor: rememberMe ? 'var(--accent)' : 'var(--login-border)',
                color: rememberMe ? 'var(--accent-ink)' : 'transparent',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-[13px] h-[13px]">
                <polyline points="4 12 10 18 20 6" />
              </svg>
            </span>
            Remember Me
          </label>

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
            className="w-full text-[15px] font-bold rounded-[7px] border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              padding: 14,
              background: 'var(--accent)',
              color: 'var(--accent-ink)',
              transition: 'filter .14s',
            }}
            onMouseEnter={e => { if (!login.isPending) e.currentTarget.style.filter = 'brightness(.94)' }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'none' }}
          >
            {login.isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </>
  )
}
