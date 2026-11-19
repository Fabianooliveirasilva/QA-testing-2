import { test, expect } from './fixtures';
import { checkout, products } from '../test-data/config';

const [backpack, bikeLight] = products;
if (!backpack || !bikeLight) throw new Error('Test data must contain at least two products');

test.describe('Checkout', () => {
  test.beforeEach(async ({ loggedInInventory: inventory, cartPage }) => {
    await inventory.addToCart(backpack.name);
    await inventory.addToCart(bikeLight.name);
    await inventory.openCart();
    await cartPage.checkout();
  });

  test('completes an order and shows consistent totals', async ({ checkoutPage, inventoryPage }) => {
    await checkoutPage.fillInformation(checkout.valid);
    await checkoutPage.continue();
    await checkoutPage.expectOverview();

    const expectedItemTotal = backpack.price + bikeLight.price;
    const itemTotal = await checkoutPage.amount(checkoutPage.itemTotal);
    const tax = await checkoutPage.amount(checkoutPage.tax);
    const total = await checkoutPage.amount(checkoutPage.total);
    expect(itemTotal).toBeCloseTo(expectedItemTotal, 2);
    expect(total).toBeCloseTo(itemTotal + tax, 2);

    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  // Fixed expectation (not derived from the page), so a wrong tax rate is caught even if
  // item total, tax and total are consistent with each other. Observed on 2026-11-17: 8% rate.
  test('applies the expected tax to a known cart ($39.98 -> $3.20)', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation(checkout.valid);
    await checkoutPage.continue();
    await checkoutPage.expectOverview();

    await expect(checkoutPage.itemTotal).toHaveText('Item total: $39.98');
    await expect(checkoutPage.tax).toHaveText('Tax: $3.20');
    await expect(checkoutPage.total).toHaveText('Total: $43.18');
  });

  for (const [name, data] of Object.entries(checkout).filter(([key]) => key.startsWith('missing'))) {
    test(`blocks checkout when information is incomplete (${name})`, async ({ checkoutPage }) => {
      const { error, ...info } = data as typeof checkout.missingFirstName;
      await checkoutPage.fillInformation(info);
      await checkoutPage.continue();
      await expect(checkoutPage.errorMessage).toHaveText(error);
    });
  }
});
