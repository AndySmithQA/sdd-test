# TypeScript Contracts: Drag-and-Drop Types

**Feature**: [spec.md](../spec.md) | **Data Model**: [data-model.md](../data-model.md)

This directory contains TypeScript type definitions for the drag-and-drop goal reordering feature. These contracts define the shape of data and operations, serving as the interface between components, hooks, and storage.

## Files

- `types.ts` - Core type definitions for drag state, keyboard state, and operations
- `README.md` - This file

## Usage

Import these types in components, hooks, and utilities:

```typescript
import type { DragState, KeyboardReorderState, ReorderOperation } from '../types/dragDrop';
```

## Type Safety

All types are strictly defined with no `any` types. TypeScript will enforce:
- Correct prop types in components
- Valid state transitions in hooks
- Proper parameter types in reorder operations
- Non-null assertions where invariants guarantee values exist

## Naming Conventions

- **Interfaces**: PascalCase (e.g., `DragState`)
- **Type Aliases**: PascalCase (e.g., `ReorderDirection`)  
- **Enums**: PascalCase with UPPER_CASE values (avoided in favor of union types)
- **Generic Types**: Single uppercase letter or descriptive PascalCase (e.g., `T`, `TGoal`)
