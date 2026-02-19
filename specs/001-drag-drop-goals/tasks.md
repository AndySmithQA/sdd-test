# Tasks: Drag-and-Drop Goal Reordering

**Input**: Design documents from `/specs/001-drag-drop-goals/`  
**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/types.ts](contracts/types.ts)

**Manual Verification**: Per project constitution, no automated tests are included. Verification is manual via code review and developer walkthroughs of user scenarios defined in spec.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and manual verification of each story. Per project constitution, no automated tests are included.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Minimal setup (project already exists)

- [x] T001 Review existing goal management implementation in src/components/ and src/hooks/useGoals.ts
- [x] T002 Review existing localStorage schema in src/data/goalsStorage.ts
- [x] T003 [P] Create feature branch and verify existing app functionality

**Checkpoint**: Existing codebase understood, ready for foundational changes

---

## Phase 2: Foundational (Data Layer - BLOCKS All User Stories)

**Purpose**: Core data model changes that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Add `displayOrder: number` field to Goal interface in src/types/goals.ts
- [x] T005 [P] Create src/types/dragDrop.ts with DragState, KeyboardReorderState, ReorderOperation, and handler types from contracts/types.ts
- [x] T006 Implement displayOrder migration logic in src/data/goalsStorage.ts (migrateGoalsToDisplayOrder function)
- [x] T007 Update loadGoals() in src/data/goalsStorage.ts to run migration and sort by displayOrder
- [x] T008 Update saveGoals() in src/data/goalsStorage.ts to persist displayOrder field
- [x] T009 [P] Create src/data/orderUtils.ts with reorderGoals() function implementing index-based reordering logic
- [x] T010 [P] Create src/data/orderUtils.ts with normalizeDisplayOrder() function for integrity recovery
- [x] T011 Update createGoal() logic to assign displayOrder = max(currentOrders) + 1
- [x] T012 Verify migration works: load app with existing goals, check displayOrder assigned, verify localStorage updated

**Checkpoint**: Foundation ready - displayOrder field integrated, migration works, reorder utilities available. User story implementation can now begin.

---

## Phase 3: User Story 1 - Basic Goal Reordering via Drag-and-Drop (Priority: P1) 🎯 MVP

**Goal**: Enable mouse-based drag-and-drop reordering in active column with persistence

**Manual Verification**: Open app with 3+ active goals, click and drag third goal to first position, release, verify goal moves to first position. Reload page, verify order persists. Verify goals are sorted by displayOrder on render.

### Implementation for User Story 1

- [x] T013 [P] [US1] Create src/hooks/useDragAndDrop.ts with state management (draggedGoal, draggedIndex, dropTargetIndex)
- [x] T014 [P] [US1] Implement onMouseDown handler in useDragAndDrop.ts to initiate drag and set draggedGoal
- [x] T015 [US1] Implement onMouseMove handler in useDragAndDrop.ts to update dropTargetIndex
- [x] T016 [US1] Implement onMouseUp handler in useDragAndDrop.ts to execute reorder via orderUtils.reorderGoals()
- [x] T017 [US1] Implement getGoalClasses() in useDragAndDrop.ts to return CSS classes based on drag state
- [x] T018 [US1] Add handleReorder callback in src/hooks/useGoals.ts that calls reorderGoals() and saveGoals()
- [x] T019 [US1] Enhance src/components/GoalColumn.tsx to use useDragAndDrop hook for active column
- [x] T020 [US1] Bind drag handlers (onMouseDown, onMouseMove) to GoalCard components in GoalColumn.tsx
- [x] T021 [US1] Add onMouseUp and onMouseLeave handlers to GoalColumn container in GoalColumn.tsx
- [x] T022 [US1] Ensure goals are filtered by status and sorted by displayOrder in GoalColumn.tsx render
- [x] T023 [US1] Update src/components/GoalCard.tsx to accept and apply className prop from drag state
- [x] T024 [US1] Verify basic drag works: drag goal with mouse, see it move, release, verify reorder happens
- [x] T025 [US1] Verify persistence: reorder goals, reload page, verify order preserved

