import { type Locator, type Page } from '@playwright/test';

/** Shop header shared by every storefront page (user info, cart, menu, search). */
export class Header {
  readonly root: Locator;
  readonly signInLink: Locator;
  readonly signOutLink: Locator;
  readonly accountLink: Locator;
  readonly cart: Locator;
  readonly topMenu: Locator;
  readonly searchBox: Locator;

  constructor(readonly page: Page) {
    this.root = page.locator('#header');
    const userInfo = this.root.locator('#_desktop_user_info');
    this.signInLink = userInfo.getByRole('link', { name: 'Přihlásit se' });
    this.signOutLink = userInfo.locator('a.logout');
    this.accountLink = userInfo.locator('a.account');
    this.cart = this.root.locator('#_desktop_cart');
    this.topMenu = this.root.locator('#_desktop_top_menu');
    this.searchBox = this.root.getByRole('textbox', { name: 'Vyhledávání' });
  }

  categoryLink(name: string): Locator {
    return this.topMenu.getByRole('link', { name, exact: true });
  }

  async signOut(): Promise<void> {
    await this.signOutLink.click();
  }

  async search(term: string): Promise<void> {
    await this.searchBox.fill(term);
    await this.searchBox.press('Enter');
  }
}
