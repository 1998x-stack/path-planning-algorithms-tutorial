# Portfolio improvement history

### 2026-11-05 22:15 UTC — ChatGPT Portfolio Iteration
- Run ID: portfolio-20261105-2215-11
- Repo / Base SHA: 1998x-stack/path-planning-algorithms-tutorial / 6a95e4ff14fcdd893bbb31ecef75ebfff04450d2
- Historical context: Default branch docs/improvements.md returned 404 (first initialization). No PRs found in repository search; five existing commits inspected, last dated 2026-08-18.
- Product problem & expected user value: README instructs opening index.html directly, but file:// fetch('courses.json') can fail under browser local-file restrictions, leaving all 28 chapters inaccessible from the index. Offline reading should work without a server.
- Engineering diagnosis & evidence: index.html invokes fetch('courses.json') unconditionally; local-file origin restrictions cause failure in common browsers. The existing catch only suggests refreshing.
- Options & decision: (1) offline navigation broken, P1, score 5+4+5+4-2-2=14; (2) missing initial loading state, P2, 3+1+4+4-2-1=9; (3) chapter-link metadata validation, P2, 3+2+3+4-2-1=9. Selected (1) as the documented entry path.
- Changes: index.html embeds the existing courses.json as an offline snapshot, uses it only for file://, retains fetch for hosted HTTP(S); tests/offline-index.test.cjs checks snapshot equivalence and both routing paths. No dependency changes.
- Validation: C: connector inspection confirms source includes both protocol paths and JSON payload. D: node tests/offline-index.test.cjs written but not executed against checkout; browser E2E unavailable. No claim of behavioral pass.
- Security & regression review: Embedded payload is repository-owned JSON; no keys or network behavior added; risk of snapshot drift mitigated by regression test. Hosted fetch path preserved.
- Risk & rollback: Embedded data must be updated alongside courses.json; revert the PR to restore prior behavior.
- Follow-up: Run Node regression and file:// browser E2E, then verify hosted HTTP navigation and mobile keyboard access.
- Commit: pending
- PR: pending
