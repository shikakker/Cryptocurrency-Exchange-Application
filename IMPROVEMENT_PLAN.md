# Completion plan

1. Reconcile the 5.2 KB README with the Vite `src` implementation and the `.bolt` project provenance.
2. Identify which exchange screens/actions are static simulation versus backed by market, wallet or order APIs.
3. Do not describe the project as a functioning exchange unless custody, order execution and settlement actually exist and are verified.
4. Use decimal-safe arithmetic for prices, quantities, balances, fees and totals.
5. Validate trading pair, order side/type, quantity and price before any action; clearly label demo balances and simulated fills.
6. Add loading/stale-market-data, insufficient-balance, invalid-order and provider-failure states.
7. Add accessible confirmation for consequential actions and prevent accidental duplicate submissions.
8. Add tests for order calculations, validation and simulated trade state transitions.
9. Add CI for lint/type-check, tests and production Vite build.
10. Rewrite README as portfolio documentation centered on verified exchange UX/prototyping rather than unsupported financial infrastructure claims.
