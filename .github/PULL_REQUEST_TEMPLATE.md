# Pull Request

## 📋 Description

Brief description of what this PR does.

## 🔗 Related Issue

Closes #[issue number]

## 🎯 Type of Change

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] ♻️ Refactoring (no functional changes)
- [ ] 🎨 Style/UI update
- [ ] ⚡ Performance improvement

## 🏗️ Architecture Impact

**Which areas are affected?**
- [ ] FrontDesk feature (`src/widgets/frontdesk/`)
- [ ] Shared components
- [ ] State management (`src/store/`)
- [ ] Services/API layer
- [ ] Build configuration
- [ ] Documentation

**For FrontDesk changes, which provider?**
- [ ] Internal (DMs)
- [ ] Email
- [ ] WhatsApp
- [ ] Tickets
- [ ] Unified Inbox
- [ ] Cross-provider

## 🧪 Testing

**How has this been tested?**

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] E2E tests added/updated (if applicable)

**Test coverage:**
- [ ] Coverage maintained or improved
- [ ] Critical paths covered

**Manual testing checklist:**
- [ ] Tested on Chrome
- [ ] Tested on Safari/Firefox
- [ ] Tested responsive layouts
- [ ] Tested error states
- [ ] Tested loading states

## 📸 Screenshots/Videos

If applicable, add screenshots or screen recordings to demonstrate the changes.

**Before:**
[Screenshot or description]

**After:**
[Screenshot or description]

## ⚡ Performance Impact

- [ ] No performance impact
- [ ] Performance improved
- [ ] Performance degraded (explain mitigation below)

**If performance tested, provide metrics:**
- Render time: [before/after]
- Bundle size: [before/after]
- Memory usage: [before/after]

## 📝 Checklist

**Code Quality:**
- [ ] Code follows project style guidelines (`npm run lint` passes)
- [ ] TypeScript has no errors (`npm run type-check` passes)
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] No console.log or debugging code left

**Documentation:**
- [ ] README updated (if needed)
- [ ] API documentation updated (if needed)
- [ ] `CLAUDE.md` or `GEMINI.md` updated (if scope/architecture changed)
- [ ] Inline code documentation added

**FrontDesk Specific (if applicable):**
- [ ] Follows FrontDesk provider pattern
- [ ] Recoil atoms use correct naming (`frontdesk.{provider}.{data}`)
- [ ] WebSocket events properly handled
- [ ] Error boundaries considered
- [ ] Only modified allowed paths (see `CLAUDE.md`)

**Testing:**
- [ ] Tests pass locally (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No new warnings introduced

## 🚀 Deployment Notes

Any special considerations for deployment?

- [ ] Database migrations required
- [ ] Environment variables changed
- [ ] Feature flags needed
- [ ] Breaking changes (requires coordination)

## 🔄 Migration Guide

If this introduces breaking changes, provide migration instructions:

```typescript
// Before
// ...

// After
// ...
```

## 📚 Additional Context

Any additional information that reviewers should know.

## 👀 Reviewers

@mention specific people if their review is required

---

**By submitting this PR, I confirm:**
- [ ] I have tested this thoroughly
- [ ] This follows the project's contribution guidelines
- [ ] I have updated relevant documentation
