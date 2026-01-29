# Waitlist Page Generator

A waitlist landing page built with Next.js, TypeScript, Tailwind CSS, and Prisma Postgres.

## Features

- **Dark gradient boilerplate**: Ready-made landing page with Hero and CTA
- **Waitlist signups**: Email form with Prisma Postgres storage
- **Spam protection**: Honeypot, rate limiting, timing check, and email validation

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

3. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in the values:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values:

   | Variable | Required | Description |
   |----------|----------|-------------|
   | `DATABASE_URL` | **Yes** | PostgreSQL connection string (see below) |
   | `ADMIN_EMAIL` | **Yes** | Admin user email for login |
   | `ADMIN_PASSWORD` | **Yes** | Admin user password (plain text, hashed on creation) |
   | `ADMIN_NAME` | No | Display name for admin user (default: "Admin") |

   **Database URL formats:**
   - **Prisma Postgres**: `prisma+postgres://accelerate.prisma-data.net/?api_key=...`
   - **Standard PostgreSQL**: `postgresql://user:password@localhost:5432/dbname`
   - **Connection pooling**: `postgresql://user:password@host:5432/db?pgbouncer=true`

4. **Create admin user**

   After setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`, run:

   ```bash
   npm run create-admin
   ```

   This creates (or updates) an admin user in the database. You can re-run this command anytime to reset the admin password.

5. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Admin Dashboard

Once you've created an admin user, access the admin dashboard at `/admin`:

- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Login**: Use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env` file
- **Features**: View all waitlist signups with email, IP hash, source, and signup date

The admin authentication uses session storage (browser-based). To change the admin password, update `ADMIN_PASSWORD` in `.env` and run `npm run create-admin` again.

## Customize for your own brand

The project uses a single brand config so you can change the messaging in one place and have it reflected on the landing page and metadata.

### 1. Edit the brand config

Edit **`.cursor/config/brand.md`**. It uses the Golden Circle structure:

| Section | Purpose | Where it appears |
|--------|---------|-------------------|
| **Name** | Your product/brand name | Page title, meta description, header |
| **Why** | Your purpose or belief (emotional hook) | Main headline (`<h1>`) |
| **How** | Your unique value proposition | Subheadline (first paragraph) |
| **What** | What you actually offer | Description (second paragraph) |

Example `.cursor/config/brand.md`:

```markdown
# Brand Messaging

## Name
Your Product Name

## Why
Your purpose or belief—the emotional reason you exist.

## How
Your unique value proposition—how you deliver on that why.

## What
What you actually make or offer. Be specific.
```

### 2. Apply brand to the page

- **With Cursor**: Ask the AI to “apply brand messaging” or “update page from brand.md”. It will read `.cursor/config/brand.md` and update `app/page.tsx` (headline, subheadline, description) and `app/layout.tsx` (title, meta description, header).
- **Manually**: After editing `brand.md`, copy the content into:
  - **`app/layout.tsx`** — `metadata.title`, `metadata.description`, and the header brand name (e.g. `BRAND_NAME`).
  - **`app/page.tsx`** — the `<h1>`, first `<p>` (subheadline), and second `<p>` (description).

### 3. Optional: colors and styles

- **Theme/colors**: Edit CSS variables in **`app/globals.css`** (e.g. `--primary`, `--secondary`, `--background`, `--foreground`) to match your brand.
- **Form and API**: Form UI and logic live in **`components/WaitlistForm.tsx`**; the signup API and spam checks are in **`app/api/waitlist/route.ts`**.


## Scripts

| Script       | Description                    |
|-------------|--------------------------------|
| `npm run dev` | Start development server       |
| `npm run build` | Production build             |
| `npm run start` | Start production server       |
| `npm run setup` | Install deps, generate Prisma client, push schema, create admin |
| `npm run create-admin` | Create/update admin user from .env credentials |
| `npm run db:push` | Push Prisma schema to the database |
| `npm run db:studio` | Open Prisma Studio          |

## Environment Variables

| Variable       | Required | Description                          |
|----------------|----------|--------------------------------------|
| `DATABASE_URL` | **Yes**  | PostgreSQL connection string         |
| `ADMIN_EMAIL` | **Yes**  | Admin user email for dashboard login |
| `ADMIN_PASSWORD` | **Yes**  | Admin user password (plain text in .env, hashed in database) |
| `ADMIN_NAME` | No  | Admin display name (default: "Admin") |

**Database URL formats:**
- **Prisma Postgres**: `prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_KEY`
- **Standard PostgreSQL**: `postgresql://user:password@localhost:5432/dbname`
- **With connection pooling**: Add `?pgbouncer=true` or similar based on your provider

After setting these variables, run `npm run create-admin` to create the admin user in the database.

## Deployment

- **Vercel**: Connect the repo, set `DATABASE_URL` in the project environment, and deploy. Run migrations (e.g. `db:push`) via a one-off command or CI step.
- **Other platforms**: Ensure Node.js 18+ and set `DATABASE_URL`. Run `npm run build` and `npm run start` (or your host’s equivalent).

## License

MIT
