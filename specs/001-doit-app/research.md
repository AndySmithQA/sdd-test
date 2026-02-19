# Research: Goal Tracking Web App (doit)

**Date**: 2026-02-19  
**Scope**: date handling, local persistence, responsive layout and modal behavior

## Decision: Use date-fns for date calculations and formatting

**Rationale**:
- `differenceInCalendarDays` with `startOfDay` avoids time-of-day drift when computing days remaining.
- `format` provides consistent, localized date display without heavy dependencies.
- Simple, tree-shakeable utilities align with minimal dependency principle.

**Alternatives considered**:
- Native `Date` math only: workable but more error-prone for calendar-day boundaries.
- Luxon: richer but heavier and unnecessary for the feature scope.

## Decision: Persist goals in browser localStorage with versioned schema

**Rationale**:
- Meets persistence requirement without adding backend complexity.
- Versioned payload (`goals:v1`) supports safe future schema changes.
- Safe parsing with `try/catch` and shape checks avoids corrupt data crashes.

**Alternatives considered**:
- Session-only state: fails persistence requirement.
- Backend API: adds infrastructure outside MVP scope.

## Decision: Bootstrap 5 grid for responsive two-column layout and modal

**Rationale**:
- `col-12 col-md-6` provides mobile-first stacking and tablet/desktop two-column layout.
- Built-in modal patterns support accessibility and consistent behavior.
- Aligns with locked tech stack and minimal CSS overhead.

**Alternatives considered**:
- Custom CSS grid: more work without clear benefit.
- Third-party component libraries: violates minimal dependency preference.
