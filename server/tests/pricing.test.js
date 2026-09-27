import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateCartTotals,
  sanitizeQuantity,
  toSafeMoney,
} from '../utils/pricing.js';

test('calculateCartTotals sums product prices by quantity and currency-safe values', () => {
  const summary = calculateCartTotals([
    { quantity: 2, product: { price: 799 } },
    { quantity: 1, product: { price: 1499.50 } },
  ]);

  assert.equal(summary.subtotal, 3097.5);
  assert.equal(summary.itemCount, 3);
  assert.equal(summary.total, 3097.5);
});

test('sanitizeQuantity rejects invalid or negative values', () => {
  assert.throws(() => sanitizeQuantity(0), /greater than 0/i);
  assert.throws(() => sanitizeQuantity(-2), /greater than 0/i);
  assert.throws(() => sanitizeQuantity('abc'), /positive integer/i);
});

test('toSafeMoney prevents floating point drift and disallows negative prices', () => {
  assert.equal(toSafeMoney(799.99 + 0.01), 800);
  assert.throws(() => toSafeMoney(-10), /cannot be negative/i);
});
