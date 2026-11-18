# Application Analysis — SauceDemo

System under test: <https://www.saucedemo.com/> (public demo e-commerce application by Sauce Labs).
Inspection date: 2026-11-17. Method: manual exploration plus Playwright accessibility snapshots.
Everything below is observed behaviour, not documented requirements.

## Workflows

| # | Page | URL | Purpose |
|---|------|-----|---------|
| 1 | Login | `/` | Authenticate with a demo user |
| 2 | Inventory | `/inventory.html` | Product list, sorting, add/remove from cart |
| 3 | Cart | `/cart.html` | Review and remove items, start checkout |
| 4 | Checkout: Your Information | `/checkout-step-one.html` | First name, last name, postal code |
| 5 | Checkout: Overview | `/checkout-step-two.html` | Item list, payment, shipping, totals |
| 6 | Checkout: Complete | `/checkout-complete.html` | Order confirmation |

## Demo users

Usernames are published on the login page: `standard_user`, `locked_out_user`, `problem_user`,
`performance_glitch_user`, `error_user`, `visual_user`. All share the public demo password.
The password is read from the `SAUCE_PASSWORD` environment variable (default: the public demo value).

## Observed messages

| Situation | Message |
|-----------|---------|
| Empty username | `Epic sadface: Username is required` |
| Wrong password | `Epic sadface: Username and password do not match any user in this service` |
| Locked user | `Epic sadface: Sorry, this user has been locked out.` |
| Checkout, empty first name | `Error: First Name is required` |
| Checkout, empty last name | `Error: Last Name is required` |
| Checkout, empty postal code | `Error: Postal Code is required` |

## Catalog (6 products)

Sauce Labs Backpack ($29.99), Sauce Labs Bike Light ($9.99), Sauce Labs Bolt T-Shirt ($15.99),
Sauce Labs Fleece Jacket ($49.99), Sauce Labs Onesie ($7.99), Test.allTheThings() T-Shirt (Red) ($15.99).
Sorting options: Name (A to Z), Name (Z to A), Price (low to high), Price (high to low).

## Pricing observation

Backpack + Bike Light: item total $39.98, tax $3.20, total $43.18 (tax is about 8%).

## Locator strategy

- Accessible roles and names first: `getByRole('button', { name: 'Login' })`, `getByRole('textbox', { name: 'Username' })`, `getByRole('alert')`.
- The application exposes a stable `data-test` attribute; `playwright.config.ts` maps it to `getByTestId` and it is used only where no accessible role exists (cart badge, product name, totals).
- No CSS-class or XPath selectors.

## Observations worth exploring (not confirmed defects)

- The cart badge and cart state persist across page navigation for the logged-in user.
- Finishing an order empties the cart.
- `problem_user`, `error_user`, `visual_user` and `performance_glitch_user` are designed to misbehave and are candidates for exploratory testing, not for the stable automated suite.
