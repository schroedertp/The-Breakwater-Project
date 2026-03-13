const { test, expect } = require('/opt/node22/lib/node_modules/playwright/test');

const GUEST_PASSWORD = 'avalon';

// Helper to unlock the app
async function unlock(page) {
  await page.goto('/');
  const lockScreen = page.locator('#lockScreen');
  await expect(lockScreen).toBeVisible();
  await page.fill('#lockPwd', GUEST_PASSWORD);
  await page.click('#lockEnterBtn');
  await expect(lockScreen).not.toHaveClass(/unlocked/);
  // Wait for lock screen to fade out
  await page.waitForFunction(() => {
    const el = document.getElementById('lockScreen');
    return el && el.classList.contains('unlocked');
  });
}

test.describe('Lock Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage so lock screen always shows
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('bw_auth'));
    await page.reload();
  });

  test('shows lock screen on first visit', async ({ page }) => {
    await expect(page.locator('#lockScreen')).toBeVisible();
    await expect(page.locator('#lockPwd')).toBeVisible();
    await expect(page.locator('#lockEnterBtn')).toBeVisible();
  });

  test('shows error on wrong password', async ({ page }) => {
    await page.fill('#lockPwd', 'wrongpassword');
    await page.click('#lockEnterBtn');
    await expect(page.locator('#lockError')).toContainText('Incorrect password');
  });

  test('unlocks with correct password', async ({ page }) => {
    await page.fill('#lockPwd', GUEST_PASSWORD);
    await page.click('#lockEnterBtn');
    await page.waitForFunction(() =>
      document.getElementById('lockScreen')?.classList.contains('unlocked')
    );
    await expect(page.locator('#lockScreen')).toHaveClass(/unlocked/);
  });

  test('toggles password visibility', async ({ page }) => {
    const input = page.locator('#lockPwd');
    await expect(input).toHaveAttribute('type', 'password');
    await page.click('#lockPwdToggle');
    await expect(input).toHaveAttribute('type', 'text');
    await page.click('#lockPwdToggle');
    await expect(input).toHaveAttribute('type', 'password');
  });

  test('unlocks by pressing Enter key', async ({ page }) => {
    await page.fill('#lockPwd', GUEST_PASSWORD);
    await page.press('#lockPwd', 'Enter');
    await page.waitForFunction(() =>
      document.getElementById('lockScreen')?.classList.contains('unlocked')
    );
    await expect(page.locator('#lockScreen')).toHaveClass(/unlocked/);
  });
});

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate((pwd) => localStorage.setItem('bw_auth', pwd), GUEST_PASSWORD);
    await page.reload();
  });

  test('navigation tabs are visible', async ({ page }) => {
    await expect(page.locator('#navTabs')).toBeVisible();
  });

  test('shows home page by default', async ({ page }) => {
    await expect(page.locator('#page-home')).toHaveClass(/active/);
  });

  test('can navigate to Stay tab', async ({ page }) => {
    await page.locator('#navTabs button', { hasText: /^My Stay$/ }).click();
    await expect(page.locator('#page-stay')).toHaveClass(/active/);
  });

  test('can navigate to Book tab', async ({ page }) => {
    await page.locator('#navTabs button', { hasText: /^Book$/ }).click();
    await expect(page.locator('#page-book')).toHaveClass(/active/);
  });

  test('can navigate to Events tab', async ({ page }) => {
    await page.locator('#navTabs button', { hasText: /^Events$/ }).click();
    await expect(page.locator('#page-events')).toHaveClass(/active/);
  });
});

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate((pwd) => localStorage.setItem('bw_auth', pwd), GUEST_PASSWORD);
    await page.reload();
  });

  test('hero section is visible', async ({ page }) => {
    await expect(page.locator('.hero')).toBeVisible();
  });

  test('countdown widget is present', async ({ page }) => {
    await expect(page.locator('#countdownWidget')).toBeVisible();
    await expect(page.locator('#cdDays')).toBeVisible();
    await expect(page.locator('#cdHours')).toBeVisible();
    await expect(page.locator('#cdMins')).toBeVisible();
    await expect(page.locator('#cdSecs')).toBeVisible();
  });

  test('conditions section is present', async ({ page }) => {
    await expect(page.locator('.conditions-section')).toBeVisible();
  });

  test('tides section is present', async ({ page }) => {
    await expect(page.locator('.tides-section')).toBeVisible();
  });
});

test.describe('Booking Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate((pwd) => localStorage.setItem('bw_auth', pwd), GUEST_PASSWORD);
    await page.reload();
    await page.locator('#navTabs button', { hasText: /^Book$/ }).click();
    await expect(page.locator('#page-book')).toHaveClass(/active/);
  });

  test('calendar is visible', async ({ page }) => {
    await expect(page.locator('#calGrid')).toBeVisible();
  });

  test('booking form fields are present', async ({ page }) => {
    await expect(page.locator('#checkinInput')).toBeVisible();
    await expect(page.locator('#checkoutInput')).toBeVisible();
    await expect(page.locator('#adultsSelect')).toBeVisible();
    await expect(page.locator('#childrenSelect')).toBeVisible();
    await expect(page.locator('#bookingName')).toBeVisible();
    await expect(page.locator('#bookingEmail')).toBeVisible();
    await expect(page.locator('#bookingPhone')).toBeVisible();
  });

  test('can type in name and email fields', async ({ page }) => {
    await page.fill('#bookingName', 'Jane Smith');
    await page.fill('#bookingEmail', 'jane@example.com');
    await expect(page.locator('#bookingName')).toHaveValue('Jane Smith');
    await expect(page.locator('#bookingEmail')).toHaveValue('jane@example.com');
  });
});

test.describe('Page Title', () => {
  test('has correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/The Breakwater/);
  });
});
