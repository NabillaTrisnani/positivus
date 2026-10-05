# Positivus

Company profile / landing page website for a digital marketing agency, complete with an admin (CMS) page to manage landing page content.

The public page displays: partners/logos, services, case studies, working process, team, testimonials, contact, and newsletter subscription. All of this content can be managed via the admin dashboard.

## Design Credit

UI design based on [Positivus Landing Page Design](https://www.figma.com/community/file/1230604708032389430/positivus-landing-page-design) by [Olga](https://www.figma.com/files/team/1302855487434660655/resources/community/@olgaaverchenko?fuid=803620011251670922) from Figma Community.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL + Prisma ORM 7
- **Auth:** JWT (`jose` / `jsonwebtoken` + `bcryptjs`), admin route protection via `middleware.ts` + `token` cookie
- **Image upload:** Cloudinary (`cloudinary` + `next-cloudinary`)
- **Additional UI:** `lucide-react`, `react-slick` + `slick-carousel`

## Requirements

- Node.js 20+ (LTS recommended)
- npm
- A running PostgreSQL instance (local / remote)
- A Cloudinary account (for image uploads)

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/positivus"
JWT_SECRET="fill-with-a-long-random-string"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_URL="cloudinary://api-key:api-secret@cloud-name"
```

> `DATABASE_URL` is used by Prisma, `JWT_SECRET` for admin login, and the Cloudinary credentials for photo/logo uploads.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up the database (create tables from migrations)
npx prisma migrate dev

# 3. Seed initial data (optional, from prisma/seed.ts)
npx prisma db seed

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The admin page is at `http://localhost:3000/admin`, you need to log in first at `http://localhost:3000/login`.

## Available Scripts

| Script        | Description              |
| ------------- | ------------------------ |
| `npm run dev`   | Run in development mode  |
| `npm run build` | Build for production     |
| `npm run start` | Run the production build |
| `npm run lint`  | Run ESLint               |

## Features Overview

**Public page (`/`):**
- Responsive landing page (hero, partners, services, case studies, working process, team, testimonials, contact, footer)

**Admin pages (`/admin/*`, login required):**
- CRUD for Services, Case Studies, Working Process, Team, Testimonials, Partners, Social Media
- View Contact messages & Subscription (newsletter) data
- Image uploads to Cloudinary

**API (`/api/*`):**
- `auth` — login/logout
- `landingpage` — aggregated data for the front page
- `service`, `case-study`, `working-process`, `team`, `testimonial`, `partner`, `social-media`, `contact`, `subscription`
