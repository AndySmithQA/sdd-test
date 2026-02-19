# Quickstart: Implementing Drag-and-Drop Goal Reordering

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  
**Target Audience**: Developers implementing this feature

## Overview

This guide provides a step-by-step walkthrough for implementing drag-and-drop goal reordering with full keyboard accessibility. Follow these phases in order to ensure proper integration with the existing codebase.

**Estimated Implementation Time**: 8-12 hours

---

## Prerequisites

Before starting, ensure:
- ✅ Existing `src/types/goals.ts` with Goal interface
- ✅ Existing `src/data/goalsStorage.ts` with localStorage operations
- ✅ Existing `src/hooks/useGoals.ts` managing goals state
- ✅ Existing `src/components/GoalCard.tsx` and `GoalColumn.tsx` components
- ✅ Familiarity with React hooks, TypeScript, and CSS transforms

---

## Phase 1: Data Layer (2-3 hours)

### Step 1.1: Extend Goal Type

**File**: `src/types/goals.ts`

Add `displayOrder` field to Goal interface:

```typescript
export interface Goal {
  id: string;
  title: string;
  description?: string;
  endDate: Date;
  status: GoalStatus;
  createdDate: Date;
  displayOrder: number; // NEW: Zero-based position index
}
```

### Step 1.2: Create Drag-Drop Types

**File**: `src/types/dragDrop.ts` (new)

Copy type definitions from [`contracts/types.ts`](contracts/types.ts):
- `DragState`, `KeyboardReorderState`
- `DragHandlers`, `KeyboardReorderHandlers`
- `ReorderOperation`, `ReorderResult`
- Helper type guards

### Step 1.3: Add Display Order Migration

**File**: `src/data/goalsStorage.ts`

Add migration logic to `loadGoals()`:

```typescript
function migrateGoalsToDisplayOrder(goals: StoredGoal[]): StoredGoal[] {
  const needsMigration = goals.some(g => g.displayOrder === undefined);
  
  if (!needsMigration) return goals;
  
  // Sort by createdDate, assign sequential order
  const sorted = [...goals].sort((a, b) => 
    new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
  );
  
  return sorted.map((goal, index) => ({
    ...goal,
    displayOrder: goal.displayOrder ?? index
  }));
}

export function loadGoals(): Goal[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  const parsed: StorageSchema = JSON.parse(stored);
  const migratedGoals = migrateGoalsToDisplayOrder(parsed.goals);
  
  // Save if migrated
  if (parsed.goals !== migratedGoals) {
    saveGoals(migratedGoals.map(deserializeGoal));
  }
  
  return migratedGoals
    .map(deserializeGoal)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}
```

### Step 1.4: Add Reorder Utility

**File**: `src/data/orderUtils.ts` (new)

```typescript
import type { Goal, GoalStatus } from '../types/goals';
import type { ReorderOperation, ReorderResult } from '../types/dragDrop';

export function reorderGoals(
  goals: Goal[], 
  operation: ReorderOperation
): ReorderResult {
  const { fromIndex, toIndex, status } = operation;
  
  // Filter goals by status
  const statusGoals = goals.filter(g => g.status === status);
  const otherGoals = goals.filter(g => g.status !== status);
  
  // Validate indices
  if (fromIndex < 0 || toIndex < 0 || 
      fromIndex >= statusGoals.length || 
      toIndex >= statusGoals.length) {
    return { goals, success: false, error: 'Invalid index' };
  }
  
  // Reorder
  const reordered = [...statusGoals];
  const [moved] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, moved);
  
  // Update displayOrder
  const updated = reordered.map((goal, index) => ({
    ...goal,
    displayOrder: index
  }));
  
  // Merge with other status goals
  const allGoals = [...updated, ...otherGoals]
    .sort((a, b) => a.displayOrder - b.displayOrder);
  
  return { goals: allGoals, success: true };
}
```

**Testing**: Load app, verify existing goals display in order, verify localStorage migration works.

---

## Phase 2: Mouse Drag-and-Drop (3-4 hours)

### Step 2.1: Create Drag Hook

**File**: `src/hooks/useDragAndDrop.ts` (new)

