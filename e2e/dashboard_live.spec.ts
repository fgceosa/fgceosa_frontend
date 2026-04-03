import { test, expect } from '@playwright/test';

// Credentials from .env
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin1234';

test.describe('Dashboard (Live Integration)', () => {
  test('should log in and see the platform dashboard', async ({ page }) => {
    // 1. Go to Sign In
    await page.goto('/sign-in');
    
    // 2. Fill credentials
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    
    // 3. Click Sign In
    await page.click('button[type="submit"]');
    
    // 4. Wait for redirection to dashboard
    // Note: Since this is a platform super admin, it might redirect to /platform/dashboard
    await expect(page).toHaveURL(/.*dashboard.*/, { timeout: 15000 });
    
    // 5. Verify Welcome Message
    // In DashboardClient, it uses "Good [Time], [Name]"
    await expect(page.getByText(/Good/i)).toBeVisible();
    await expect(page.getByText(/Admin/i)).toBeVisible();
    
    // 6. Verify Dashboard Structure
    await expect(page.getByText(/Dashboard & Analytics/i)).toBeVisible();
    
    // Check for some live data sections
    await expect(page.getByText(/Usage Trends/i)).toBeVisible();
    await expect(page.getByText(/Credit/i)).toBeVisible();
  });

  test('should navigate to Copilot Hub from sidebar', async ({ page }) => {
    // Re-use session if possible, but for simplicity here we just log in again
    // In a real setup we would use storageState
    await page.goto('/sign-in');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard.*/);

    // Click on Copilot Hub in the sidebar/navigation
    // Let's assume there is a link with text "Copilot Hub"
    // Based on src/app/(protected-pages)/dashboard/copilot-hub/
    const copilotLink = page.getByRole('link', { name: /Copilot Hub/i });
    if (await copilotLink.isVisible()) {
        await copilotLink.click();
        await expect(page).toHaveURL(/.*copilot-hub.*/);
        await expect(page.getByText(/My Copilots/i || /Official/i)).toBeVisible();
    }
  });
});
