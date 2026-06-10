import type { ReactNode } from 'react'
import { Moon02Icon, Sun03Icon } from '@/lib/icons'
import { useTheme } from '@/components/layout/useTheme'

// Auth pages use their own token set — separate from the admin shell.
// --login-card, --login-bg, --login-border, --login-field, --login-mark
// are scoped here so they don't bleed into the admin layout.
const AUTH_TOKENS = `
  html[data-theme="dark"] {
    --login-bg:     #09090b;
    --login-card:   #18181b;
    --login-border: #27272a;
    --login-field:  #18181b;
    --login-mark:   var(--accent);
  }
  html[data-theme="light"] {
    --login-bg:     #F4F4F5;
    --login-card:   #FFFFFF;
    --login-border: #E7E7E9;
    --login-field:  #FAFAFA;
    --login-mark:   #1c1c1f;
  }
`

interface AuthLayoutProps {
  children: ReactNode
  /** Project name shown next to the logo mark */
  title?: string
}

export function AuthLayout({ children, title = 'Project Name' }: AuthLayoutProps) {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <style>{AUTH_TOKENS}</style>

      <div
        className="min-h-screen grid place-items-center"
        style={{ background: 'var(--login-bg)', color: 'var(--ink)', padding: 32 }}
      >
        {/* Theme toggle */}
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

        <div
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
          {/* Brand */}
          <div className="flex items-center justify-center gap-1 mb-[30px]">
            <span className="w-[46px] h-[46px] grid place-items-center" style={{ color: 'var(--login-mark)' }}>
              {/* Replace the SVG path with the project logo mark if needed */}
              <svg viewBox="0 0 512 512" fill="currentColor" className="w-full h-full block" aria-hidden="true">
                <path d="M455.6 349.2c-45.891-39.09-36.67-77.877-16.095-128.11C475.16 134.04 415.967 34.14 329.93 8.3C237.04-19.6 134.252 24.341 99.677 117.147a180.9 180.9 0 0 0-10.988 73.544c1.733 29.543 14.717 52.97 24.09 80.3c17.2 50.161-28.1 92.743-66.662 117.582c-46.806 30.2-36.319 39.857-8.428 41.858c23.378 1.68 44.478-4.548 65.265-15.045c9.2-4.647 40.687-18.931 45.13-28.588c-12.184 26.59-36.962 72.702-21.463 102.102c19.1 36.229 67.112-31.77 76.709-45.812c8.591-12.572 42.963-81.279 63.627-46.926c18.865 31.361 8.6 76.391 35.738 104.622c32.854 34.2 51.155-18.312 51.412-44.221c.163-16.411-6.1-95.852 29.9-59.944c21.421 21.381 52.905 71.181 88.561 67.023c38.736-4.516-22.123-67.967-28.262-78.695c5.393 4.279 53.665 34.128 53.818 9.52c.11-18.789-30.085-34.667-42.524-45.267" />
              </svg>
            </span>
            <span className="text-[40px] font-medium tracking-[-0.04em] text-(--ink)">{title}</span>
          </div>

          {children}
        </div>
      </div>
    </>
  )
}
