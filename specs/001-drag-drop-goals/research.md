# Research: Drag-and-Drop Goal Reordering

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  
**Date**: 2026-02-19

## Research Questions

### R1: Native Drag-and-Drop Implementation in React (No External Libraries)

**Question**: What are the best practices for implementing mouse-based drag-and-drop using native browser events in React, without relying on external libraries like react-dnd or dnd-kit?

**Decision**: Implement using React's synthetic event system with `onMouseDown`, `onMouseMove`, `onMouseUp` handlers combined with state management for drag state.

**Rationale**:
- **Performance**: Native events avoid library overhead and bundle size increase
- **Control**: Full control over drag behavior, visual feedback, and animations
- **Simplicity**: Minimal dependencies principle from constitution
- **React Integration**: Synthetic events integrate seamlessly with React state and lifecycle

**Implementation Pattern**:
```typescript
// Custom hook for drag-and-drop
function useDragAndDrop(items: Goal[], onReorder: (newOrder: Goal[]) => void) {
  const [draggedItem, setDraggedItem] = useState<Goal | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  
  const handleMouseDown = (item: Goal) => (e: React.MouseEvent) => {
    e.preventDefault();
    setDraggedItem(item);
  };
  
  const handleMouseMove = (index: number) =>  (e: React.MouseEvent) => {
    if (draggedItem) {
      setDropTargetIndex(index);
    }
  };
  
  const handleMouseUp = () => {
    if (draggedItem && dropTargetIndex !== null) {
      // Reorder logic here
      onReorder(reorderedItems);
    }
    setDraggedItem(null);
    setDropTargetIndex(null);
  };
  
  return { draggedItem, dropTargetIndex, handleMouseDown, handleMouseMove, handleMouseUp };
}
```

**Alternatives Considered**:
- HTML5 Drag and Drop API (`draggable` attribute): Rejected due to limited customization for visual gap feedback and inconsistent browser behavior
- External libraries (react-dnd, dnd-kit): Rejected per Minimal Dependencies principle; adds 50-200KB bundle size for functionality achievable with native events

---

### R2: Keyboard Navigation for Drag-and-Drop (WCAG Compliance)

**Question**: What keyboard interaction patterns ensure WCAG 2.1 Level AA compliance for drag-and-drop reordering functionality?

**Decision**: Implement "Reorder Mode" pattern: Tab to focus goal → Space/Enter to activate reorder mode → Up/Down arrows to move → Enter to confirm / Escape to cancel.

**Rationale**:
- **WCAG 2.1.1 (Keyboard)**: All functionality available via keyboard
- **WCAG 2.4.3 (Focus Order)**: Logical Tab order through goal cards
- **WCAG 2.4.7 (Focus Visible)**: Clear visual focus indicators during navigation and reorder mode
- **Common Pattern**: Matches keyboard reordering in file explorers, email clients, task managers

**Implementation Pattern**:
```typescript
function useKeyboardReorder(items: Goal[], onReorder: (newOrder: Goal[]) => void) {
  const [reorderMode, setReorderMode] = useState<{ active: boolean; itemId: string | null }>({ 
    active: false, 
    itemId: null 
  });
  const [pendingPosition, setPendingPosition] = useState<number | null>(null);
  
  const handleKeyDown = (item: Goal, currentIndex: number) => (e: React.KeyboardEvent) => {
    // Space/Enter: Toggle reorder mode
    if (e.key === ' ' || e.key === 'Enter') {
      if (!reorderMode.active) {
        e.preventDefault();
        setReorderMode({ active: true, itemId: item.id });
        setPendingPosition(currentIndex);
      } else {
        // Confirm reorder
        confirmReorder();
      }
    }
    
    // Arrow keys: Move in reorder mode
    if (reorderMode.active && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      const direction = e.key === 'ArrowUp' ? -1 : 1;
      const newPosition = Math.max(0, Math.min(items.length - 1, pendingPosition! + direction));
      setPendingPosition(newPosition);
      // Visual feedback: highlight new position
    }
    
    // Escape: Cancel reorder
    if (e.key === 'Escape' && reorderMode.active) {
      setReorderMode({ active: false, itemId: null });
      setPendingPosition(null);
    }
  };
  
  return { reorderMode, pendingPosition, handleKeyDown };
}
```

