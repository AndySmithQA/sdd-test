# Feature Specification: Goal Tracking Web App (doit)

**Feature Branch**: `001-doit-app`  
**Created**: 2026-02-19  
**Status**: Draft  
**Input**: Goal tracking web app with two-column layout, goal management via modal, deadline highlighting, and modern pastel theme

## Clarifications

### Session 2026-02-19
- Q: How should goals be persisted across reloads? → A: Persist goals in browser localStorage.

## User Scenarios *(mandatory)*

### User Story 1 - Create New Goal (Priority: P1)

A user wants to add a new goal they want to achieve within a specific timeframe. They click an "Add Goal" button, fill in the goal details (title, end date, description), and submit the form to create the goal.

**Why this priority**: Goal creation is the foundational action—without this, users cannot use the application. All other features depend on having goals in the system.

**Manual Verification**: Can be verified by clicking "Add Goal" button, entering test data (e.g., title: "Learn React", end date: 5 days from now, description: "Build a React component"), submitting the form, and confirming the goal appears in the active goals column on the left.

**Acceptance Scenarios**:

1. **Given** the user is on the doit main page, **When** they click the "Add Goal" button, **Then** a modal form appears with fields for title, end date, and description
2. **Given** the modal is open, **When** the user enters valid goal details and clicks "Submit", **Then** the modal closes and the goal appears in the active goals left column
3. **Given** the modal is open, **When** the user clicks "Cancel" or clicks outside the modal, **Then** the modal closes without creating a goal
4. **Given** the user submits a goal form, **When** the end date is within 3 days from today, **Then** the goal displays with a highlighted/warning style in the active column

---

### User Story 2 - View Active Goals with Days Remaining (Priority: P1)

A user wants to see all their active (incomplete) goals and quickly know how many days they have left to achieve each goal.

**Why this priority**: This is core to the app's value—users need immediate visibility into their active goals and urgency. Without this, they cannot make decisions about which goals to prioritize.

**Manual Verification**: Can be verified by creating a few test goals with different end dates (some in 1 day, some in 7 days, some in 30 days), viewing the left column, and confirming each goal displays with the correct day count calculated from today's date.

**Acceptance Scenarios**:

1. **Given** the user has multiple active goals, **When** they view the app, **Then** all active goals appear in the left column
2. **Given** a goal is active, **When** the user views it, **Then** it displays the number of days remaining until the end date (e.g., "5 days left")
3. **Given** a goal has 0 days remaining (today is the end date), **When** the user views it, **Then** it displays "Due today"
4. **Given** a goal's end date is today or in the past, **When** the user views it, **Then** it displays in a warning/expired state (user can see it's overdue)

---

### User Story 3 - Complete and Move Goals to Completed Column (Priority: P1)

A user wants to mark a goal as complete by checking a checkbox, then move it to the completed column to celebrate progress and keep active goals visible.

**Why this priority**: Moving completed goals to a separate column is core to the two-column layout and allows users to see achievement while maintaining focus on active goals.

**Manual Verification**: Can be verified by checking a checkbox next to an active goal, confirming a "Move to Completed" action appears or is auto-triggered, and verifying the goal moves from the left column to the right column while maintaining all goal details (title, description, end date).

**Acceptance Scenarios**:

1. **Given** a goal is in the active column, **When** the user checks its checkbox, **Then** the goal displays a checked state and an action menu or confirmation appears
2. **Given** a goal is checked, **When** the user selects "Move to Completed", **Then** the goal moves from the left column to the right column
3. **Given** a goal is in the completed column, **When** the user views it, **Then** it displays all original details (title, end date, description) and shows a checkmark or completed indicator
4. **Given** the user completes a goal, **When** the goal moves to the right column, **Then** the left column updates immediately to show one fewer active goal

---

### User Story 4 - Delete a Goal (Priority: P2)

A user wants to permanently remove a goal from the system when they decide it's no longer relevant, either from the active or completed column.

**Why this priority**: Goal deletion is important for app maintenance and user control, but secondary to core goal management. It prevents clutter and allows users to refocus.

**Manual Verification**: Can be verified by checking a goal (either active or completed), selecting "Delete" option, confirming the deletion, and verifying the goal is completely removed from the column and does not reappear on page refresh.

**Acceptance Scenarios**:

1. **Given** a goal is checked in either column, **When** the user selects "Delete", **Then** a confirmation dialog appears asking "Are you sure?"
2. **Given** the confirmation dialog is shown, **When** the user confirms deletion, **Then** the goal is removed from the column permanently
3. **Given** the goal is deleted, **When** the user has other goals, **Then** the remaining goals stay in place and no column is empty (unless it should be)

---

### User Story 5 - Highlight Upcoming Deadline Goals (Priority: P2)

A user wants visual indicators for goals that are due within 3 days so they can prioritize urgent work without manually calculating dates.

**Why this priority**: Deadline highlighting improves UX by drawing attention to urgent goals. It supports decision-making and motivation but is secondary to core goal management.

**Manual Verification**: Can be verified by creating goals with end dates at 1 day, 2 days, 3 days, and 4 days from today, viewing the active column, and confirming that goals due within 3 days display in a distinct highlighted style (e.g., warmer pastel color, border highlight) while goals with 4+ days do not.

**Acceptance Scenarios**:

