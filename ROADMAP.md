# Veritas Talker Engine — Roadmap

Build → Production → Boss handoff → **Desktop `.exe` last.**

Use this doc as the single source of truth. Work one phase at a time; don't start the next until exit criteria are met.

**Boss will not install until the app is finished and ready to go.** Phase 3 (pilot on boss machine) waits until Phases 1–2 are complete and you sign off internally.

---

## Project locations

| | Path / URL |
|---|------------|
| **Local repo** | `C:\Users\theki\antigravity\Veritas-Talker-Engine` |
| **GitHub (private)** | https://github.com/Hyper217/veritas-talker-engine |
| **Dev server** | http://localhost:3001 (`npm run dev`) |
| **Branch** | `master` |

To move to Antigravity 2.0 or another machine: `git clone https://github.com/Hyper217/veritas-talker-engine.git`

---

## Status snapshot

| Area | State |
|------|--------|
| Core app (catalog, queue, editor) | Working |
| **Noir** layout (built-in black & gold) | Working |
| **Google Flow** import (any style PNG) | Working |
| Flow zone alignment (Art Deco preset + fine-tune) | Working |
| PDF generation (sequential capture, fixed sizing) | Rebuilt — needs print QA |
| Data backup (export/import JSON) | Done |
| Git / GitHub | Done (private repo, pushed) |
| Production start script | Not started |
| Boss install / pilot | **Blocked until app is finished** |
| Desktop `.exe` | **Final phase — after boss-ready sign-off** |

**You are here:** Phase 1 — finish print QA and Flow alignment polish

---

## App architecture (current)

```
┌─────────────────────────────────────────────────────────────┐
│  LAYOUTS                                                    │
│  • Noir (gem icon) — built-in black & gold                  │
│  • Google Flow import (sparkles) — YOUR artwork + overlays  │
├─────────────────────────────────────────────────────────────┤
│  FLOW WORKFLOW                                              │
│  Design in Google Flow (3:4 portrait) → Export PNG →        │
│  Import in app → Pick Art Deco preset → Fine-tune zones →   │
│  Set text colors → Add wines → Print PDF (4 per sheet)      │
└─────────────────────────────────────────────────────────────┘
```

**Removed:** Classic, Bento, Heritage, Modern Botanical layouts (deleted — fresh start with Noir + Flow only).

---

## Phase 1 — Build Hardening

**Goal:** You trust every layout and every PDF before calling the app “finished.”

**Duration:** ~1 week (adjust as needed)

### Blueprint

```
[Noir OR Flow design] → [Wine / CSV / catalog] → [Queue] → [PDF] → [Print test]
         ↑                         ↑
   Art Deco zone preset      Backup JSON
```

### Tasks

- [x] Rebuild PDF pipeline (sequential capture, exact dimensions, no stretch)
- [x] Google Flow import panel (PNG/JPG from Flow)
- [x] Strip layouts to **Noir + Flow only**
- [x] Flow prompt guide updated for **3:4** aspect ratio (Flow’s actual ratios)
- [x] Per-design **layout zones** + Art Deco preset + fine-tune editor
- [x] Flow text colors (main + accent) + notes panel opacity toggle
- [x] Multi-select catalog → queue
- [x] Toast notifications
- [x] **1.1** Git repo + initial commit + push to GitHub
- [x] **1.2** Workspace backup (catalog, settings, Flow designs, sessions)
- [x] **1.3** Remove unused dependencies (Gemini, Express, etc.)
- [x] Dev server on **port 3001** (avoids clash with other localhost apps)
- [ ] **1.4** Print QA — run `docs/PRINT-QA-CHECKLIST.md` on Noir + one Flow import
- [ ] **1.5** Fix issues found in QA (alignment, PDF sizing, image CORS)
- [ ] **1.6** Polish Flow zone defaults from real Art Deco import feedback
- [ ] **1.7** CSV re-import duplicate guard (merge or skip option)

### Exit criteria

- [ ] 8+ wines → 2-page PDF → physical print with correct ~4" × ~5.3" talkers
- [ ] Noir and Flow imports pass print checklist
- [ ] Backup restores correctly on a second machine / fresh browser
- [x] `npm run lint` and `npm run build` pass

### Key files

| File | Purpose |
|------|---------|
| `src/lib/pdf.ts` | PDF capture and assembly |
| `src/lib/flowLayout.ts` | Zone presets (Default, Art Deco) |
| `src/components/ShelfTalker.tsx` | Noir + Flow overlay renderer |
| `src/components/FlowLayoutEditor.tsx` | Zone alignment UI |
| `src/components/FlowDesignPanel.tsx` | Import + colors + layout |
| `public/google-flow-prompt-guide.txt` | Flow prompts (3:4) |
| `docs/PRINT-QA-CHECKLIST.md` | Manual QA script |

