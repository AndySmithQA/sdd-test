# Data Model: Drag-and-Drop Goal Reordering

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md) | **Research**: [research.md](research.md)  
**Date**: 2026-02-19

## Overview

This feature extends the existing Goal entity with a display order attribute and introduces drag-and-drop state entities for managing reorder operations. The data model maintains backward compatibility with existing localStorage data while adding new fields for order management.

## Core Entities

### Goal (Enhanced)

Represents a user's goal with display order for manual reordering.

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string (UUID v4) | Yes | Unique identifier | Generated via uuid library |
| `title` | string | Yes | Goal title | 1-100 characters |
| `description` | string | No | Optional goal description | Max 500 characters |
| `endDate` | Date | Yes | Target completion date | Must be valid date |
| `status` | 'active' \| 'completed' | Yes | Current goal status | Enum: active or completed |
| `createdDate` | Date | Yes | Creation timestamp | Auto-generated, UTC |
| **`displayOrder`** | number | **Yes (new)** | **Position in column (0-based index)** | **Non-negative integer, unique within status** |

**Changes from Existing**:
- **Added `displayOrder`** field (integer) to track position within active or completed column
- Field is required for new goals, optional in storage for backward compatibility (migration auto-assigns)
- Display order is separate per status group (active goals have order 0-N, completed goals have separate order 0-M)

**Relationships**:
- Goals are grouped by `status` (active vs completed)
- Within each group, goals are ordered by `displayOrder` (ascending)
- No explicit parent-child relationships between goals

**Invariants**:
- Within each status group, `displayOrder` values should be sequential (0, 1, 2, ...) without gaps
- When a goal changes status (active → completed), both groups' display orders are recalculated
- Display order is NOT globally unique (goal A in active column can have same order as goal B in completed column)

**Storage Schema**:
```typescript
// localStorage: "goals:v1"
interface StoredGoal {
  id: string;
  title: string;
  description?: string;
  endDate: string;        // ISO string
  status: 'active' | 'completed';
  createdDate: string;    // ISO string
  displayOrder: number;   // NEW field
}

interface StorageSchema {
  version: 1;
  goals: StoredGoal[];
}
```

