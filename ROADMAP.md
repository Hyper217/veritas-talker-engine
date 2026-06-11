# Veritas Talker Engine — Roadmap

Build → Production → Pilot → **Desktop .exe last.**

Use this doc as the single source of truth. Work one phase at a time; don't start the next until exit criteria are met.

---

## Status snapshot

| Area | State |
|------|--------|
| Core app (designs, catalog, queue) | Working |
| PDF generation | Rebuilt (sequential capture, fixed sizing) |
| Google Flow import | Working (PNG import + overlay) |
| Git / GitHub | In progress |
| Data backup | In progress |
| Production scripts | Not started |
| Boss pilot | Not started |
| Desktop `.exe` | **Final phase — do not start until Phase 3 passes** |

**You are here:** Phase 1 — Build Hardening

---

## Phase 1 — Build Hardening

**Goal:** The app is reliable enough that you trust every layout and every PDF before anyone else touches it.

**Duration:** ~1 week (adjust as needed)

### Blueprint

```
[Design pick] → [Wine entry / CSV / catalog] → [Queue] → [PDF] → [Print test]
        ↑                              ↑
   Noir + Flow designs         Flow import + backup
```

### Tasks

- [x] Rebuild PDF pipeline (exact dimensions, no stretch)
- [x] Google Flow design import panel
- [x] Multi-select catalog → queue
- [x] Toast notifications (replace alerts)
- [ ] **1.1** Initialize git repo + first commit *(repo initialized — commit when ready)*
- [x] **1.2** Data backup — export/import full workspace (catalog, settings, Flow designs, sessions)
- [x] **1.3** Remove unused dependencies (Gemini, Express, etc.)
- [ ] **1.4** Print QA — run `docs/PRINT-QA-CHECKLIST.md` on Noir + one Flow import
- [ ] **1.5** Fix any issues found in QA (layout clip, missing score badge, image CORS)
- [ ] **1.6** Flow overlay tuning — text contrast controls on imported designs
- [ ] **1.7** Duplicate-wine guard on CSV re-import (merge or skip option)

### Exit criteria

- [ ] You can add 8+ wines, generate a 2-page PDF, and print it with correct 4×5 sizing
- [ ] Noir and Flow layouts pass the print checklist
- [ ] Full workspace exports to JSON and restores on another machine
- [ ] `npm run lint` and `npm run build` pass with zero errors

### Files involved

| File | Purpose |
|------|---------|
| `src/lib/pdf.ts` | PDF capture |
| `src/components/ShelfTalker.tsx` | Layout renderers |
| `src/lib/dataBackup.ts` | Export/import |
| `docs/PRINT-QA-CHECKLIST.md` | Manual QA script |

---

## Phase 2 — Production Readiness

**Goal:** The project is packaged, documented, and safe to share via GitHub — still run as a web app, not an `.exe` yet.

**Duration:** ~1 week

### Blueprint

```
Developer machine                    Shared repo
     │                                    │
     ├─ npm run build ──────────────────► GitHub
     ├─ backup JSON                       │
     └─ README + ROADMAP                  ▼
                                   Boss clones repo
```

### Tasks

- [ ] **2.1** Push to GitHub (private repo recommended)
- [ ] **2.2** Add `start-production.bat` / `start-production.ps1` (build + preview, no dev UI)
- [ ] **2.3** Add version number to app footer (`package.json` version)
- [ ] **2.4** In-app first-run tips (3-step: pick style → add wine → print)
- [ ] **2.5** localStorage quota warning when catalog images are too large
- [ ] **2.6** Error boundary so one bad render doesn't white-screen the app
- [ ] **2.7** Update README install section — demote dev-server instructions, promote production build
- [ ] **2.8** Tag release `v1.0.0` on GitHub

### Exit criteria

- [ ] Fresh clone → `npm install` → `npm run build` → `npm run preview` works on a clean Windows machine
- [ ] README alone is enough for a semi-technical person to run the app
- [ ] Backup/restore tested with real catalog data

