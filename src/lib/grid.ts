export const MOBILE_COLUMNS = 3
export const DESKTOP_COLUMNS = 5

/** Rows that end short at a breakpoint, trimmed so the grid stays a clean rectangle. */
export function overflowClass(index: number, count: number) {
  const fits = (columns: number) => {
    const full = Math.floor(count / columns) * columns
    return full === 0 || index < full
  }
  const mobile = fits(MOBILE_COLUMNS)
  const desktop = fits(DESKTOP_COLUMNS)
  if (!mobile && !desktop) return "hidden"
  if (!mobile) return "max-lg:hidden"
  if (!desktop) return "lg:hidden"
  return undefined
}
