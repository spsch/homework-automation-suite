import { test as setup, expect } from '../fixtures';
import { createCustomer, saveRegisteredCustomer } from '../support/customer';

/**
 * E2E: register a brand-new customer.
 *
 * Runs as the `setup` project, once per run, before all browser projects.
 * The created customer is saved to playwright/.auth/customer.json and reused
 * by the login/logout and add-to-cart tests ("user from previous steps").
 * If this fails, the dependent tests are skipped.
 */
setup('new customer can register an account', { tag: '@e2e' }, async ({ page, registrationPage, header }) => {
  const customer = createCustomer();

  await setup.step('open the registration form', async () => {
    await registrationPage.goto();
    await expect(registrationPage.heading).toBeVisible();
  });

  await setup.step('fill in and submit the form', async () => {
    await registrationPage.register(customer);
  });

  await setup.step('customer is registered and signed in', async () => {
    await expect(page).toHaveURL(/\/cs\/$/);
    await expect(header.accountLink).toContainText(`${customer.firstName} ${customer.lastName}`);
    await expect(header.signOutLink).toBeVisible();
    await expect(header.signInLink).toHaveCount(0);
  });

  await setup.step('account page is accessible', async () => {
    await header.accountLink.click();
    await expect(page).toHaveURL(/muj-ucet/);
    await expect(page.getByRole('heading', { name: 'Váš účet', level: 1 })).toBeVisible();
  });

  saveRegisteredCustomer(customer);
});
