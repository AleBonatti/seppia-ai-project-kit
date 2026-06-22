import { useRef, useState } from 'react'
import { Upload01Icon, ViewIcon, ViewOffSlashIcon } from '@/lib/icons'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SaveBar } from '@/components/ui/SaveBar'
import { useAuth } from '@/features/auth/hooks/useAuth'

// ── Shared form-row layout (label left 220px, field right) ────────────────────

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

// ── Password field with show / hide toggle ────────────────────────────────────

interface PasswordFieldProps {
  placeholder?: string
  value: string
  onChange: (v: string) => void
}

function PasswordField({ placeholder, value, onChange }: PasswordFieldProps) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="flex items-center border border-(--field-border) bg-(--field) rounded-(--r-sm) pr-1 focus-within:border-(--accent) focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_22%,transparent)] transition-[border-color,box-shadow]">
      <input
        type={revealed ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-[13.5px] text-(--ink) placeholder:text-(--faint) px-3 py-[9px]"
      />
      <button
        type="button"
        onClick={() => setRevealed(r => !r)}
        className="flex-none flex items-center gap-1 px-2 py-1 rounded-[7px] text-[12px] font-medium text-(--muted) hover:text-(--ink) hover:bg-(--surface-2) transition-colors"
      >
        {revealed
          ? <ViewOffSlashIcon size={15} strokeWidth={1.8} />
          : <ViewIcon size={15} strokeWidth={1.8} />}
        {revealed ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}

// ── Password strength meter ───────────────────────────────────────────────────

function passwordScore(v: string): number {
  if (!v) return 0
  let s = 0
  if (v.length >= 8)                          s++
  if (/[0-9]/.test(v))                        s++
  if (/[^A-Za-z0-9]/.test(v))                s++
  if (/[A-Z]/.test(v) && /[a-z]/.test(v))    s++
  return s
}

const STRENGTH_LABEL = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AccountSettingsPage() {
  const { user } = useAuth()

  // Profile photo
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)

  function onAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  // Personal info
  const [name, setName] = useState(user?.name ?? '')

  // Password
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const setField = (key: keyof typeof pw) => (v: string) =>
    setPw(prev => ({ ...prev, [key]: v }))

  const score = passwordScore(pw.next)
  const passwordsMatch = pw.next.length > 0 && pw.next === pw.confirm

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
            {/* Avatar preview */}
            <div
              className="shrink-0 rounded-full border border-(--border) bg-(--surface-2) text-(--ink) font-semibold grid place-items-center overflow-hidden"
              style={{ width: 80, height: 80, fontSize: 24, letterSpacing: '-0.01em' }}
            >
              {avatarSrc
                ? <img src={avatarSrc} alt="Avatar preview" className="w-full h-full object-cover block" />
                : (user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?')}
            </div>
            <div className="min-w-0">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onAvatarPick}
                className="hidden"
              />
              <div className="flex gap-2 mb-2">
                <Button
                  size="sm"
                  leftIcon={<Upload01Icon size={14} strokeWidth={1.8} />}
                  onClick={() => fileRef.current?.click()}
                >
                  Upload new
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setAvatarSrc(null)}>
                  Remove
                </Button>
              </div>
              <p className="text-[12.5px] text-(--faint)">JPG, PNG or GIF. Max size 1 MB. Recommended 256×256px.</p>
            </div>
          </div>
        </FormRow>
      </Card>

      {/* ── Personal info ── */}
      <Card>
        <div className="mb-1">
          <h3 className="text-[17px] font-semibold text-(--ink)">Personal info</h3>
          <p className="text-[13px] text-(--muted) mt-[3px]">Update your name and the email you sign in with.</p>
        </div>

        <FormRow label="Full name" help="Shown across the workspace and on your posts.">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
          />
        </FormRow>

        <FormRow label="Email" help="The email you use to sign in. Contact an admin to change it.">
          <div className="flex items-center justify-between border border-(--field-border) bg-(--field) rounded-(--r-sm) px-3 py-[9px]">
            <span className="text-[13.5px] text-(--ink) font-mono">{user?.email}</span>
            <Badge variant="success">Verified</Badge>
          </div>
        </FormRow>

        <SaveBar lastSaved="Jun 12, 2026 · 14:09" onSave={() => {}} />
      </Card>

      {/* ── Password ── */}
      <Card>
        <div className="mb-1">
          <h3 className="text-[17px] font-semibold text-(--ink)">Password</h3>
          <p className="text-[13px] text-(--muted) mt-[3px]">Choose a strong password you don't reuse on other sites.</p>
        </div>

        <FormRow label="Current password">
          <PasswordField
            placeholder="Enter current password"
            value={pw.current}
            onChange={setField('current')}
          />
        </FormRow>

        <FormRow label="New password">
          <PasswordField
            placeholder="Enter new password"
            value={pw.next}
            onChange={setField('next')}
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
            {pw.next
              ? `${STRENGTH_LABEL[score]} — at least 8 characters with a number and a symbol.`
              : 'At least 8 characters with a number and a symbol.'}
          </p>
        </FormRow>

        <FormRow label="Confirm password">
          <PasswordField
            placeholder="Re-enter new password"
            value={pw.confirm}
            onChange={setField('confirm')}
          />
          {pw.confirm.length > 0 && (
            <p
              className="text-[12.5px] mt-[7px]"
              style={{ color: passwordsMatch ? 'var(--accent)' : '#e5484d' }}
            >
              {passwordsMatch ? 'Passwords match.' : "Passwords don't match yet."}
            </p>
          )}
        </FormRow>

        <SaveBar lastSaved="Last changed 3 months ago" onSave={() => {}} />
      </Card>
    </div>
  )
}