**Checkpoint**: User Story 1 complete - basic mouse drag-and-drop works in active column, order persists

---

## Phase 4: User Story 2 - Visual Drag Feedback (Priority: P2)

**Goal**: Add smooth animations and visual feedback during drag operations

**Manual Verification**: Drag a goal and observe: (1) dragged goal has reduced opacity, (2) visual gap opens between goals at drop target, (3) goals smoothly shift with 200-300ms animation, (4) gap follows cursor smoothly

### Implementation for User Story 2

- [x] T026 [P] [US2] Create src/styles/dragDrop.css with base goal-card transition (transform 250ms ease-out)
- [x] T027 [P] [US2] Add .dragging class in dragDrop.css (opacity 0.5, scale 1.02, z-index 1000, cursor grabbing)
- [x] T028 [P] [US2] Add .shift-down and .shift-up classes in dragDrop.css using translateY transforms
- [x] T029 [P] [US2] Define CSS variables --goal-card-height and --goal-gap in dragDrop.css root
- [x] T030 [US2] Import dragDrop.css in src/components/GoalColumn.tsx
- [x] T031 [US2] Enhance getGoalClasses() in useDragAndDrop.ts to return 'shift-down' or 'shift-up' based on dropTargetIndex
- [x] T032 [US2] Update onMouseMove logic to calculate shift direction based on cursor position vs draggedIndex
- [x] T033 [US2] Add drag handle cursor styling (cursor: grab) to GoalCard in dragDrop.css
- [x] T034 [US2] Verify visual feedback: drag goal, see opacity change, see gaps open/close, see smooth animations
- [x] T035 [US2] Test performance: drag through list of 20+ goals, verify 60fps smooth animations

**Checkpoint**: User Story 2 complete - visual feedback polished, animations smooth

---

## Phase 5: User Story 3 - Keyboard-Only Goal Reordering (Priority: P2)

**Goal**: Enable full keyboard navigation for reordering (Tab, Space/Enter, arrows, Enter/Escape)

**Manual Verification**: Using keyboard only (no mouse): Tab to a goal, press Space to enter reorder mode, press Up arrow twice, press Enter to confirm. Verify goal moved up two positions, focus maintained, screen reader announces changes.

### Implementation for User Story 3

- [x] T036 [P] [US3] Create src/hooks/useKeyboardReorder.ts with KeyboardReorderState management
- [x] T037 [P] [US3] Implement onKeyDown handler for Space/Enter to activate reorder mode in useKeyboardReorder.ts
- [x] T038 [US3] Implement arrow key handling (Up/Down) in useKeyboardReorder.ts to update currentIndex
- [x] T039 [US3] Implement Enter key handler in useKeyboardReorder.ts to confirm reorder and call onReorder callback
- [x] T040 [US3] Implement Escape key handler in useKeyboardReorder.ts to cancel and restore originalIndex
- [x] T041 [US3] Implement onBlur handler in useKeyboardReorder.ts to auto-save on focus loss
- [x] T042 [US3] Add boundary detection in arrow key handler (prevent moving beyond 0 or length-1)
- [x] T043 [US3] Create announce() function in useKeyboardReorder.ts to update ARIA live region with position changes
- [x] T044 [US3] Implement getAriaLabel() in useKeyboardReorder.ts to generate descriptive labels for goal cards
- [x] T045 [P] [US3] Add keyboard reorder styles to dragDrop.css (.reorder-mode, .pending-position, :focus-visible)
- [x] T046 [P] [US3] Add .sr-only class to dragDrop.css for visually hidden ARIA live region
- [x] T047 [US3] Integrate useKeyboardReorder hook into GoalColumn.tsx
- [x] T048 [US3] Add keyboard handlers (onKeyDown, onBlur) to GoalCard components in GoalColumn.tsx
- [x] T049 [US3] Add ARIA attributes to GoalCard: tabIndex={0}, role="button", aria-label, aria-pressed
- [x] T050 [US3] Add ARIA live region div to GoalColumn.tsx with ref from useKeyboardReorder hook
- [x] T051 [US3] Verify Tab navigation: Tab through goals, see focus indicators, verify sequential order
- [x] T052 [US3] Verify reorder mode: Space activates, arrows move, Enter confirms, Escape cancels
- [x] T053 [US3] Verify ARIA announcements: use screen reader, verify position changes announced
- [x] T054 [US3] Verify focus loss: enter reorder mode, click elsewhere, verify auto-save works
- [x] T055 [US3] Verify boundary detection: try moving past top/bottom, verify appropriate feedback

