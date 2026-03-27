# NodeTutor

## Current State
App uses TanStack Router. Navbar is shared via AuthGuard in App.tsx. Links exist but no active-state highlighting, no wallet indicator, no notification dot, no mobile hamburger.

## Requested Changes (Diff)

### Add
- Active tab pill on current route link
- Wallet pill showing NodeCredits
- Red dot on bell icon
- Mobile hamburger menu with toggle state

### Modify
- Navbar frosted glass: bg-white/70 backdrop-blur-md border-gray-200/50
- Zone A: GraduationCap icon + NodeTutor in blue
- Zone B: Dashboard, My Sessions, KTU Resources with active highlighting
- Zone C: wallet + bell+dot + avatar/name dropdown

### Remove
- Welcome back text span

## Implementation Plan
1. Upgrade Navbar.tsx with all above
2. Use useRouterState for active route detection
3. Add mobile hamburger toggle
4. Validate and build
