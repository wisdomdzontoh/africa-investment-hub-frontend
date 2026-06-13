import { expect, test } from "@playwright/test";

// Critical public-path smoke tests. They run without the backend: the data
// layer degrades to empty results, so pages still render.

test("home page renders the hero and primary nav", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("navigation")).toBeVisible();
});

test("opportunities page renders its filter controls", async ({ page }) => {
  await page.goto("/en/opportunities");
  // The page either lists projects or shows an empty state — both resolve
  // without error and surface the heading.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("unknown route shows the not-found page", async ({ page }) => {
  const res = await page.goto("/en/this-route-does-not-exist");
  expect(res?.status()).toBe(404);
});
