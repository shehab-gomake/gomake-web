# AI Tools Markdown File Organization Guide

This document outlines the best practices for organizing markdown files for different AI coding assistants: **Claude Code**, **Cursor IDE**, and **Gemini**.

## Overview

Each AI tool has specific conventions for how it discovers and uses markdown documentation:

| Tool | Root File | Directory | Purpose |
|------|-----------|-----------|---------|
| **Claude Code** | `CLAUDE.md` | `.claude/` | Agent instructions, skills, workflows, orchestrator state |
| **Cursor IDE** | `.cursorrules` | `.cursor/` | Workspace knowledge, rules, acceleration files |
| **Gemini** | `GEMINI.md` | (none) | Gemini-specific development guidelines |
| **General Docs** | `README.md` | `docs/` | Project documentation, architecture guides |

---

## 1. Claude Code Organization

### Structure: `.claude/`

Claude Code uses the `.claude/` directory for agent-specific files that guide its behavior.

```
.claude/
├── agents/                    # Agent definitions
│   ├── frontdesk-orchestrator.md
│   └── frontdesk-codebase-investigator.md
├── skills/                    # Knowledge base for adapting patterns
│   └── chatwoot/
│       ├── README.md
│       ├── core-architecture.md
│       ├── api-patterns.md
│       ├── state-management.md
│       ├── component-patterns.md
│       └── flows/
│           ├── message-sending-flow.md
│           ├── conversation-list-filtering.md
│           ├── contact-management.md
│           └── new-conversation-creation.md
├── workflows/                 # Step-by-step workflows
│   ├── adapt-chatwoot-feature.md
│   ├── dev-login.md
│   ├── implement-chatwoot-api.md
│   └── verify-chatwoot-flow.md
└── orchestrator-state/        # Persistent state for orchestrator
    ├── README.md
    ├── frontdesk-tasks.json    # (gitignored - session state)
    └── demo-checklist.md
```

### Key Principles

1. **Skills** (`skills/`): Document external patterns (e.g., Chatwoot Vue/Vuex) to help Claude adapt them
2. **Workflows** (`workflows/`): Step-by-step procedures with frontmatter descriptions
3. **Agents** (`agents/`): Specialized agent definitions with capabilities and constraints
4. **Orchestrator State** (`orchestrator-state/`): JSON state files for multi-session continuity

### File Naming

- Use kebab-case: `message-sending-flow.md`
- Include frontmatter for workflows:
  ```yaml
  ---
  description: How to implement message sending
  ---
  ```

### Root File: `CLAUDE.md`

- Located at project root
- Contains Claude-specific development guidelines
- Mandatory reading for Claude Code agents
- References `.claude/` directory structure

---

## 2. Cursor IDE Organization

### Structure: `.cursor/`

Cursor IDE uses `.cursor/` for workspace knowledge and acceleration files.

```
.cursor/
├── README.md                  # Overview of acceleration files
├── ai-dev-acceleration.md     # Quick patterns and templates
├── api-reference.md          # Complete API endpoint reference
├── quick-decision-tree.md    # Decision-making workflows
├── code-snippets.ts          # Copy-paste code library
├── feature-template.tsx      # New feature scaffolding
├── workspace-knowledge.md    # Workspace overview
├── workspace-index.md        # Project structure index
├── CURSOR_GUIDE.md          # Cursor-specific guide
├── WHATS_NEW.md             # Recent changes
├── IMPROVEMENTS_SUMMARY.md   # Improvement tracking
└── rules/                    # Architecture rules (.mdc format)
    ├── frontdesk-architecture.mdc
    ├── frontdesk-chatwoot-provider.mdc
    └── chatwoot-skills-integration.mdc
```

### Key Principles

1. **Acceleration Files**: Quick access patterns, snippets, templates
2. **Reference Files**: API docs, decision trees, workspace knowledge
3. **Rules** (`rules/`): Architecture patterns in `.mdc` format (Markdown with Cursor-specific features)
4. **Auto-loading**: Files are automatically loaded based on context

### File Naming

- Use kebab-case: `ai-dev-acceleration.md`
- Code files use normal extensions: `code-snippets.ts`, `feature-template.tsx`
- Rules use `.mdc` extension: `frontdesk-architecture.mdc`

### Root File: `.cursorrules`

- Located at project root
- Contains workspace-level rules for Cursor
- References `.cursor/` directory structure

---

## 3. Gemini Organization

### Structure: Root-level `GEMINI.md`

Gemini uses a single root-level file for its guidelines.

