# Scoped AI Template Editor | JASTRO Hiring Assessment

> **A safe, deterministic, responsive visual & code website template editor with selection authority and independent per-element recovery.**

Built for the **JASTRO AI Frontend Developer Assignment Round**.

---

## 🌟 Executive Summary & Problem Solved

When business owners edit website templates, traditional visual and AI editors frequently suffer from **destructive overwrites**, **layout regressions on different device viewports**, and **all-or-nothing rollbacks**. 

**Scoped AI Template Editor** provides a guaranteed-safe editing loop:
1. **Selection Authority:** AI edits and batch commands are strictly confined to the user's selected element IDs and selected responsive scope.
2. **Canonical State Contract:** A single, typed JSON-serializable model powers the Visual Canvas, the live Code surface, the deterministic AI engine, and the recovery timeline in 100% synchronization.
3. **Viewport Override Isolation:** Base properties cascade cleanly to Desktop (~1440px), Tablet (~768px), and Mobile (~375px). Editing a specific viewport creates an isolated override without mutating Base or other viewports.
4. **Proposal Staging Before Commit:** AI edits never silently overwrite. Proposals render side-by-side with per-element granular `Accept` / `Reject` controls.
5. **Independent Element Recovery:** Any element or viewport override can be rolled back to any prior revision without losing or reverting unrelated work on other elements.

---

## 🚀 Quick Setup & Local Development

### Prerequisites
- **Node.js**: `v18+` (Tested on `v22.21.0`)
- **npm**: `v9+` (Tested on `v10.9.4`)

### Installation & Run

```bash
# 1. Install all dependencies
npm install

# 2. Run local development server (Vite)
npm run dev

# 3. Open browser at http://localhost:3000 (or the port indicated in terminal)
```

### Running Automated Test Suite

```bash
# Run all Vitest unit & integration test suites
npm test

# Run tests in watch mode
npm run test:watch
```

### Building for Production

```bash
npm run build
npm run preview
```

---

## 🎨 Chosen Responsive Template: "Lumina Artisanal Roastery"

- **Template Source:** Original, bespoke modular design created specifically for this assignment, inspired by luxury specialty coffee roasteries (e.g., Onyx Coffee Lab, Blue Bottle, Counter Culture).
- **Structure & Sections:**
  1. `elem_navbar`: Responsive Navigation Bar with branding, navigation links, and subscription CTA.
  2. `elem_hero`: High-impact Hero with single-origin batch badge, dynamic typography, and primary CTA.
  3. `elem_features_grid`: Value proposition grid containing 3 modular feature cards (*Direct Trade*, *Micro-Batch*, *Peak Fresh Delivery*).
  4. `elem_products_section`: Featured micro-lot showcase with product cards, tasting note badges, pricing, and bag buttons.
  5. `elem_testimonial`: Q-Grader social proof quote block.
  6. `elem_cta_banner`: Newsletter & Roastery Club subscription card.
  7. `elem_footer`: Legal links, copyright, and global footer.

---

## 🧭 Walkthrough of Core User Journeys & Demo Scenarios

### 1. Viewport Previews & Responsive Scope
- Click **Desktop (1440px)**, **Tablet (768px)**, or **Mobile (375px)** in the top navigation bar to test responsive layouts.
- Change the **Target Scope** dropdown (`Base`, `Desktop Only`, `Tablet Only`, `Mobile Only`).
- Notice that changes made under `Base` flow universally, while changes made under `Mobile Only` create isolated overrides.

### 2. Multi-Element Selection
- **Single Select:** Click any element on the Canvas or in the left Hierarchy Tree.
- **Additive Group Select:** Hold `Shift`, `Ctrl`, or `Cmd` while clicking multiple elements.
- **Marquee Selection:** Click and drag a selection rectangle across the canvas background to multi-select intersecting elements.
- **Select All:** Press `Ctrl+A` or click *Select All* in the sidebar.

### 3. In-Canvas & Property Inspector Editing
- **Inline Text:** Double-click any heading or paragraph on the canvas to edit text directly with Enter / Blur saving.
- **Property Inspector:** Adjust font size, text color, background color, padding, max-width, border radius, and alignment with real-time feedback.

### 4. Canonical Code Surface Sync & Resilience
- Switch View Mode to **Split** or **Code**.
- Edit JSON fields (e.g., change `baseContent.title`). Click **Apply Code Edits**; notice the Canvas updates instantly.
- Introduce deliberate syntax error (e.g., broken brackets). The editor highlights the exact syntax error in a banner and **refuses to corrupt the last valid canonical state**.

### 5. Deterministic AI Demo Engine (5 Core Paths + 4 Safe Failure Demos)
Click the **AI Scoped Edit** button in the top bar:

