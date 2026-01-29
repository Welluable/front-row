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

3. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## How to Customize

Edit the landing page content and styles in `app/page.tsx` and `app/globals.css`. Form logic, API route, and spam protection live in `components/WaitlistForm.tsx` and `app/api/waitlist/route.ts`.


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
