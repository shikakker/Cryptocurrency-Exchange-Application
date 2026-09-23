import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const calculator = await readFile(new URL('../src/utils/exchangeCalculator.ts', import.meta.url), 'utf8');
const best = await readFile(new URL('../src/components/Exchange/BestExchangePaths.tsx', import.meta.url), 'utf8');
const form = await readFile(new URL('../src/components/Exchange/ExchangeForm.tsx', import.meta.url), 'utf8');
const app = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');
const api = await readFile(new URL('../src/services/api.ts', import.meta.url), 'utf8');

test('round-trip finder compounds conversion rates and fees instead of adding unrelated percentages', () => {
  assert.match(calculator, /SIMULATED_FEE_RATE = 0\.001/);
  assert.match(calculator, /outputAmount = amount \* rate \* \(1 - SIMULATED_FEE_RATE\)/);
  assert.match(calculator, /totalReturnPercentage = \(outputAmount - 1\) \* 100/);
  assert.doesNotMatch(calculator, /reduce\(\(acc, step\).*profitPercentage/s);
});

test('UI makes simulation boundary explicit and does not claim executable arbitrage', () => {
  assert.match(best, /Round-trip Simulation/);
  assert.match(best, /does not represent executable arbitrage or exchange quotes/);
  assert.doesNotMatch(best, /potential profit/);
  assert.match(app, /Demo only — no trading or custody/);
});

test('manual conversion compares same-snapshot USD-equivalent values across different asset units', () => {
  assert.match(form, /initialUsdValue = initialAmount \* firstMarket\.current_price/);
  assert.match(form, /finalUsdValue = currentAmount \* finalMarket\.current_price/);
  assert.match(form, /amount: inputAmount/);
  assert.doesNotMatch(form, /addTransaction/);
});

test('fake authentication and transaction history are not product gates', () => {
  assert.doesNotMatch(app, /LoginForm/);
  assert.doesNotMatch(app, /TransactionHistory/);
});

test('market provider call is bounded and response shape is validated', () => {
  assert.match(api, /timeout: 10_000/);
  assert.match(api, /Array\.isArray\(response\.data\)/);
  assert.match(api, /Number\.isFinite\(item\.current_price\)/);
});