| Scenario | Instruction Example | Scope | Expected Behavior |
|---|---|---|---|
| **1. Content Rewrite** | *"Make the headline punchy, high-energy, and focused on craft quality."* | `base` | Rewrites selected heading/subheading to conversion-focused artisanal copy. |
| **1b. Translation** | *"Translate selected content to Spanish for international customers."* | `base` | Translates titles, badges, and CTA buttons into authentic Spanish. |
| **2. Style Morph** | *"Change styling to luxury dark emerald aesthetic with warm amber gold borders."* | `base` | Updates background to `#06281e`, adds `#d4aa4f` border and glow shadow. |
| **2b. Neon Buttons** | *"Make selected buttons glowing neon pills with high contrast."* | `base` | Sets `borderRadius: 9999px`, glowing amber box-shadow, and bold text. |
| **3. Move / Reorder / Spacing** | *"Center-align hero content, expand vertical padding to 5rem, and max-width."* | `base` | Centers text, expands vertical padding to `5rem`, adjusts layout bounds. |
| **4. One-Viewport Responsive** | *"Optimize font size to 22px and tighten padding for mobile screen view only."* | `mobile` | Creates isolated `overrides.mobile` without touching Desktop or Base. |
| **5. Multi-Element Batch** | *"Apply modern frosted glass styling with golden accent badge to all selected cards."* | `base` | Applies backdrop blur, glassmorphism border, and shadow to all selected cards. |
| **6a. Safe Failure: Unselected Target** | *"Rewrite the unselected footer while only the hero is selected."* | `base` | **Selection Authority Error:** Validator blocks unauthorized target ID. |
| **6b. Safe Failure: Stale Revision** | *"Apply edit based on revision 0 when element is at revision 5."* | `base` | **Stale Revision Conflict:** Engine detects and flags concurrent revision mismatch. |
| **6c. Safe Failure: Forbidden Script** | *"Inject custom raw HTML script tags into element content."* | `base` | **Schema Validator Block:** Rejects `dangerouslySetInnerHTML` / script tags. |
| **6d. Safe Failure: Unsupported Prompt** | *"Turn the website into a 3D video game engine."* | `base` | **Graceful Diagnostic:** Returns helpful feedback without corrupting template. |

### 6. Granular Per-Element Proposal Review
- When AI proposals are generated, the **Proposal Staging Drawer** opens.
- Review before/after property diffs and visual cards.
- Click **Accept** or **Reject** on individual elements independently, or click **Accept All** / **Reject All**.

### 7. Independent Element History & Recovery
- Click the **History** button in the top navigation.
- Filter by any specific element (e.g. `elem_hero`) and choose target scope (`base`, `mobile`).
- Click **Restore Element** on a prior revision.
- Notice that only that single element and scope are restored; all other elements remain untouched at their current state.

---

## 🏗️ Architecture & Data Model

```
src/
├── types/template.ts            # Canonical Template, Element, Override, Command, & History types
├── core/
│   ├── resolutionEngine.ts     # Viewport cascading: Resolved = Merge(Base, Overrides[Viewport])
│   ├── validator.ts            # Selection authority, forbidden keys, and schema validation
│   ├── patchEngine.ts          # Unified immutable commit pipeline & history snapshotting
│   ├── historyEngine.ts        # Per-element per-viewport independent recovery engine
│   └── aiEngine.ts             # Deterministic scenario engine & safe failure simulations
├── store/
│   └── useEditorStore.ts       # Unified React state hook with localStorage persistence
├── template/
│   └── defaultTemplate.ts      # Lumina Coffee Roastery responsive schema
├── components/
│   ├── canvas/                 # Device frame, marquee selection box, modular element renderer
│   └── editor/                 # TopNav, Sidebar, PropertyInspector, CodeEditor, AI Modal, Drawers
└── test/                       # 17 focused automated unit & integration tests
```

### Commit Boundary Explanation & Trade-offs
- **Commit Boundary:** Every state transition (Canvas slider, Code JSON edit, Accepted AI proposal, History restore) executes via a single typed `EditCommand` through `applyEditCommand()`. It validates the target IDs, applies patches immutably, increments the monotonic revision counter, and logs a snapshot to the element-level history journal.
- **Trade-off:** Storing element-level snapshots inside the history journal increases in-memory footprint compared to JSON-patch delta diffs. However, snapshot journaling provides $O(1)$ independent rollback guarantees, prevents patch-drift corruption, and makes per-element recovery completely independent of sibling element mutations.

### Ownership of Canonical Model
- All UI state, responsive resolution, validation pipelines, AI selection authority checks, and history ledgers are 100% custom-owned and implemented without third-party editor frameworks.
- UI helper libraries used: `react` (rendering), `tailwindcss` (styling), `lucide-react` (icons), and `canvas-confetti` (UX polish).

---

## 🧪 Automated Test Verification

All 17 automated tests verify requirement compliance:
1. `resolution.test.ts` — Viewport inheritance, property origin tracking, and override isolation.
2. `patchEngine.test.ts` — Uniform commit pipeline and single-view isolation.
3. `aiScope.test.ts` — Selection authority, unselected element blocking, and deterministic consistency.
4. `codeCanvasSync.test.ts` — Bidirectional sync and JSON syntax error boundary resilience.
5. `independentRecovery.test.ts` — Restoring element $A$ leaves element $B$ and other viewports untouched.

```bash
$ npm test
✓ src/test/resolution.test.ts (4 tests)
✓ src/test/patchEngine.test.ts (3 tests)
✓ src/test/aiScope.test.ts (4 tests)
✓ src/test/codeCanvasSync.test.ts (4 tests)
✓ src/test/independentRecovery.test.ts (2 tests)

Test Files  5 passed (5)
Tests       17 passed (17)
```
