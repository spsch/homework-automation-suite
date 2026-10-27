import { type Locator, type Page } from '@playwright/test';

/** Sign-in page - /cs/přihlásit */
export class LoginPage {
  readonly path = 'přihlásit';
  readonly form: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;

  constructor(readonly page: Page) {
    this.form = page.locator('#login-form');
    this.email = this.form.locator('input[name="email"]');
    this.password = this.form.locator('input[name="password"]');
    this.submitButton = this.form.getByRole('button', { name: 'Přihlásit se' });
    // Rendered in the surrounding section, outside the <form> element.
    this.errorAlert = page.locator('section.login-form .help-block .alert-danger');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async login(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submitButton.click();
  }
}
