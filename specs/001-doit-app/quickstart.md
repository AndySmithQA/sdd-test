# Quickstart: Goal Tracking Web App (doit)

## Prerequisites

- Node.js 18+
- npm

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## Manual Verification Checklist (No Automated Tests)

1. Create a goal via the modal with title, end date, and description.
2. Confirm the goal appears in the Active column with correct days remaining.
3. Create a goal due within 3 days and verify highlight styling.
4. Check a goal and move it to Completed column.
5. Delete a goal from either column and confirm it is removed.
6. Refresh the page and confirm goals persist via localStorage.
7. Resize to mobile, tablet, and desktop widths to confirm responsive layout.

## Notes

- Data is stored in browser localStorage only.
- No automated tests are included by project constitution.
