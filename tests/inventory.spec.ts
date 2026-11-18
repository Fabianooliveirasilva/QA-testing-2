import { test, expect } from './fixtures';
import { products } from '../test-data/config';

test.describe('Inventory', () => {
  test('shows all six products with their names and prices', async ({ loggedInInventory: inventory }) => {
    await expect(inventory.items).toHaveCount(products.length);
    await expect(inventory.itemNames).toHaveText(products.map((p) => p.name));
    await expect(inventory.itemPrices).toHaveText(products.map((p) => `$${p.price}`));
  });

  test('sorting by price (low to high) orders products ascending', async ({ loggedInInventory: inventory }) => {
    await inventory.sortBy('Price (low to high)');
    const expected = [...products].sort((a, b) => a.price - b.price).map((p) => `$${p.price}`);
    await expect(inventory.itemPrices).toHaveText(expected);
  });
});
