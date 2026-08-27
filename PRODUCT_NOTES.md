# Product Decisions, Domain Concepts & Technical Notes

This document provides a comprehensive breakdown of the domain concepts, state architecture, security boundaries, recovery semantics, and product decisions implemented in the **Scoped AI Template Editor**.

---

## 1. Primary User, Job-to-be-Done & Definition of a Safe Edit

### Primary User
A non-technical or semi-technical small business owner (e.g., artisanal roastery founder, boutique agency owner) who wants to customize and maintain a high-converting website without accidentally breaking responsive layouts or losing manual work.

### Core Job-to-be-Done
*"When I want to update my website's content, theme, or mobile responsiveness—whether through manual canvas tweaks, code editing, or text-driven AI prompts—I want to see exactly what will change before it happens, ensure other screen sizes remain safe, and be able to restore any element independently if I change my mind."*

### Definition of a "Safe Completed Template Edit"
An edit is considered safe and complete if and only if:
1. It applies **strictly to the user's targeted elements and responsive scope**.
2. It **does not corrupt unselected elements, foreign viewports, or concurrent revisions**.
3. It passes schema validation (no prototype pollution, script injections, or broken JSON).
4. It creates an explicit forward entry in the element-level history journal so it can be restored at any future point without global rollback.

---

## 2. Domain Entities & Conceptual Boundaries

| Concept | Technical Definition & Boundary |
|---|---|
| **Element** | A modular, typed, JSON-serializable node with a stable UUID (`id`), parent pointer (`parentId`), element type (`hero`, `navbar`, `card`, etc.), monotonic `revision`, universal `baseStyles` / `baseContent`, and isolated `overrides` dictionary. |
| **Group Selection** | A discrete `Set<string>` of element IDs chosen via Click, additive `Shift/Cmd-click`, or Marquee drag rectangle. Selection is authority: no AI or batch command can touch an ID outside this set. |
| **Committed Step** | An immutable transformation triggered by a typed `EditCommand` that increments the template and element revision counters and registers a snapshot entry in the history journal. |
| **Viewport Scope** | The target tier for property application: `base` (universal fallback across all viewports) vs. `desktop` / `tablet` / `mobile` (viewport-specific overrides). |
| **Editable Property Boundary** | Explicit style tokens (colors, typography, spacing, flex/grid layouts, shadows) and content fields (text, titles, buttons, badges, images). Dangerous HTML attributes (like `dangerouslySetInnerHTML`, `eval`, `script`) are forbidden by the schema validator. |

---

## 3. State Synchronization & Viewport Cascading Resolution

### Canonical Single Source of Truth
The visual Canvas, the Monaco/JSON Code Editor, the Deterministic AI Demo Engine, and the History Recovery Modal all read from and write to the same single `TemplateModel` state object.

### Cascading Resolution Formula
For any element $E$ rendered at Viewport $V \in \{\text{desktop}, \text{tablet}, \text{mobile}\}$:
$$\text{ResolvedStyles}(E, V) = \{ \dots E.\text{baseStyles}, \dots(E.\text{overrides}[V]?.styles \parallel \{\}) \}$$
$$\text{ResolvedContent}(E, V) = \{ \dots E.\text{baseContent}, \dots(E.\text{overrides}[V]?.content \parallel \{\}) \}$$

- **Base Propagation:** Modifying a property in `base` immediately updates all viewports that do not have an explicit override for that property.
- **Override Isolation:** Modifying a property in `mobile` writes exclusively to `overrides.mobile`. Desktop and Tablet continue resolving their base values without side effects.

---

## 4. Deterministic AI Scope Authority & Error Handling

### Selection Authority Contract
The deterministic AI engine takes the user's prompt, active responsive scope, and `selectedIds`.
- The engine computes candidate proposals exclusively for elements in `selectedIds`.
- A runtime validation guard (`validateAiProposalBundle`) inspects the returned bundle. If any proposal references an unselected ID or illegal field, the entire bundle is quarantined and flagged as a security violation.

### Handling Invalid or Stale Output
- **Stale Revisions:** If the element was modified concurrently after the proposal was generated (`baseRevision < currentRevision`), the proposal drawer flags a `Stale Revision Warning`.
- **Invalid Code Edits:** If a user enters invalid JSON in the Code surface, the syntax validator blocks application and renders an inline error banner, preserving the last known valid state.

---

## 5. Review, Partial Acceptance & Independent Recovery Policy

1. **Staging Proposal Drawer:** AI proposals are never automatically written to canonical state. Proposals are staged in a dedicated drawer showing side-by-side Before vs. After diffs.
2. **Partial Acceptance:** In a multi-element AI operation (e.g., editing 3 cards), the user can accept Card 1, reject Card 2, and leave Card 3 pending.
3. **Independent Recovery:** Each element maintains an isolated history journal. Restoring Element A to a revision from 10 minutes ago restores only Element A's properties. Element B remains at its latest revision. Furthermore, restoring a Mobile override restores only the mobile override without touching Desktop or Base.

---

## 6. One Product Decision of Our Own

### Feature: **Responsive Cascade & Override Promotion Engine**
- **User Problem:** When business owners make a styling adjustment on Mobile (e.g., a great color theme or font pairing), they frequently want to promote that winning look to become the new global default across all screen sizes without having to manually copy-paste values. Conversely, they often forget which properties were inherited vs. overridden.
- **Implementation:**
  1. Added **Inheritance Origin Badges** in the Property Inspector (`shared base` vs `[viewport] override`).
  2. Added the **Responsive Cascade Visualizer & 1-Click Promote to Global Base** button in the bottom drawer, allowing users to promote any viewport override to the universal Base with a single click.
- **Product Evidence to Validate:**
  - *Metric 1 (Efficiency):* Reduction in time-to-publish for multi-screen template adaptations.
  - *Metric 2 (Error Reduction):* Decrease in accidental override abandonment (measuring cases where users create an override, forget about it, and wonder why base edits don't apply).

---

## 7. Cuts, Assumptions & Next Priorities

### Assumptions Made
1. Desktop preview target is ~1440px (rendered at 1200px container with responsive fluid padding). Tablet is 768px, Mobile is 375px.
2. Small business owners prioritize structured content editing and visual consistency over freeform drag-and-drop coordinate positioning.

### Intentional Cuts
1. Multi-user concurrent WebSockets live collaboration (cut to maintain focus on rock-solid local state synchronization, history journaling, and deterministic AI validation).
2. Live external LLM API calls (as required by PDF Section 4, a deterministic scenario engine was implemented to guarantee repeatable, reviewer-testable evaluation).

### Next Three Priorities
1. **Visual CSS Diff Overlay:** Visual ghost overlay showing translucent before/after rendering directly on the canvas during proposal preview.
2. **Component Preset Library:** Ability for users to save any custom element as a reusable component snippet.
3. **One-Click Static HTML/CSS/Tailwind Export:** Generating production-ready single-file static HTML bundles for instant deployment to Vercel/Netlify.