```typescript
import { useState } from 'react';
import type { Goal, GoalStatus } from '../types/goals';
import type { DragState, DragHandlers } from '../types/dragDrop';

export function useDragAndDrop(
  goals: Goal[],
  status: GoalStatus,
  onReorder: (fromIndex: number, toIndex: number) => void
) {
  const [dragState, setDragState] = useState<DragState>({
    draggedGoal: null,
    draggedIndex: null,
    dropTargetIndex: null,
    status
  });
  
  const handlers: DragHandlers = {
    onMouseDown: (goal: Goal) => (e: React.MouseEvent) => {
      e.preventDefault();
      const index = goals.findIndex(g => g.id === goal.id);
      setDragState({
        draggedGoal: goal,
        draggedIndex: index,
        dropTargetIndex: index,
        status
      });
    },
    
    onMouseMove: (index: number) => (e: React.MouseEvent) => {
      if (dragState.draggedGoal) {
        setDragState(prev => ({ ...prev, dropTargetIndex: index }));
      }
    },
    
    onMouseUp: () => {
      if (dragState.draggedGoal && 
          dragState.draggedIndex !== null && 
          dragState.dropTargetIndex !== null &&
          dragState.draggedIndex !== dragState.dropTargetIndex) {
        onReorder(dragState.draggedIndex, dragState.dropTargetIndex);
      }
      setDragState({
        draggedGoal: null,
        draggedIndex: null,
        dropTargetIndex: null,
        status
      });
    },
    
    onMouseLeave: () => {
      setDragState(prev => ({ ...prev, dropTargetIndex: null }));
    }
  };
  
  const isDragging = dragState.draggedGoal !== null;
  
  const getGoalClasses = (goalId: string, index: number): string => {
    const classes: string[] = [];
    
    if (dragState.draggedGoal?.id === goalId) {
      classes.push('dragging');
    }
    
    if (dragState.dropTargetIndex !== null && 
        dragState.draggedIndex !== null) {
      if (index > dragState.draggedIndex && 
          index <= dragState.dropTargetIndex) {
        classes.push('shift-up');
      } else if (index < dragState.draggedIndex && 
                 index >= dragState.dropTargetIndex) {
        classes.push('shift-down');
      }
    }
    
    return classes.join(' ');
  };
  
  return { dragState, handlers, isDragging, getGoalClasses };
}
```

### Step 2.2: Add Drag Styles

**File**: `src/styles/dragDrop.css` (new)

```css
/* Dragged goal appearance */
.goal-card.dragging {
  opacity: 0.5;
  transform: scale(1.02);
  transition: opacity 100ms ease-out, transform 100ms ease-out;
  z-index: 1000;
  cursor: grabbing !important;
}

/* Goals shifting to make space */
.goal-card {
  transform: translateY(0);
  transition: transform 250ms ease-out;
}

.goal-card.shift-down {
  transform: translateY(calc(var(--goal-card-height) + var(--goal-gap)));
}

.goal-card.shift-up {
  transform: translateY(calc(-1 * (var(--goal-card-height) + var(--goal-gap))));
}

/* Drag handle (if using explicit handle) */
.goal-card-drag-handle {
  cursor: grab;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.goal-card-drag-handle:active {
  cursor: grabbing;
}

/* CSS variables - adjust based on actual card size */
:root {
  --goal-card-height: 120px;
  --goal-gap: 16px;
}
```

### Step 2.3: Integrate into GoalColumn Component

**File**: `src/components/GoalColumn.tsx`

```typescript
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { reorderGoals } from '../data/orderUtils';
import '../styles/dragDrop.css';

function GoalColumn({ status, goals, onGoalsChange }) {
  const handleReorder = (fromIndex: number, toIndex: number) => {
    const result = reorderGoals(goals, { fromIndex, toIndex, status });
    if (result.success) {
      onGoalsChange(result.goals);
      // Save to localStorage
      saveGoals(result.goals);
    }
  };
  
  const { handlers, getGoalClasses } = useDragAndDrop(
    goals.filter(g => g.status === status),
    status,
    handleReorder
  );
  
  return (
    <div 
      className="goal-column"
      onMouseUp={handlers.onMouseUp}
      onMouseLeave={handlers.onMouseLeave}
    >
      {goals
        .filter(g => g.status === status)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((goal, index) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            className={getGoalClasses(goal.id, index)}
            onMouseDown={handlers.onMouseDown(goal)}
            onMouseMove={handlers.onMouseMove(index)}
          />
        ))}
    </div>
  );
}
```

**Testing**: Drag goals with mouse, verify visual feedback, verify order persists after reload.

---

