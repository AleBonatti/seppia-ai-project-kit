import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload01Icon } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SaveBar } from '@/components/ui/SaveBar'
import { useAuth } from '@/features/auth/hooks/useAuth'
// Replace with real mutation hooks:
// import { useUpdateProfile } from '../hooks/useUpdateProfile'
// import { useUpdatePassword } from '../hooks/useUpdatePassword'
// import { useUploadAvatar } from '../hooks/useUploadAvatar'
// import { useDeleteAvatar } from '../hooks/useDeleteAvatar'

// ── Constants ─────────────────────────────────────────────────────────────────

const AVATAR_MAX_BYTES  = 2 * 1024 * 1024        // 2 MB
const AVATAR_ACCEPT     = ['image/jpeg', 'image/png']
const SAVE_DELAY_MS     = 500

// ── Shared form-row layout ────────────────────────────────────────────────────

interface FormRowProps {
  label: string
  help?: string
  children: React.ReactNode
  noBorderTop?: boolean
}

function FormRow({ label, help, children, noBorderTop }: FormRowProps) {
  return (
    <div
      className="grid gap-7 py-5 items-start"
      style={{
        gridTemplateColumns: '220px minmax(0, 1fr)',
        borderTop: noBorderTop ? 'none' : '1px solid var(--border)',
      }}
    >
      <div className="pt-[9px]">
        <span className="text-[14px] font-semibold text-(--ink)">{label}</span>
        {help && <p className="text-[12.5px] text-(--faint) mt-[7px] leading-relaxed">{help}</p>}
      </div>
      <div>{children}</div>
    </div>
  )
}

// ── Password strength meter ───────────────────────────────────────────────────

function passwordScore(v: string): number {
  if (!v) return 0
  let s = 0
  if (v.length >= 8)                       s++
  if (/[0-9]/.test(v))                     s++
  if (/[^A-Za-z0-9]/.test(v))             s++
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++
  return s
}

const STRENGTH_LABEL = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']

