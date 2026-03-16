# Creek Lend

A modern loan application and management platform built for Creek Financial Services.

---

## Technology Stack

### Platform

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Hosting    | **Vercel** (Serverless)           |
| Runtime    | **Node.js**                       |
| Language   | **TypeScript 5.9**                |

### Frontend

| Category          | Technology                                      |
| ----------------- | ----------------------------------------------- |
| Framework         | **Next.js 16** (App Router, Server Components)  |
| UI Library        | **React 19**                                    |
| Styling           | **Tailwind CSS 4**                              |
| Form Validation   | **Zod 4** (schema-based validation)             |
| Notifications     | **React Hot Toast**                             |
| Maps              | **Google Maps JS API** (@googlemaps/js-api-loader) |
| Icons             | **Lucide React**                                |

### Backend

| Category          | Technology                                                  |
| ----------------- | ----------------------------------------------------------- |
| API Layer         | **Next.js API Routes** (proxied to backend via rewrites)    |
| Backend Server    | Separate **Vercel**-hosted backend (`loan-app-ka1t.vercel.app`) |
| Authentication    | Custom admin authentication (token-based)                   |
| Middleware        | **Next.js Middleware** for route protection                 |

### Database

| Category   | Technology                                     |
| ---------- | ---------------------------------------------- |
| Database   | **Neon PostgreSQL** (Serverless Postgres)      |
| Driver     | **@neondatabase/serverless** (HTTP-based driver) |

### Analytics & Tracking

| Category   | Technology                  |
| ---------- | --------------------------- |
| Analytics  | **Google Analytics (GA4)**  |
| Pixel      | **Facebook Pixel**          |

### Security

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy` headers
- `X-XSS-Protection` enabled
- `Referrer-Policy: strict-origin-when-cross-origin`
- Console logs removed in production

### Build & Dev Tools

| Tool       | Version / Details     |
| ---------- | --------------------- |
| ESLint     | 9.x (with Next.js config) |
| PostCSS    | 8.x                  |
| Autoprefixer | 10.x               |
| Critters   | CSS inlining optimization |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard
│   ├── apply/              # Loan application flow
│   ├── contact/            # Contact page
│   ├── faq/                # FAQ page
│   ├── how-it-works/       # How it works page
│   ├── loan-status/        # Loan status tracker
│   ├── rates-and-fees/     # Rates & fees info
│   ├── verify-bank/        # Bank verification
│   ├── privacy-policy/     # Legal pages
│   ├── terms-of-service/
│   ├── fair-lending/
│   └── direct-lender-disclosure/
├── components/             # Reusable UI components
│   ├── analytics/          # Analytics & tracking
│   ├── forms/              # Form components
│   ├── layout/             # Layout components (Header, Footer)
│   ├── sections/           # Page sections
│   └── ui/                 # Base UI components
├── lib/                    # Utilities & shared logic
│   ├── api.ts              # API helper
│   ├── admin-auth.tsx      # Admin authentication
│   ├── validation.ts       # Client-side validation
│   ├── constants.ts        # App constants
│   ├── utils.ts            # Utility functions
│   └── server/             # Server-side logic
├── middleware.ts            # Route middleware
├── styles/                 # Global styles
└── types/                  # TypeScript type definitions
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Environment Variables

| Variable                        | Description                        |
| ------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_API_URL`           | Backend API base URL               |
| `NEXT_PUBLIC_API_URL_OVERRIDE`  | Optional API URL override          |

---

## Deployment

The application is deployed on **Vercel** with automatic deployments from the Git repository. The frontend and backend are hosted as separate Vercel projects with API requests proxied via Next.js rewrites.
