const { test, expect } = require('/opt/node22/lib/node_modules/playwright/test');

test.describe('Admin Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin.html');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Breakwater Guest Link Generator/);
  });

  test('header is visible', async ({ page }) => {
    await expect(page.locator('.header')).toBeVisible();
  });

  test('guest link form fields are present', async ({ page }) => {
    await expect(page.locator('#inName')).toBeVisible();
    await expect(page.locator('#inCheckin')).toBeVisible();
    await expect(page.locator('#inCheckout')).toBeVisible();
    await expect(page.locator('#inBaseUrl')).toBeVisible();
  });

  test('can fill in guest name', async ({ page }) => {
    await page.fill('#inName', 'Johnson');
    await expect(page.locator('#inName')).toHaveValue('Johnson');
  });

  test('can set check-in and check-out dates', async ({ page }) => {
    await page.fill('#inCheckin', '2026-08-01');
    await page.fill('#inCheckout', '2026-08-08');
    await expect(page.locator('#inCheckin')).toHaveValue('2026-08-01');
    await expect(page.locator('#inCheckout')).toHaveValue('2026-08-08');
  });

  test('output preview appears after generating link', async ({ page }) => {
    await page.fill('#inName', 'Smith');
    await page.fill('#inCheckin', '2026-07-15');
    await page.fill('#inCheckout', '2026-07-22');
    await page.fill('#inBaseUrl', 'https://t3dproperties.com');
    await page.click('button:has-text("Generate Guest Link")');
    await expect(page.locator('#outputPreview')).toBeVisible({ timeout: 3000 });
  });

  test('preview shows guest name after generating link', async ({ page }) => {
    await page.fill('#inName', 'Williams');
    await page.fill('#inCheckin', '2026-09-01');
    await page.fill('#inCheckout', '2026-09-08');
    await page.fill('#inBaseUrl', 'https://t3dproperties.com');
    await page.click('button:has-text("Generate Guest Link")');
    await expect(page.locator('#previewName')).toContainText('Williams');
  });
});

test.describe('Admin — Event Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin.html');
  });

  test('event form fields are present', async ({ page }) => {
    await expect(page.locator('#evTitle')).toBeVisible();
    await expect(page.locator('#evDate')).toBeVisible();
    await expect(page.locator('#evTime')).toBeVisible();
    await expect(page.locator('#evLocation')).toBeVisible();
    await expect(page.locator('#evCategory')).toBeVisible();
    await expect(page.locator('#evFree')).toBeVisible();
    await expect(page.locator('#evDesc')).toBeVisible();
  });

  test('can fill in event title and location', async ({ page }) => {
    await page.fill('#evTitle', 'Avalon Summer Concert');
    await page.fill('#evLocation', 'Veterans Memorial Park, 30th St');
    await expect(page.locator('#evTitle')).toHaveValue('Avalon Summer Concert');
    await expect(page.locator('#evLocation')).toHaveValue('Veterans Memorial Park, 30th St');
  });

  test('price field hidden when event is free', async ({ page }) => {
    await page.selectOption('#evFree', 'free');
    await expect(page.locator('#evPriceGroup')).toBeHidden();
  });

  test('price field shown when event is paid', async ({ page }) => {
    await page.selectOption('#evFree', 'paid');
    await expect(page.locator('#evPriceGroup')).toBeVisible();
  });

  test('can select event category', async ({ page }) => {
    await page.selectOption('#evCategory', { index: 1 });
    const selected = await page.locator('#evCategory').inputValue();
    expect(selected).toBeTruthy();
  });
});
