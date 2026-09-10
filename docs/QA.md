# QA contract — Carwow-style

Passing a build is necessary but not sufficient. A lead variant must also be inspected as a dealership experience.

## Install/run
- Install: `npm ci`
- Preview: `npx vite dev --host 127.0.0.1 --port 6463 --strictPort`

## Framework checks
- `npm run check`
- `npm run build`
- `npm run test:unit -- --run`

## Browser matrix
Test at **390px** and **1440px**. Minimum route set:
- `/`
- `/inventory`
- `/inventory/mercedes-benz-gla-45-amg-405323`
- `/contact`
- `/sell-your-car`
- `/financing`
- `/compare`

On the tested routes, exercise navigation, mobile menu/open-close behavior, one search/filter path, one vehicle-detail transition and return path, phone/contact CTA, map/contact link, and the main sell/finance/import/enquiry path that the lead actually offers.

## Visual/content checks
- Correct dealer logo and favicon; no stretched or low-quality placeholder identity.
- No inherited dealer name, phone, address, domain, map, social account, testimonial, watermark or metadata.
- Inventory photos/titles/specs/prices/statuses agree with the sourced fact pack.
- No missing images, broken links, horizontal overflow, clipped controls or unreadable contrast.
- Mobile and desktop preserve the template's intended composition rather than collapsing into a generic rewrite.
- Currency, units, language and finance wording match the dealer's market.

## Runtime truthfulness
Check console/page errors. Forms, chat widgets and calculators may be demo interactions; record that clearly unless real delivery/integration is configured and tested. A localhost 200 response is not a deploy verification.

## Final identity search
Search the full lead copy for: `DAY NIGHT AUTO GROUP|Day Night Auto|Day & Night|daynight|day-night|0877 733 110|Атанас Манчев|kristiankirilov` plus the old domain/social/logo filenames. Provenance/history files can retain source names if clearly historical; active UI/data/metadata cannot.

## Done gate
Do not mark ready until checks pass or each failure is explicitly documented with impact. Report exactly which commands, routes and widths were tested.
