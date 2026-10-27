import { test as base } from '@playwright/test';
import { CartModal } from './pages/CartModal';
import { CartPage } from './pages/CartPage';
import { CategoryPage } from './pages/CategoryPage';
import { Header } from './pages/Header';
import { LoginPage } from './pages/LoginPage';
import { ProductPage } from './pages/ProductPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { type Customer, loadRegisteredCustomer } from './support/customer';

type PageObjects = {
  header: Header;
  registrationPage: RegistrationPage;
  loginPage: LoginPage;
  categoryPage: CategoryPage;
  productPage: ProductPage;
  cartModal: CartModal;
  cartPage: CartPage;
  /** Customer created by the `setup` project (registration.setup.ts). Loaded lazily, after setup has run. */
  registeredCustomer: Customer;
};

/** Playwright `test` extended with page objects bound to the test's `page`. */
export const test = base.extend<PageObjects>({
  header: async ({ page }, use) => use(new Header(page)),
  registrationPage: async ({ page }, use) => use(new RegistrationPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  categoryPage: async ({ page }, use) => use(new CategoryPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  cartModal: async ({ page }, use) => use(new CartModal(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  registeredCustomer: async ({}, use) => use(loadRegisteredCustomer()),
});

export { expect } from '@playwright/test';
