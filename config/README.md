# Config Files

Edit these files to customize your waitlist landing page. After editing, use the Cursor skill **generate-waitlist** to apply changes to the boilerplate.

## Content Files (Markdown + Frontmatter)

### mission.md

Hero section content.

- **headline** – Main headline (supports inline text and gradient span)
- **subheadline** – Supporting text below the headline
- **cta** – Call-to-action button text (e.g. "Join the Waitlist")
- Body – Optional extended mission description

### problem.md

Pain points section.

- **title** – Section heading
- Body – Paragraph and bullet list of pain points

### solution.md

How your product solves the problem.

- **title** – Section heading
- **subtitle** – Short tagline
- **tags** – Array of short feature tags (e.g. "Fast setup", "No bloat")
- Body – Supporting copy

## Structured Config (JSON)

### style.json

Theme and visual style.

- **colors** – `primary`, `secondary`, `background`, `text`, `muted` (hex)
- **fonts** – `heading`, `body` (font names)
- **preset** – `"dark-gradient"` | `"minimal-light"` | `"bold-colorful"` (optional)

### meta.json

Site metadata and SEO.

- **title** – Page title and default OG title
- **description** – Meta description and default OG description
- **ogImage** – Path to Open Graph image
- **favicon** – Path to favicon

## Workflow

1. Edit the config files above.
2. In Cursor, run the **generate-waitlist** skill (or ask: "Generate my waitlist page from the config files").
3. The skill will update the landing page components and styles to match your config.
