import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortSelect: Locator;
  readonly menuButton: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toHaveText('Products');
  }

  private item(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  async addToCart(productName: string): Promise<void> {
    await this.item(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(productName: string): Promise<void> {
    await this.item(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(option: string): Promise<void> {
    await this.sortSelect.selectOption({ label: option });
  }

  /** The Add to cart / Remove toggle button of a product (excludes the product detail links). */
  private toggleButton(productName: string): Locator {
    return this.item(productName).getByRole('button', { name: /^(Add to cart|Remove)$/ });
  }

  async expectInCart(productName: string): Promise<void> {
    await expect(this.toggleButton(productName)).toHaveText('Remove');
  }

  async expectNotInCart(productName: string): Promise<void> {
    await expect(this.toggleButton(productName)).toHaveText('Add to cart');
  }

  async resetAppState(): Promise<void> {
    await this.menuButton.click();
    await this.page.getByRole('button', { name: 'Reset App State' }).click();
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.page.getByRole('button', { name: 'Logout' }).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
