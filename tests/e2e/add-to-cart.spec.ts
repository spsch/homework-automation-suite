import { test, expect } from '../fixtures';

/**
 * E2E: the customer created by registration.setup.ts adds a product from the
 * Clothes category to the cart.
 *
 * All browser projects share that one customer, and PrestaShop keeps one cart
 * per customer, so the cart page may already contain items added by another
 * browser. Exact quantities are therefore asserted on the add-to-cart modal
 * (what this test added), while the cart page is checked for the product line.
 */
test.describe('Add to cart', { tag: '@e2e' }, () => {
  const product = {
    name: 'Hummingbird printed t-shirt',
    size: 'M',
    color: 'Černá',
    colorSlug: 'cerna',
    quantity: 2,
  };

  test.beforeEach(async ({ header, loginPage, registeredCustomer: customer }) => {
    await loginPage.goto();
    await loginPage.login(customer.email, customer.password);
    await expect(header.accountLink).toContainText(`${customer.firstName} ${customer.lastName}`);
  });

  test('logged-in customer adds a product from Clothes to the cart', async ({
    page,
    header,
    categoryPage,
    productPage,
    cartModal,
    cartPage,
  }) => {
    await test.step('open the Clothes category', async () => {
      await header.categoryLink('Clothes').click();
      await expect(page).toHaveURL(/\/cs\/3-clothes/);
      await expect(categoryPage.heading).toHaveText('Clothes');
      await expect(categoryPage.product(product.name)).toBeVisible();
    });

    await test.step('open the product detail', async () => {
      await categoryPage.openProduct(product.name);
      await expect(productPage.heading).toHaveText(product.name);
    });

    await test.step('choose variant and quantity', async () => {
      await productPage.selectSize(product.size);
      await productPage.selectColor(product.color, product.colorSlug);
      await productPage.setQuantity(product.quantity);
    });

    await test.step('add to cart and verify the confirmation dialog', async () => {
      await productPage.addToCart();

      await expect(cartModal.root).toBeVisible();
      await expect(cartModal.title).toBeVisible();
      await expect(cartModal.productName).toHaveText(product.name);
      await expect(cartModal.productDetails).toContainText(new RegExp(`Velikost:\\s*${product.size}`));
      await expect(cartModal.productDetails).toContainText(new RegExp(`Barva:\\s*${product.color}`));
      await expect(cartModal.productDetails).toContainText(new RegExp(`Množství:\\s*${product.quantity}`));
      await expect(header.cart).not.toContainText(/Košík\s*\(0\)/);
    });

    await test.step('cart contains the product in the chosen variant', async () => {
      await cartModal.proceedToCheckoutLink.click();

      await expect(page).toHaveURL(/kosik/);
      await expect(cartPage.heading).toBeVisible();
      const line = cartPage.item(product.name, { Velikost: product.size, Barva: product.color });
      await expect(line).toHaveCount(1);
      const quantity = Number(await cartPage.quantityOf(line).inputValue());
      expect(quantity).toBeGreaterThanOrEqual(product.quantity);
      await expect(cartPage.checkoutLink).toBeVisible();
    });
  });
});
