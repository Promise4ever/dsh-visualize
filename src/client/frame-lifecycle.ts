import { useCallback, useEffect, useState, type RefObject } from 'react'

/** Load on first visibility, then latch: scrolling away must not destroy interaction state. */
export function useFirstVisible(target: RefObject<Element>): readonly [boolean, () => void] {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (seen) return
    const element = target.current
    if (element === null) return
    if (typeof IntersectionObserver !== 'function') {
      setSeen(true)
      return
    }
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.target === element && entry.isIntersecting)) return
      setSeen(true)
      observer.disconnect()
    }, { rootMargin: '0px', threshold: 0 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [target, seen])
  const activate = useCallback(() => setSeen(true), [])
  return [seen, activate]
}
