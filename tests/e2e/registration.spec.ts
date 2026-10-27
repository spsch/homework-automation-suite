import { test, expect } from '../fixtures';
import { createCustomer } from '../support/customer';

/**
 * E2E: registration form validation. The happy path (a real account being created)
 * lives in registration.setup.ts; these cases must NOT create any account.
 */
test.describe('Registration - validation', { tag: '@e2e' }, () => {
  test.beforeEach(async ({ registrationPage }) => {
    await registrationPage.goto();
  });

  test('rejects a first name containing digits', async ({ page, registrationPage }) => {
    await registrationPage.register(createCustomer({ firstName: 'Jan123' }));

    await expect(page).toHaveURL(/registrace/);
    await expect(registrationPage.fieldError('firstname')).toContainText('Neplatný formát.');
  });

  test('rejects an e-mail that is already registered', async ({ page, registrationPage }) => {
    // The shop's own demo account always exists.
    await registrationPage.register(createCustomer({ email: 'demo@prestashop.com' }));

    await expect(page).toHaveURL(/registrace/);
    await expect(registrationPage.fieldError('email')).toContainText(
      'Tento e-mail je již zaregistrován',
    );
  });

  test('does not submit without the mandatory consents', async ({ page, registrationPage }) => {
    await registrationPage.fill(createCustomer(), { acceptConsents: false });
    await registrationPage.submitButton.click();

    // Blocked by native HTML5 validation (message text differs per browser).
    await expect(page).toHaveURL(/registrace/);
    expect(await registrationPage.termsConsent.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
    expect(await registrationPage.privacyConsent.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
  });

  test('does not submit with a too weak password', async ({ page, registrationPage }) => {
    await registrationPage.register(createCustomer({ password: 'abc' }));

    await expect(page).toHaveURL(/registrace/);
    expect(await registrationPage.password.evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(false);
  });
});
