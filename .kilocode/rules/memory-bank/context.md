# Context — Current State & Recent Changes

## Recent Changes (2026-05-13)
### Critical: Memory Leak Fix in page.tsx

**Problem:** The AI CEO Simulation was running as a "runaway train" consuming excessive RAM.

**Root Causes Identified:**
1. **Missing cleanup on 4 recursive `setTimeout` useEffects** — `botChatter`, `autoFeed`, `statDrift`, and `autoHaggle` all used recursive `setTimeout` patterns with NO cleanup return function. Every time an effect re-ran, a NEW timeout chain started while the OLD one kept running. Timers piled up indefinitely → memory exhaustion.
2. **Unstable `doHaggle` reference** — `doHaggle` was a plain function (not wrapped in `useCallback`), creating a new reference every render. The `autoHaggle` effect depended on it, so it re-ran on EVERY render, spawning a new timeout chain each time. This was the worst offender.
3. **Forward reference to `resolveHaggle`** — `doHaggle` called `resolveHaggle` inside a `setTimeout`, but `resolveHaggle` was declared AFTER `doHaggle`, causing a runtime reference error.

**Fixes Applied:**
- Added `return () => clearTimeout(timeoutRef.current)` cleanup to all 4 recursive setTimeout effects
- Used a shared `useRef` (`timeoutRef`) for the timeout ID so cleanup always clears the current timer
- Wrapped all action functions (`doHaggle`, `doDefend`, `doApprove`, etc.) in `useCallback` with proper dependencies
- Moved `resolveHaggle` declaration BEFORE `doHaggle` to fix forward reference
- `doHaggle` is now stable — autoHaggle effect only re-runs when `haggleInProgress` actually changes

**Result:** TypeScript compiles cleanly, ESLint passes with 0 errors (2 minor warnings about `launchConfetti` and `updateScore` deps that are acceptable).

## Tech Stack
- Next.js 16 with App Router
- React 19, TypeScript 5.9
- Tailwind CSS 4
- Bun package manager