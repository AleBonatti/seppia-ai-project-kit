import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AuthLayout } from '../components/AuthLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useForgotPassword } from '../hooks/useForgotPassword'

const schema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (values: FormValues) => {
    forgotPassword.mutate(values)
  }

  return (
    // Replace "Project Name" with the project name from .claude/specs/project.md
    <AuthLayout title="Project Name">
      {forgotPassword.isSuccess ? (
        // Success state — inline confirmation, no redirect
        <div className="text-center py-2">
          <p className="text-[15px] font-semibold text-(--selected) mb-2">Check your email</p>
          <p className="text-[13.5px] text-(--muted) mb-6">
            We've sent a password reset link to your email address.
          </p>
          <Link
            to="/login"
            className="text-[13.5px] font-semibold no-underline text-(--accent) hover:opacity-80 transition-opacity"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-center text-[23px] font-medium tracking-[-0.02em] text-(--selected) m-0 mb-1.5">
            Forgot password?
          </h1>
          <p className="text-center text-[14px] text-(--muted) m-0 mb-6">
            Enter your email and we'll send you a reset link.
          </p>

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

            {forgotPassword.isError && (
              <p className="mb-4 text-[13px] text-red-400 text-center">
                Something went wrong. Please try again.
              </p>
            )}

            <Button type="submit" variant="primary" size="lg" isLoading={forgotPassword.isPending} className="w-full">
              Send reset link
            </Button>
          </form>

          <p className="text-center text-[13.5px] text-(--muted) mt-5">
            <Link to="/login" className="font-semibold text-(--ink) no-underline hover:text-(--accent) transition-colors">
              Back to sign in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  )
}
