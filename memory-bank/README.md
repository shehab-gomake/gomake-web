# Memory Bank: gomake-web

This Memory Bank serves as the persistent knowledge base for the gomake-web project. Since AI context resets between sessions, these files ensure continuity and understanding of the project.

## Core Files

### 1. `projectbrief.md`

The foundation document that shapes all other files. Defines core requirements, goals, and scope.

### 2. `productContext.md`

Why this project exists, problems it solves, and user experience goals.

### 3. `activeContext.md`

Current work focus, recent changes, next steps, and active decisions.

### 4. `systemPatterns.md`

System architecture, key technical decisions, and design patterns.

### 5. `techContext.md`

Technologies used, development setup, and technical constraints.

### 6. `progress.md`

What works, what's left to build, current status, and known issues.

## Usage

**At the start of each session:** Read ALL core files to understand project context.

**During development:** Update relevant files when significant changes occur.

**When requested:** User may ask to "update memory bank" - review and update all files to reflect current state.

## File Hierarchy

```
projectbrief.md (foundation)
    ├── productContext.md
    ├── systemPatterns.md
    └── techContext.md
            └── activeContext.md
                    └── progress.md
```

---

_Memory Bank initialized: October 20, 2025_
