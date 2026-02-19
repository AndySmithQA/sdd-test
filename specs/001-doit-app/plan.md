# Implementation Plan: Goal Tracking Web App (doit)

**Branch**: `001-doit-app` | **Date**: 2026-02-19 | **Spec**: [specs/001-doit-app/spec.md](specs/001-doit-app/spec.md)
**Input**: Feature specification from `/specs/001-doit-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a goal tracking web app with two columns (active goals left, completed goals right), modal-based goal creation, checkbox actions for completion/deletion, and deadline highlighting for goals due within 3 days. Implement as a React + TypeScript + Bootstrap single-page app using localStorage for persistence and date-fns for date calculations/formatting. No automated tests; manual verification only.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.9 (React 19)  
**Primary Dependencies**: React, Bootstrap 5.2, date-fns  
**Storage**: Browser localStorage (single-device persistence)  
**Target Platform**: Modern web browsers (Chrome, Safari, Firefox, Edge)
**Project Type**: Single web application (Vite)  
**Performance Goals**: UI interactions under 500ms; smooth 60 fps scrolling  
**Constraints**: No automated tests; offline-capable for existing local data  
**Scale/Scope**: Single-user local app; small goal list (<500 items)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Clean Code: PASS (plan emphasizes clear components and minimal complexity)
- User Experience (UX) First: PASS (modal flow, clear actions, pastel theme)
- Responsive Design: PASS (Bootstrap grid with mobile-first behavior)
- Minimal Dependencies: PASS (React, Bootstrap, date-fns only)
- NO Testing: PASS (manual verification only)
- Tech Stack Locked: PASS (React + TypeScript + Bootstrap + Vite)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── components/
│   ├── GoalCard.tsx
│   ├── GoalColumn.tsx
│   ├── GoalFormModal.tsx
│   └── Header.tsx
├── data/
│   └── goalsStorage.ts
├── hooks/
│   └── useGoals.ts
├── styles/
│   └── theme.css
├── types/
│   └── goals.ts
├── App.tsx
└── main.tsx
```

**Structure Decision**: Single React web app under `src/` with components, hooks, and localStorage data helpers; no test directories per constitution.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
