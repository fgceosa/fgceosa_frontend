import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should load the landing page', async ({ page }) => {
    await page.goto('/');
    // Check if the page title or a key element is present
    // Assuming the landing page has "Qorebit" somewhere
    await expect(page).toHaveTitle(/Qorebit/i);
  });

  test('should show validation errors on empty login', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Attempt to sign in without credentials
    await page.click('button[type="submit"]');
    
    // Check for validation messages
    // Based on SignInForm.tsx, it uses zod validation
    await expect(page.getByText(/Please enter your email/i)).toBeVisible();
    await expect(page.getByText(/Please enter your password/i)).toBeVisible();
  });

  test('should navigate to sign up page from sign in', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Click the "Sign Up" link
    await page.click('a[href*="sign-up"]');
    
    // Should be on the sign up page
    await expect(page).toHaveURL(/.*sign-up.*/);
    await expect(page.getByText(/Join Qorebit AI/i).first()).toBeVisible();
  });

  test('should redirect unauthenticated users from dashboard to sign-in', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should be redirected to sign-in
    await expect(page).toHaveURL(/.*sign-in.*/);
  });
});
