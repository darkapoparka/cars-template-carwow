# Carwow-style automotive template

Canonical standalone master: **`darkapoparka/cars-template-carwow`**. This repository is a reusable dealership design, not a dealer-specific project and not evidence that any sample business data is current.

**AI/agent entry point:** read `AGENTS.md`, then `TEMPLATE.md`, `docs/LEAD-BUILD.md`, and `docs/QA.md` before editing.

## Portfolio role
- Template key: `carwow`
- Role: **core**
- Design position: consumer marketplace / strongest immediate visual impact
- Standard dealer offer: `auto-best + carwow + modern`
- Import is Design 2 in the intentional Import trio; it does not add a fourth design.

## Rule of ownership
Improve this repository only when the task is a **shared template improvement**. For a **lead build**, use canonical Cars clients/<slug>/ through its approved-release clone workflow; never personalize this master.

## Quick start
`npm ci`

Preview command: `npx vite dev --host 127.0.0.1 --port 6463 --strictPort`

Entry route: `/`

See `TEMPLATE.md` for template-specific boundaries and `docs/LEAD-BUILD.md` for the complete lead workflow. Historical pre-split root docs are preserved under `docs/legacy/from-cars-2026-09-10/` for provenance only; they do not override the current instructions.

Current cross-repository ownership, approved releases, dealer-copy workflow and standalone/mounted limits: [Cars integration](docs/CARS-INTEGRATION.md).
