import { test, expect } from '@playwright/test';

test.describe('Dashboard (Mocked API)', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Mock NextAuth Session API (This handles the auth() check in frontend)
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'c0a80164-0000-0000-0000-000000000001',
            name: 'John Doe',
            email: 'john@example.com',
            image: null,
            authority: ['user'],
            permissions: ['copilot:view', 'copilot:chat'],
            tag_number: 'QB-1234'
          },
          accessToken: 'fake-jwt-token',
          expires: '2099-01-01T00:00:00.000Z'
        }),
      });
    });

    // 2. Mock Dashboard Data API (Main Backend Call)
    await page.route('**/api/v1/dashboard**', async (route) => {
      // Return fixed dashboard metrics
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          summary: {
            totalChats: 156,
            totalCredits: 50000,
            avgResponseTime: 1.2,
            activeProjects: 4
          },
          weeklyUsageTrends: [
            { day: 'Mon', requests: 10, cost: 2.5 },
            { day: 'Tue', requests: 20, cost: 5.0 },
            { day: 'Wed', requests: 15, cost: 3.5 },
            { day: 'Thu', requests: 30, cost: 7.0 },
            { day: 'Fri', requests: 25, cost: 6.0 },
            { day: 'Sat', requests: 5, cost: 1.2 },
            { day: 'Sun', requests: 8, cost: 1.8 }
          ],
          modelUsage: [
            { name: 'GPT-4o', count: 100, percentage: 65 },
            { name: 'Claude-3.5', count: 50, percentage: 35 }
          ]
        }),
      });
    });

    // 3. Mock Credit History
    await page.route('**/api/v1/dashboard/credit-history**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                { id: 'tx1', type: 'transfer', amount: 500, status: 'completed', createdAt: '2026-03-29T10:00:00Z', description: 'Monthly Allocation' }
            ])
        })
    });
  });

  test('should display total credits and welcome message', async ({ page }) => {
    await page.goto('/dashboard');

    // Should NOT be redirected to sign-in since we mocked the session
    await expect(page).toHaveURL(/.*dashboard.*/);

    // Verify Welcome Message
    // Note: DashboardClient uses getHours() to decide greeting.
    // We'll just look for "Good" and "John Doe"
    await expect(page.getByText(/Good/i)).toBeVisible();
    await expect(page.getByText(/John Doe/i)).toBeVisible();

    // Verify Dashboard context and sections are loaded
    await expect(page.getByText(/Dashboard & Analytics/i)).toBeVisible();
    await expect(page.getByText(/Monitor your credit usage/i)).toBeVisible();
  });

  test('should show usage statistics sections', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check if sections are rendered (based on DashboardClient.tsx)
    // Overview (Statistic Cards)
    await expect(page.getByText(/Statistic/i).first() || page.getByText(/Weekly/i).first()).toBeVisible();
    
    // Usage Trends section
    await expect(page.getByText(/Weekly Usage Trends/i)).toBeVisible();
    
    // Transaction History section
    await expect(page.getByText(/Transaction History/i)).toBeVisible();
  });
});
