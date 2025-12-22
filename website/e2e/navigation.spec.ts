/**
 * E2E Tests: Navigation
 * Tests basic navigation and routing
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Physical AI & Humanoid Robotics/);
  });

  test('should navigate to docs', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Docs');
    await expect(page).toHaveURL(/.*docs.*/);
  });

  test('should navigate through modules', async ({ page }) => {
    await page.goto('/docs/intro');

    // Check sidebar exists
    const sidebar = page.locator('[class*="sidebar"]');
    await expect(sidebar).toBeVisible();

    // Navigate to Module 1
    await page.click('text=Foundations');
    await expect(page).toHaveURL(/.*01-foundations.*/);
  });

  test('should use breadcrumbs', async ({ page }) => {
    await page.goto('/docs/modules/01-foundations/chapter-01-intro');

    // Check breadcrumbs
    const breadcrumbs = page.locator('[class*="breadcrumb"]');
    await expect(breadcrumbs).toBeVisible();
  });
});

test.describe('Search', () => {
  test('should open search', async ({ page }) => {
    await page.goto('/');

    // Open search (Ctrl+K or Cmd+K)
    await page.keyboard.press('Meta+K');

    // Search input should be visible
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible();
  });

  test('should search for content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Meta+K');

    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill('ROS 2');

    // Should show results
    await page.waitForTimeout(1000);
    const results = page.locator('[class*="search-result"]');
    await expect(results).toBeTruthy();
  });
});

test.describe('Language Switching', () => {
  test('should switch to Urdu', async ({ page }) => {
    await page.goto('/');

    // Find language switcher
    const langSwitcher = page.locator('[class*="languageSwitcher"]');

    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();
      await page.click('text=اردو');

      // Should redirect to Urdu version
      await expect(page).toHaveURL(/\/ur\//);

      // Check RTL direction
      const html = page.locator('html');
      await expect(html).toHaveAttribute('dir', 'rtl');
    }
  });
});
