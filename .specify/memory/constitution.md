<!-- 
SYNC IMPACT REPORT - Constitution Update
Version: 1.0.0 (initial)
Ratification Date: 2026-02-19
Last Amended: 2026-02-19

Created Principles:
- I. Clean Code (NEW)
- II. User Experience (UX) (NEW)
- III. Responsive Design (NEW)
- IV. Minimal Dependencies (NEW)
- V. NO Testing—Supersedes All Other Guidance (NEW - CRITICAL)

Technology Stack Section (NEW):
- React 19+ with TypeScript 5.9+
- Bootstrap 5.2+
- Vite 7.3+
- ESLint 9.39+
- npm package manager

Development Workflow Section (NEW):
- Feature definition via spec files
- Manual verification only (NO tests)
- Code review gates
- Explicit prohibition on automated testing

Templates Status (follow-up actions required):
- spec-template.md: ⚠️ PENDING - header "User Scenarios & Testing" should rename to "User Scenarios", remove any references to automated tests
- tasks-template.md: ⚠️ PENDING - remove all testing task examples; replace with manual verification tasks
- plan-template.md: ⚠️ PENDING - remove "Testing:" field from Technical Context section

Rationale for Version 1.0.0:
- Initial complete constitution for project
- Five core principles established (Clean Code, UX, Responsive Design, Minimal Dependencies, NO Testing)
- Technology stack locked (React + TypeScript + Bootstrap)
- NO Testing principle explicitly positioned as SUPERSEDING all other guidance
- MINOR-category feature set (new principles, tech stack definition)
-->

# sdd-test Constitution
A technology-first web application constitution emphasizing clean code, user experience, and minimal dependencies

## Core Principles

### I. Clean Code (NON-NEGOTIABLE)
Code MUST prioritize readability, maintainability, and clarity. Every component, function, and variable MUST have a clear, self-documenting purpose. Complexity MUST be justified and minimized. Code reviews MUST enforce clarity standards—no obfuscated logic, no premature optimization, no "clever" code sacrifices legibility. Refactoring for clarity is always preferred over adding features.

### II. User Experience (UX) First
Every feature implementation MUST center on user workflows and accessibility. UI changes MUST be validated against user needs—assume nothing about what users want. Forms, navigation, error messages, and feedback mechanisms MUST be intuitive. Progressive enhancement is mandatory: graceful degradation when features unavailable. User journeys MUST be tested manually against documented acceptance scenarios before any feature is considered complete.

### III. Responsive Design (MANDATORY)
All UI components MUST work seamlessly across mobile (320px+), tablet (768px+), and desktop (1024px+) viewports. Grid layouts via Bootstrap grid system are mandatory. Fluid typography, flexible spacing, and touch-friendly interactions (minimum 44px tap targets) are non-negotiable. Media queries MUST be tested across real devices or verified via browser dev tools. Responsive testing is part of development definition-of-done, not a separate test phase.

### IV. Minimal Dependencies
The dependency tree MUST remain shallow and intentional. Every external package MUST solve a concrete problem; no experimental, abandoned, or redundant packages. Dependencies MUST be reviewed quarterly for updates and security. Breaking changes in dependencies MUST trigger a plan before upgrade. Prefer Bootstrap utilities over custom CSS frameworks. Prefer React built-ins over heavy state management libraries. When in doubt, write it—don't add a package.

### V. NO Testing—This Principle Supersedes All Other Guidance
**This is absolute.** No unit tests, no integration tests, no end-to-end tests, no test harness, no test runner setup. Manual verification against documented user acceptance scenarios is sufficient. Developers MUST verify features work by running the application locally and walking through user journeys manually. If any other guidance in this constitution conflicts with this principle, this principle wins. Code review and manual walkthroughs replace automated testing as the quality gate.

## Technology Stack (Locked)

**Primary Framework**: React 19+ with TypeScript 5.9+  
**UI Framework**: Bootstrap 5.2+  
**Build Tool**: Vite 7.3+  
**Package Manager**: npm  
**Linting**: ESLint 9.39+ with React plugins  
**Node.js**: 18+ (aligned with vite and react versions)

These technologies are not negotiable and form the foundation of all feature development.

## Development Workflow

1. **Feature Definition**: User scenarios MUST be documented in spec files with prioritized user journeys. Each story MUST be independently implementable and manually verifiable.
2. **Manual Verification**: Developers MUST run features locally and walk through each user scenario step-by-step. UI behavior, responsive layout, and edge cases are verified manually.
3. **Code Review**: Reviewers MUST verify clean code standards, UX compliance, responsive behavior across viewports, and adherence to minimal dependencies. Manual testing by the reviewer is expected.
4. **No Automated Testing**: Automated tests of any kind (unit, integration, e2e) are explicitly prohibited. Reliance on manual verification and code review catches issues effectively.

## Governance

**Constitution Authority**: This constitution supersedes all other project guidance. In case of conflict between this document and other guidance (READMEs, PRs, conversations), this constitution is the source of truth.

**Amendment Process**: Amendments require documented justification, explicit rationale for version change, and consensus. Any principle conflict that would violate the No Testing principle is rejected immediately.

**Version Management**: 
- MAJOR: Principle removal or fundamental redefinition (e.g., requiring testing when it's now prohibited)
- MINOR: New principle, technology stack update, or substantive expansion of existing principle guidance
- PATCH: Clarifications, wording refinements, non-semantic corrections

**Compliance Review**: All code reviewed against these principles. Violations (testing code, untested dependencies, unclear code, non-responsive layouts) must be resolved before merge.

**Ratification Reference**: Development guidance and runtime procedures are in README.md. Constitution is the authoritative governance layer; README provides implementation assistance.

---

**Version**: 1.0.0 | **Ratified**: 2026-02-19 | **Last Amended**: 2026-02-19
