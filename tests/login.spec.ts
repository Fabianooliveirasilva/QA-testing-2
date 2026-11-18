import { test, expect } from './fixtures';
import { errors, password, users } from '../test-data/config';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in and lands on the product list', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, password);
    await inventoryPage.expectLoaded();
  });

  test('wrong password shows an invalid credentials error', async ({ page, loginPage }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await expect(loginPage.errorMessage).toHaveText(errors.invalidCredentials);
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('locked out user cannot log in', async ({ page, loginPage }) => {
    await loginPage.login(users.locked.username, password);
    await expect(loginPage.errorMessage).toHaveText(errors.lockedOut);
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('empty credentials show a username required error', async ({ loginPage }) => {
    await loginPage.login(users.empty.username, users.empty.password);
    await expect(loginPage.errorMessage).toHaveText(errors.usernameRequired);
  });
});