**ARIA Attributes Required**:
- `role="button"` on goal cards to indicate interactivity
- `aria-label` describing reorder capability (e.g., "Goal: Learn React. Press Space to reorder")
- `aria-pressed` or `aria-selected` when in reorder mode
- `aria-live="polite"` region announcing position changes ("Goal moved to position 2 of 5")

**Alternatives Considered**:
- Drag gestures with keyboard (press Space, then arrow keys without mode): Rejected due to confusing state management and lack of clear "commit" action
- Context menu approach (right-click → Move Up/Down): Rejected as not intuitive for keyboard-only users

---

### R3: Visual Gap Animation Performance (200-300ms Target)

**Question**: How should goal cards animate position changes to create smooth visual gaps during drag operations while maintaining 60fps performance?

**Decision**: Use CSS transforms (`translateY`) with `transition: transform 250ms ease-out` for goal position shifts. Avoid layout recalculations by using transforms instead of margin/padding changes.

**Rationale**:
- **GPU Acceleration**: CSS transforms trigger GPU compositing, avoiding main thread layout calculations
- **60fps Target**: 250ms animation at 60fps = 15 frames, smooth enough for visual clarity
- **Browser Optimization**: Modern browsers heavily optimize CSS transforms
- **Spec Compliance**: Falls within 200-300ms requirement from spec

**Implementation Pattern**:
```css
/* dragDrop.css */
.goal-card {
  transform: translateY(0);
  transition: transform 250ms ease-out;
}

.goal-card.shift-down {
  transform: translateY(var(--goal-card-height-with-gap));
}

.goal-card.shift-up {
  transform: translateY(calc(-1 * var(--goal-card-height-with-gap)));
}

.goal-card.dragging {
  opacity: 0.5;
  transform: scale(1.02);
  transition: opacity 100ms ease-out, transform 100ms ease-out;
  z-index: 1000;
}
```

**JavaScript Pattern**:
```typescript
// Calculate shift direction based on drop target
function calculateShiftTransform(currentIndex: number, dropTargetIndex: number): string {
  if (currentIndex < dropTargetIndex) return 'shift-down';
  if (currentIndex > dropTargetIndex) return 'shift-up';
  return '';
}
```

**Performance Considerations**:
- Limit to 50 goals per column (spec requirement) - acceptable performance
- Use `will-change: transform` sparingly (only on dragged item during drag)
- Debounce mouse move events if performance issues arise (unlikely with transform-based approach)

**Alternatives Considered**:
- CSS animations with `@keyframes`: Rejected due to less flexible timing control and harder to coordinate with React state
- `margin-top`/`margin-bottom` changes: Rejected due to layout thrashing and poor performance (forces reflow)
- JavaScript-based animation (requestAnimationFrame): Rejected as unnecessarily complex versus CSS transitions

---

### R4: localStorage Schema Migration for Display Order Field

**Question**: How should we add the `displayOrder` field to existing Goal entities in localStorage without breaking existing data or requiring users to clear storage?

**Decision**: Implement additive migration strategy: detect missing `displayOrder` field, auto-assign sequential order based on creation date (oldest first), persist updated schema.

**Rationale**:
- **Non-Breaking**: Existing goals without `displayOrder` remain valid
- **Automatic Migration**: Happens transparently on app load
- **Preservation**: User's existing goals unaffected; order defaults to creation date order (intuitive)
- **Version Control**: Storage schema already versioned (`goals:v1`), can track migration status

**Implementation Pattern**:
```typescript
// goalsStorage.ts enhancement
interface StoredGoalV1 extends StoredGoal {
  displayOrder?: number; // Optional for backward compatibility
}

function migrateGoalsToDisplayOrder(goals: StoredGoalV1[]): StoredGoalV1[] {
  // Check if migration needed
  const needsMigration = goals.some(g => g.displayOrder === undefined);
  
  if (!needsMigration) return goals;
  
  // Sort by createdDate (oldest first) and assign sequential order
  const sorted = [...goals].sort((a, b) => 
    new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
  );
  
  return sorted.map((goal, index) => ({
    ...goal,
    displayOrder: goal.displayOrder ?? index // Preserve existing order if present
  }));
}

// In loadGoals function:
export function loadGoals(): Goal[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  const parsed: StorageSchema = JSON.parse(stored);
  
  // Apply migration
  const migratedGoals = migrateGoalsToDisplayOrder(parsed.goals);
  
  // Save back if migrated
  if (parsed.goals !== migratedGoals) {
    saveGoals(migratedGoals.map(deserializeGoal));
  }
  
  return migratedGoals
    .map(deserializeGoal)
    .sort((a, b) => a.displayOrder - b.displayOrder); // Always sort by display order
}
```

