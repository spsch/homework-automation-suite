import { test, expect } from '../fixtures';

/**
 * E2E: sign in and sign out with the customer created by registration.setup.ts.
 */
test.describe('Login and logout', { tag: '@e2e' }, () => {
  test('registered customer can log in and log out', async ({ page, header, loginPage, registeredCustomer: customer }) => {
    await test.step('open the login page from the header', async () => {
      await page.goto('');
      await header.signInLink.click();
      await expect(loginPage.form).toBeVisible();
    });

    await test.step('log in with the registered credentials', async () => {
      await loginPage.login(customer.email, customer.password);

      await expect(header.accountLink).toContainText(`${customer.firstName} ${customer.lastName}`);
      await expect(header.signOutLink).toBeVisible();
      await expect(header.signInLink).toHaveCount(0);
    });

    await test.step('account page is accessible while logged in', async () => {
      await page.goto('muj-ucet');
      await expect(page.getByRole('heading', { name: 'Váš účet', level: 1 })).toBeVisible();
    });

    await test.step('log out', async () => {
      await header.signOut();

      await expect(header.signInLink).toBeVisible();
      await expect(header.signOutLink).toHaveCount(0);
      await expect(header.accountLink).toHaveCount(0);
    });

    await test.step('account page requires login again', async () => {
      await page.goto('muj-ucet');
      await expect(loginPage.form).toBeVisible();
    });
  });

  test('login is rejected with a wrong password', async ({ header, loginPage, registeredCustomer: customer }) => {
    await loginPage.goto();
    await loginPage.login(customer.email, `${customer.password}-wrong`);

    await expect(loginPage.errorAlert).toContainText('Ověření se nezdařilo');
    await expect(header.signInLink).toBeVisible();
    await expect(header.signOutLink).toHaveCount(0);
  });
});