**Checkpoint**: User Story 3 complete - full keyboard accessibility implemented, WCAG compliant

---

## Phase 6: User Story 4 - Reorder Goals in Completed Column (Priority: P3)

**Goal**: Extend drag-and-drop and keyboard reordering to completed column

**Manual Verification**: Complete 3 goals, navigate to completed column, drag/keyboard-reorder a completed goal to new position. Verify reorder works identically to active column. Verify active and completed orders are independent.

### Implementation for User Story 4

- [ ] T056 [US4] Update GoalColumn.tsx to apply useDragAndDrop hook for completed column (status='completed')
- [ ] T057 [US4] Update GoalColumn.tsx to apply useKeyboardReorder hook for completed column (status='completed')
- [ ] T058 [US4] Verify completed column filtering: ensure reorder only affects completed goals, not active
- [ ] T059 [US4] Verify independent order: reorder in completed column, verify active column unaffected
- [ ] T060 [US4] Test drag in completed column: drag goal, verify visual feedback, verify persistence
- [ ] T061 [US4] Test keyboard in completed column: Tab to completed goal, reorder with keys, verify works

**Checkpoint**: User Story 4 complete - both columns support full drag-drop and keyboard reordering

---

## Phase 7: User Story 5 - Cancel Drag Operation (Priority: P3)

**Goal**: Enable canceling drag via Escape key or dragging outside drop zone

**Manual Verification**: Start dragging a goal, press Escape, verify goal returns to original position. Start dragging, move outside column, release, verify drag cancelled.

### Implementation for User Story 5

- [ ] T062 [US5] Add global keydown listener in useDragAndDrop.ts to detect Escape key during drag
- [ ] T063 [US5] Implement Escape handler to reset dragState without calling onReorder
- [ ] T064 [US5] Update onMouseLeave handler in GoalColumn.tsx to clear dropTargetIndex (visual gap disappears)
- [ ] T065 [US5] Update onMouseUp handler to check if dropTargetIndex is null (outside zone) and skip reorder
- [ ] T066 [US5] Verify Escape cancel: drag goal, press Escape, verify returns to original position
- [ ] T067 [US5] Verify outside cancel: drag goal outside column, release, verify no reorder happens
- [ ] T068 [US5] Verify visual consistency: cancelled drag removes all visual feedback immediately

**Checkpoint**: User Story 5 complete - cancel operations work correctly for mouse and keyboard

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Responsive design, touch detection, edge cases, performance, documentation

