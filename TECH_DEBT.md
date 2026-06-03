# Technical Debt Analysis - Scheduler

This document summarizes the technical debt audit performed on the Scheduler codebase.
Three follow-up tickets have been created to address the most impactful low-hanging fruit items.

## Ticket 1: SWAP-5619 - Remove unused frontend dependencies

**Severity:** Low effort, Low risk

The frontend `package.json` contains three date-related packages that are never imported
anywhere in the source code:

- `date-fns` (^2.27.0)
- `@date-io/moment` (^2.17.0)
- `dateformat` (^5.0.3)

The frontend exclusively uses `moment` for all date handling across 20+ files. These
unused packages increase install time, bundle confusion, and create ambiguity about which
date library to use.

**Action:** Remove the three unused dependencies from `apps/frontend/package.json`.

## Ticket 2: SWAP-5620 - Replace console.error/console.log with proper error handling

**Severity:** Medium effort, Low risk

The frontend has 28+ instances of `console.error` and `console.log` across components
and hooks, while the backend correctly uses `@user-office-software/duo-logger`. Several
locations have TODO comments acknowledging the need for an error handling refactor.

**Key problem areas:**

| File | Instances | Notes |
|------|-----------|-------|
| `TimeSlotBooking.tsx` | 4 | TODO comments on each |
| `TimeSlotLostTimeTable.tsx` | 1 | TODO comment |
| `CalendarViewContainer.tsx` | 1 | No user feedback |
| `TableView.tsx` | 1 | Bare error logging |
| `useDataApi.ts` | 2 | Unsafe GraphQL error extraction + TODO |
| Multiple hooks | 6+ | `.catch(console.error)` pattern |
| `RoleSelection.tsx` | 1 | Unsafe error extraction + TODO |

**Action:** Introduce consistent error handling strategy; replace `console.error` with
user-facing notifications (notistack) or structured logging.

## Ticket 3: SWAP-5621 - Improve TypeScript type safety by eliminating `any` usage

**Severity:** Medium effort, Low risk

The codebase has 39 instances of the `any` type across 18 files (21 backend, 18 frontend).
Thirteen files have file-level `eslint-disable` comments for `@typescript-eslint/no-explicit-any`.

**Worst offenders:**

| File | Count | Issue |
|------|-------|-------|
| `resolvers/Decorators.ts` | 5 | Decorator targets and return types |
| `generated/sdk.ts` | 9 | Generated code (lower priority) |
| `components/common/Table.tsx` | 4 | Has TODO: "use generic solution" |
| `decorators/Authorized.ts` | 2 | Decorator target and return type |
| `decorators/EventBus.ts` | 2 | Decorator target and args type |
| `context/UserContext.tsx` | 2 | Reducer payload and return type |
| `hooks/common/useDataApi.ts` | 2 | JWT decode type assertions |
| `eventHandlers/messageBroker.ts` | 2 | Unsafe `as any` type assertions |

**Action:** Create proper TypeScript interfaces, use generics, and apply discriminated
union patterns to replace `any` usage. Keep generated code (`sdk.ts`) out of scope.

## Additional observations

These items were noted during the audit but are not included in the initial three tickets:

- **React 17 EOL**: React 17.0.2 reached end-of-life; an upgrade to React 18 should be
  planned alongside a React Router v5 to v6 migration.
- **Zero test coverage**: Backend has no unit tests (test script exits with `exit 0`),
  and frontend has no component/hook tests. Only E2E tests (6 Cypress specs) exist.
- **17+ TODO/FIXME comments**: Scattered across both apps, several referencing deferred
  refactors or known permission issues in Equipment mutations/queries.
- **Hardcoded configuration**: Exchange name, facility name, and service identifiers are
  hardcoded in backend files rather than pulled from environment variables.
