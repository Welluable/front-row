---
name: generate-waitlist
description: Read config files (mission, problem, solution, style) and update text content and colors on the waitlist landing page. Use when the user has edited config files and wants the page updated, or when they ask to "generate my waitlist page from config".
---

# Generate Waitlist Page from Config

This skill updates **text content and colors** of the waitlist landing page by reading the project's config files. The boilerplate structure, layout, component classes, and all functional code remain unchanged.

## When to Use

- User says they edited config files and want the page updated
- User asks to "generate my waitlist page" or "apply config to the landing page"
- User wants the site text or colors to reflect the `/config` directory

## Critical Rule: Text and Colors Only

**DO NOT modify:**
- Component structure, HTML elements, or JSX layout
- CSS class names or Tailwind classes in components
- Fonts or font imports
- `app/layout.tsx` (metadata, fonts, imports)
- `WaitlistForm.tsx` (form logic, API URL, honeypot)
- `app/api/waitlist/route.ts`
- `lib/` directory (prisma, rate-limit, validation)
- Any imports, exports, or function signatures

**ONLY modify:**
- String literals (headlines, paragraphs, list items, button text)
- Array contents for lists/tags (the string values inside)
- CSS variable **values** in `globals.css` (the hex color codes only)

## Step 1: Read Config Files

Read and parse these files (in project root):

| File | Format | Content to Extract |
|------|--------|-------------------|
| `config/mission.md` | Markdown + YAML frontmatter | `headline`, `subheadline`, `cta` |
| `config/problem.md` | Markdown + YAML frontmatter | `title`, body content (pain points) |
| `config/solution.md` | Markdown + YAML frontmatter | `title`, `subtitle`, `tags` array |
| `config/style.json` | JSON | `colors` object (primary, secondary, background, text, muted) |

- For `.md` files: parse YAML frontmatter (between `---` and `---`); treat the rest as body/content.
- For `.json` files: parse as JSON.
- If a config file is missing, keep existing values for that section.

## Step 2: Update Text in Components

Replace **only the text strings** within these components. Keep all structure, classes, and elements exactly as they are.

### Hero (`components/Hero.tsx`)

- Replace the headline text string with `mission.md` frontmatter `headline`
- Replace the subheadline text string with `subheadline` from frontmatter
- If there's a gradient-styled phrase (e.g., in a `<span>`), keep the span structure and just update the text inside

### Problem (`components/Problem.tsx`)

- Replace the section title string with `problem.md` frontmatter `title`
- Replace the intro paragraph text from the body of `problem.md`
- Replace pain-point list item strings (parse list items from markdown body)

### Solution (`components/Solution.tsx`)

- Replace the section title string with `solution.md` frontmatter `title`
- Replace the subtitle/description string with `subtitle` from frontmatter
- Replace tag strings in the tags array with `tags` from frontmatter

### CTA Section (`app/page.tsx`)

- Replace CTA heading text if specified in config
- Replace supporting text above the form
- Do NOT touch `<WaitlistForm />` or any surrounding structure

## Step 3: Update Colors (`config/style.json`)

In `app/globals.css`, update **only the hex values** of existing CSS variables. Do not add, remove, or rename variables.

Map `style.json` colors to CSS variables:
- `colors.background` → `--background`
- `colors.text` → `--foreground`
- `colors.primary` → `--primary`
- `colors.secondary` → `--secondary`
- `colors.muted` → `--muted`

**CORRECT** - Only changing the hex value:
```css
/* Before */
--primary: #8b5cf6;

/* After */
--primary: #3b82f6;
```

**INCORRECT** - Adding or changing variable names:
```css
/* DO NOT DO THIS */
--primary-color: #3b82f6;
--new-accent: #ef4444;
```

## Step 4: Preserve Everything Else

Leave these completely unchanged:
- All `className` attributes in components
- All component imports and exports
- All HTML/JSX element structure
- All event handlers and logic
- CSS variable names (only change their values)
- Layout files (`layout.tsx`)
- API routes and lib utilities
- Form component internals

## Example: Correct vs Incorrect (Text)

**CORRECT** - Only changing text:
```tsx
// Before
<h1 className="text-5xl font-bold">Old Headline</h1>

// After (only the string changed)
<h1 className="text-5xl font-bold">New Headline from Config</h1>
```

**INCORRECT** - Changing structure or classes:
```tsx
// DO NOT DO THIS
<h1 className="text-6xl font-extrabold text-primary">New Headline</h1>
```

## Summary Checklist

- [ ] Read config/mission.md, config/problem.md, config/solution.md, config/style.json
- [ ] Replace only text strings in Hero, Problem, Solution components
- [ ] Replace CTA text in app/page.tsx (text only)
- [ ] Update CSS variable hex values in globals.css from style.json colors
- [ ] Verify no structural changes were made to components
- [ ] Verify no CSS variable names were added or removed
- [ ] Leave all other files untouched

After applying changes, only the visible text and colors should be different. The page structure, layout, and functionality must remain identical to the original boilerplate.
