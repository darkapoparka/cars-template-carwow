# Native EN/BG localization handoff

Verified 20 September 2026. This work belongs only to the canonical Carwow repository, on main. No Cars pins, dealer deployments, replacement Vercel projects, additional worktrees, security settings or framework dependencies were changed. This existing task was the sole source/index/build writer; it created no additional Codex tasks or sub-agents.

## Source and release identity

- Baseline: `89f50c427863050abb7923152f05c091bb937d1e`.
- Exact application/release commit: `2cb3eb1d33f71d5b3ef92497b773d629dcd52ffc`.
- Exact application-commit tree: `3a94037100612126587f5b7e68c3c23f5bc814af`.
- Nine scoped, non-force commits were pushed from the baseline through that application commit. Review with `git diff 89f50c427863050abb7923152f05c091bb937d1e 2cb3eb1d33f71d5b3ef92497b773d629dcd52ffc`.
- Existing Vercel project: `prj_MrJ6NCi6r5wuMlo1k697mUk1AENj`; team: `team_RTNXBnClGWDdcYFFUW0BnqvJ`.
- Verified Git/main production deployment: `dpl_6eLNijAiC9M51T5z3osZjMYevfJx`, READY at the exact application SHA, with no alias error.
- Deployment URL: https://cars-template-carwow-52niuwylf-tyj5.vercel.app.
- Verified public alias: https://cars-template-carwow.vercel.app.

This handoff and VERIFICATION.json follow the tested application in a documentation-only commit. They do not change the application source. The final documentation HEAD/deployment check is recorded locally in `.audit/localization/OWNER-STATUS.md` and `deployment-docs.json`; the application release SHA above is the source used for all complete matrices below.

## Implemented

Native Svelte EN/BG messages replace public interface/editorial copy at component bindings. Catalog ownership is split across common, template, dealer and stock additions; dealer identity and inventory currency remain independent of visitor country. Unknown immutable interface prose fails instead of silently falling back. Stock IDs, VINs, URLs, brands/models and user-entered values remain data. Catalog size is an inventory, not a coverage claim; no independent human linguistic review is claimed.

Request-local locale resolution supports standalone and configured /variant-3 mounts, with locale immediately after the mount. Explicit supported URL language wins. Public links, assets, CSS icons, navigation/history, route chrome, saved/compared cars, metadata, hreflang and native redirects preserve the appropriate locale/base. Contact import and trade-in intent retain distinct native metadata. Finance formatting and invalid-input messages are native without changing the calculation or EUR facts.

The first-visit preferences dialog/mobile sheet is dismissible, offers native language names, suggests an approximate Vercel country and keeps country/language independent. Permanent native controls and a server-rendered no-JavaScript settings form remain available. Cookies are bounded, host-only, Path=/, HttpOnly, SameSite=Lax and Secure on HTTPS. The endpoint accepts only strict same-origin preference requests. Storage failure, stale responses, rapid reopening, focus return from mobile menus and Escape above the vehicle drawer are covered.

Carwow's native auth/session/staff/DB/device/rate-limit policy remains in place. Admin stays English-only; mounted admin redirects and disabled auth-path matching are normalized. Public demo business writes fail closed before enquiry/CRM/AI/database handlers. HTML is private/no-store with locale/device variation; actual SvelteKit data requests also returned private/no-store. No translation overlay or DOM text replacement was introduced; the document-language placeholder is the only HTML token transform.

The Carwow-only portable-policy delta rejects return paths that normalize to protocol-relative URLs, including /x/..//evil.example/path and encoded dot-segment variants. Public preference returns also exclude admin/resources. Earlier failing coordinator negatives are retained; twelve form/JSON regressions and a malicious mocked client destination now pass. The shared rollout kit was not edited.

## Exact-source verification

Before builds and matrices, the sole checkout's tracked source and index matched the application commit. Overlapping unrelated work was preserved in recorded backups; three unrelated untracked source/test files were temporarily held out of compilation. No unrelated promo images are referenced by the committed source. This avoids treating a dirty-tree build as proof of the release.

| Environment                 | Route cases | Interaction checks | Failures | Explicit skips |
| --------------------------- | ----------: | -----------------: | -------: | -------------: |
| Standalone production, 6464 |  156 passed |          59 passed |        0 |              2 |
| /variant-3 production, 6464 |  156 passed |          59 passed |        0 |              2 |
| Public Vercel alias         |  156 passed |          59 passed |        0 |              2 |

Each environment ran serial Chromium EN/BG matrices at 320, 390 and 1440 pixels. The 26-route matrix covers home, inventory/map/applied and empty filters, detail, Sell/request, Import and trade-in contact intents, financing/calculator, contact, about/dealer, reviews, blog/article, team/member, FAQ/terms, favorites/compare and 404. It checks native text/accessibility attributes, metadata, hreflang, asset/base URLs, document overflow and mobile tab TEXT containment.

Interactions cover preferences/country independence, URL conflicts, query/hash preservation, menus/filter application, saved/compared vehicle facts, detail language controls, native validation/demo rejection, invalid finance values, mobile import/service drawers, no-JS, blocked storage, stale-response races, normalized redirect attacks and read-only admin routing. The two skips per environment are EN/BG desktop cases for the intentionally absent mobile-only import URL hero; desktop contact validation is tested separately. No failed or untested case was converted into a skip.

