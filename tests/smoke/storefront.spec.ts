import { test, expect } from '../fixtures';

/**
 * Smoke suite: fast, read-only checks that the storefront is up and its key
 * entry points work. No data is created, so it is safe to run against any environment.
 */
test.describe('Storefront smoke', { tag: '@smoke' }, () => {
  test('homepage loads successfully', async ({ page }) => {
    const response = await page.goto('');

    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveTitle('PrestaShop');
    await expect(page.locator('#header')).toBeVisible();
    await expect(page.locator('#footer')).toBeVisible();
  });

  test('header shows guest state: sign-in link and empty cart', async ({ page, header }) => {
    await page.goto('');

    await expect(header.signInLink).toBeVisible();
    await expect(header.signOutLink).toHaveCount(0);
    await expect(header.cart).toContainText(/Košík\s*\(0\)/);
    await expect(header.searchBox).toBeVisible();
  });

  test('main menu lists the top-level categories', async ({ page, header }) => {
    await page.goto('');

    for (const category of ['Clothes', 'Příslušenství', 'Art']) {
      await expect(header.categoryLink(category)).toBeVisible();
    }
  });

  test('homepage shows popular products', async ({ page }) => {
    await page.goto('');

    const popular = page.locator('section.featured-products').filter({
      has: page.getByRole('heading', { name: 'Oblíbené produkty' }),
    });
    await expect(popular).toBeVisible();
    await expect(popular.locator('article.product-miniature').first()).toBeVisible();
    expect(await popular.locator('article.product-miniature').count()).toBeGreaterThan(0);
  });

  for (const { name, path } of [
    { name: 'Clothes', path: '3-clothes' },
    { name: 'Příslušenství', path: '6-accessories' },
    { name: 'Art', path: '9-art' },
  ]) {
    test(`category "${name}" opens from the main menu and lists products`, async ({ page, header, categoryPage }) => {
      await page.goto('');
      await header.categoryLink(name).click();

      await expect(page).toHaveURL(new RegExp(`/cs/${path}`));
      await expect(categoryPage.heading).toHaveText(name);
      await expect(categoryPage.products.first()).toBeVisible();
    });
  }

  test('catalog search submits and renders the results page', async ({ page, header }) => {
    await page.goto('');
    await header.search('mug');

    await expect(page).toHaveURL(/vyhledavani.*s=mug/);
    await expect(page.getByRole('heading', { name: 'Výsledek hledání', level: 1 })).toBeVisible();
  });

  test(
    'catalog search finds an existing product',
    {
      annotation: {
        type: 'known issue',
        description:
          'Search returns "Pro tento výraz jsme nic nenašli" for every term, incl. exact product names ' +
          '(observed 2026-10-27; search index probably not built). Remove test.fail() once fixed.',
      },
    },
    async ({ page, header }) => {
      test.fail();
      await page.goto('');
      await header.search('Hummingbird');

      const results = page.locator('#js-product-list article.product-miniature');
      await expect(results.first()).toContainText(/Hummingbird/i);
    },
  );

  test('product detail page opens with an enabled add-to-cart button', async ({ categoryPage, productPage }) => {
    await categoryPage.goto('3-clothes');
    await categoryPage.openProduct('Hummingbird printed t-shirt');

    await expect(productPage.heading).toHaveText('Hummingbird printed t-shirt');
    await expect(productPage.addToCartButton).toBeEnabled();
  });

  test('registration page is reachable', async ({ registrationPage }) => {
    await registrationPage.goto();

    await expect(registrationPage.heading).toBeVisible();
    await expect(registrationPage.submitButton).toBeVisible();
  });

  test('login page is reachable from the header', async ({ page, header, loginPage }) => {
    await page.goto('');
    await header.signInLink.click();

    await expect(loginPage.form).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });
});
