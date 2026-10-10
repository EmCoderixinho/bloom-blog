"use client"

import { useCallback, useSyncExternalStore } from "react"

const listeners = new Set<() => void>()
const cache = new Map<string, string[]>()

function read(key: string): string[] {
  if (!cache.has(key)) {
    let value: string[] = []
    try {
      const raw = window.localStorage.getItem(key)
      const parsed: unknown = raw ? JSON.parse(raw) : []
      if (Array.isArray(parsed)) value = parsed.filter((v): v is string => typeof v === "string")
    } catch {
      // Storage can be blocked (private mode); fall back to in-memory state.
    }
    cache.set(key, value)
  }
  return cache.get(key)!
}

function write(key: string, value: string[]) {
  cache.set(key, value)
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore: the in-memory cache still reflects the change for this session.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key) cache.delete(event.key)
    listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

const EMPTY: string[] = []

/** A per-browser set of ids (liked or saved posts) persisted in localStorage. */
export function useStoredSet(key: string, id: string) {
  const values = useSyncExternalStore(subscribe, () => read(key), () => EMPTY)
  const has = values.includes(id)
  const toggle = useCallback(() => {
    const current = read(key)
    write(key, current.includes(id) ? current.filter((v) => v !== id) : [...current, id])
  }, [key, id])
  return [has, toggle] as const
}


let now = 0
const nowListeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined

function subscribeNow(listener: () => void) {
  nowListeners.add(listener)
  if (!timer) {
    now = Date.now()
    timer = setInterval(() => {
      now = Date.now()
      nowListeners.forEach((l) => l())
    }, 60_000)
  }
  return () => {
    nowListeners.delete(listener)
    if (nowListeners.size === 0) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

function getNow() {
  if (!now) now = Date.now()
  return now
}

/** Current time (refreshed every minute) on the client; null during SSR and hydration. */
export function useNow(): number | null {
  return useSyncExternalStore(subscribeNow, getNow, () => null)
}
