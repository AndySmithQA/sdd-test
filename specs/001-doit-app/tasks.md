---
description: "Task list for doit goal tracking web app implementation"
---

# Tasks: Goal Tracking Web App (doit)

**Input**: Design documents from `/specs/001-doit-app/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/  
**Manual Verification**: Per project constitution, no automated tests. Verification is manual via code review and developer walkthroughs of user scenarios.

**Organization**: Tasks are organized by user story to enable independent implementation and manual verification. Each story can be completed independently and verified without other stories.

## Format: `- [ ] [ID] [P?] [Story] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1, US2, US3, etc.)
- Include exact file paths in task descriptions
- No test tasks per constitution

## Path Conventions

- `src/` at repository root for all source code
- Components in `src/components/`
- Hooks in `src/hooks/`
- Types in `src/types/`
- Data/storage helpers in `src/data/`
- Styles in `src/styles/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and foundational structure

- [x] T001 Create React + TypeScript project structure with Vite build config
- [x] T002 [P] Install dependencies: react, react-dom, bootstrap, date-fns
- [x] T003 [P] Create base styles and pastel color theme variables in `src/styles/theme.css`
- [x] T004 Create TypeScript types for Goal entity in `src/types/goals.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Implement localStorage helper with serialize/deserialize and schema versioning in `src/data/goalsStorage.ts`
- [x] T006 Create `useGoals` hook with CRUD operations (add, update, delete) in `src/hooks/useGoals.ts`
- [x] T007 [P] Create base `App.tsx` layout structure with two-column container using Bootstrap grid in `src/App.tsx`
- [x] T008 [P] Create Header component with app title in `src/components/Header.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create New Goal (Priority: P1) 🎯 MVP

**Goal**: Users can create new goals via modal form with title, end date, and optional description

**Manual Verification**: Click "Add Goal" button, enter goal details (title, end date, description), submit form, confirm goal appears in active column with correct days remaining display.

### Implementation for User Story 1

- [x] T009 [US1] Create GoalFormModal component with title input, date picker, and description textarea in `src/components/GoalFormModal.tsx`
- [x] T010 [US1] Implement form validation (title required, endDate required, prevent submit on missing fields)
- [x] T011 [US1] Add "Add Goal" button to Header component that opens GoalFormModal
- [x] T012 [US1] Wire useGoals hook to form submission to create new goal with generated ID and current date as createdDate
- [x] T013 [US1] Implement modal open/close state with focus management and click-outside handler
- [ ] T014 [US1] Test US1 acceptance scenarios manually: button click opens modal, form submit creates goal and closes modal, cancel closes modal without creating

**Checkpoint**: User Story 1 complete - goal creation workflow is functional and manually verified

---

## Phase 4: User Story 2 - View Active Goals with Days Remaining (Priority: P1)

**Goal**: Display all active goals in left column with accurate days-remaining calculation and urgency display

**Manual Verification**: Create test goals with end dates 1 day, 7 days, and 30 days away. Verify days remaining calculated correctly in left column. Verify "Due today" displays for today's date and "Overdue" for past dates.

### Implementation for User Story 2

- [x] T015 [P] [US2] Create GoalCard component displaying goal title, description, and days remaining in `src/components/GoalCard.tsx`
- [x] T016 [P] [US2] Implement days-remaining calculation using date-fns (`differenceInCalendarDays` with `startOfDay` normalization)
- [x] T017 [US2] Implement conditional display: "X days left", "Due today", or "Overdue" based on daysRemaining value
- [x] T018 [US2] Create GoalColumn component to display list of goals in a card container in `src/components/GoalColumn.tsx`
- [x] T019 [US2] Filter goals by status (`active`) and pass filtered list to GoalColumn in `App.tsx`
- [x] T020 [US2] Apply responsive Bootstrap grid to left column (`col-12 col-md-6`)
- [x] T021 [US2] Test US2 acceptance scenarios manually: verify active goals display, day counts accurate for 1, 7, 30 day tests, "Due today" and "Overdue" displays correct

**Checkpoint**: User Stories 1 + 2 complete - goal creation and viewing workflows are functional

---

## Phase 5: User Story 3 - Complete and Move Goals to Completed Column (Priority: P1)

**Goal**: Users can check a goal, move it to completed column, and it maintains all details in completed state

**Manual Verification**: Check an active goal, confirm action menu appears, select "Move to Completed", verify goal moves to right column with checkmark indicator, left column updates immediately.

### Implementation for User Story 3

- [x] T022 [P] [US3] Add checkbox and action buttons (Move to Completed, Delete) to GoalCard component
- [x] T023 [US3] Implement checkbox state tracking for selected goal per card
- [x] T024 [US3] Create action handler to call useGoals.updateGoal with status="completed"
- [x] T025 [US3] Display completed goals in right column filtered by status="completed"
- [x] T026 [US3] Add visual indicator (checkmark, strikethrough, or grayed styling) for completed goals
- [x] T027 [US3] Verify completed column displays all original goal details (title, description, end date)
- [x] T028 [US3] Test US3 acceptance scenarios manually: check goal, select Move to Completed, verify goal in right column, left column count decreases, page refresh preserves state

**Checkpoint**: User Stories 1 + 2 + 3 complete - MVP is functional (create, view active, complete)

---

## Phase 6: User Story 4 - Delete a Goal (Priority: P2)

**Goal**: Users can permanently delete goals from either column with confirmation dialog

**Manual Verification**: Check a goal in either column, select Delete, confirm deletion in dialog, verify goal removed and does not reappear on page refresh.

### Implementation for User Story 4

- [x] T029 [US4] Create ConfirmDialog component for delete confirmation in `src/components/ConfirmDialog.tsx`
- [x] T030 [US4] Add Delete button click handler to show ConfirmDialog with "Are you sure?" message
- [x] T031 [US4] Implement confirmed Delete action calling useGoals.deleteGoal with goal ID
- [x] T032 [US4] Remove deleted goal from UI immediately after confirmation
- [x] T033 [US4] Test US4 acceptance scenarios manually: check goal, click Delete, cancel dialog (goal persists), click Delete and confirm (goal removed), refresh page (goal does not reappear)

**Checkpoint**: All Goal Management (P1 + P2 core delete) features complete

---

## Phase 7: User Story 5 - Highlight Upcoming Deadline Goals (Priority: P2)

**Goal**: Goals due within 3 days display with distinct warning styling; overdue and normal goals display differently

**Manual Verification**: Create goals with end dates at 1, 2, 3, 4 days, and in the past. Verify 1-3 day goals show highlighted pastel background, 4+ days show normal style, past dates show expired style.

### Implementation for User Story 5

- [x] T034 [P] [US5] Add CSS styling for three states in `src/styles/theme.css`: `goal-due-soon` (pastel peachy/coral), `goal-normal` (light pastel), `goal-overdue` (muted/gray)
- [x] T035 [US5] Compute `isDueSoon` and `isOverdue` flags in GoalCard component using daysRemaining
- [x] T036 [US5] Apply conditional CSS class to goal card based on status (due soon, normal, overdue)
- [x] T037 [US5] Test US5 acceptance scenarios manually: create 1/2/3/4-day and past-date test goals, verify highlighting applied correctly, verify styles are visually distinct

**Checkpoint**: Deadline highlighting complete

---

## Phase 8: User Story 6 - Responsive Design Across Devices (Priority: P2)

**Goal**: Two-column layout adapts to mobile, tablet, and desktop viewports without breaking functionality

**Manual Verification**: Open app in browser dev tools at 375px (mobile), 768px (tablet), and 1200px (desktop). Verify columns stack on mobile, adjust spacing on tablet, display side-by-side on desktop. Test button clicks, modal, and text readability at each size.

### Implementation for User Story 6

- [x] T038 [US6] Apply Bootstrap responsive grid classes to App layout columns (`col-12 col-md-6` for each)
- [x] T039 [US6] Set max-width and padding constraints on containers for readability at large desktop sizes
- [x] T040 [P] [US6] Test GoalCard and GoalColumn responsive behavior: ensure cards don't overflow, buttons clickable at all sizes
- [x] T041 [US6] Test GoalFormModal responsive behavior: modal stays centered, form fields readable, buttons accessible on mobile
- [x] T042 [US6] Test Button and input font sizes and spacing meet mobile touch target guidelines (44px minimum)
- [x] T043 [US6] Manually verify responsive behavior at three breakpoints: mobile (375px), tablet (768px), desktop (1200px)

**Checkpoint**: Responsive design verified across all three breakpoints

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and final verification across all features

- [x] T044 [P] Test color contrast on pastel backgrounds meets WCAG AA standards in `src/styles/theme.css`
- [x] T045 Verify localStorage persistence: create goals, refresh page, confirm goals remain
- [x] T046 Verify form validation: attempt submit with empty title/date, confirm error state
- [x] T047 Test edge case: create goal with end date in past, confirm displays as "Overdue" immediately
- [x] T048 Test edge case: create goal with no description (empty string), confirm goal displays without error
- [x] T049 [P] Clean up unused imports and ensure consistent code formatting across all components
- [ ] T050 Create README.md with setup, build, run instructions in repository root
- [ ] T051 Manual end-to-end workflow: create 5 test goals with various dates, move one to complete, delete one, verify UI accuracy and persistence
- [ ] T052 Document pastel color hex values used in `src/styles/theme.css` for design reference

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 can start after Foundational
  - US2 (View) depends on US1 (Create) being complete to have data to display
  - US3 (Complete) depends on US1 + US2
  - US4 (Delete) depends on US1 (has data to delete)
  - US5 (Highlight) depends on US2 (needs goal display to style)
  - US6 (Responsive) can run in parallel with other stories after Foundational
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1 - Create)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **US2 (P1 - View)**: Can start after US1 complete - needs goals to display
- **US3 (P1 - Complete)**: Can start after US2 complete - needs view to work before completion action
- **US4 (P2 - Delete)**: Can start after US1 (has goals to delete)
- **US5 (P2 - Highlight)**: Can start after US2 (needs goal display to apply styling)
- **US6 (P2 - Responsive)**: Can run in parallel with other stories after Foundational (applies across all components)

### Sequential Execution (Recommended for single developer)

1. Phase 1 (Setup) - 4 tasks
2. Phase 2 (Foundational) - 4 tasks
3. Phase 3 (US1 Create) - 6 tasks
4. Phase 4 (US2 View) - 7 tasks
5. Phase 3 (US3 Complete) - 7 tasks
6. Phase 6 (US4 Delete) - 5 tasks
7. Phase 7 (US5 Highlight) - 4 tasks
8. Phase 8 (US6 Responsive) - 6 tasks
9. Phase 9 (Polish) - 9 tasks

**Total**: 52 tasks

### Parallel Execution (Recommended for 2-3 developers after Foundational)

```
Developer A: US1 (Create) → US3 (Complete) → US4 (Delete)
Developer B: US2 (View) → US5 (Highlight)
Developer C: US6 (Responsive) - can run in parallel with others
All: Polish & end-to-end verification
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup (4 tasks)
2. Complete Phase 2: Foundational (4 tasks)
3. Complete Phase 3: US1 Create (6 tasks)
4. Complete Phase 4: US2 View (7 tasks)
5. Complete Phase 5: US3 Complete (7 tasks)
6. **STOP and VALIDATE**: Create/view/complete workflows work end-to-end
7. Manual verification against US1, US2, US3 acceptance scenarios
8. Deploy MVP with core goal management functionality

### Incremental Delivery (Add enhancements after MVP)

1. MVP complete → Deploy
2. Add US4 (Delete) - improves goal management
3. Add US5 (Highlight) - improves UX with urgency indicators
4. Add US6 (Responsive) - improves accessibility across devices
5. Polish - final refinement and verification

### Single-Developer Fast Track

1. Implement and manually verify one user story completely (create, view, test)
2. Move to next story once previous is working
3. Skip parallel opportunities; maintain sequential clarity
4. Polish phase covers cross-story consistency

---

## Notes

- [P] tasks = different files with no dependencies; can parallelise within a phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and manually verifiable
- Manual verification checklist in quickstart.md guides testing
- Commit after each task or logical group (e.g., after all US1 tasks)
- Stop at any checkpoint to validate story independently via manual walkthrough
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence
- Constitution: NO automated tests - all quality assurance via manual verification and code review