### Files involved

| File | Purpose |
|------|---------|
| `scripts/start-production.ps1` | One-command local server |
| `README.md` | Install docs |
| `ROADMAP.md` | This file |

---

## Phase 3 — Pilot Deployment

**Goal:** Your boss (or first real user) uses the app daily for real shelf talkers. Collect feedback before wrapping in an `.exe`.

**Duration:** ~1–2 weeks of real use

### Blueprint

```
Boss machine                         Feedback loop
     │                                     │
     ├─ Clone repo                         │
     ├─ Run production build               │
     ├─ Import wine CSV                    │
     ├─ Print shelf talkers ──────────────► You fix issues (Phase 1/2 tasks)
     └─ Export backup weekly               │
```

### Tasks

- [ ] **3.1** Install on boss machine (USB or GitHub clone)
- [ ] **3.2** Walk through workflow once (15 min demo)
- [ ] **3.3** Import their real wine catalog (CSV or manual)
- [ ] **3.4** Print one full sheet — physical proof (ruler check: 4" × 5" per talker)
- [ ] **3.5** Log bugs/requests in GitHub Issues
- [ ] **3.6** Fix pilot feedback (prioritize PDF accuracy > UX polish)
- [ ] **3.7** Sign-off: boss confirms they'd use this weekly

### Exit criteria

- [ ] At least one real print batch completed without you present
- [ ] No blocking PDF/layout bugs open
- [ ] Backup habit established (export JSON weekly)

---

## Phase 4 — Desktop `.exe` (FINAL)

**Goal:** Double-click installer — no Node.js, no terminal, no localhost bookmarks.

**Duration:** ~3–5 days engineering + testing

**Do not start until Phase 3 exit criteria pass.**

### Blueprint

```
Vite build (dist/)  →  Tauri shell  →  .exe installer  →  Boss desktop icon
```

### Recommended stack

| Choice | Why |
|--------|-----|
| **Tauri 2** (recommended) | Small download, native feel, good for internal tools |
| Electron | Heavier, more examples if you hit Tauri issues |

### Tasks

- [ ] **4.1** Add Tauri to project (`@tauri-apps/cli`)
- [ ] **4.2** App icon + window title "Veritas Talker Engine"
- [ ] **4.3** Wire Tauri to serve `dist/` in production
- [ ] **4.4** File save dialog for PDF (native save picker vs browser download)
- [ ] **4.5** Build Windows `.exe` / `.msi` installer
- [ ] **4.6** Test installer on clean machine (no Node installed)
- [ ] **4.7** Optional: code signing (reduces SmartScreen warnings)
- [ ] **4.8** Tag release `v1.0.0-desktop`

### Exit criteria

- [ ] Boss installs from `.exe` alone
- [ ] PDF generation works inside Tauri webview
- [ ] Catalog + backups persist between app restarts
- [ ] Update path documented (re-install new `.exe` or auto-update later)

### Files to add

```
src-tauri/
  tauri.conf.json
  src/main.rs
  icons/
```

---

## What to do next (today)

1. Finish Phase 1 tasks **1.1–1.3** (git, backup, cleanup)
2. Run **Print QA checklist** on your machine (`docs/PRINT-QA-CHECKLIST.md`)
3. Note any failures → fix before Phase 2

---

## Decision log

| Decision | Choice | Reason |
|----------|--------|--------|
| Distribution order | Web build first, `.exe` last | Faster iteration; exe is packaging only |
| Desktop wrapper | Tauri over Electron | Smaller, professional enough for internal tool |
| Data storage | localStorage + JSON backup | No backend needed yet; Firebase blueprint deferred |
| Google Flow | PNG import | No public Flow API exists |

---

## Future (post v1.0 desktop)

Not in scope until v1 ships:

- Firebase cloud sync (`firebase-blueprint.json`)
- Adjustable text zones on Flow backgrounds
- Auto-update for desktop app
- Mac installer