// ── Zod schemas ───────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword:     z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string().min(1, 'Required'),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type ProfileValues  = z.infer<typeof profileSchema>
type PasswordValues = z.infer<typeof passwordSchema>

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AccountSettingsPage() {
  const { user } = useAuth()

  // Replace with: const uploadAvatar  = useUploadAvatar()
  // Replace with: const deleteAvatar  = useDeleteAvatar()
  // Replace with: const updateProfile = useUpdateProfile()
  // Replace with: const updatePassword = useUpdatePassword()

  // ── Avatar ──
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatarSrc, setAvatarSrc] = useState<string | null>(
    // Replace with: user?.avatarUrl ?? null
    null
  )
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  function onAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarError(null)

    if (!AVATAR_ACCEPT.includes(file.type)) {
      setAvatarError('Only JPEG and PNG files are allowed.')
      e.target.value = ''
      return
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setAvatarError('Image must be 2 MB or smaller.')
      e.target.value = ''
      return
    }

    // Preview locally while the upload happens
    const reader = new FileReader()
    reader.onload = () => setAvatarSrc(reader.result as string)
    reader.readAsDataURL(file)

    setIsUploadingAvatar(true)
    // Replace with: uploadAvatar.mutate(file, {
    //   onSuccess: () => setIsUploadingAvatar(false),
    //   onError:   () => { setAvatarError('Upload failed. Please try again.'); setIsUploadingAvatar(false) },
    // })
    setTimeout(() => setIsUploadingAvatar(false), SAVE_DELAY_MS)
    e.target.value = ''
  }

  function onAvatarRemove() {
    setAvatarSrc(null)
    setAvatarError(null)
    // Replace with: deleteAvatar.mutate()
  }

  // ── Profile form ──
  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '' },
  })
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  function onProfileSubmit(values: ProfileValues) {
    setIsSavingProfile(true)
    setTimeout(() => {
      // Replace with: updateProfile.mutate(values, { onSettled: () => setIsSavingProfile(false) })
      setIsSavingProfile(false)
    }, SAVE_DELAY_MS)
  }

  // ── Password form ──
  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const newPasswordValue = passwordForm.watch('newPassword')
  const score = passwordScore(newPasswordValue)

  function onPasswordSubmit(values: PasswordValues) {
    setIsSavingPassword(true)
    setTimeout(() => {
      // Replace with: updatePassword.mutate(values, {
      //   onSuccess: () => passwordForm.reset(),
      //   onSettled: () => setIsSavingPassword(false),
      // })
      passwordForm.reset()
      setIsSavingPassword(false)
    }, SAVE_DELAY_MS)
  }

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="flex flex-col gap-(--gap)">
      {/* Page header */}
      <div>
        <h1 className="text-[20px] font-semibold text-(--ink)">Account settings</h1>
        <p className="text-[13.5px] text-(--muted) mt-[2px]">Manage your personal details, photo and password.</p>
      </div>

      {/* ── Profile photo ── */}
      <Card>
        <div className="mb-1">
          <h3 className="text-[17px] font-semibold text-(--ink)">Profile photo</h3>
          <p className="text-[13px] text-(--muted) mt-[3px]">This image appears next to your name across the app.</p>
        </div>

        <FormRow label="Avatar" noBorderTop>
          <div className="flex items-center gap-4">
            <div
              className="shrink-0 rounded-full border border-(--border) bg-(--surface-2) text-(--ink) font-semibold grid place-items-center overflow-hidden"
              style={{ width: 80, height: 80, fontSize: 24, letterSpacing: '-0.01em' }}
            >
              {avatarSrc
                ? <img src={avatarSrc} alt="Avatar preview" className="w-full h-full object-cover block" />
                : initials}
            </div>
            <div className="min-w-0">
              <input
                ref={fileRef}
                type="file"
                accept={AVATAR_ACCEPT.join(',')}
                onChange={onAvatarPick}
                className="hidden"
              />
              <div className="flex gap-2 mb-2">
                <Button
                  size="sm"
                  leftIcon={<Upload01Icon size={14} strokeWidth={1.8} />}
                  isLoading={isUploadingAvatar}
                  onClick={() => fileRef.current?.click()}
                >
                  Upload new
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!avatarSrc}
                  onClick={onAvatarRemove}
                >
                  Remove
                </Button>
              </div>
              <p className="text-[12.5px] text-(--faint)">JPEG or PNG only. Max 2 MB. Resized to 500 × 500 px on the server.</p>
              {avatarError && <p className="text-[12.5px] text-red-400 mt-1">{avatarError}</p>}
            </div>
          </div>
        </FormRow>
      </Card>

      {/* ── Personal info ── */}
      <Card>
        <div className="mb-1">
          <h3 className="text-[17px] font-semibold text-(--ink)">Personal info</h3>
          <p className="text-[13px] text-(--muted) mt-[3px]">Update your display name.</p>
        </div>

        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} noValidate>
          <FormRow label="Full name" help="Shown across the workspace and on your posts." noBorderTop>
            <Input
              placeholder="Your name"
              error={profileForm.formState.errors.name?.message}
              {...profileForm.register('name')}
            />
          </FormRow>

          <FormRow label="Email" help="Contact an admin to change your email address.">
            <div className="flex items-center justify-between border border-(--field-border) bg-(--field) rounded-(--r-sm) px-3 py-[9px] opacity-60 cursor-not-allowed">
              <span className="text-[13.5px] text-(--ink) font-mono">{user?.email}</span>
              <Badge variant="success">Verified</Badge>
            </div>
          </FormRow>

          <SaveBar onSave={profileForm.handleSubmit(onProfileSubmit)} isLoading={isSavingProfile} />
        </form>
      </Card>

      {/* ── Password ── */}
      <Card>
        <div className="mb-1">
          <h3 className="text-[17px] font-semibold text-(--ink)">Password</h3>
          <p className="text-[13px] text-(--muted) mt-[3px]">Choose a strong password you don't reuse on other sites.</p>
        </div>

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} noValidate>
          <FormRow label="Current password" noBorderTop>
            <PasswordInput
              placeholder="Enter current password"
              showToggle={false}
              error={passwordForm.formState.errors.currentPassword?.message}
              {...passwordForm.register('currentPassword')}
            />
          </FormRow>

          <FormRow label="New password">
            <PasswordInput
              placeholder="Enter new password"
              showToggle={false}
              error={passwordForm.formState.errors.newPassword?.message}
              {...passwordForm.register('newPassword')}
            />
            {/* Strength meter */}
            <div className="flex gap-[5px] mt-[9px]">
              {[0, 1, 2, 3].map(i => (
                <span
                  key={i}
                  className="h-1 flex-1 rounded-[3px] transition-colors duration-150"
                  style={{ background: i < score ? 'var(--accent)' : 'var(--surface-2)' }}
                />
              ))}
            </div>
            <p className="text-[12.5px] text-(--faint) mt-[7px]">
              {newPasswordValue
                ? `${STRENGTH_LABEL[score]} — at least 8 characters with a number and a symbol.`
                : 'At least 8 characters with a number and a symbol.'}
            </p>
          </FormRow>

          <FormRow label="Confirm password">
            <PasswordInput
              placeholder="Re-enter new password"
              showToggle={false}
              error={passwordForm.formState.errors.confirmPassword?.message}
              {...passwordForm.register('confirmPassword')}
            />
          </FormRow>

          <SaveBar onSave={passwordForm.handleSubmit(onPasswordSubmit)} isLoading={isSavingPassword} />
        </form>
      </Card>
    </div>
  )
}
