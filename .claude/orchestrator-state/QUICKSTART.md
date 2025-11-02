# FrontDesk Orchestrator - Quick Start

## When to Use the Orchestrator

Use `frontdesk-orchestrator` agent when:

1. **User requests multi-task FrontDesk feature** (3+ steps)
2. **User asks "what should I work on next?"** for FrontDesk
3. **User requests status update** on FrontDesk implementation
4. **User encounters blocker** during FrontDesk work
5. **Planning a demo** or major milestone

## How to Invoke

```
I'm going to use the Task tool to launch the frontdesk-orchestrator agent to [break down this work/check status/handle this blocker].
```

Then use:
```
Task tool with subagent_type: "frontdesk-orchestrator"
```

## What It Does

- Loads state from `.claude/orchestrator-state/frontdesk-tasks.json`
- Creates/updates task graph with dependencies
- Routes work to specialized agents (Explore, general-purpose)
- Syncs with TodoWrite tool
- Saves state after changes
- Provides status reports

## Critical Rules

- ✅ Use for complex FrontDesk coordination
- ❌ DON'T use for single quick fixes
- ❌ DON'T use for non-FrontDesk work
- ✅ The orchestrator NEVER writes code (only coordinates)
