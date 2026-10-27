import { type Locator, type Page } from '@playwright/test';

/** Confirmation dialog shown after a product is added to the cart. */
export class CartModal {
  readonly root: Locator;
  readonly title: Locator;
  readonly productName: Locator;
  /** Product block: price, variant attributes ("Velikost: M") and added quantity ("Množství: 2"). */
  readonly productDetails: Locator;
  readonly continueShoppingButton: Locator;
  readonly proceedToCheckoutLink: Locator;

  constructor(readonly page: Page) {
    this.root = page.locator('#blockcart-modal');
    this.title = this.root.getByRole('heading', { name: 'Produkt byl úspěšně přidán do nákupního košíku' });
    this.productName = this.root.getByRole('heading', { level: 6 });
    this.productDetails = this.root.locator('.modal-body .row > div').first();
    this.continueShoppingButton = this.root.getByRole('button', { name: 'Pokračovat v nákupu' });
    this.proceedToCheckoutLink = this.root.getByRole('link', { name: 'Pokračovat do pokladny' });
  }
}
