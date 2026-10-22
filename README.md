# Behind the Bite

Independent hackathon prototype: an immersive, accessible web app that helps young people discover engineering careers in food manufacturing.

**Not affiliated with, endorsed by, or connected to Mondelēz International or any employer systems.**

## Product

Familiar snack → hidden engineering → playable mission → explained career route → a next step that can actually be taken.

Public navigation: Explore / Try a shift / Find your route / My next steps / My Bite, plus Ask the team and a discreet Employer demo.

New in this build:
- Sandwich biscuit layered explorer (`/explore/sandwich-biscuit`)
- Private **My Bite** profile (`/profile`) with saved interests and activity
- Optional onboarding and site accessibility preferences
- Demo inbox with user/admin threads (`/profile/messages`, `/admin/inbox`)
- Authored sample translation thread (`BTB-1042`) — live translation is not configured unless `TRANSLATE_API_KEY` and a provider are wired server-side

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Demo storage

The prototype runs in **demo mode** with deterministic seed data. Edits, routes, action plans and analytics events are saved in **this browser** (`localStorage`) behind a storage adapter.

- Changes are **not** shared across devices, browsers or teammates.
- The employer area is **passwordless on purpose** and is **not secure**.
- Reset from `/demo` or Admin → Settings.
- Corrupted storage falls back to seed content.
- Visitor, Jordan and graduate workspaces are stored separately. Resetting Jordan does not erase the visitor workspace.
- Support preferences stay private unless ticked on a message.
- Internal admin notes never appear in the visitor thread.
- Messaging is simulated in this browser. No email is sent.

If a shared backend is added later, keep it behind the same adapter. Do not put secrets in client code.

## Architecture

- Next.js App Router + TypeScript + Tailwind CSS
- Motion for React, Lucide, Recharts, Zod, Radix primitives
- `lib/content` — typed models and seed CMS
- `lib/storage` — browser / memory adapter
- `lib/simulation` — packaging, cooling and pack-option models
- `lib/recommendations` — transparent rule-based route suggestions
- `lib/analytics/funnel` — sample cohort vs this browser’s events (never mixed)

## Demonstration journey (about 3 minutes)

1. Home → Explore a chocolate bar
2. Open **Equipment and automation**
3. Play **Packaging Detective**
4. Open the related career
5. Generate a route (`/find-your-route`)
6. Save a next step
7. `/admin` → “This browser’s demo activity”

Presenter launcher: `/demo` (Jordan conversation journey, chocolate path, graduate, dashboard, Jordan-only reset).

## Deployment (Vercel)

No environment variables are required for demo mode.

```bash
npm run build
npx vercel
```

Or import the Git repository in the Vercel dashboard (framework: Next.js).

This README does not claim a live URL until a deployment has been verified.

## Remaining deployment step

Vercel CLI was not logged in on this machine (`vercel whoami` → Logged out).

1. `npx vercel login`
2. `npx vercel --prod`
3. Open the printed URL and walk the chocolate → mission → route → admin path.

## Checks run locally

- `npx vitest run` — 14 tests passed (simulation, recommendations, funnel, CSV escaping, content persistence)
- `npx tsc --noEmit` — passed
- `npx eslint .` — passed
- `npx next build` — passed
- Browser: home, chocolate explorer stations, Packaging Detective (observe → inspect → hypothesis → compare → complete), route finder back/continue, admin sample vs this-browser funnel

Not claimed: a verified production URL (not deployed).
