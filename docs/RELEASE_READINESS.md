# Release readiness

Last checked: 2026-09-19

## Current release contract

- Deployment target: Vercel Git integration from the `origin` repository. No
  custom CI workflow or `vercel.json` is currently checked in.
- Build command: `pnpm build` (Next.js production build).
- Required checks: `pnpm lint`, `pnpm typecheck`, `pnpm assets:validate`, and
  `pnpm build`.
- Runtime configuration: no required environment variables are declared by the
  application. Do not add `.env*` files or secrets to the repository.
- Static 3D assets are requested from root-relative `/models/*.glb` URLs. Keep
  these files under `public/models/`. With the current stable filenames and no
  cache-header override, expect Next.js's default revalidation behavior rather
  than immutable caching. Confirm all six manifest entries load with HTTP 200 and
  record their actual cache headers on preview. Adopt content-hashed/versioned
  URLs before introducing a long-lived immutable cache policy.

## Pre-release checklist

- [ ] Run all four required checks from a clean checkout.
- [ ] Create a Vercel preview from the release commit (or confirm the Git
      integration preview exists).
- [ ] On preview, verify `/`, direct/reloaded routes and any supported hash
      entry, plus all six `/models/*.glb` requests in the Network panel.
- [ ] Review desktop and narrow/mobile layout, reduced motion, WebGL fallback,
      keyboard navigation, project links, and console errors.
- [ ] Record preview URL, commit SHA, browser/device coverage, and any known
      exceptions before production promotion.
- [ ] Confirm the current production deployment is identified as the rollback
      target. Promotion is a separate, explicit release decision.

## Rollback

If the release fails preview or production smoke checks, keep the prior
known-good deployment active. In Vercel, use the Deployments view to identify
the last known-good deployment and choose **Promote to Production** (or use
`vercel rollback <deployment>` when the CLI is authorized). Re-run the smoke
checks after rollback. Do not delete the failed deployment; retain it for
diagnosis.

## Historical Phase 13 local verification record

This record is retained for regression context and does not describe the current
Phase 20 working tree.

- Commit checked: `b8f8414` plus the Phase 13 documentation changes in this
  working tree.
- `pnpm lint`, `pnpm typecheck`, `pnpm assets:validate`, and `pnpm build`: passed.
  Asset validation covered all six production GLBs and their manifest,
  compression, provenance, environment, and in-place animation contracts.
- The optimized production server returned HTTP 200 for all six root-relative
  `/models/*.glb` URLs. Transfer sizes matched the manifest: 8,544 B court,
  5,044 B props, 3,076 B scoreboard, 3,224 B stadium, 6,144 B Player A, and
  5,888 B Player B.
- Local Chromium smoke review passed for semantic content, one persistent
  desktop Canvas, hash navigation/reload/history, project-dialog focus entry,
  Escape close/focus restoration, narrow layout overflow, and the mobile project
  sheet. No browser errors were observed. Cross-browser/device, forced-failure,
  reduced-motion, and full forward/reverse visual review remain preview gates.
- Vercel preview: not deployed; no Vercel CLI or local project linkage is
  available in this workspace. Use the repository's Vercel Git integration
  after access is confirmed.

## Phase 20 release gate status

This is a local readiness check only. No preview was created, no production
deployment was promoted, and no rollback was executed.

- Local `corepack pnpm lint`: passed.
- Local `corepack pnpm typecheck`: passed.
- Local `corepack pnpm assets:validate`: passed; six production GLBs passed
  manifest, provenance, Meshopt, environment, and in-place clip validation.
- Local `corepack pnpm build`: passed on Next.js 16.3.5; `/`, `/_not-found`,
  and `/icon.svg` prerendered successfully.
- Package manager: the pinned `pnpm@12.4.1` is available through Corepack;
  the `pnpm` executable itself is not on PATH in this workspace.
- Working tree contains unrelated in-progress Phase 18/19 edits; this check
  did not reset, stage, or modify those files.

### Outstanding external evidence

- [ ] Create or confirm the Vercel Git preview for the release commit and record
      its URL and commit SHA.
- [ ] On that preview, verify `/`, direct/reloaded chapter hashes, browser
      back/forward, all six `/models/*.glb` requests (HTTP 200, sizes, and
      cache headers), metadata, and console/network errors.
- [ ] Complete the Phase 20 desktop/mobile/tablet matrix: Chromium, Safari,
      Firefox where feasible; keyboard, touch, reduced-motion, WebGL fallback,
      quality tiers, hotspot jumps, reverse scroll, and project sheet/dialog.
- [ ] Capture the required grass-court visual regression frames and production
      browser performance evidence, including low-quality and reduced-motion
      states.
- [ ] Identify the current production deployment and verify the rollback path;
      retain the prior known-good deployment as the rollback target.
- [x] Phase 19 accepted locally: reviewed authored Blockbench players pass the
      reviewed build and validation path, render as production actors, preserve
      deterministic contacts and the About hotspot, and use the selected 15fps
      cadence after a 12/15/18fps application-camera comparison. This does not
      satisfy the separate preview, cross-browser/device, performance, or
      rollback gates above.
