# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke\storefront.spec.ts >> Storefront smoke >> catalog search finds an existing product
- Location: tests\smoke\storefront.spec.ts:68:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#js-product-list article.product-miniature').first()
Expected pattern: /Hummingbird/i
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" locator('#js-product-list article.product-miniature').first() with timeout 10000ms
  - waiting for locator('#js-product-list article.product-miniature').first()

```

```yaml
- main:
  - navigation:
    - link "Kontaktujte nás":
      - /url: https://prestashop.tesena.com/cs/napiste-nam
    - button "Rozevírací nabídka jazyka": Čeština 
    - text: "Měna:"
    - button "Rozevírací nabídka měny": CZK Kč 
    - link " Přihlásit se":
      - /url: https://prestashop.tesena.com/cs/přihlásit?back=https%3A%2F%2Fprestashop.tesena.com%2Fcs%2Fvyhledavani%3Fcontroller%3Dsearch%26s%3DHummingbird
    - text: Košík (0)
  - list:
    - listitem:
      - link "Clothes":
        - /url: http://prestashop.tesena.com/cs/3-clothes
    - listitem:
      - link "Příslušenství":
        - /url: http://prestashop.tesena.com/cs/6-accessories
    - listitem:
      - link "Art":
        - /url: http://prestashop.tesena.com/cs/9-art
  - status
  - textbox "Vyhledávání":
    - /placeholder: Hledat v katalogu
    - text: Hummingbird
  - complementary
  - navigation:
    - list:
      - listitem:
        - link "Domů":
          - /url: https://prestashop.tesena.com/cs/
        - text: /
      - listitem: Výsledek hledání
  - heading "Výsledek hledání" [level=1]
  - heading "Pro tento výraz jsme nic nenašli" [level=4]
  - paragraph: Zkuste použít jiná slova. Snad najdete, co hledáte.
  - textbox "Vyhledávání":
    - /placeholder: Hledat v katalogu
    - text: Hummingbird
  - paragraph: Získejte nejnovější novinky a speciální slevy
  - button "Odebírat"
  - textbox "Získejte nejnovější novinky a speciální slevy":
    - /placeholder: Vaše e-mailová adresa
  - paragraph: Odběr novinek můžete kdykoliv zrušit. Pokud to chcete udělat, naše kontaktní informace naleznete v právním oznámení.
  - list
  - paragraph: Produkty
  - list:
    - listitem:
      - link "Slevy":
        - /url: https://prestashop.tesena.com/cs/slevy
    - listitem:
      - link "Nové produkty":
        - /url: https://prestashop.tesena.com/cs/novinky
    - listitem:
      - link "Nejprodávanější":
        - /url: https://prestashop.tesena.com/cs/nejprodavanejsi
  - paragraph: Naše společnost
  - list:
    - listitem:
      - link "Delivery":
        - /url: https://prestashop.tesena.com/cs/content/1-delivery
    - listitem:
      - link "Legal Notice":
        - /url: https://prestashop.tesena.com/cs/content/2-legal-notice
    - listitem:
      - link "Terms and conditions of use":
        - /url: https://prestashop.tesena.com/cs/content/3-terms-and-conditions-of-use
    - listitem:
      - link "About us":
        - /url: https://prestashop.tesena.com/cs/content/4-about-us
    - listitem:
      - link "Secure payment":
        - /url: https://prestashop.tesena.com/cs/content/5-secure-payment
    - listitem:
      - link "Kontaktujte nás":
        - /url: https://prestashop.tesena.com/cs/napiste-nam
    - listitem:
      - link "Mapa stránek":
        - /url: https://prestashop.tesena.com/cs/mapa stránek
    - listitem:
      - link "Prodejny":
        - /url: https://prestashop.tesena.com/cs/prodejny
  - paragraph:
    - link "Váš účet":
      - /url: https://prestashop.tesena.com/cs/muj-ucet
  - list:
    - listitem:
      - link "Sledování objednávky":
        - /url: https://prestashop.tesena.com/cs/sledovani-objednavky-navstevnika
    - listitem:
      - link "Přihlásit se":
        - /url: https://prestashop.tesena.com/cs/muj-ucet
    - listitem:
      - link "Vytvořit účet":
        - /url: https://prestashop.tesena.com/cs/registrace
    - listitem:
      - link "Moje oznámení":
        - /url: //prestashop.tesena.com/cs/module/ps_emailalerts/account
  - paragraph: Informace o obchodu
  - text: "PrestaShop Česko Napište nám:"
  - link "demo@prestashop.com":
    - /url: mailto:demo@prestashop.com
  - paragraph
  - paragraph:
    - link "© 2026 - Software pro elektronický obchod od PrestaShop™":
      - /url: https://www.prestashop-project.org/
