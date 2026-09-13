# Phase 12 — Vercel Deployment, Preview Workflow & Analytics

## Objective
Deploy safely with reproducible previews, production promotion, custom-domain readiness, and lightweight analytics.

## Deliverable
Git-integrated Vercel project with preview deployments, production branch protection habits, analytics, and launch checklist.

---

## Deployment model
Recommended:
- GitHub repository connected to Vercel,
- non-production branches / pull requests create preview deployments,
- `main` is production,
- visually inspect major 3D changes on preview URLs before merge.

The site is mostly static/client-rendered 3D, so avoid introducing server infrastructure unless the portfolio later needs it.

---

## Environment strategy
Likely minimal environment variables. Possible values:
- analytics flags,
- optional public contact/form endpoint,
- optional feature flags.

Never put secrets in `NEXT_PUBLIC_*` variables.

For the initial static portfolio, prefer zero secrets.

---

## Vercel project setup
1. connect GitHub repository,
2. verify framework auto-detected as Next.js,
3. use normal install/build commands unless repository structure requires overrides,
4. assign preview and production domains,
5. enable Web Analytics if desired,
6. enable Speed Insights if useful for field performance,
7. configure custom domain after preview QA.

---

## Preview workflow
For every major phase:
1. push feature branch,
2. open PR,
3. let Vercel create preview,
4. test on desktop + real phone,
5. record visual/performance issues,
6. merge only when phase acceptance criteria pass.

For this project preview deployments are especially important because code review alone cannot validate camera motion or WebGL presentation.

---

## Production safety
Before production:
- `pnpm build` locally/CI,
- no debug markers/panels,
- production asset paths valid,
- no source Blender files in public assets,
- no giant unoptimized GLBs accidentally committed,
- reduced-motion verified,
- fallback verified,
- metadata/OG image/favicon verified,
- custom 404/error pages reasonable.

---

## Rollback strategy
Keep previous known-good deployment available.

If a production release introduces a rendering regression:
- roll back/promote prior deployment instead of debugging live under pressure,
- fix on branch,
- validate on preview,
- re-promote/redeploy.

---

## Caching/static assets
Version 3D asset filenames when replacing them in ways that may be cached aggressively:

```text
court-v2.glb
player-a-v3.glb
```

Or use hashed build/asset pipeline where practical.

Do not rely on visitors clearing browser cache after changing a GLB in-place.

---

## Analytics events worth tracking
Keep analytics respectful and useful.

Potential events:
- navigation chapter selected,
- project opened,
- live project link clicked,
- GitHub clicked,
- resume opened,
- contact clicked,
- sound enabled.

Do not send per-scroll-frame analytics.

---

## SEO / social launch
Verify:
- meaningful title/description,
- canonical URL,
- Open Graph image,
- social card metadata,
- semantic headings,
- crawlable project text,
- sitemap/robots where appropriate.

The 3D Canvas itself contributes almost nothing to SEO; the DOM content must carry it.

---

## Launch checklist
- [ ] Production branch connected.
- [ ] Preview deployments work.
- [ ] Real-device preview tested.
- [ ] Custom domain configured.
- [ ] HTTPS healthy.
- [ ] Metadata/OG previews inspected.
- [ ] Analytics configured if wanted.
- [ ] Debug features disabled.
- [ ] Rollback path understood.
- [ ] Known-good production deployment bookmarked/identifiable.
