import fs from 'fs';
import path from 'path';

export type Gender = 'Pan' | 'Paní';

export interface Customer {
  gender: Gender;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  /** Optional, format DD.MM.YYYY */
  birthday?: string;
}

/** Where the customer registered by the `setup` project is stored (git-ignored). */
export const REGISTERED_CUSTOMER_FILE = path.resolve(__dirname, '../../playwright/.auth/customer.json');

/** Letters only - the shop rejects digits in first/last name. */
function randomLetters(length: number): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

/** Builds a customer with a unique e-mail so every run registers a new account. */
export function createCustomer(overrides: Partial<Customer> = {}): Customer {
  const suffix = randomLetters(6);
  return {
    gender: 'Pan',
    firstName: 'Tester',
    lastName: `Auto${suffix}`,
    email: `autotest.${Date.now()}.${suffix}@example.com`,
    // Must satisfy the shop's password strength policy.
    password: `Pw#${suffix}-${Date.now()}`,
    birthday: '31.05.1990',
    ...overrides,
  };
}

export function saveRegisteredCustomer(customer: Customer): void {
  fs.mkdirSync(path.dirname(REGISTERED_CUSTOMER_FILE), { recursive: true });
  fs.writeFileSync(REGISTERED_CUSTOMER_FILE, JSON.stringify(customer, null, 2));
}

export function loadRegisteredCustomer(): Customer {
  if (!fs.existsSync(REGISTERED_CUSTOMER_FILE)) {
    throw new Error(
      `No registered customer found at ${REGISTERED_CUSTOMER_FILE}. ` +
        'Run the tests with the "setup" project dependency (do not pass --no-deps).',
    );
  }
  return JSON.parse(fs.readFileSync(REGISTERED_CUSTOMER_FILE, 'utf-8')) as Customer;
}
