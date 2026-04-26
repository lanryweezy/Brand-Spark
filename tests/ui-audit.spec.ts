import { test, expect } from '@playwright/test';

test('take screenshots of dashboard and landing page', async ({ page }) => {
  // Take screenshot of landing page
  await page.goto('http://localhost:8080');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'landing-page.png', fullPage: true });

  // Take screenshot of dashboard
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // Let the user login flow complete
  await page.fill('input[type="email"]', 'alex@agency.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button:has-text("Sign In")');

  await page.waitForSelector('text=Strategic Goals', { timeout: 10000 });

  await page.screenshot({ path: 'dashboard.png', fullPage: true });
});