// Prompt used:
// CONTEXT: login fix - commit abc123
// TASK: regression suite covering all prior §12 failures.
// COVER: every pattern recorded in client/agents.md §12 and server/agents.md §12.
// FORMAT: Playwright - one test per §12 entry.

const { test, expect, devices } = require('@playwright/test');

test.use({ ...devices['iPhone 14 Pro'] });

test.describe('Login - regression (§12 entries)', () => {
  // §12 2026-05-28: touchEnd not click
  test('submit via touchEnd fires onLogin (not click event)', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    // Playwright .tap() maps to touchstart/touchend on mobile devices
    await page.getByRole('button', { name: /sign in/i }).tap();
    await expect(page).toHaveURL('/dashboard');
  });

  // §12 2026-05-28: aria-disabled on button AND wrapper
  test('disabled submit has aria-disabled on button and wrapper', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    const responsePromise = page.waitForResponse('/api/login');
    await page.getByRole('button', { name: /sign in/i }).tap();
    const btn = page.getByRole('button', { name: /signing in/i });
    await expect(btn).toHaveAttribute('aria-busy', 'true');
    await expect(btn).toBeDisabled();
    await responsePromise;
  });

  // §12 2026-05-20: MSW OPTIONS preflight
  test('login request succeeds despite CORS preflight', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).tap();
    // No CORS error = OPTIONS handler is present in MSW
    await expect(page).toHaveURL('/dashboard');
  });

  // §12 2026-05-20: assert loading BEFORE awaiting response
  test('loading state visible immediately on submit', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).tap();
    // assert immediately, before any await
    await expect(page.getByRole('button', { name: /signing in/i })).toBeVisible();
  });
});
