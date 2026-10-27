import { type Locator, type Page } from '@playwright/test';
import { type Customer } from '../support/customer';

/** Customer registration form - /cs/registrace */
export class RegistrationPage {
  readonly path = 'registrace';
  readonly heading: Locator;
  readonly form: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly birthday: Locator;
  readonly termsConsent: Locator;
  readonly privacyConsent: Locator;
  readonly partnerOffers: Locator;
  readonly newsletter: Locator;
  readonly submitButton: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Registrovat', level: 1 });
    this.form = page.locator('#customer-form');
    this.firstName = this.form.getByRole('textbox', { name: 'Jméno' });
    this.lastName = this.form.getByRole('textbox', { name: 'Příjmení' });
    this.email = this.form.getByRole('textbox', { name: 'E-mail' });
    this.password = this.form.locator('input[name="password"]');
    this.birthday = this.form.getByRole('textbox', { name: 'Datum narození' });
    this.termsConsent = this.form.locator('input[name="psgdpr"]');
    this.privacyConsent = this.form.locator('input[name="customer_privacy"]');
    this.partnerOffers = this.form.locator('input[name="optin"]');
    this.newsletter = this.form.locator('input[name="newsletter"]');
    this.submitButton = this.form.getByRole('button', { name: 'Uložit' });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  /** Server-side validation message rendered under a field, e.g. fieldError('firstname'). */
  fieldError(inputName: string): Locator {
    return this.form
      .locator('.form-group')
      .filter({ has: this.page.locator(`input[name="${inputName}"]`) })
      .locator('.help-block .alert-danger');
  }

  async fill(customer: Customer, { acceptConsents = true } = {}): Promise<void> {
    await this.form.getByRole('radio', { name: customer.gender, exact: true }).check();
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.email.fill(customer.email);
    await this.password.fill(customer.password);
    if (customer.birthday) {
      await this.birthday.fill(customer.birthday);
    }
    if (acceptConsents) {
      await this.termsConsent.check();
      await this.privacyConsent.check();
    }
  }

  async register(customer: Customer): Promise<void> {
    await this.fill(customer);
    await this.submitButton.click();
  }
}
