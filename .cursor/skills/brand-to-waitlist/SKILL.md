---
name: brand-to-waitlist
description: Read brand messaging from brand.md (Why, How, What) and update the waitlist landing page to incorporate that message. Use when the user wants to update the landing page from their brand file, or asks to "apply brand messaging" or "update page from brand.md".
---

# Brand to Waitlist

Update the waitlist landing page based on Golden Circle brand messaging (Why, How, What).

## File Locations

- **Brand file**: `.cursor/config/brand.md`
- **Landing page**: `app/page.tsx`
- **Layout/metadata**: `app/layout.tsx`

## Workflow

1. **Read the brand file** at `.cursor/config/brand.md`
2. **Parse the four sections**: Name, Why, How, What
3. **Update `app/page.tsx`** and `app/layout.tsx` with the content mapped as follows:

| Brand Section | Page Element | Purpose |
|---------------|--------------|---------|
| **Name** | Page title & metadata (`layout.tsx`) | Brand name for title, meta tags |
| **Why** | Main headline (`<h1>`) | Emotional hook, the purpose/belief |
| **How** | Subheadline (first `<p>`) | Value proposition, the unique approach |
| **What** | Description (second `<p>`) | Product details, the concrete offering |

## brand.md Format

The brand file should have this structure:

```markdown
# Brand Messaging

## Name
[Your brand/product name]

## Why
[Your purpose, cause, or belief - the emotional reason you exist]

## How
[Your unique value proposition - how you deliver on the why]

## What
[Your product/service - what you actually offer]
```

## Content Mapping Details

### Name → Page Title & Metadata
- Update the `metadata` object in `app/layout.tsx`
- Set `title` to the brand name
- Set `description` using content from How or What sections

### Why → Headline
- Craft a compelling headline from the Why section
- The headline should be dynamic—no fixed format required
- Use the gradient-styled `<span>` to highlight 1-3 key words
- Keep the full headline concise (under 15 words total)
- Examples of valid headline structures:
  - "Build something **people love**"
  - "**Financial freedom** without the complexity"
  - "The smartest way to **manage your money**"
  - "Stop guessing. Start **knowing**."

### How → Subheadline
- Use as the first paragraph under the headline
- Should be 1-2 sentences max
- Focus on the unique approach or benefit

### What → Description
- Use as the second paragraph
- Can be longer, providing more detail
- End with a call-to-action feeling

## Example

**brand.md:**
```markdown
## Name
MoneyMind

## Why
We believe everyone deserves financial freedom without complexity.

## How
AI-powered insights that simplify your money decisions.

## What
A personal finance app that learns your habits and automates your savings, investments, and budgets—no expertise required.
```

**Resulting layout.tsx metadata:**
```tsx
export const metadata: Metadata = {
  title: "MoneyMind",
  description: "AI-powered insights that simplify your money decisions.",
};
```

**Resulting page.tsx updates:**
```tsx
<h1>
  <span className="...">Financial freedom</span>{" "}
  without the complexity
</h1>
<p className="...">
  AI-powered insights that simplify your money decisions.
</p>
<p className="...">
  A personal finance app that learns your habits and automates your savings, investments, and budgets—no expertise required. Be the first to know when we launch.
</p>
```

## Error Handling

- If `brand.md` doesn't exist, notify the user and offer to create a template
- If sections are missing, warn the user about which sections need content
- Preserve the existing page structure and styling—only update text content
