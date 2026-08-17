# Completion plan

1. Reframe the product from the actual Vite/Bolt implementation: login form, crypto list, exchange form/result/steps, best-path view, transaction history and local stores; do not present it as a production exchange without verified execution infrastructure.
2. Audit `src/services/api.ts`, the auth/exchange/transaction stores and every displayed balance/rate to classify each value as fixture, local simulation or live provider data, with visible provenance/timestamps.
3. Treat `PathSummary.tsx` being zero-byte as an incomplete feature: either implement it from verified exchange-path data or remove the dead import/claim instead of leaving a placeholder component.
4. Define typed assets, pairs, quotes, exchange paths, fees, balances and transactions, using decimal-safe/base-unit arithmetic for all prices, quantities and totals.
5. Validate source/destination asset, amount, path steps and rate freshness before showing an exchange result; reject zero/negative amounts, identical assets and unsupported pairs deterministically.
6. If any real provider is connected, keep API credentials server-side and add timeout, rate-limit, stale quote and provider-failure handling; otherwise label all exchange execution as simulation and never fabricate completed transfers.
7. Add a confirmation step that displays exact input, expected output, fees, route and quote timestamp before any consequential action, and prevent duplicate submissions/replays.
8. Add deterministic tests for `exchangeCalculator`, best-path selection, validation and store state transitions using fixed fixtures; add interaction tests for login -> quote -> review -> simulated result/history.
9. Add CI for ESLint, TypeScript, tests and production Vite build; pin supported Node/dependency versions and remove obsolete/generated Bolt-only assumptions from runtime configuration where unnecessary.
10. Rewrite README as a verified exchange-UX prototype case study covering implemented screens, simulation/live-data status, calculation model, architecture, screenshots, setup and explicit absence of custody/settlement unless later implemented.
