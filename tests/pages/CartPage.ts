import { type Locator, type Page } from '@playwright/test';

/** Shopping cart - /cs/kosik?action=show */
export class CartPage {
  readonly path = 'kosik?action=show';
  readonly heading: Locator;
  readonly items: Locator;
  readonly checkoutLink: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Nákupní košík', level: 1 });
    this.items = page.locator('.cart-overview .cart-item');
    this.checkoutLink = page.locator('.cart-summary').getByRole('link', { name: 'Pokračovat do pokladny' });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  /** Cart line of a product in a given variant, e.g. item('Hummingbird printed t-shirt', { Velikost: 'M', Barva: 'Černá' }). */
  item(productName: string, attributes: Record<string, string> = {}): Locator {
    let line = this.items.filter({ has: this.page.getByRole('link', { name: productName, exact: true }) });
    for (const [label, value] of Object.entries(attributes)) {
      line = line.filter({
        has: this.page.locator('.product-line-info').filter({ hasText: `${label}:` }).locator('.value', { hasText: value }),
      });
    }
    return line;
  }

  quantityOf(line: Locator): Locator {
    return line.locator('input.js-cart-line-product-quantity');
  }
}
