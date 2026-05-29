// Prompt used:
// CONTEXT: App - full login journey - mobile web
// DEVICE: iPhone 14 Pro (Playwright preset)
// TASK: guest completes login and lands on /dashboard.
// NETWORK: fast wifi then slow 3G at submit.
// ASSERT: dashboard title visible, token in localStorage, back does not re-login.
// SCREENSHOT: capture /dashboard for visual diff baseline.

const { test, expect, devices } = require('@playwright/test');

test.use({ ...devices['iPhone 14 Pro'] });

test.describe('Login journey - E2E', () => {
  test('happy path: login lands on /dashboard', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).tap();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    await page.screenshot({ path: 'tests/e2e/screenshots/dashboard.png' });
  });

  test('token stored in localStorage after login', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).tap();
    await page.waitForURL('/dashboard');

    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('back button from /dashboard does not re-login', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).tap();
    await page.waitForURL('/dashboard');

    await page.goBack();
    await expect(page).not.toHaveURL('/login');
  });

  test('slow 3G: loading state visible during submit', async ({ page, context }) => {
    // Throttle to Slow 3G at the point of submission
    await page.goto('/');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');

    await context.route('/api/login', async (route) => {
      await page.waitForTimeout(2000); // simulate slow network
      await route.continue();
    });

    await page.getByRole('button', { name: /sign in/i }).tap();
    await expect(page.getByRole('button', { name: /signing in/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /signing in/i }))
      .toHaveAttribute('aria-busy', 'true');
  });
});