## Phase 3: Keyboard Navigation (3-4 hours)

### Step 3.1: Create Keyboard Hook

**File**: `src/hooks/useKeyboardReorder.ts` (new)

```typescript
import { useState, useRef } from 'react';
import type { Goal, GoalStatus } from '../types/goals';
import type { KeyboardReorderState, KeyboardReorderHandlers } from '../types/dragDrop';

export function useKeyboardReorder(
  goals: Goal[],
  status: GoalStatus,
  onReorder: (fromIndex: number, toIndex: number) => void
) {
  const [state, setState] = useState<KeyboardReorderState>({
    active: false,
    goalId: null,
    currentIndex: null,
    originalIndex: null,
    status
  });
  
  const liveRegionRef = useRef<HTMLDivElement>(null);
  
  const announce = (message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
    }
  };
  
  const handlers: KeyboardReorderHandlers = {
    onKeyDown: (goal: Goal, index: number) => (e: React.KeyboardEvent) => {
      // Enter reorder mode
      if ((e.key === ' ' || e.key === 'Enter') && !state.active) {
        e.preventDefault();
        setState({
          active: true,
          goalId: goal.id,
          currentIndex: index,
          originalIndex: index,
          status
        });
        announce(`Reorder mode activated. Use arrow keys to move. Position ${index + 1} of ${goals.length}`);
        return;
      }
      
      // Confirm reorder
      if (e.key === 'Enter' && state.active) {
        e.preventDefault();
        if (state.originalIndex !== state.currentIndex) {
          onReorder(state.originalIndex!, state.currentIndex!);
          announce(`Goal moved to position ${state.currentIndex! + 1}`);
        }
        setState({ active: false, goalId: null, currentIndex: null, originalIndex: null, status });
        return;
      }
      
      // Cancel reorder
      if (e.key === 'Escape' && state.active) {
        e.preventDefault();
        setState({ active: false, goalId: null, currentIndex: null, originalIndex: null, status });
        announce('Reorder cancelled');
        return;
      }
      
      // Move up/down
      if (state.active && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        const direction = e.key === 'ArrowUp' ? -1 : 1;
        const newIndex = Math.max(0, Math.min(goals.length - 1, state.currentIndex! + direction));
        
        if (newIndex !== state.currentIndex) {
          setState(prev => ({ ...prev, currentIndex: newIndex }));
          announce(`Position ${newIndex + 1} of ${goals.length}`);
        } else {
          announce(direction === -1 ? 'At top of list' : 'At bottom of list');
        }
      }
    },
    
    onFocus: (goal: Goal, index: number) => () => {
      // Focus management if needed
    },
    
    onBlur: () => {
      // Auto-save on focus loss
      if (state.active && state.originalIndex !== state.currentIndex) {
        onReorder(state.originalIndex!, state.currentIndex!);
      }
      setState({ active: false, goalId: null, currentIndex: null, originalIndex: null, status });
    }
  };
  
  const getAriaLabel = (goal: Goal, index: number, totalCount: number): string => {
    return `${goal.title}. Position ${index + 1} of ${totalCount}. Press Space to reorder.`;
  };
  
  return {
    reorderState: state,
    handlers,
    isReordering: state.active,
    getAriaLabel,
    liveRegionRef
  };
}
```

### Step 3.2: Add Keyboard Styles

**File**: `src/styles/dragDrop.css` (append)

```css
/* Keyboard reorder mode */
.goal-card.reorder-mode {
  outline: 3px solid var(--primary-color);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.2);
}

.goal-card.pending-position {
  background-color: rgba(var(--primary-rgb), 0.1);
  border-left: 4px solid var(--primary-color);
}

/* Focus visible for keyboard users */
.goal-card:focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}

/* ARIA live region (visually hidden) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border-width: 0;
}
```

### Step 3.3: Integrate into GoalColumn

**File**: `src/components/GoalColumn.tsx` (enhance)

