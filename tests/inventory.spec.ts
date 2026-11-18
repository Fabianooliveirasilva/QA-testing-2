import { test, expect } from './fixtures';
import { products } from '../test-data/config';

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);

const sortOptions = [
  { label: 'Name (A to Z)', order: [...products].sort(byName) },
  { label: 'Name (Z to A)', order: [...products].sort(byName).reverse() },
  { label: 'Price (low to high)', order: [...products].sort((a, b) => a.price - b.price) },
  { label: 'Price (high to low)', order: [...products].sort((a, b) => b.price - a.price) },
];

test.describe('Inventory', () => {
  test('shows all six products with their names and prices', async ({ loggedInInventory: inventory }) => {
    await expect(inventory.items).toHaveCount(products.length);
    await expect(inventory.itemNames).toHaveText(products.map((p) => p.name));
    await expect(inventory.itemPrices).toHaveText(products.map((p) => `$${p.price}`));
  });

  for (const { label, order } of sortOptions) {
    test(`sorting by "${label}" orders the products correctly`, async ({ loggedInInventory: inventory }) => {
      await inventory.sortBy(label);
      await expect(inventory.itemPrices).toHaveText(order.map((p) => `$${p.price}`));
      // Names are asserted only for name sorting: two products share the price $15.99,
      // so their relative order under price sorting is not defined by the requirement.
      if (label.startsWith('Name')) {
        await expect(inventory.itemNames).toHaveText(order.map((p) => p.name));
      }
    });
  }
});
