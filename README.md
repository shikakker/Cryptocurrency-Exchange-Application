# Cryptocurrency Exchange Application

Crypto-market / exchange **frontend prototype** with live CoinGecko market prices, simulated authentication, local exchange-state management, transaction-history UI, and an experimental “best trading paths” calculator.

Historical deployment reference from the previous README:

```text
http://crypto.whoisegor.ru/
```

The application reads real public market prices from CoinGecko, but it does **not** execute cryptocurrency trades, custody assets, connect wallets, authenticate users, or calculate real arbitrage opportunities from exchange order books.

## Product areas

- Login / registration UI
- Top cryptocurrency market list
- Exchange form
- Exchange-result presentation
- Experimental trading-path ranking
- Transaction-history UI
- Zustand state management
- Responsive React dashboard

## Live market data

`src/services/api.ts` calls CoinGecko directly from the browser:

```text
GET https://api.coingecko.com/api/v3/coins/markets
    ?vs_currency=usd
    &order=market_cap_desc
    &per_page=100
    &sparkline=false
```

This provides live-ish market summary values such as `current_price` for the top 100 records returned by the public endpoint.

The application refreshes the “best path” calculation approximately every 30 seconds.

## Authentication is simulated

`src/store/authStore.ts` contains explicit comments that a real app would make an API call.

Current login / registration behavior simply creates a local user object:

```text
user.email = submitted email
user.id    = Math.random().toString()
```

The password is not verified against a server or database.

Therefore the login screen is **not a security or account boundary**.

## No wallet / custody / trade execution

The current package contains no:

- ethers / viem / Web3 wallet SDK;
- exchange trading API;
- custody provider;
- blockchain RPC client;
- private-key storage;
- order-signing flow;
- deposit / withdrawal infrastructure.

Exchange state is UI state, not a financial transaction system.

## “Best Trading Paths” are not real arbitrage calculations

`findBestTradingPaths()` calculates a synthetic conversion rate as:

```text
from.current_price / to.current_price
```

using CoinGecko USD spot-price snapshots.

It then computes step “profit” values and **adds percentage changes across steps**.

This is not a valid real-world arbitrage model.

A correct exchange / arbitrage calculation would need to account for at least:

- bid / ask rather than one reference price;
- a specific exchange / venue;
- actual trading pairs;
- order-book depth;
- fees;
- slippage;
- minimum order sizes;
- precision / lot sizes;
- transfer costs;
- execution latency;
- chain withdrawal / deposit delays;
- liquidity;
- taxes / jurisdiction where relevant.

Additionally, multi-step returns compound multiplicatively; they should not generally be modeled by simply adding per-step percentage values.

The current labels such as:

```text
X% potential profit
```

should therefore be treated as **experimental UI output**, not a trading signal or expected return.

## Financial disclaimer

This repository is a software prototype, not an exchange, broker, investment service, or financial-advice system.

Do not use the current “profit” values for real trading decisions.

## Browser API / rate-limit caveat

CoinGecko is called directly from the frontend without an application cache or rate-limit layer.

A production market dashboard should define:

- provider quota / authentication;
- server-side caching;
- stale-data handling;
- request retry / backoff;
- source attribution;
- timestamp / freshness display;
- fallback when the provider is unavailable.

## Tech stack

- React 18
- TypeScript
- Vite 5
- Axios
- React Router 6
- Zustand
- Tailwind CSS
- Lucide React
- CoinGecko public API

## Local development

### Requirements

- Node.js 18+
- npm
- Internet access to CoinGecko

### Install

```bash
git clone https://github.com/shikakker/Cryptocurrency-Exchange-Application.git
cd Cryptocurrency-Exchange-Application
npm install
```

Run:

```bash
npm run dev
```

Build / lint / preview:

```bash
npm run lint
npm run build
npm run preview
```

## Production direction

A real exchange product would require a substantially different architecture:

```text
web / mobile client
       |
       v
authenticated trading backend
       |
       +-- account / KYC / AML
       +-- wallet / custody
       +-- market-data adapters
       +-- order management
       +-- risk controls
       +-- transaction ledger
       +-- withdrawals / deposits
       +-- audit / compliance
       |
       v
exchange / blockchain infrastructure
```

A portfolio description should therefore emphasize the **market-data and exchange UX experiment**, not imply regulated financial infrastructure.

## Current status

**Functional crypto-market frontend prototype with real CoinGecko price data and simulated account / exchange behavior.** Market-data display is source-backed; authentication, transaction execution, custody, and “best trading path” profitability are not production financial functionality.

## License

See repository files for licensing information and review CoinGecko API terms separately.