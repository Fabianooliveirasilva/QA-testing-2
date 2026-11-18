import users from './users.json';
import products from './products.json';
import checkout from './checkout.json';

/**
 * Password of the public SauceDemo demo users. It is published on the login page,
 * but it is still read from the environment so no credential is hardcoded in tests.
 */
export const password: string = process.env.SAUCE_PASSWORD || 'secret_sauce';

export const errors = {
  usernameRequired: 'Epic sadface: Username is required',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
} as const;

export { users, products, checkout };

export type Product = (typeof products)[number];
