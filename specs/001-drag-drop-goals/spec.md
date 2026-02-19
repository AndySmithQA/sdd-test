# Feature Specification: Drag-and-Drop Goal Reordering

**Feature Branch**: `001-drag-drop-goals`  
**Created**: 2026-02-19  
**Status**: Draft  
**Input**: User description: "drag and drop - modify the page so that users can re-order goals by dragging and dropping them above or below other goals in the list"

## Clarifications

### Session 2026-02-19
- Q: How should keyboard navigation be supported? → A: Full keyboard support (Tab navigation, arrow keys to reorder, Enter to confirm drop)
- Q: Should touch/mobile gestures be supported? → A: Mouse and keyboard only (defer touch to future mobile-specific enhancement)
- Q: What visual style should the drop indicator use? → A: Visual gap/space (goals physically shift apart to show insertion point)
- Q: What should happen when focus is lost during keyboard reorder mode? → A: Auto-save current position (keep changes made before focus loss)
- Q: What animation duration should be used for goal shifting transitions? → A: Moderate animation (200-300ms, balanced smoothness)

## User Scenarios *(mandatory)*

### User Story 1 - Basic Goal Reordering via Drag-and-Drop (Priority: P1)

A user wants to reorganize their goals by priority or preference. They click and hold on a goal card, drag it to a new position above or below other goals in the same column, and release to reorder it. The goal order updates immediately and persists across page reloads.

**Why this priority**: This is the core functionality—enabling users to manually prioritize and organize their goals according to their own mental model. Without this, the feature provides no value.

**Manual Verification**: Can be verified by opening the app with multiple active goals, clicking and dragging the third goal to the first position, releasing the mouse, and confirming the goal now appears first in the list. Reload the page and verify the order persists.

**Acceptance Scenarios**:

1. **Given** the user has 3 or more goals in the active column, **When** they click and hold on a goal card, **Then** the goal becomes draggable and visual feedback indicates the drag has started
2. **Given** a goal is being dragged, **When** the user moves the cursor over another goal, **Then** a visual gap appears between goals showing where the goal will be inserted
3. **Given** a goal is being dragged, **When** the user releases the mouse button over a valid drop position, **Then** the goal is moved to that position and all other goals shift accordingly
4. **Given** a goal has been reordered, **When** the user refreshes the page, **Then** the new order is preserved

---

### User Story 2 - Visual Drag Feedback (Priority: P2)

A user wants clear visual feedback while dragging so they understand what they're moving and where it will land. The dragged goal shows a semi-transparent preview, and the drop target position is clearly marked.

**Why this priority**: Visual feedback enhances user confidence and reduces errors during drag operations. It's important for UX but the reordering can technically work without fancy visuals.

**Manual Verification**: Can be verified by dragging a goal and observing: (1) the dragged goal appears with reduced opacity or a ghost effect, (2) a visual gap appears between goals showing where the drop will occur, (3) the gap moves as the cursor moves over different positions, with goals smoothly shifting (200-300ms animation) to accommodate.

**Acceptance Scenarios**:

1. **Given** a user starts dragging a goal, **When** the drag is in progress, **Then** the dragged goal displays with visual distinction (e.g., reduced opacity, slight scale increase)
2. **Given** a goal is being dragged over another goal, **When** the cursor crosses the midpoint of the target goal, **Then** a visual gap opens between goals to show insertion point above or below, and other goals shift to accommodate
3. **Given** a user drags a goal outside the goal list area, **When** the cursor leaves the droppable zone, **Then** the visual gap disappears, goals return to their positions, and releasing the mouse cancels the drag operation

---

### User Story 3 - Keyboard-Only Goal Reordering (Priority: P2)

A user who relies on keyboard navigation (due to accessibility needs or preference) wants to reorder goals without using a mouse. They use Tab to focus on a goal, Space/Enter to enter reorder mode, arrow keys to move the goal up or down, and Enter to confirm the new position.

**Why this priority**: Keyboard accessibility is essential for users with mobility limitations and ensures compliance with accessibility standards (WCAG). It's secondary to mouse-based drag-and-drop but critical for inclusive design.

**Manual Verification**: Can be verified by using only the keyboard (no mouse): Tab to a goal, press Space to enter reorder mode, press Up arrow twice to move the goal up two positions, press Enter to confirm, and verify the goal moved correctly and focus is maintained.

**Acceptance Scenarios**:

1. **Given** a user is navigating with keyboard only, **When** they press Tab, **Then** focus moves sequentially through goal cards with visible focus indicators
2. **Given** a goal has keyboard focus, **When** the user presses Space or Enter, **Then** the goal enters reorder mode with visual indication
3. **Given** a goal is in keyboard reorder mode, **When** the user presses Up or Down arrow keys, **Then** the goal's position moves up or down by one position with each keypress and visual feedback shows the change
4. **Given** a goal is in keyboard reorder mode, **When** the user presses Enter, **Then** the new position is saved and the goal exits reorder mode
5. **Given** a goal is in keyboard reorder mode, **When** the user presses Escape, **Then** the goal returns to its original position and exits reorder mode
6. **Given** a goal is in keyboard reorder mode, **When** focus is lost (user clicks elsewhere or tabs to another element), **Then** the current position is automatically saved and the goal exits reorder mode

---

### User Story 4 - Reorder Goals in Completed Column (Priority: P3)

A user wants to reorder goals in the completed column as well as the active column, to organize their achievement history.

**Why this priority**: Organizing completed goals is a nice-to-have for users who want to curate their achievement history, but it's less critical than organizing active goals which affect current decision-making.

**Manual Verification**: Can be verified by creating and completing 3+ goals, navigating to the completed column, dragging a completed goal to a different position, and confirming the reorder works identically to the active column.

