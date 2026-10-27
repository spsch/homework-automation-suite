import { type Locator, type Page } from '@playwright/test';

/** Product listing of a category, e.g. /cs/3-clothes */
export class CategoryPage {
  readonly heading: Locator;
  readonly products: Locator;

  constructor(readonly page: Page) {
    this.heading = page.locator('#main').getByRole('heading', { level: 1 });
    this.products = page.locator('#js-product-list article.product-miniature');
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  product(name: string): Locator {
    return this.products.filter({ has: this.page.getByRole('heading', { name, exact: true }) });
  }

  async openProduct(name: string): Promise<void> {
    await this.product(name).getByRole('heading', { name, exact: true }).getByRole('link').click();
  }
}