Visual inspection included desktop EN home/BG inventory, mobile EN/BG home/services/detail, and the Bulgarian preference sheet. It corrected dark-header contrast and the detail control's pointer/keyboard interaction. These checks do not approve the separate retained design work.

| Check                                      | Actual result                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| npm run check                              | 0 errors, 0 warnings                                                                              |
| node node_modules/vitest/vitest.mjs run    | 141 tests passed, 18 files, task-only source at 90060f8 (before the final dialog-only Escape fix) |
| npm run test:localization                  | 108 passed: portable/catalog checks plus 12 normalized-return regressions                         |
| npm run test:tooling                       | 11 passed                                                                                         |
| npm run check:localization                 | Passed native-binding/catalog/dealer guard and generated drift check                              |
| npm run lint:code                          | Passed                                                                                            |
| Prettier over all task-owned changed files | Passed                                                                                            |
| npm run check:typography                   | Passed, Carwow typography tokens retained                                                         |
| npm run build:preview-node                 | Standalone and mounted production builds passed                                                   |
| Existing Vercel npm run build              | READY Git deployment at exact source SHA                                                          |
| npm run check:backend-secrets              | Passed: 354 client-exposed source files, 392 built client files                                   |

The final Escape-only fix was verified in rebuilt exact-commit standalone/mounted/public browser matrices; the restored checkout subsequently passed all 150 unit tests.

Known gates are reported separately, not presented as green: architecture still reports the two pre-existing unreachable modules MobileLeadManualCard.svelte and mobile-filter-pill.css; global formatting still flags five unrelated pre-existing files (.impeccable critique, AGENTS.md, docs/CARS-INTEGRATION.md, docs/refactor-2026-09-12/REPORT.md and README.md). The local production-write backend preflight lacks DATABASE_URL, BETTER_AUTH_SECRET, CHAT_COOKIE_SECRET and DEFAULT_DEALER_SLUG; no credentials were added or changed. Authenticated admin workflows and real business delivery were not exercised. No forced production 500, full legacy E2E/visual-baseline suite, Firefox or WebKit run is claimed.

## Preserved local work and preview

All 25 held paths were restored into the canonical checkout. Baseline-only styles/data/repository/formatter/test files retain their original bytes. Overlapping native bindings were merged with the preserved local compositions; both original and localized backups remain. All initial tracked/untracked paths still exist. The four untracked promo assets and unrelated tests remain uncommitted. Nothing was reset, stashed, cleaned, force-pushed or moved to another project.

The restored local composition separately passes Svelte checking, the locale guard, a production build, 150 unit tests in 19 files, and 36/36 EN/BG browser smoke cases across home, inventory, services, about and blog at all three widths. These are local preservation checks, not the source proof for the deployed release, and do not grant visual approval to the unpublished redesign.

The owner preview is http://127.0.0.1:6464/ and reflects the restored local work. The prior denied 6463 restart was never retried or bypassed. Git initially waited at its helper-selector UI; a command-scoped use of the already installed credential manager with interaction disabled completed the normal push. Saved Git/auth/security/approval configuration was left unchanged.

## Reproduction and evidence

Use the retained Node 24 runtime and npm lockfile. After confirming writer and listener ownership, build standalone with npm run build:preview-node, or set DAY_LOCALE_BASE=/variant-3 for the mounted build. Start only the permitted owner preview through scripts/preview-node.mjs. The browser scripts use an existing server and never start or stop one.

Run node scripts/localization-browser.mjs and then node scripts/localization-interactions.mjs serially. Set LOCALE_ORIGIN, DAY_LOCALE_BASE and LOCALE_EVIDENCE for the target. The mounted base is a build setting; do not hardcode it into standalone source or use a public alias as proof of a mounted build.

Versioned summary: [VERIFICATION.json](VERIFICATION.json). Detailed local evidence under `.audit/localization/`:

- release-source.json, release-verification.json, release-deployment.json: exact source, clean tracked state, hashes, matrices and READY/alias identity.
- standalone-accepted/, mounted-accepted/, public-release/: final route/interaction JSON and screenshots. Earlier standalone/, mounted/, mounted-final/, standalone-release/ and coordinator-watch/ retain real failures before correction.
- check-final.log, unit-final.log, policy-final.log, tooling-final.log, guard-final.log, lint-final.log, task-format-final.log, typography-final.log, secrets-final.log and build-\*-accepted.log: actual check/build output.
- backend-env-final.log, architecture.log and format-check-final.log: retained limitations.
- baseline/, coordinator-baseline/, pre-candidate/, active-candidate.json, held-untracked.json, restoration-review.json and restoration-proof.json: preservation and restoration records.
- restored-check.log, restored-guard.log, restored-unit.log, build-restored-local.log and restored-browser.json: separate local-composition verification.

Authored: complete for the current EN/BG public template. Committed and pushed: task-only application source. Deployed: the existing Git-connected Carwow template, verified READY. Browser verified: exact application commit standalone, mounted and public. Unrelated design work: restored locally, uncommitted and unpublished. Cars promotion and dealer deployments: not performed.
