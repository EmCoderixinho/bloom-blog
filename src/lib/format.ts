// Formatting is done by hand rather than with Intl: many browsers ship without
// Bosnian locale data, which made server and client output differ (hydration mismatch).

const MONTHS = ["januar", "februar", "mart", "april", "maj", "juni", "juli", "august", "septembar", "oktobar", "novembar", "decembar"]

/** 1843 → "1.843" */
export function formatNumber(value: number) {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

/** "6. oktobar 2026." in Sarajevo time. */
export function formatDate(iso: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Sarajevo",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(new Date(iso))
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return `${get("day")}. ${MONTHS[get("month") - 1]} ${get("year")}.`
}

/** Bosnian plural: 1 sat, 2–4 sata, 5+ sati (with 11–14 taking the "many" form). */
function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

const UNITS: [seconds: number, forms: [string, string, string]][] = [
  [7 * 24 * 3600, ["sedmicu", "sedmice", "sedmica"]],
  [24 * 3600, ["dan", "dana", "dana"]],
  [3600, ["sat", "sata", "sati"]],
  [60, ["minutu", "minute", "minuta"]],
]

/** "prije 2 sata", "jučer". Falls back to the full date after four weeks or for future dates. */
export function formatRelative(iso: string, now: number) {
  const seconds = Math.round((now - new Date(iso).getTime()) / 1000)
  if (seconds < 0 || seconds >= 4 * 7 * 24 * 3600) return formatDate(iso)
  if (seconds < 60) return "upravo sada"
  for (const [size, [one, few, many]] of UNITS) {
    const n = Math.floor(seconds / size)
    if (n < 1) continue
    if (size === 24 * 3600 && n === 1) return "jučer"
    return `prije ${n} ${plural(n, one, few, many)}`
  }
  return formatDate(iso)
}
