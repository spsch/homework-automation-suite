# homework-automation-suite

Automated UI tests for the PrestaShop demo storefront at
**https://prestashop.tesena.com/cs/** (Czech locale), written with
[Playwright Test](https://playwright.dev/) and TypeScript.

The suite has two layers:

| Layer     | What it covers                                                                 | Creates data? |
|-----------|--------------------------------------------------------------------------------|---------------|
| **Smoke** | Storefront is up: homepage, header, menu, categories, search, product detail, login/registration pages | No |
| **E2E**   | Customer registration → login/logout → add a Clothes product to the cart, plus negative cases | Yes, 1 new customer per run |

Detailed test cases, design decisions and known issues are in
[docs/TEST_DOCUMENTATION.md](docs/TEST_DOCUMENTATION.md).

## Prerequisites

- Node.js 20+ (developed on Node 24)
- Internet access to `prestashop.tesena.com`

## Setup

```bash
npm ci
npx playwright install --with-deps   # browsers (drop --with-deps on Windows/macOS)
```

## Running tests

| Command                  | Runs                                                            |
|--------------------------|-----------------------------------------------------------------|
| `npm test`               | Everything, all browsers (Chromium, Firefox, WebKit)            |
| `npm run test:smoke`     | Smoke suite only (no data created, no dependencies)             |
| `npm run test:e2e`       | E2E suite (automatically runs the registration `setup` first)   |
| `npm run test:chromium`  | Smoke + E2E in Chromium only - fastest full check               |
| `npm run test:headed`    | Chromium with a visible browser window                          |
| `npm run test:ui`        | Playwright UI mode for interactive debugging                    |
| `npm run report`         | Open the last HTML report                                       |

Any Playwright CLI option can be appended after `--`, e.g.
`npm run test:e2e -- --project=firefox-e2e` or `npm test -- --grep "log out"`.

To run against another instance of the shop, set `BASE_URL`
(keep the trailing slash): `BASE_URL=https://my-shop.example/cs/ npm test`.

## Project structure

```
playwright.config.ts        Projects, base URL, timeouts, reporters
tests/
  fixtures.ts               `test` extended with page objects + registeredCustomer
  pages/                    Page Object Model (one class per page/component)
    Header.ts               user info, cart, top menu, search
    RegistrationPage.ts     /registrace
    LoginPage.ts            /přihlásit
    CategoryPage.ts         category listing, e.g. /3-clothes
    ProductPage.ts          product detail + variant selection
    CartModal.ts            "added to cart" dialog
    CartPage.ts             /kosik
  support/customer.ts       Test-data factory and persistence of the registered customer
  smoke/storefront.spec.ts  Smoke suite
  e2e/
    registration.setup.ts   E2E: register a new customer (runs once, first)
    registration.spec.ts    E2E: registration form validation
    login-logout.spec.ts    E2E: login + logout with the registered customer
    add-to-cart.spec.ts     E2E: add a product from Clothes as the registered customer
docs/TEST_DOCUMENTATION.md  Test documentation
.github/workflows/          GitHub Actions pipeline
```

### How the E2E chain works

```
setup (Chromium, once)          chromium-e2e / firefox-e2e / webkit-e2e
registration.setup.ts  ──────►  login-logout.spec.ts
  registers a new customer      add-to-cart.spec.ts
  saves playwright/.auth/       registration.spec.ts (validation only)
        customer.json
```

The `setup` project registers a unique customer and writes its credentials to
`playwright/.auth/customer.json` (git-ignored). Every `*-e2e` project declares
`dependencies: ['setup']`, so the login/logout and cart tests always use the
customer created earlier in the same run. If registration fails, those tests are skipped
instead of failing for an unrelated reason. Smoke projects have no dependency, so they still
report even when registration is broken.

## Reports and debugging

- HTML report: `playwright-report/` (`npm run report`).
- On failure: screenshot + video in `test-results/`; on CI retry also a trace
  (`npx playwright show-trace <trace.zip>`).

## CI

`.github/workflows/playwright.yml` runs `npx playwright test` on every push and PR to
`main`/`master` and uploads the HTML report as a build artifact. On CI the suite runs with
1 worker and 2 retries (see `playwright.config.ts`).