```
GEMINI.md                      # Gemini-specific development guidelines
```

### Key Principles

1. **Single File**: All Gemini-specific instructions in one file
2. **Self-contained**: References other docs but contains Gemini-specific patterns
3. **Mandatory Reading**: Must be read at the start of any Gemini task

### File Naming

- Use uppercase: `GEMINI.md`
- Located at project root (same level as `CLAUDE.md`)

---

## 4. General Documentation Organization

### Structure: `docs/`

General project documentation goes in `docs/` directory.

```
docs/
├── README.md                  # Documentation index
├── frontdesk/
│   ├── README.md             # FrontDesk documentation index
│   ├── FRONTDESK_CHATWOOT_ARCHITECTURE.md
│   ├── CHATWOOT_CHANNEL_CONNECTION_FLOW.md
│   ├── NAVIGATION_ANALYSIS.md
│   └── 01-providers/
│       └── chatwoot/
│           ├── BROWSER_TEST_RESULTS.md
│           ├── CONVERSATION_PERSISTENCE_VERIFICATION.md
│           └── ...
└── AI_TOOLS_MARKDOWN_ORGANIZATION.md  # This file
```

### Key Principles

1. **Hierarchical**: Organize by feature/domain
2. **Index Files**: Include `README.md` in each major directory
3. **Naming**: Use descriptive, uppercase names for important docs
4. **Cross-references**: Link between related documents

---

## 5. Best Practices Summary

### File Organization Rules

1. **Claude Code Files** → `.claude/`
   - Skills, workflows, agents, orchestrator state
   - Use frontmatter for metadata
   - Kebab-case naming

2. **Cursor IDE Files** → `.cursor/`
   - Acceleration files, rules, workspace knowledge
   - Use `.mdc` for rules
   - Kebab-case naming

3. **Gemini Files** → Root level
   - Single `GEMINI.md` file
   - Uppercase naming

4. **General Documentation** → `docs/`
   - Architecture guides, test results, implementation docs
   - Hierarchical organization
   - Descriptive naming

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Claude workflows | kebab-case | `adapt-chatwoot-feature.md` |
| Claude skills | kebab-case | `message-sending-flow.md` |
| Cursor files | kebab-case | `ai-dev-acceleration.md` |
| Cursor rules | kebab-case + `.mdc` | `frontdesk-architecture.mdc` |
| Gemini file | UPPERCASE | `GEMINI.md` |
| Root protocol files | UPPERCASE | `CLAUDE.md` |
| General docs | UPPERCASE or kebab-case | `FRONTDESK_ARCHITECTURE.md` |

### Frontmatter Usage

Use YAML frontmatter for Claude workflows:

```yaml
---
description: How to implement a feature
tags: [workflow, chatwoot, frontdesk]
---
```

### Cross-Referencing

Always use relative paths when linking between documents:

```markdown
See [Architecture Guide](../docs/frontdesk/FRONTDESK_CHATWOOT_ARCHITECTURE.md)
```

---

## 6. Migration Checklist

When organizing uncommitted markdown files:

- [ ] **Claude workflows** → `.claude/workflows/`
- [ ] **Claude skills** → `.claude/skills/{domain}/`
- [ ] **Claude agents** → `.claude/agents/`
- [ ] **Cursor acceleration** → `.cursor/`
- [ ] **Cursor rules** → `.cursor/rules/` (with `.mdc` extension)
- [ ] **Gemini guidelines** → Root level `GEMINI.md`
- [ ] **General docs** → `docs/` (organized by domain)
- [ ] **Project relationship docs** → `docs/` or root level

---

## 7. Quick Reference

### Where to Put Files

| File Type | Location | Example |
|-----------|----------|---------|
| Step-by-step workflow | `.claude/workflows/` | `implement-chatwoot-api.md` |
| External pattern reference | `.claude/skills/` | `chatwoot/api-patterns.md` |
| Agent definition | `.claude/agents/` | `frontdesk-orchestrator.md` |
| Quick code patterns | `.cursor/` | `code-snippets.ts` |
| Architecture rules | `.cursor/rules/` | `frontdesk-architecture.mdc` |
| Gemini guidelines | Root | `GEMINI.md` |
| Architecture docs | `docs/` | `FRONTDESK_ARCHITECTURE.md` |
| Test results | `docs/` | `BROWSER_TEST_RESULTS.md` |

---

**Last Updated**: 2025-01-19
**Purpose**: Guide for organizing markdown files across AI coding assistants

