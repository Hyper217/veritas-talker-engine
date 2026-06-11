# Veritas Talker Engine

A desktop-ready web app for creating and printing wine shelf talkers. Pick a design, build your wine library, queue selections, and export a print-ready PDF with four talkers per letter-size sheet.

> **Roadmap:** See [ROADMAP.md](./ROADMAP.md) for phased build → production → pilot → desktop `.exe` plan.  
> **Current phase:** Phase 1 — Build Hardening

## Features

- **2 layouts** — **Noir** (built-in black & gold) + **Google Flow** imports
- **Wine catalog** — Add wines one-by-one or bulk-import via CSV
- **Multi-select** — Select multiple catalog wines and add them to the print queue at once
- **Print PDF** — Accurate 4×5 inch talkers arranged 2×2 on US Letter paper
- **Google Flow import** — Import PNG backgrounds exported from [Google Flow](https://labs.google/fx/tools/flow)
- **Local storage** — Catalog, settings, and print history stay on the machine (no cloud required)

## Quick Start (Your Computer)

**Requirements:** [Node.js](https://nodejs.org/) 18 or newer

```bash
# 1. Clone or download this repo
git clone <your-repo-url>
cd Veritas-Talker-Engine

# 2. Install dependencies
npm install

# 3. Run the app
npm run dev
```

Open **http://localhost:3001** in Chrome or Edge for best PDF results.

## Install on a Boss / Client Computer

> Full rollout plan: [ROADMAP.md](./ROADMAP.md). Desktop `.exe` is **Phase 4 (final)** — use production build for pilot first.

### Option A — Production build (recommended for pilot)

```bash
npm install
npm run build
npm run preview
```

Open **http://localhost:4173** in Chrome or Edge.

### Option B — Development mode (for you while building)

```bash
npm install
npm run dev
```

Open **http://localhost:3001**

### Option C — Desktop `.exe` (Phase 4 — not yet)

Tauri packaging comes after pilot sign-off. See ROADMAP.md Phase 4.

## Workflow

1. **Pick a style** — Use the left sidebar to choose a shelf talker design
2. **Add wines** — Enter details manually, import CSV, or load from catalog
3. **Build queue** — Click "Add to Queue" or use multi-select in the catalog
4. **Preview** — Live preview updates as you edit
5. **Print** — Click "Generate Print PDF" to download a ready-to-print file

## CSV Import

Download the template from the catalog panel or use `public/wine-catalog-template.csv`.

| Column | Required | Notes |
|--------|----------|-------|
| Producer | Yes | Winery name |
| Name | Yes | Wine name |
| Vintage | Yes | Year |
| Region | No | e.g. Willamette Valley OR USA |
| Score | No | Numeric rating |
| Reviewer | No | Defaults to PTS |
| Description | No | Tasting notes (plain text) |
| Tags | No | Pipe or comma separated |
| Image Link | No | Dropbox share link or leave blank |

## Google Flow Integration

[Google Flow](https://labs.google/fx/tools/flow) is Google's AI creative studio for images and video. There is **no public API** to pull designs directly from Flow — the workflow is export-and-import:

### Step-by-step

1. **Design in Google Flow** — Open [labs.google/fx/tools/flow](https://labs.google/fx/tools/flow) and create a shelf talker background using image generation (Nano Banana) or the Image Editor
2. **Use 3:4 aspect ratio in Flow** — Portrait (Flow does not offer 4:5; 3:4 is the closest match). See `public/google-flow-prompt-guide.txt` for layout zones, master prompt, and style templates
3. **Design for overlays** — Leave open zones for producer name, bottle photo, tasting notes, and tags. Avoid baking in wine-specific text
4. **Export PNG** — Download the finished background from your Flow project
5. **Import here** — Click the **Sparkles** icon in the left sidebar → **Import Flow Export**
6. **Select & print** — Choose your design, add wines to the queue, generate PDF

The app overlays all wine data (producer, name, vintage, score, bottle image, description, tags) on top of your Flow background at print time.

### Built-in vs Flow designs

| Option | Best for |
|--------|----------|
| **Noir** (black & gold) | Default shelf talker — no Flow account needed |
| **Google Flow import** | Custom backgrounds you design in Flow |

## PDF Tips

- **Images:** Use Dropbox links (`?dl=0` works) or drag-and-drop local bottle photos
- **Browser:** Chrome or Edge produce the most accurate PDF output
- **CORS:** Remote images must allow cross-origin access; local/drag-drop images always work
- **Multiple pages:** Queues larger than 4 wines automatically span multiple sheets

## Project Structure

```
src/
├── App.tsx                 # Main UI, catalog, queue, PDF orchestration
├── components/
│   ├── ShelfTalker.tsx     # Noir layout + Flow overlay
│   ├── FlowDesignPanel.tsx # Google Flow import library
│   ├── RichTextEditor.tsx  # Tasting note editor
│   └── Toast.tsx           # Notifications
├── lib/
│   ├── pdf.ts              # PDF capture and assembly
│   ├── talkerDimensions.ts # Print size constants
│   └── utils.ts            # Dropbox URL helper
└── types.ts                # Product and settings types
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3001 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript check |

## License

Private / internal use — adjust as needed for your distribution model.
