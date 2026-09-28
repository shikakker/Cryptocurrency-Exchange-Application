# Cryptocurrency Exchange Application — Modernization Roadmap

The current application is correctly documented as a frontend prototype using CoinGecko market summaries, simulated authentication and synthetic path calculations. It does not execute trades or custody assets.

## 10 tasks
1. Rename synthetic “best trading paths” in the UI so users cannot mistake them for executable arbitrage opportunities.
2. Replace additive percentage logic with mathematically coherent conversion simulation if the educational calculator is retained.
3. Introduce explicit venue/pair/fee/slippage inputs before any future arbitrage-style analysis.
4. Add CoinGecko loading, quota/rate-limit, stale-data and provider-error states.
5. Cache and timestamp market snapshots so every calculation exposes data freshness.
6. Separate demo authentication from any future real account/security architecture.
7. Add deterministic transaction-history fixtures and label them as simulated activity.
8. Add tests for conversion math, state transitions, data refresh and failure states.
9. Add CI/build validation and responsive/accessibility checks for the dashboard.
10. Position as a fintech/crypto product-design and simulation prototype, never as a functioning exchange.

## Portfolio value
Strong product/fintech UI case if framed around market-data UX and simulation boundaries rather than financial infrastructure.