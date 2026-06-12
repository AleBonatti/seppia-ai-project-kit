import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AuthLayout } from '../components/AuthLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useResetPassword } from '../hooks/useResetPassword'

const schema = z.object({
  password: z.string().min(8, 'At least 8 characters'),
  password_confirmation: z.string().min(1, 'Required'),
}).refine(data => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
})

type FormValues = z.infer<typeof schema>

export default function ResetPasswordPage() {
  // Laravel appends ?token=...&email=... to the reset link
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const email = searchParams.get('email') ?? ''

  const resetPassword = useResetPassword()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (values: FormValues) => {
    resetPassword.mutate({ token, email, ...values })
  }

  // Guard: if no token in URL the link is invalid
  if (!token || !email) {
    return (
      <AuthLayout title="Project Name">
        <div className="text-center py-2">
          <p className="text-[15px] font-semibold text-(--selected) mb-2">Invalid reset link</p>
          <p className="text-[13.5px] text-(--muted) mb-6">
            This link is expired or malformed. Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="text-[13.5px] font-semibold no-underline text-(--accent) hover:opacity-80 transition-opacity"
          >
            Request new link
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    // Replace "Project Name" with the project name from .claude/specs/project.md
    <AuthLayout title="Project Name">
      <h1 className="text-center text-[23px] font-medium tracking-[-0.02em] text-(--selected) m-0 mb-1.5">
        Set new password
      </h1>
      <p className="text-center text-[14px] text-(--muted) m-0 mb-6">
        Choose a strong password for your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="password"
          label="New password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          id="password_confirmation"
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />

        {resetPassword.isError && (
          <p className="mb-4 text-[13px] text-red-400 text-center">
            This reset link has expired. Please request a new one.
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" isLoading={resetPassword.isPending} className="w-full">
          Reset password
        </Button>
      </form>

      <p className="text-center text-[13.5px] text-(--muted) mt-5">
        <Link to="/login" className="font-semibold text-(--ink) no-underline hover:text-(--accent) transition-colors">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