---

## Phase 2 — Production Readiness (boss still waits)

**Goal:** App is documented and runnable without you present — but boss does **not** install yet until you declare it finished.

**Duration:** ~1 week

### Blueprint

```
You finish Phase 1  →  production scripts + polish  →  YOU sign off  →  then Phase 3/4
```

### Tasks

- [x] **2.1** Push to GitHub (private): `Hyper217/veritas-talker-engine`
- [ ] **2.2** Add `scripts/start-production.ps1` (build + preview, one command)
- [ ] **2.3** Version number in app footer (`package.json` version)
- [ ] **2.4** In-app first-run tips (pick design → add wine → print)
- [ ] **2.5** localStorage quota warning for large catalog images
- [ ] **2.6** Error boundary (prevent white-screen crashes)
- [ ] **2.7** README “boss handoff” section (when ready, not before)
- [ ] **2.8** Tag release `v1.0.0-rc` on GitHub when internally ready

### Exit criteria

- [ ] Fresh clone → `npm install` → `npm run build` → `npm run preview` on clean Windows PC
- [ ] You (not boss) complete full workflow without help
- [ ] Backup/restore tested with real catalog data

---

## Phase 3 — Boss Handoff (only after “finished”)

**Goal:** Boss uses the app for real shelf talkers. **Starts only when you say the app is ready.**

**Duration:** ~1–2 weeks of real use

### Blueprint

```
App declared finished  →  Demo to boss  →  Real catalog + prints  →  Feedback  →  Phase 4
```

### Tasks

- [ ] **3.1** Deliver to boss (`.exe` preferred, or production build if exe not ready)
- [ ] **3.2** 15-minute walkthrough
- [ ] **3.3** Import real wine catalog (CSV)
- [ ] **3.4** Physical print proof (ruler: ~4" × ~5.3" per talker)
- [ ] **3.5** GitHub Issues for feedback
- [ ] **3.6** Fix pilot bugs (PDF accuracy first)
- [ ] **3.7** Boss sign-off: would use weekly

### Exit criteria

- [ ] Boss completes a print batch without you
- [ ] No blocking PDF/layout bugs
- [ ] Weekly backup habit

---

## Phase 4 — Desktop `.exe` (FINAL — boss-facing deliverable)

**Goal:** Double-click installer — no Node.js, no terminal, no localhost.

**Duration:** ~3–5 days

**Start after Phase 3 sign-off OR deliver `.exe` as the Phase 3 handoff if boss won't use dev tools.**

### Blueprint

```
Vite build (dist/)  →  Tauri shell  →  .exe installer  →  Boss desktop icon
```

### Tasks

- [ ] **4.1** Add Tauri 2
- [ ] **4.2** App icon + window title
- [ ] **4.3** Serve `dist/` in production shell
- [ ] **4.4** Native PDF save dialog
- [ ] **4.5** Windows `.exe` / `.msi` installer
- [ ] **4.6** Test on clean machine (no Node)
- [ ] **4.7** Optional: code signing (SmartScreen)
- [ ] **4.8** Tag `v1.0.0-desktop` on GitHub

### Exit criteria

- [ ] Boss installs from `.exe` alone
- [ ] PDF works in Tauri webview
- [ ] Data persists between sessions

---

## What to do next

1. **Print QA** — `docs/PRINT-QA-CHECKLIST.md` (Noir + your Flow Art Deco import)
2. **Fine-tune zones** — Sparkles panel → Art Deco preset → adjust any misaligned fields
3. **Fix QA failures** — Phase 1.5
4. **Phase 2** — production script + polish
5. **Declare finished** → then boss handoff (Phase 3) → then `.exe` (Phase 4)

---

## Decision log

| Decision | Choice | Reason |
|----------|--------|--------|
| Distribution order | Build → prod → boss → `.exe` | Boss won't install until finished |
| Layouts | Noir + Flow imports only | Fresh start; Flow handles variety |
| Flow aspect ratio | **3:4** in Google Flow | Flow only offers 16:9, 4:3, 1:1, 3:4, 9:16 |
| Flow alignment | Per-design zones + presets | Each Flow artwork has different slots |
| Dev port | **3001** | Avoids localhost:3000 clash / service worker issues |
| Desktop wrapper | Tauri 2 | Smaller than Electron for internal tool |
| Data storage | localStorage + JSON backup | No backend; Firebase deferred |
| Google Flow | PNG import | No public Flow API |
| GitHub | Private repo | Work in progress, not public yet |

---

## Future (post v1.0 desktop)

- Firebase cloud sync (`firebase-blueprint.json`)
- Visual drag-and-drop zone editor (instead of numeric fine-tune)
- Auto-update for desktop app
- Mac installer
- Optional: zero-overlay Flow mode (artwork is 100% complete in Flow)
