import { expect, type Locator, type Page } from '@playwright/test';

/** Product detail page with the add-to-cart form. */
export class ProductPage {
  readonly heading: Locator;
  readonly sizeSelect: Locator;
  readonly quantity: Locator;
  readonly addToCartButton: Locator;

  constructor(readonly page: Page) {
    this.heading = page.locator('#main').getByRole('heading', { level: 1 });
    const form = page.locator('#add-to-cart-or-refresh');
    this.sizeSelect = form.getByRole('combobox', { name: 'Velikost' });
    this.quantity = form.getByRole('spinbutton', { name: 'Počet' });
    this.addToCartButton = form.getByRole('button', { name: 'Přidat do košíku' });
  }

  colorOption(name: string): Locator {
    return this.page.locator('#add-to-cart-or-refresh').getByRole('radio', { name, exact: true });
  }

  /**
   * Changing a variant reloads the product block via AJAX and updates the URL hash
   * (e.g. #/2-velikost-m/11-barva-cerna); wait for it before the next interaction.
   */
  async selectSize(size: string): Promise<void> {
    // The change handler is bound by the theme scripts; selecting earlier is silently ignored.
    await this.page.waitForLoadState('load');
    await this.sizeSelect.selectOption({ label: size });
    await expect(this.page).toHaveURL(new RegExp(`velikost-${size.toLowerCase()}`));
    await expect(this.sizeSelect).toHaveValue(/.+/);
  }

  async selectColor(color: string, urlSlug: string): Promise<void> {
    await this.page.waitForLoadState('load');
    await this.colorOption(color).check();
    await expect(this.page).toHaveURL(new RegExp(`barva-${urlSlug}`));
    await expect(this.colorOption(color)).toBeChecked();
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantity.fill(String(quantity));
  }

  async addToCart(): Promise<void> {
    await expect(this.addToCartButton).toBeEnabled();
    await this.addToCartButton.click();
  }
}
