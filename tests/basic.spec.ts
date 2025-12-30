import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('has correct title and content', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/David Eiken - Home/);
    
    // Check main heading
    const heading = page.locator('h1');
    await expect(heading).toContainText('Willkommen');
    
    // Check navigation
    const nav = page.locator('nav');
    await expect(nav.locator('a', { hasText: 'Home' })).toBeVisible();
    await expect(nav.locator('a', { hasText: 'Baustellenkamera' })).toBeVisible();
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto('/');
    
    // Check theme toggle button exists
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();
    
    // Get initial theme state
    const html = page.locator('html');
    const initialIsDark = await html.evaluate((el) => el.classList.contains('dark'));
    
    // Click toggle
    await themeToggle.click();
    
    // Verify theme changed - if it was dark, it should now be light and vice versa
    if (initialIsDark) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }
  });

  test('navigation to Baustellenkamera page works', async ({ page }) => {
    await page.goto('/');
    
    // Click on Baustellenkamera link
    await page.getByRole('link', { name: 'Baustellenkamera', exact: true }).click();
    
    // Check we're on the right page
    await expect(page).toHaveURL('/datenschutz/baustellenkamera');
    await expect(page).toHaveTitle(/Baustellenkamera - Datenschutz/);
  });
});

test.describe('Baustellenkamera Page', () => {
  test('has correct title and content', async ({ page }) => {
    await page.goto('/datenschutz/baustellenkamera');
    
    // Check page title
    await expect(page).toHaveTitle(/Baustellenkamera - Datenschutz/);
    
    // Check main heading
    const heading = page.locator('h1');
    await expect(heading).toContainText('Baustellenkamera - Datenschutz');
    
    // Check some key content sections
    await expect(page.getByText('Zweck der Baustellenkamera')).toBeVisible();
    await expect(page.getByText('Datenschutzrechtliche Hinweise')).toBeVisible();
    await expect(page.getByText('Technische Sicherheitsmaßnahmen')).toBeVisible();
  });

  test('navigation back to home works', async ({ page }) => {
    await page.goto('/datenschutz/baustellenkamera');
    
    // Click on Home link
    await page.getByRole('link', { name: 'Home', exact: true }).click();
    
    // Check we're on the home page
    await expect(page).toHaveURL('/');
    await expect(page).toHaveTitle(/David Eiken - Home/);
  });
});

test.describe('Accessibility', () => {
  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