1. **Given** a goal's end date is 1-3 days from today, **When** the user views the active column, **Then** the goal displays with a highlighted/warning style (e.g., peachy or coral pastel background)
2. **Given** a goal's end date is more than 3 days away, **When** the user views the active column, **Then** the goal displays in standard styling without highlight
3. **Given** a goal's end date has passed, **When** the user views the active column, **Then** the goal displays in an expired/overdue style distinct from the 3-day warning

---

### User Story 6 - Responsive Design Across Devices (Priority: P2)

A user wants the app to work well on mobile, tablet, and desktop without losing functionality or readability.

**Why this priority**: Responsive design ensures the app is accessible across devices. While less core than P1 goals (create/view/complete), it's essential for a modern web app and should be verified during development.

**Manual Verification**: Can be verified by opening the app on three different screen sizes (mobile ~375px width, tablet ~768px width, desktop ~1200px width) and confirming the two-column layout adapts appropriately (stacks on mobile, adjusts spacing on tablet, full side-by-side on desktop), buttons are clickable, modal is usable, and all text is readable.

**Acceptance Scenarios**:

1. **Given** the user views the app on a mobile device (320px-480px width), **When** they interact with the layout, **Then** columns stack vertically or adapt to single-column mode appropriately
2. **Given** the user views the app on a tablet (768px-1024px width), **When** they view the columns, **Then** both columns visible with adjusted spacing/padding
3. **Given** the user views the app on desktop (1200px+), **When** they view the layout, **Then** two columns display side-by-side in full width layout as designed

---

### Edge Cases

- What happens when a user reloads the page? → Goals persist (implementation detail for backend/storage)
- How does the system handle a goal with no description? → Goal is displayable with empty description field; not required
- What happens if a user creates a goal with end date in the past? → System allows it, goal displays as expired/overdue immediately
- What if the user deletes a goal then closes the page? → Deletion is permanent; goal does not reappear on reload
- How does the system handle goals created extremely far in the future (years away)? → Displays normally; no UI breakage

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create new goals with title, end date, and optional description through a modal form
- **FR-002**: System MUST display active goals in a left column showing goal title, description, and calculated days remaining
- **FR-003**: System MUST calculate and display days remaining for each active goal as "X days left", "Due today", or "Overdue" based on end date
- **FR-004**: System MUST provide a checkbox or selection mechanism for each goal to mark it for action (move to completed or delete)
- **FR-005**: System MUST allow users to move a checked goal from active column to completed column with a single action
- **FR-006**: System MUST display completed goals in a right column preserving all goal details (title, description, end date)
- **FR-007**: System MUST allow permanent deletion of goals with confirmation dialog before removal
- **FR-008**: System MUST highlight goals with end date within 3 days in a visually distinct way (e.g., pastel color highlight)
- **FR-009**: System MUST persist goals in browser localStorage (data must survive page reload)
- **FR-010**: System MUST display Add Goal button prominently on the main page
- **FR-011**: System MUST close the goal creation modal on form submission or user cancellation
- **FR-012**: System MUST prevent form submission with missing required fields (title and end date)
- **FR-013**: System MUST be responsive and functional on mobile (320px+), tablet (768px+), and desktop (1200px+) viewports
- **FR-014**: System MUST use Bootstrap 5 grid system for responsive layout
- **FR-015**: System MUST use a modern light theme with pastel color palette (avoid bright/harsh colors)

### Key Entities

- **Goal**: Represents a user-defined objective with time constraint
  - title (required, string): Name of the goal
  - description (optional, string): Details about the goal
  - endDate (required, date): Target completion date
  - status (required, enum): "active" or "completed"
  - createdDate (required, date): When the goal was created
  - daysRemaining (calculated): Number of days from today until endDate

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User can create a goal with title, end date, and description from empty app state in under 60 seconds on first use
- **SC-002**: All active goals display correctly with accurate day count (within 1-day margin for timezone edge cases)
- **SC-003**: 100% of goals with end date ≤3 days away display highlighted visual indicator as designed
- **SC-004**: User can move complete goal from active to completed column with single verified action per goal (<3 clicks)
- **SC-005**: Goal deletion is permanent—deleted goals do not reappear after page reload
- **SC-006**: App responds to user interactions (button clicks, form submission) within 500ms
- **SC-007**: Layout is fully functional and readable on three test device sizes (mobile, tablet, desktop) without horizontal scrolling on mobile
- **SC-008**: Modal form is usable on mobile devices (buttons clickable, text readable, fields accessible without zoom)
- **SC-009**: Color contrast meets WCAG AA standards for readability on light pastel background
- **SC-010**: User satisfaction: 90% of test users successfully complete create/move/delete workflows independently

---

## Assumptions

- Goals are stored in browser localStorage
- Users access the app from modern browsers (Chrome, Safari, Firefox, Edge) that support ES6+ and Bootstrap 5
- "Days remaining" calculation treats today as day 0; if end date is today, display "Due today"
- Pastel color palette includes: soft blues, soft greens, soft pinks, soft peachy tones; specific hex values to be defined in design phase
- Modal form validation happens client-side; no server-side validation specified (can be added later)
- No user authentication or multi-user sync required for this MVP spec

---

## Open Design Decisions

- **Goal Editing**: Can users edit existing goals? (P3 feature for future consideration)
- **Goal Categories/Tags**: Should goals be grouped by category or tagged? (P3 feature for future consideration)
- **Recurring Goals**: Should goals support recurring patterns (daily, weekly)? (Out of scope for MVP)
- **Exact Highlight Color**: Which pastel color for 3-day warning? (To be confirmed in design phase)