- [ ] T069 [P] Add responsive media queries to dragDrop.css (@media min-width 1024px for desktop drag handles)
- [ ] T070 [P] Add mobile viewport handling to dragDrop.css (@media max-width 1023px hide drag handles)
- [ ] T071 [P] Add touch device detection in useDragAndDrop.ts (return no-op handlers if isTouchDevice)
- [ ] T072 [P] Add CSS variable definitions for goal-card-height based on actual rendered size
- [ ] T073 Handle edge case: dragging to same position (no-op, no re-render)
- [ ] T074 Handle edge case: single goal in column (draggable but no effect)
- [ ] T075 Handle edge case: empty column (display appropriate message, no drag handlers)
- [ ] T076 Handle edge case: drag initiated on checkbox/button (prevent drag on interactive elements)
- [ ] T077 Add performance optimization: debounce mousemove if needed for large lists
- [ ] T078 Test responsive behavior: verify on 320px, 768px, 1024px viewports
- [ ] T079 Test cross-browser: verify on Chrome, Firefox, Safari, Edge
- [ ] T080 Code cleanup: review all files for clean code principles, remove console.logs
- [ ] T081 Documentation: add inline comments for complex drag/keyboard logic
- [ ] T082 Run through complete quickstart.md verification checklist
- [ ] T083 Final manual verification: walk through all 5 user stories end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational - BLOCKS ALL)
    ↓
    ├─→ Phase 3 (US1 - P1) 🎯 MVP ← Start here for MVP
    │     ↓
    ├─→ Phase 4 (US2 - P2) ← Can start after US1 complete
    │
    ├─→ Phase 5 (US3 - P2) ← Can start in parallel with US2
    │
    ├─→ Phase 6 (US4 - P3) ← Can start after US1 complete
    │
    └─→ Phase 7 (US5 - P3) ← Can start after US1 complete
          ↓
    Phase 8 (Polish) ← Requires all user stories complete
```

### MVP Scope (Minimum Viable Product)

**MVP = Phase 1 + Phase 2 + Phase 3 (User Story 1)**

Delivers: Basic mouse drag-and-drop reordering in active column with persistence

**Post-MVP Enhancements**:
- Phase 4: Visual polish
- Phase 5: Keyboard accessibility
- Phase 6: Completed column support
- Phase 7: Cancel operations
- Phase 8: Responsive, edge cases, polish

### Parallel Execution Opportunities

**Within Phase 2 (Foundational)**:
- T005 (dragDrop types) can run parallel with T004 (Goal type)
- T009, T010 (orderUtils) can run parallel with T006-T008 (storage migration)

**Within Phase 3 (US1)**:
- T013, T014 (drag hook) can run parallel with T023 (GoalCard enhancement)

**Within Phase 4 (US2)**:
- T026-T029 (CSS) can all run in parallel (different style rules)

**Within Phase 5 (US3)**:
- T036-T044 (keyboard hook) can run parallel with T045-T046 (CSS)

**Across User Stories (after Phase 2)**:
- US2 (Phase 4) and US3 (Phase 5) can be implemented in parallel
- US4 (Phase 6) and US5 (Phase 7) can be implemented in parallel after US1

**Within Phase 8 (Polish)**:
- T069-T072 (responsive/CSS) can all run in parallel
- T078-T079 (testing) can run in parallel

### Task Count by User Story

- **Setup**: 3 tasks
- **Foundational**: 9 tasks (blocks all stories)
- **US1 (P1)**: 13 tasks - Basic drag-drop
- **US2 (P2)**: 10 tasks - Visual feedback
- **US3 (P2)**: 20 tasks - Keyboard accessibility
- **US4 (P3)**: 6 tasks - Completed column
- **US5 (P3)**: 7 tasks - Cancel operations
- **Polish**: 15 tasks

**Total**: 83 tasks

### Independent Verification Per Story

Each user story phase includes verification tasks to ensure the story can be tested independently:
- **US1**: T024-T025 (drag works, persistence works)
- **US2**: T034-T035 (visual feedback, performance)
- **US3**: T051-T055 (keyboard navigation, ARIA, focus)
- **US4**: T060-T061 (completed column drag/keyboard)
- **US5**: T066-T068 (cancel operations)

### Implementation Strategy

1. **Start with MVP** (Phase 1-3): Get basic drag-drop working first
2. **Add polish** (Phase 4): Visual feedback enhances UX
3. **Add accessibility** (Phase 5): Critical for WCAG compliance
4. **Extend to completed** (Phase 6): Reuse existing logic
5. **Add cancel** (Phase 7): Edge case handling
6. **Polish & test** (Phase 8): Cross-cutting concerns

**Recommended Order**: 1 → 2 → 3 → 5 → 4 → 6 → 7 → 8

This ensures keyboard accessibility (US3) is prioritized alongside visual feedback (US2), as both are P2 priority and critical for inclusive design.