**Migration**:
- Existing goals without `displayOrder` are migrated on load
- Migration assigns order based on `createdDate` (oldest = order 0, newest = order N-1)
- Migration happens automatically and transparently per [research.md R4](research.md#r4-localstorage-schema-migration-for-display-order-field)

---

### DragState (Runtime State)

Represents the current drag-and-drop operation state (not persisted).

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `draggedGoal` | Goal \| null | Yes | The goal currently being dragged, or null if no drag active |
| `draggedIndex` | number \| null | Yes | Original index of dragged goal, or null |
| `dropTargetIndex` | number \| null | Yes | Current drop target index as cursor moves, or null |
| `status` | 'active' \| 'completed' | No | Which column the drag is happening in |

**Lifecycle**:
- **Initialized**: `null` values when component mounts
- **Drag Start**: Set `draggedGoal`, `draggedIndex`, `status` on mouse down
- **Drag Move**: Update `dropTargetIndex` as mouse moves over other goals
- **Drag End**: Execute reorder, reset all to `null`
- **Drag Cancel**: Reset all to `null` without reordering

**Usage**:
- Managed by `useDragAndDrop` custom hook
- Provides data for visual feedback (drag preview, visual gaps)
- Determines which goals should shift position during drag

---

### KeyboardReorderState (Runtime State)

Represents keyboard-based reordering state (not persisted).

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `active` | boolean | Yes | True if keyboard reorder mode is active |
| `goalId` | string \| null | Yes | ID of goal in reorder mode, or null |
| `currentIndex` | number \| null | Yes | Current position during reordering |
| `originalIndex` | number \| null | Yes | Starting position (for cancel/restore) |
| `status` | 'active' \| 'completed' | No | Which column the reorder is in |

**Lifecycle**:
- **Inactive**: `active: false`, all other fields `null`
- **Mode Enter**: User presses Space/Enter on focused goal → set `active: true`, capture goal and index
- **Position Change**: Arrow keys update `currentIndex`, visual feedback shows new position
- **Confirm**: Enter key → persist new order, reset to inactive
- **Cancel**: Escape key → restore `originalIndex`, reset to inactive
- **Focus Loss**: Auto-save at `currentIndex`, reset to inactive

**Usage**:
- Managed by `useKeyboardReorder` custom hook
- Provides data for visual indicators (highlight goal in reorder mode, show pending position)
- Determines ARIA live region announcements ("Goal moved to position 3 of 5")

---

## Data Operations

### Reorder Goals

Reorders goals within the same status group.

**Input**:
- `goals`: Goal[] - Current goals list
- `fromIndex`: number - Source position
- `toIndex`: number - Destination position
- `status`: 'active' | 'completed' - Which column

**Process**:
1. Filter goals by status
2. Remove goal at `fromIndex`
3. Insert goal at `toIndex`
4. Recalculate `displayOrder` for all goals in group (sequential 0, 1, 2, ...)
5. Persist updated goals to localStorage

**Output**:
- Updated Goal[] with new displayOrder values

**Validation**:
- `fromIndex` and `toIndex` must be valid indices
- Goals remain within same status group (no cross-column drag in this feature)

---

### Change Goal Status (Enhanced)

Updates goal status and recalculates display orders.

**Input**:
- `goalId`: string
- `newStatus`: 'active' | 'completed'

**Process**:
1. Find goal by ID
2. Update status field
3. Remove from source status group, recalculate source group display orders
4. Add to destination status group at end, recalculate destination group display orders
5. Persist to localStorage

**Output**:
- Updated Goal[] with recalculated displayOrder across both status groups

---

## Validation Rules

### Display Order Integrity

**Rules**:
- Within each status group, display orders MUST be sequential starting from 0
- No duplicate display orders within the same status group
- Display orders MUST be non-negative integers

**Enforcement**:
- On reorder: Recalculate entire group sequentially
- On status change: Recalculate both source and destination groups
- On goal creation: Assign `displayOrder = max(currentOrders) + 1`
- On goal deletion: Recalculate remaining group sequentially

**Recovery**:
If display order integrity is violated (e.g., gaps, duplicates), run normalization:
```typescript
function normalizeDisplayOrder(goals: Goal[]): Goal[] {
  return goals
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((goal, index) => ({ ...goal, displayOrder: index }));
}
```

---

## State Transitions

### Goal Lifecycle with Display Order

```
[New Goal Created]
    ↓
[Assign displayOrder = lastOrder + 1]
    ↓
[Goal in Active Column] ←→ [User Reorders] ←→ [Update displayOrder]
    ↓
[User Completes Goal]
    ↓
[Status: active → completed, recalculate display orders in both columns]
    ↓
[Goal in Completed Column] ←→ [User Reorders] ←→ [Update displayOrder]
    ↓
[User Deletes Goal]
    ↓
[Recalculate displayOrder for remaining goals in group]
    ↓
[Goal Removed]
```

---

## Performance Considerations

**Read Operations**:
- Loading goals: O(n) deserialize from localStorage + O(n log n) sort by displayOrder
- Filtering by status: O(n) single pass
- Expected: <10ms for typical 50 goals

**Write Operations**:
- Reorder within column: O(n) recalculate orders + O(n) serialize to localStorage
- Status change: O(n) for both groups recalculation
- Expected: <20ms for typical 50 goals

**Constraints**:
- Max goals: 50 per column (100 total) per spec
- localStorage limit: ~5-10MB typical (sufficient for thousands of goals)
- Visual updates: Debounced during drag to avoid excessive renders

---

## Data Model Summary

**New Fields**: 1 (`displayOrder` on Goal)  
**New Entities**: 2 runtime state entities (DragState, KeyboardReorderState)  
**Modified Operations**: 3 (reorder, status change, goal creation)  
**Storage Impact**: Additive migration, backward compatible, ~4 bytes per goal (integer)

This data model supports the feature requirements while maintaining simplicity and backward compatibility with existing data.