**Acceptance Scenarios**:

1. **Given** the user has multiple goals in the completed column, **When** they drag a completed goal to a new position, **Then** the goal reorders within the completed column
2. **Given** a goal is being dragged in the completed column, **When** the user releases it, **Then** the completed column maintains its separate order from the active column

---

### User Story 5 - Cancel Drag Operation (Priority: P3)

A user wants to cancel a drag operation if they change their mind, by pressing Escape or dragging outside the droppable area.

**Why this priority**: Cancel functionality prevents accidental reordering but is not critical—users can simply move the goal back if reordering happens accidentally.

**Manual Verification**: Can be verified by starting to drag a goal, pressing the Escape key, and confirming the goal returns to its original position without reordering. Also test by dragging outside the column area and releasing.

**Acceptance Scenarios**:

1. **Given** a user is dragging a goal, **When** they press the Escape key, **Then** the drag operation cancels and the goal returns to its original position
2. **Given** a user is dragging a goal, **When** they release the mouse outside the goal list area, **Then** the drag operation cancels and the goal stays in its original position

### Edge Cases

- What happens when dragging a goal to its current position (no change)? The system should handle this gracefully without re-rendering or saving.
- What happens when a user drags very quickly and releases before the drop indicator appears? The system should either complete the drop based on final position or cancel the operation safely.
- What happens when there is only one goal in a column? Dragging should be possible but have no effect on order.
- What happens if the user starts dragging on the checkbox or other interactive elements within the goal card? The drag should only activate when initiated on the card body, not on buttons or checkboxes.
- What happens when goals are filtered or sorted by other criteria? Manual drag-and-drop order should take precedence and disable any automatic sorting (if such features are added in the future).
- What happens if a user presses arrow keys while in keyboard reorder mode when the goal is at the top or bottom of the list? The system should prevent movement beyond list boundaries and provide appropriate feedback (e.g., boundary reached).
- What happens if a user switches from keyboard reorder mode to mouse drag on the same goal? The system should cancel keyboard mode and initiate mouse drag if applicable, or handle the transition gracefully.
- What happens if focus is lost (user clicks elsewhere or tabs away) while a goal is in keyboard reorder mode? The system auto-saves the current position and exits reorder mode, preserving any reordering changes made before focus was lost.

## Assumptions

- Goals in the current app do not have any automatic sorting or filtering features, so drag-and-drop will establish the primary display order
- Storage system (localStorage per existing app design) can accommodate an additional order attribute for each goal
- Users interact with the app on desktop browsers using mouse/trackpad or keyboard only; touch gestures are explicitly out of scope for this feature and deferred to future mobile-specific enhancement
- The drag-and-drop feature applies to all goals equally, regardless of their deadline status or completion state

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to initiate a drag operation by clicking and holding on a goal card
- **FR-002**: System MUST provide visual feedback when a drag operation starts (e.g., cursor change, card opacity change)
- **FR-003**: System MUST display a visual gap between goals showing the insertion point, with goals dynamically shifting to accommodate the space as the user moves the cursor
- **FR-004**: System MUST reorder goals when the user releases the drag over a valid drop position
- **FR-005**: System MUST update the display immediately after a goal is reordered, without requiring a page refresh
- **FR-006**: System MUST persist the new goal order to storage so it survives page reloads
- **FR-007**: System MUST support drag-and-drop reordering in both the active goals column and the completed goals column
- **FR-008**: System MUST maintain separate ordering for active and completed columns (reordering in one does not affect the other)
- **FR-009**: System MUST allow users to cancel a drag operation by pressing the Escape key
- **FR-010**: System MUST cancel the drag operation (no reordering) if the user releases the mouse outside the droppable area
- **FR-011**: System MUST prevent drag operations from interfering with other interactive elements on the goal card (checkboxes, delete buttons)
- **FR-012**: System MUST handle edge cases gracefully (empty lists, single-goal lists, dragging to the same position)
- **FR-013**: System MUST support keyboard navigation, allowing users to focus on goal cards using Tab key
- **FR-014**: System MUST allow keyboard users to enter reorder mode for a focused goal (e.g., by pressing Space or Enter)
- **FR-015**: System MUST allow keyboard users to move a goal up or down using arrow keys (Up/Down arrows) while in reorder mode
- **FR-016**: System MUST allow keyboard users to confirm the new position by pressing Enter
- **FR-017**: System MUST provide visual indication when a goal is in keyboard reorder mode (distinct from mouse drag state)
- **FR-018**: System MUST auto-save the current position and exit reorder mode if focus is lost during keyboard reordering (user clicks elsewhere, tabs away, or switches windows)
- **FR-019**: System MUST animate goal position transitions smoothly using a moderate duration (200-300 milliseconds) to provide clear visual feedback without perceived lag

### Key Entities

- **Goal**: Represents a user goal with attributes including title, description, end date, completion status, and **display order** (new attribute). The display order determines the position of the goal within its column (active or completed).
- **Goal Order**: Represents the sequence of goals within a column. Each goal has an order index or position value that is updated when goals are reordered via drag-and-drop.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can reorder a goal from position 5 to position 1 in under 3 seconds
- **SC-002**: Visual feedback (drag preview and drop indicator) appears within 100 milliseconds of initiating a drag
- **SC-002b**: Goal position transitions complete within 200-300 milliseconds, creating smooth animations that don't feel sluggish
- **SC-003**: Goal order persists correctly across page reloads in 100% of test cases
- **SC-004**: 95% of users successfully reorder goals on their first attempt without errors or confusion
- **SC-005**: Drag-and-drop operations work smoothly with lists containing up to 50 goals without performance degradation
- **SC-006**: Users can cancel drag operations successfully in 100% of attempts using Escape key or dragging outside the drop zone
