import { test, expect } from './fixtures';
import { products } from '../test-data/config';

const [backpack, bikeLight] = products;
if (!backpack || !bikeLight) throw new Error('Test data must contain at least two products');

test.describe('Cart', () => {
  test('adding products updates the badge and the cart contents', async ({ loggedInInventory: inventory, cartPage }) => {
    await inventory.addToCart(backpack.name);
    await inventory.addToCart(bikeLight.name);
    await expect(inventory.cartBadge).toHaveText('2');

    await inventory.openCart();
    await cartPage.expectLoaded();
    await expect(cartPage.itemNames).toHaveText([backpack.name, bikeLight.name]);
  });

  test('removing a product updates the badge and the cart contents', async ({ loggedInInventory: inventory, cartPage }) => {
    await inventory.addToCart(backpack.name);
    await inventory.addToCart(bikeLight.name);
    await inventory.openCart();

    await cartPage.remove(backpack.name);
    await expect(cartPage.itemNames).toHaveText([bikeLight.name]);
    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('removing the last product empties the cart and hides the badge', async ({ loggedInInventory: inventory, cartPage }) => {
    await inventory.addToCart(backpack.name);
    await inventory.openCart();

    await cartPage.remove(backpack.name);
    await expect(cartPage.items).toHaveCount(0);
    await expect(inventory.cartBadge).toBeHidden();
  });
});