```

# Test source

```ts
  1   | import { test, expect } from '../fixtures';
  2   | 
  3   | /**
  4   |  * Smoke suite: fast, read-only checks that the storefront is up and its key
  5   |  * entry points work. No data is created, so it is safe to run against any environment.
  6   |  */
  7   | test.describe('Storefront smoke', { tag: '@smoke' }, () => {
  8   |   test('homepage loads successfully', async ({ page }) => {
  9   |     const response = await page.goto('');
  10  | 
  11  |     expect(response?.ok()).toBeTruthy();
  12  |     await expect(page).toHaveTitle('PrestaShop');
  13  |     await expect(page.locator('#header')).toBeVisible();
  14  |     await expect(page.locator('#footer')).toBeVisible();
  15  |   });
  16  | 
  17  |   test('header shows guest state: sign-in link and empty cart', async ({ page, header }) => {
  18  |     await page.goto('');
  19  | 
  20  |     await expect(header.signInLink).toBeVisible();
  21  |     await expect(header.signOutLink).toHaveCount(0);
  22  |     await expect(header.cart).toContainText(/Košík\s*\(0\)/);
  23  |     await expect(header.searchBox).toBeVisible();
  24  |   });
  25  | 
  26  |   test('main menu lists the top-level categories', async ({ page, header }) => {
  27  |     await page.goto('');
  28  | 
  29  |     for (const category of ['Clothes', 'Příslušenství', 'Art']) {
  30  |       await expect(header.categoryLink(category)).toBeVisible();
  31  |     }
  32  |   });
  33  | 
  34  |   test('homepage shows popular products', async ({ page }) => {
  35  |     await page.goto('');
  36  | 
  37  |     const popular = page.locator('section.featured-products').filter({
  38  |       has: page.getByRole('heading', { name: 'Oblíbené produkty' }),
  39  |     });
  40  |     await expect(popular).toBeVisible();
  41  |     await expect(popular.locator('article.product-miniature').first()).toBeVisible();
  42  |     expect(await popular.locator('article.product-miniature').count()).toBeGreaterThan(0);
  43  |   });
  44  | 
  45  |   for (const { name, path } of [
  46  |     { name: 'Clothes', path: '3-clothes' },
  47  |     { name: 'Příslušenství', path: '6-accessories' },
  48  |     { name: 'Art', path: '9-art' },
  49  |   ]) {
  50  |     test(`category "${name}" opens from the main menu and lists products`, async ({ page, header, categoryPage }) => {
  51  |       await page.goto('');
  52  |       await header.categoryLink(name).click();
  53  | 
  54  |       await expect(page).toHaveURL(new RegExp(`/cs/${path}`));
  55  |       await expect(categoryPage.heading).toHaveText(name);
  56  |       await expect(categoryPage.products.first()).toBeVisible();
  57  |     });
  58  |   }
  59  | 
  60  |   test('catalog search submits and renders the results page', async ({ page, header }) => {
  61  |     await page.goto('');
  62  |     await header.search('mug');
  63  | 
  64  |     await expect(page).toHaveURL(/vyhledavani.*s=mug/);
  65  |     await expect(page.getByRole('heading', { name: 'Výsledek hledání', level: 1 })).toBeVisible();
  66  |   });
  67  | 
  68  |   test(
  69  |     'catalog search finds an existing product',
  70  |     {
  71  |       annotation: {
  72  |         type: 'known issue',
  73  |         description:
  74  |           'Search returns "Pro tento výraz jsme nic nenašli" for every term, incl. exact product names ' +
  75  |           '(observed 2026-10-27; search index probably not built). Remove test.fail() once fixed.',
  76  |       },
  77  |     },
  78  |     async ({ page, header }) => {
  79  |       test.fail();
  80  |       await page.goto('');
  81  |       await header.search('Hummingbird');
  82  | 
  83  |       const results = page.locator('#js-product-list article.product-miniature');
> 84  |       await expect(results.first()).toContainText(/Hummingbird/i);
      |                                     ^ Error: expect(locator).toContainText(expected) failed
  85  |     },
  86  |   );
  87  | 
  88  |   test('product detail page opens with an enabled add-to-cart button', async ({ categoryPage, productPage }) => {
  89  |     await categoryPage.goto('3-clothes');
  90  |     await categoryPage.openProduct('Hummingbird printed t-shirt');
  91  | 
  92  |     await expect(productPage.heading).toHaveText('Hummingbird printed t-shirt');
  93  |     await expect(productPage.addToCartButton).toBeEnabled();
  94  |   });
  95  | 
  96  |   test('registration page is reachable', async ({ registrationPage }) => {
  97  |     await registrationPage.goto();
  98  | 
  99  |     await expect(registrationPage.heading).toBeVisible();
  100 |     await expect(registrationPage.submitButton).toBeVisible();
  101 |   });
  102 | 
  103 |   test('login page is reachable from the header', async ({ page, header, loginPage }) => {
  104 |     await page.goto('');
  105 |     await header.signInLink.click();
  106 | 
  107 |     await expect(loginPage.form).toBeVisible();
  108 |     await expect(loginPage.submitButton).toBeVisible();
  109 |   });
  110 | });
  111 | 
```