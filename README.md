# Waitlist Page Generator

A config-driven waitlist landing page built with Next.js, TypeScript, Tailwind CSS, and Prisma Postgres. Edit markdown and JSON config files, then use the included Cursor skill to generate your page.

## Features

- **Config-driven content**: Mission, problem, solution, and style live in `/config`
- **Dark gradient boilerplate**: Ready-made landing page with Hero, Problem, Solution, and CTA
- **Waitlist signups**: Email form with Prisma Postgres storage
- **Spam protection**: Honeypot, rate limiting, timing check, and email validation
- **Cursor skill**: Generate the page from config files without editing components by hand

## Quick Start

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Set up the database**

   Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL connection string. Then:

   ```bash
   npm run db:push
   ```

   Or run the full setup:

   ```bash
   npm run setup
   ```

3. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## How to Customize

1. **Edit config files** in `/config`:
   - `mission.md` – Hero headline, subheadline, CTA text
   - `problem.md` – Pain points section
   - `solution.md` – How you solve it and feature tags
   - `style.json` – Colors (primary, secondary, background, text), fonts, preset
   - `meta.json` – Site title, description, OG image, favicon

2. **Generate the page**  
   In Cursor, run the **generate-waitlist** skill or say: *"Generate my waitlist page from the config files."*  
   The skill reads the config and updates the landing page components and styles.

3. **Do not edit** the form logic, API route, or spam protection unless you know what you’re doing; the skill is designed to leave those unchanged.

See `config/README.md` for a full description of each config file.

## Scripts

| Script       | Description                    |
|-------------|--------------------------------|
| `npm run dev` | Start development server       |
| `npm run build` | Production build             |
| `npm run start` | Start production server       |
| `npm run setup` | Install deps, generate Prisma client, push schema |
| `npm run db:push` | Push Prisma schema to the database |
| `npm run db:studio` | Open Prisma Studio          |

## Environment Variables

| Variable       | Required | Description                          |
|----------------|----------|--------------------------------------|
| `DATABASE_URL` | Yes      | PostgreSQL connection string         |

For standard PostgreSQL (e.g. with `@prisma/adapter-pg`), use a `postgresql://` URL. For Prisma Postgres, use the URL provided by their service (e.g. `prisma+postgres://...`); you may need to use their recommended client setup.

## Deployment

- **Vercel**: Connect the repo, set `DATABASE_URL` in the project environment, and deploy. Run migrations (e.g. `db:push`) via a one-off command or CI step.
- **Other platforms**: Ensure Node.js 18+ and set `DATABASE_URL`. Run `npm run build` and `npm run start` (or your host’s equivalent).

## License

MIT