```typescript
import { useKeyboardReorder } from '../hooks/useKeyboardReorder';

function GoalColumn({ status, goals, onGoalsChange }) {
  // ... existing drag-drop code ...
  
  const { 
    handlers: keyboardHandlers, 
    getAriaLabel, 
    liveRegionRef,
    reorderState 
  } = useKeyboardReorder(
    goals.filter(g => g.status === status),
    status,
    handleReorder
  );
  
  return (
    <div className="goal-column">
      {/* ARIA live region for screen readers */}
      <div 
        ref={liveRegionRef} 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      />
      
      {goals
        .filter(g => g.status === status)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((goal, index) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            className={getGoalClasses(goal.id, index)}
            onMouseDown={handlers.onMouseDown(goal)}
            onMouseMove={handlers.onMouseMove(index)}
            onKeyDown={keyboardHandlers.onKeyDown(goal, index)}
            onBlur={keyboardHandlers.onBlur}
            tabIndex={0}
            role="button"
            aria-label={getAriaLabel(goal, index, goals.length)}
            aria-pressed={reorderState.goalId === goal.id}
          />
        ))}
    </div>
  );
}
```

**Testing**: Tab through goals, Space to activate, arrows to move, Enter to confirm, Escape to cancel.

---

## Phase 4: Responsive & Polish (1-2 hours)

### Step 4.1: Responsive Handling

**File**: `src/styles/dragDrop.css` (append)

```css
/* Desktop: show drag handle */
@media (min-width: 1024px) {
  .goal-card-drag-handle {
    display: flex;
  }
}

/* Tablet/Mobile: hide drag handle */
@media (max-width: 1023px) {
  .goal-card-drag-handle {
    display: none;
  }
}
```

### Step 4.2: Touch Detection

**File**: `src/hooks/useDragAndDrop.ts` (enhance)

```typescript
export function useDragAndDrop(...args) {
  const isTouchDevice = 'ontouchstart' in window;
  
  // Disable drag handlers on touch-only devices
  if (isTouchDevice) {
    return {
      dragState: { /* null state */ },
      handlers: { /* no-op handlers */ },
      isDragging: false,
      getGoalClasses: () => ''
    };
  }
  
  // ... rest of hook implementation ...
}
```

**Testing**: Test on desktop, tablet with keyboard, verify mobile shows hint but disables drag.

---

## Manual Verification Checklist

Use this checklist to verify the feature meets spec requirements:

### Mouse Drag-and-Drop (User Story 1)
- [ ] Click and hold goal card initiates drag (opacity changes)
- [ ] Moving cursor over other goals shows visual gap
- [ ] Goals smoothly shift position (200-300ms animation)
- [ ] Release drops goal at new position
- [ ] Order persists after page reload
- [ ] Dragging outside column cancels operation

### Visual Feedback (User Story 2)
- [ ] Dragged goal shows reduced opacity
- [ ] Visual gap opens between goals
- [ ] Gap follows cursor smoothly
- [ ] No jarring layout shifts

### Keyboard Navigation (User Story 3)
- [ ] Tab moves focus through goals with visible indicator
- [ ] Space/Enter activates reorder mode
- [ ] Up/Down arrows move goal
- [ ] Screen reader announces position changes
- [ ] Enter confirms new position
- [ ] Escape cancels and restores original position
- [ ] Focus loss auto-saves current position

### Both Columns (User Story 4)
- [ ] Active column reordering works
- [ ] Completed column reordering works
- [ ] Order is independent per column

### Edge Cases
- [ ] Single goal list handles drag gracefully
- [ ] Empty list doesn't break
- [ ] Dragging to same position is no-op
- [ ] Boundary detection (can't move past top/bottom)

---

## Troubleshooting

**Issue**: Visual gap animation is jumpy  
**Fix**: Ensure CSS transforms are used, not margin/padding. Check `transition` property is set correctly.

**Issue**: Keyboard reorder doesn't work  
**Fix**: Verify `tabIndex={0}` and `role="button"` are on goal cards. Check `onKeyDown` handler is bound.

**Issue**: Order doesn't persist  
**Fix**: Verify `saveGoals()` is called after reorder. Check localStorage migration ran successfully.

**Issue**: Focus is lost during keyboard reorder  
**Fix**: Verify `onBlur` handler includes auto-save logic.

---

## Next Steps

After implementation:
1. Run through manual verification checklist
2. Test across browsers (Chrome, Firefox, Safari, Edge)
3. Test keyboard navigation with screen reader
4. Test responsive behavior at breakpoints (320px, 768px, 1024px)
5. Code review focusing on clean code principles from constitution
6. Update README with new feature documentation

**Questions?** Refer to:
- [spec.md](spec.md) for requirements
- [data-model.md](data-model.md) for entity details
- [research.md](research.md) for technical decisions
- [contracts/types.ts](contracts/types.ts) for TypeScript contracts
