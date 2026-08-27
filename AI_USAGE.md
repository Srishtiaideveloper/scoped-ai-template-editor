# AI Usage & Development Journal

This document records the AI-assisted workflows, validation methodologies, prompt interactions, and architectural decisions made during the development of the **Scoped AI Template Editor**.

---

## 1. Tools & Models Used

| Tool / Model | Primary Tasks & Responsibilities |
|---|---|
| **Gemini 3.7 / Antigravity Agent** | Product architecture framing, TypeScript data model design, Vitest test suite authoring, and React component modularization. |
| **Vite & TypeScript Compiler** | Fast bundling, Hot Module Replacement (HMR), static type safety, and syntax verification. |
| **Vitest Runner** | Continuous test verification for selection authority, responsive resolution order, and independent element rollback. |

---

## 2. Redacted Prompt & Workflow Examples

### Example A: Planning & Product-Framing Interaction
> **Prompt:**  
> *"Design a typed, JSON-serializable template model for a scoped AI template editor. The model must support stable element IDs, universal base styles/content, isolated viewport overrides (Desktop, Tablet, Mobile), monotonic revisions, and an element-level history journal for independent recovery."*
>
> **Outcome:**  
> Framed the `TemplateModel` interface where every element maintains `baseStyles`, `baseContent`, and an `overrides: { desktop?, tablet?, mobile? }` map. This separation guarantees that edits targeting a specific viewport never pollute the universal base layer or corrupt sibling viewports.

### Example B: Implementation, Debugging & Test Interaction
> **Prompt:**  
> *"Author an automated integration test verifying that when an AI proposal attempts to modify an unselected element ID, the selection authority validator catches the violation and prevents state modification."*
>
> **Outcome:**  
> Generated `src/test/aiScope.test.ts` which asserts that `validateAiProposalBundle()` returns `isValid: false` and flags an explicit `AI Security Violation` error if any returned proposal ID does not exist in the caller's `selectedIds` set.

---

## 3. Rejected or Materially Corrected AI Suggestion

- **Initial Suggestion:** The initial AI code proposed implementing global undo/redo by saving a single monolithic snapshot of the entire `TemplateModel` on every commit.
- **Why It Was Rejected:** Monolithic full-page snapshots violate the core requirement of **independent per-element recovery** (Section 1 & 3 of the brief). If a user modifies Element A, then edits Element B, and later wants to restore Element A, a monolithic snapshot would destructively wipe out the edits on Element B as well.
- **Resulting Correction:** Refactored the recovery engine to use an **element-level history journal** (`src/core/historyEngine.ts`). When Element A is restored, only Element A's slice is replaced, leaving Element B and all unrelated viewports completely undisturbed.

---

## 4. Verification & Code Quality Assurance

To ensure the highest code quality and safety bar, the following verification pipeline was executed:

1. **Automated Unit & Integration Tests:**
   - Command: `npm test`
   - Result: 17/17 tests passing across 5 dedicated test suites (`resolution`, `patchEngine`, `aiScope`, `codeCanvasSync`, `independentRecovery`).
2. **Production Bundle Compilation:**
   - Command: `npm run build`
   - Result: Clean Vite/TypeScript production build with zero type errors and zero bundle warnings.
3. **Manual Journey Exercises:**
   - Multi-element selection via Click, Shift-Click, and Marquee drag box.
   - Dual-surface bidirectional sync: verified that manual code JSON modifications update the canvas immediately and invalid syntax is safely quarantined.
   - Tested all 5 deterministic AI demo paths and all 4 safe failure scenarios.
   - Tested isolated rollback on Mobile view without altering Desktop view.
4. **Dependency Audit:**
   - Zero vulnerabilities reported by npm audit. No unnecessary external heavy dependencies.

---

## 5. Workflow Limitation & Future Improvements

- **Limitation Noticed:** In Tailwind CSS v4, PostCSS configuration moved to `@tailwindcss/postcss`. Initial configuration generated a PostCSS build error during bundling.
- **Adjustment for Next Time:** Explicitly lock tooling configurations when scaffolding new Vite plugins and configure framework-specific build adapters at step zero before integrating higher-level components.
