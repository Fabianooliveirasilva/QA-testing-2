import { test, expect } from './fixtures';
import { password, products, users } from '../test-data/config';

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

  test('a product can be removed from the inventory page (CART-005)', async ({ loggedInInventory: inventory }) => {
    await inventory.addToCart(backpack.name);
    await inventory.expectInCart(backpack.name);

    await inventory.removeFromCart(backpack.name);
    await inventory.expectNotInCart(backpack.name);
    await expect(inventory.cartBadge).toBeHidden();
  });

  test('adding and removing the same product repeatedly never duplicates it (CART-015)', async ({ loggedInInventory: inventory, cartPage }) => {
    for (let i = 0; i < 3; i++) {
      await inventory.addToCart(backpack.name);
      await inventory.removeFromCart(backpack.name);
    }
    await inventory.addToCart(backpack.name);
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.openCart();
    await expect(cartPage.items).toHaveCount(1);
  });

  test('changing the sort order does not change the cart (CART-024)', async ({ loggedInInventory: inventory, cartPage }) => {
    await inventory.addToCart(bikeLight.name);
    await inventory.sortBy('Price (high to low)');
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.openCart();
    await expect(cartPage.itemNames).toHaveText([bikeLight.name]);
  });

  test('the cart survives a page reload (CART-016)', async ({ page, loggedInInventory: inventory }) => {
    await inventory.addToCart(backpack.name);
    await page.reload();
    await expect(inventory.cartBadge).toHaveText('1');
    await inventory.expectInCart(backpack.name);
  });

  test('the cart survives logout and login (CART-017)', async ({ loggedInInventory: inventory, loginPage }) => {
    await inventory.addToCart(backpack.name);
    await inventory.logout();

    await loginPage.login(users.standard.username, password);
    await inventory.expectLoaded();
    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('Reset App State empties the cart and restores the buttons (CART-019)', async ({ page, loggedInInventory: inventory }) => {
    await inventory.addToCart(backpack.name);
    await inventory.addToCart(bikeLight.name);

    await inventory.resetAppState();
    await page.reload();
    await expect(inventory.cartBadge).toBeHidden();
    await inventory.expectNotInCart(backpack.name);
    await inventory.expectNotInCart(bikeLight.name);
  });

  test('the cart page is not accessible when logged out (CART-008)', async ({ page, loginPage }) => {
    await page.goto('/cart.html');
    await expect(loginPage.errorMessage).toHaveText("Epic sadface: You can only access '/cart.html' when you are logged in.");
  });
});
