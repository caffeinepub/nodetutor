# NodeTutor - KTU Resources Hub

## Current State
ResourcesPage.tsx exists with simple 2-column layout and basic filters. Lacks 3-column layout, dark subject cards, left sidebar accordion, and right sidebar widgets.

## Requested Changes (Diff)

### Add
- Left sidebar (20%): dark accordion with Semester (S1-S4), Branch (CSE, ME, Civil, ECE, EEE), Resource Types filters
- Center (55%): pill search bar + 6 dark subject cards with per-row materials and green circular download buttons
- Right sidebar (25%): Exam Alerts countdown card + Resource Request Form

### Modify
- ResourcesPage.tsx: full rebuild to 3-column layout

### Remove
- Old filter bar, simple ResourceCard, backend hook dependencies

## Implementation Plan
1. Rebuild ResourcesPage.tsx as 3-column layout
2. Left sidebar: dark frosted-glass accordion filters
3. Center: pill search + 6 dark subject cards
4. Right sidebar: exam countdown + request form
