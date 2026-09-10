# Template reference — Carwow-style

## Identity
- Repository: `darkapoparka/cars-template-carwow`
- Key: `carwow`
- Portfolio role: **core**
- Design position: consumer marketplace / strongest immediate visual impact
- Stack: SvelteKit + Vite
- Primary entry: `/`
- Suggested standalone review port: `6463`

This is a **template master**, not a sendable dealer demo. The baseline intentionally preserves source/sample material for design fidelity; every lead copy requires a complete identity and content sweep.

## Install and run
```text
npm ci
npx vite dev --host 127.0.0.1 --port 6463 --strictPort
```

## Primary personalization surface
- `src/lib/data/daynight-site.ts`
- `src/lib/data/daynight-current-inventory.ts`
- `src/lib/data/daynight-vehicles.ts`
- `src/lib/data/daynight-reviews.ts`
- `src/lib/styles/`
- `static/brand/`
- `static/`

Do not assume these are the only identity consumers. Search every retained route, data module, metadata definition and static asset before declaring a skin complete.

## Representative QA routes
- `/`
- `/inventory`
- `/inventory/mercedes-benz-gla-45-amg-405323`
- `/contact`
- `/sell-your-car`
- `/financing`
- `/compare`

## Required checks
- `npm run check`
- `npm run build`
- `npm run test:unit -- --run`

## Current constraints
Desktop and mobile have intentional separate compositions. The inherited npm dev wrapper hardcodes port 6517; use direct Vite for concurrent standalone review.

For `modern`, local preview also requires the environment documented in `docs/QA.md`; provider services remain unconfigured unless a lead task explicitly wires them. For `carwow`, use direct Vite for a selectable port because the inherited source dev wrapper fixes port 6517.

## Source lineage
Split on 2026-09-10 from the live working tree at `J:/cars/templates/carwow`. The split deliberately captured local working-tree changes, including changes newer than the `cars` repository HEAD. Historical root instructions were archived under `docs/legacy/from-cars-2026-09-10/`; use them only for provenance, never as current operating instructions.

## Portfolio policy
Standard showroom lead = three variants: `auto-best`, `carwow`, `modern`. Add `import` only when the dealer's real offer includes sourcing/import/transport/order-from-Europe or equivalent. Do not add a fourth design merely to increase the count.
