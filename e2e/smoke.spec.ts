import { expect, test, type Page } from "@playwright/test"

// Visible only: with cacheComponents, Next.js keeps the previous route mounted but hidden after a client navigation.
const tiles = (page: Page) => page.locator('main ul > li a[href^="/objava/"]').filter({ visible: true })

test("home → category → post", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Najnovije" })).toBeVisible()
  await expect(tiles(page).first()).toBeVisible()

  await page.locator('main section a[href="/kategorija/ljepota"]').filter({ visible: true }).first().click()
  await expect(page).toHaveURL(/\/kategorija\/ljepota$/)
  await expect(page.getByRole("heading", { level: 1, name: "Ljepota" }).filter({ visible: true })).toBeVisible()
  await expect(tiles(page).first()).toBeVisible()

  const firstTile = tiles(page).first()
  const href = await firstTile.getAttribute("href")
  await firstTile.click()
  await expect(page).toHaveURL(new RegExp(`${href}$`))
  const title = page.getByRole("heading", { level: 1 }).filter({ visible: true })
  await expect(title).toBeVisible()
  await expect(title).not.toBeEmpty()

  // Pick the Article explicitly: hidden previous routes (or a future layout schema) may carry their own JSON-LD.
  const jsonLd = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((text) => JSON.parse(text))
  const article = jsonLd.find((data) => data["@type"] === "Article")
  expect(article).toBeDefined()
  expect(article.headline).toBe((await title.textContent())?.trim())
})

// No sample post has "koža" in its title, excerpt or tags (search skips bodies), so this
// relies on the category name "Njega kože", which normalizes to "njega koze".
test('search for "koze" finds the "Njega kože" posts', async ({ page }) => {
  await page.goto("/pretraga?q=koze")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("koze")
  await expect(page.locator('main a[href="/objava/jesenja-skincare-rutina-u-5-koraka"]')).toHaveCount(1)
  await expect(page.locator('main a[href="/objava/retinol-vodic-za-pocetnike"]')).toHaveCount(1)
})

const STATIC_PAGES = ["/o-nama", "/kontakt", "/marketing", "/uslovi-koristenja", "/privatnost"]

test("footer static pages return 200", async ({ page }) => {
  await page.goto("/")
  for (const href of STATIC_PAGES) {
    await expect(page.locator(`footer a[href="${href}"]`), href).toHaveCount(1)
  }

  for (const href of STATIC_PAGES) {
    const response = await page.goto(href)
    expect(response?.status(), href).toBe(200)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  }
})
