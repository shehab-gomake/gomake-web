# 🎨 How to See the Theme Difference - Test Guide

## ✅ What I Just Updated

1. **Card Widget Styles** → Now use CSS variables
2. **Card Colors** → Now read from CSS variables (with MUI fallback)
3. **Page Background** → Now uses CSS variables
4. **Two Themes Created**:

- `base` - Your current purple/pink colors
- `hp-client` - Blue/orange with white background

---

## 🚀 How to See the Difference (3 Easy Steps)

### Step 1: Start Your Dev Server

Make sure it's running:

```bash
npm run dev
```

### Step 2: Open Your Home Page

Go to: `http://localhost:3004/home` or `http://localhost:3004`

**Take note of:**

- Success Rate card color: **Purple** 🟣
- Monthly Performance card color: **Pink** 🩷
- Page background: **Light gray** (#f6f6f6)

### Step 3: Switch to HP-Client Theme

**Open Browser Console** (Press F12)

**Type this command:**

```javascript
localStorage.setItem("selectedTheme", "hp-client");
location.reload();
```

**You should now see:**

- ✅ Success Rate card: **Purple** → **Blue** 🔵
- ✅ Monthly Performance card: **Pink** → **Orange** 🟠
- ✅ Page background: **Light gray** → **White** ⬜
- ✅ All other cards stay the same (green, red, yellow, gray)

### Switch Back to Base Theme

```javascript
localStorage.setItem("selectedTheme", "base");
location.reload();
```

**Or remove theme completely (default):**

```javascript
localStorage.removeItem("selectedTheme");
location.reload();
```

---

## 📊 Visual Comparison

| Element                 | Base Theme           | HP-Client Theme     |
| ----------------------- | -------------------- | ------------------- |
| **Success Rate Card**   | 🟣 Purple (#7c3aed)  | 🔵 Blue (#0066cc)   |
| **Monthly Performance** | 🩷 Pink (#ec4899)     | 🟠 Orange (#ff6b35) |
| **Page Background**     | Light Gray (#f6f6f6) | ⬜ White (#ffffff)  |
| **Approved Card**       | 🟢 Green             | 🟢 Green (same)     |
| **Pending Card**        | 🔴 Red               | 🔴 Red (same)       |
| **Orders Card**         | 🟡 Yellow            | 🟡 Yellow (same)    |
| **Cancelled Card**      | ⚫ Gray              | ⚫ Gray (same)      |

---

## 🎯 Quick Test Commands

Copy/paste these into your browser console:

### Test Base Theme (Default Colors)

```javascript
localStorage.setItem("selectedTheme", "base");
location.reload();
```

### Test HP-Client Theme (Different Colors)

```javascript
localStorage.setItem("selectedTheme", "hp-client");
location.reload();
```

### Remove Theme (Original Behavior)

```javascript
localStorage.removeItem("selectedTheme");
location.reload();
```

---

## 🐛 Troubleshooting

### Colors Don't Change?

1. **Check browser console** for errors
2. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Verify theme loaded**: In console, type:
   ```javascript
   getComputedStyle(document.documentElement).getPropertyValue(
     "--theme-primary-color"
   );
   ```
   - Should return color (e.g., `#0066cc` if hp-client theme is active)

### Still See Old Colors?

- Make sure dev server restarted after file changes
- Clear browser cache
- Check that files were saved correctly

---

## ✏️ Customize Your Client Theme

Edit this file to change colors:

```
src/themes/hp-client/theme.config.ts
```

**Change these values:**

```typescript
"--theme-primary-color": "#YOUR_COLOR",      // Success Rate card
"--theme-secondary-color": "#YOUR_COLOR",    // Monthly Performance
"--theme-bg-body": "#ffffff",                 // Page background
```

**Then test:**

```javascript
localStorage.setItem("selectedTheme", "hp-client");
location.reload();
```

---

## 📁 Files That Were Changed

1. ✅ `src/pages-components/admin/home/widgets/cards-widget/style.ts`

   - Now uses CSS variables for padding, background, borders

2. ✅ `src/pages-components/admin/home/widgets/cards-widget/use-cards-widget.tsx`

   - `getCardColor()` now reads CSS variables first

3. ✅ `src/pages/home/index.page.tsx`

   - Page background uses CSS variable

4. ✅ `src/pages/index.page.tsx`

   - Page background uses CSS variable

5. ✅ `src/themes/base/theme.config.ts` (NEW)

   - Default theme matching your current design

6. ✅ `src/themes/hp-client/theme.config.ts` (NEW)
   - Alternative theme with different colors

---

## 🎉 Success Indicators

You'll know it's working when:

- ✅ Success Rate card changes color when switching themes
- ✅ Monthly Performance card changes color
- ✅ Page background changes color
- ✅ You can switch between themes instantly
- ✅ No errors in browser console

---

## 🚀 Next Steps

1. **Test both themes** using the commands above
2. **Customize colors** in `hp-client/theme.config.ts`
3. **Create more themes** by copying the hp-client folder
4. **Apply to other widgets** following the same pattern

---

**Ready to test?** Open your browser console and run the commands above! 🎨
