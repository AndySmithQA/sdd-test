# Implementation Plan: Drag-and-Drop Goal Reordering

**Branch**: `001-drag-drop-goals` | **Date**: 2026-02-19 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-drag-drop-goals/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Enable users to manually reorder goals within active and completed columns through mouse-based drag-and-drop and full keyboard navigation. Goals will gain a display order attribute persisted to localStorage, with smooth visual feedback (200-300ms animations, visual gaps) during reordering. Keyboard users can Tab to goals, Space/Enter to activate reorder mode, arrow keys to move, and Enter to confirm. Touch support is explicitly deferred.

## Technical Context

**Language/Version**: TypeScript 5.9+ with React 19+  
**Primary Dependencies**: React 19.2.0, Bootstrap 5.2.3, date-fns 3.6.0, uuid 9.0.1  
**Storage**: localStorage (browser-based, no backend, schema: goals:v1)  
**Target Platform**: Desktop web browsers (Chrome, Firefox, Safari, Edge) - mouse and keyboard only  
**Project Type**: Single-page web application (Vite + React + TypeScript)  
**Performance Goals**: Visual feedback <100ms on drag start, goal transitions 200-300ms, smooth 60fps animations, handle 50+ goals without degradation  
**Constraints**: No touch support in this feature, no external libraries for drag-and-drop (implement using native browser events), maintain existing localStorage schema compatibility  
**Scale/Scope**: Single-user browser app, ~10-20 components total, localStorage limit ~5-10MB typical (sufficient for thousands of goals)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Clean Code
- ✅ **PASS**: Feature will be implemented with clear component boundaries (drag handler components, keyboard navigation hooks, order management utilities)
- ✅ **PASS**: TypeScript provides self-documenting types for drag state, keyboard modes, and order operations
- ✅ **PASS**: Complex drag/keyboard logic will be extracted into custom hooks for clarity and reusability

### Principle II: UX First
- ✅ **PASS**: Entire feature is UX-driven - drag-and-drop with visual feedback, full keyboard accessibility (Tab, Space, arrows, Enter, Escape)
- ✅ **PASS**: Manual verification steps defined in spec for each user story with clear acceptance scenarios
- ✅ **PASS**: Graceful handling of edge cases (focus loss auto-saves, boundary detection, cancel operations)
- ✅ **PASS**: Progressive enhancement: reordering is additive to existing goal management, non-breaking

### Principle III: Responsive Design
- ✅ **PASS** (Post-Phase 1): Responsive design strategy defined in research.md R5 - UI visible on all viewports (mobile 320px+, tablet 768px+, desktop 1024px+)
- ✅ **PASS**: Progressive degradation approach - reorder controls visible on desktop/keyboard devices, gracefully hidden on touch-only with explanatory hint
- ✅ **PASS**: Existing goal cards already responsive; reorder feature extends existing layout without breaking mobile view
- ✅ **PASS**: CSS media queries defined in quickstart.md for viewport-specific behavior

### Principle IV: Minimal Dependencies
- ✅ **PASS**: No new external dependencies required - implementing with native browser drag events (onMouseDown, onMouseMove, onMouseUp) and keyboard events
- ✅ **PASS**: Existing dependencies (React, Bootstrap, date-fns, uuid) sufficient for implementation
- ✅ **PASS**: No drag-drop library (react-dnd, dnd-kit, etc.) - keeping dependency tree shallow

### Principle V: NO Testing
- ✅ **PASS**: No automated tests planned - manual verification via documented user scenarios
- ✅ **PASS**: Developers will manually walk through drag-drop flows and keyboard navigation in browser dev tools
- ✅ **PASS**: Code review will verify manual testing completion

**Phase 0 Gate Status**: ✅ **PASS** - All concerns addressed in research, proceeding to Phase 1

**Phase 1 Gate Status (Re-evaluation)**: ✅ **PASS** - All constitution principles satisfied:
- Clean Code: Custom hooks, clear component boundaries, TypeScript types defined
- UX First: Comprehensive keyboard accessibility, visual feedback, manual verification checklist in quickstart.md
- Responsive Design: Progressive degradation strategy ensures all viewports work appropriately per research.md R5
- Minimal Dependencies: Zero new dependencies, native browser events only
- NO Testing: Manual verification exclusively, no test files or frameworks

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

```text
src/
├── components/
│   ├── GoalCard.tsx         # Existing goal display component (will be enhanced)
│   ├── GoalColumn.tsx       # Existing column container (will be enhanced)
│   ├── DragDropProvider.tsx # NEW: Context provider for drag state management
│   └── KeyboardReorderMode.tsx # NEW: Visual indicator for keyboard reorder mode
├── hooks/
│   ├── useGoals.ts          # Existing goals hook (will be enhanced with reorder methods)
│   ├── useDragAndDrop.ts    # NEW: Mouse drag-drop event handling and state
│   └── useKeyboardReorder.ts # NEW: Keyboard navigation and reorder mode logic
├── data/
│   ├── goalsStorage.ts      # Existing storage layer (will be enhanced for order field)
│   └── orderUtils.ts        # NEW: Order calculation and persistence utilities
├── types/
│   ├── goals.ts             # Existing types (will add displayOrder field)
│   └── dragDrop.ts          # NEW: Drag state, keyboard mode, reorder operation types
├── styles/
│   ├── theme.css            # Existing theme
│   └── dragDrop.css         # NEW: Drag preview, visual gap, keyboard focus styles
└── utils/
    └── animations.ts         # NEW: Timing utilities for 200-300ms transitions
```

**Structure Decision**: Single-page React application (Option 1). All code in `src/` directory with clear separation: components for UI, hooks for behavior logic, data for persistence, types for TypeScript definitions, styles for CSS, utils for cross-cutting concerns. No backend required - localStorage persists all state client-side.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations requiring justification. One clarification needed (responsive design + desktop-only interaction) will be resolved in Phase 0 research.
