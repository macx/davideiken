import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("has correct structure and elements", async ({ page }) => {
    await page.goto("/");

    // Check page title contains name
    await expect(page).toHaveTitle(/David Eiken/);

    // Check that main heading (h1) exists and is visible
    await expect(page.locator("h1")).toBeVisible();

    // Check that lead teaser paragraph exists
    await expect(page.locator(".lead")).toBeVisible();

    // Check that navigation exists
    await expect(page.locator("nav.site-nav")).toBeVisible();

    // Check that contact form is embedded on the page
    await expect(page.locator("#contactForm")).toBeVisible();
  });

  test("theme toggle works", async ({ page }) => {
    await page.goto("/");

    // Check theme toggle button exists in header
    const themeToggle = page.locator(".header-theme-toggle");
    await expect(themeToggle).toBeVisible();

    // Get initial theme state
    const html = page.locator("html");
    const initialTheme = await html.getAttribute("data-theme");

    // Click toggle
    await themeToggle.click();

    // Verify theme changed
    const newTheme = await html.getAttribute("data-theme");
    expect(newTheme).not.toBe(initialTheme);
  });
});

test.describe("Contact Form", () => {
  test("should submit contact form successfully with mock API response", async ({
    page,
  }) => {
    // Navigate to homepage (where contact form is in footer/Layout)
    await page.goto("/");

    // Scroll to contact form
    const form = page.locator("#contactForm");
    await expect(form).toBeVisible();

    // Mock the contact form API route to prevent real email sending
    await page.route("**/api/contact", async (route) => {
      expect(route.request().method()).toBe("POST");
      const postData = route.request().postData();
      expect(postData).toContain("name=E2E+Tester");
      expect(postData).toContain("email=e2e%40test.com");
      expect(postData).toContain(
        "message=This+is+a+test+message+written+by+playwright+E2E+test.",
      );

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Email sent successfully!",
        }),
      });
    });

    // Fill out the form fields
    await form.locator("#name").fill("E2E Tester");
    await form.locator("#email").fill("e2e@test.com");
    await form
      .locator("#message")
      .fill("This is a test message written by playwright E2E test.");

    // Submit form
    const submitBtn = form.locator("#submitBtn");
    await submitBtn.click();

    // Verify status message shows success
    const statusEl = form.locator("#formStatus");
    await expect(statusEl).toBeVisible();
    await expect(statusEl).toHaveClass(/success/);
    await expect(statusEl).toContainText("Vielen Dank!"); // German success message check
  });
});