**Migration Logic**:
1. Load goals from localStorage
2. Check each goal for `displayOrder` field
3. If missing: sort by `createdDate`, assign sequential integers (0, 1, 2, ...)
4. If present: preserve existing order
5. Save updated goals back to localStorage
6. Return goals sorted by `displayOrder`

**Rollback Strategy**: If migration causes issues, users can clear localStorage (acceptable for single-user browser app). No server-side data loss risk.

**Alternatives Considered**:
- Bump storage version to `goals:v2`: Rejected as unnecessarily disruptive; `displayOrder` is additive, not breaking
- Separate storage key for order data: Rejected due to added complexity and sync issues between two storage locations
- Lazy migration (only migrate on first reorder): Rejected because pre-existing goals need order for initial render

---

### R5: Responsive Design Strategy for Desktop-Only Interaction

**Question**: How should the drag-and-drop UI behave on mobile/tablet viewports when touch interactions are explicitly not supported in this feature?

**Decision**: UI remains fully visible and functional on all viewports (mobile 320px+, tablet 768px+, desktop 1024px+) with visual indicators that reordering requires mouse or keyboard. On touch devices, users can still view and manage goals normally, but reordering is disabled with a subtle affordance hint.

**Rationale**:
- **Progressive Degradation**: Feature works best on desktop but doesn't break mobile layout
- **Constitution Compliance**: Responsive design principle requires all viewports work, even if feature subset differs
- **User Communication**: Clear messaging prevents confusion on touch devices
- **Future-Proof**: When touch support added later, UI structure already responsive

**Implementation Pattern**:
```css
/* Desktop: show drag handle */
@media (min-width: 1024px) {
  .goal-card-drag-handle {
    display: flex;
    cursor: grab;
  }
  
  .goal-card-drag-handle:active {
    cursor: grabbing;
  }
}

/* Tablet/Mobile: hide drag handle, show status */
@media (max-width: 1023px) {
  .goal-card-drag-handle {
    display: none;
  }
  
  .goal-card::after {
    content: "Reordering available on desktop";
    font-size: 0.75rem;
    color: var(--text-muted);
    font-style: italic;
  }
}
```

**JavaScript Detection**:
```typescript
// Detect touch-only device
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Conditionally enable drag handlers
function useDragAndDrop(enabled: boolean = !isTouchDevice) {
  // Hook logic only activates if enabled === true
}
```

**User Experience**:
- **Desktop (mouse/keyboard)**: Full drag-and-drop + keyboard reorder functionality
- **Tablet (hybrid touch+keyboard)**: Keyboard reorder works, mouse drag works if mouse connected
- **Mobile (touch-only)**: Reorder controls hidden/disabled, existing goal management (add/complete/delete) unaffected

**Alternatives Considered**:
- Hide reorder feature entirely on mobile: Rejected as too aggressive; keyboard users on tablets benefit from reorder mode
- Show drag handle but disable: Rejected as creates false affordance (looks interactive but isn't)
- Attempt basic touch drag: Rejected per spec decision to defer touch support

---

## Research Summary

All research questions resolved. No blockers identified for Phase 1 design.

### Key Technical Decisions:
1. **Native events over libraries**: Use React synthetic events (mouseDown/Move/Up, keyboard events) for drag-and-drop
2. **Reorder Mode pattern**: Space/Enter to activate, arrows to move, Enter to confirm, Escape to cancel
3. **CSS transforms for animation**: 250ms `translateY` transitions for smooth 60fps performance
4. **Additive schema migration**: Auto-assign `displayOrder` based on creation date for existing goals
5. **Responsive with progressive degradation**: UI visible on all viewports, reorder enabled desktop/keyboard only

### Risks Mitigated:
- **Performance**: CSS transforms avoid layout thrashing
- **Accessibility**: WCAG-compliant keyboard navigation with ARIA attributes
- **Data integrity**: Non-breaking localStorage migration
- **Responsive design**: All viewports supported per constitution, even with desktop-focused feature

**Ready for Phase 1: Design & Contracts**
