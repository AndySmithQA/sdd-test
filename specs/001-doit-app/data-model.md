# Data Model: Goal Tracking Web App (doit)

## Entities

### Goal
Represents a user-defined objective with a target date.

**Fields**:
- `id` (string, required): Unique identifier
- `title` (string, required): Goal title
- `description` (string, optional): Details about the goal
- `endDate` (string, required): ISO date string (YYYY-MM-DD)
- `status` (enum, required): `active` | `completed`
- `createdDate` (string, required): ISO date string (YYYY-MM-DD)

**Derived Fields (UI-only)**:
- `daysRemaining` (number): Calendar days between today and `endDate`
- `isDueSoon` (boolean): `true` when `daysRemaining` is between 1 and 3 inclusive
- `isOverdue` (boolean): `true` when `daysRemaining` < 0
- `isDueToday` (boolean): `true` when `daysRemaining` == 0

## Validation Rules

- `title` is required, trimmed, and must be 1-100 characters.
- `endDate` is required and must be a valid date string in `YYYY-MM-DD` format.
- `description` is optional and must be <= 500 characters if provided.
- `status` must be `active` or `completed`.
- `createdDate` is required and uses local date in `YYYY-MM-DD` format.

## State Transitions

- `active` -> `completed` when user moves a checked goal to completed.
- `active` -> deleted when user deletes a checked active goal.
- `completed` -> deleted when user deletes a checked completed goal.

## Relationships

- No relationships; all goals are stored in a flat list for a single user.
