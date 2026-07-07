import { useEffect, useRef, useState } from 'react'

// Keeps `active` true for at least `delay` ms once `value` becomes true, even if
// `value` flips back to false sooner. Used to guarantee a visible minimum
// loading/spinner duration on fast mutations (e.g. save buttons).
export function useMinDelay(value: boolean, delay = 500): boolean {
  const [active, setActive] = useState(value)
  const startedAt = useRef<number | null>(value ? Date.now() : null)

  useEffect(() => {
    if (value) {
      startedAt.current = Date.now()
      setActive(true)
      return
    }

    const elapsed = startedAt.current ? Date.now() - startedAt.current : delay
    const remaining = Math.max(delay - elapsed, 0)

    const t = setTimeout(() => setActive(false), remaining)
    return () => clearTimeout(t)
  }, [value, delay])

  return active
}
