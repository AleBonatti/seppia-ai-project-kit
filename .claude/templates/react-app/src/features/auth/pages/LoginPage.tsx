import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useLogin } from '../hooks/useLogin'

const schema = z.object({
  email:    z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(1, 'Required'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(false)
  const login = useLogin()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (values: FormValues) => {
    login.mutate(values)
  }

  return (
    // Replace "Project Name" with the project name from .claude/specs/project.md
    <AuthLayout title="Project Name">
      <h1 className="text-center text-[23px] font-medium tracking-[-0.02em] text-(--selected) m-0 mb-1.5">
        Sign in
      </h1>

      {/* Google sign-in */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-[11px] text-[14.5px] font-semibold rounded-[7px] cursor-pointer mt-[22px] transition-[border-color]"
        style={{ padding: 13, background: 'var(--field)', color: 'var(--ink)', border: '1px solid var(--border)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--muted)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
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
      <div className="flex items-center gap-3.5 text-[12px] tracking-[.08em] my-[22px]" style={{ color: 'var(--faint)' }}>
        <span className="flex-1 h-px bg-(--border)" />
        OR
        <span className="flex-1 h-px bg-(--border)" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="email"
          label="Email"
          type="text"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="text-right -mt-2 mb-4">
          <Link
            to="/forgot-password"
            className="text-[13px] no-underline transition-colors text-(--muted) hover:text-(--accent)"
          >
            Forgot password?
          </Link>
        </div>

        {/* Remember me */}
        <label
          className="flex items-center gap-2.5 cursor-pointer select-none text-[14px]"
          style={{ margin: '4px 0 24px' }}
        >
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={e => setRememberMe(e.target.checked)}
            className="sr-only"
          />
          <span
            className="w-5 h-5 rounded-md border grid place-items-center flex-none transition-[background,border-color]"
            style={{
              background:  rememberMe ? 'var(--accent)'     : 'var(--field)',
              borderColor: rememberMe ? 'var(--accent)'     : 'var(--field-border)',
              color:       rememberMe ? 'var(--accent-ink)' : 'transparent',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-[13px] h-[13px]">
              <polyline points="4 12 10 18 20 6" />
            </svg>
          </span>
          Remember Me
        </label>

        {login.isError && (
          <p className="mb-4 text-[13px] text-red-400 text-center">
            Invalid email or password.
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" isLoading={login.isPending} className="w-full">
          Sign in
        </Button>
      </form>
    </AuthLayout>
  )
}
