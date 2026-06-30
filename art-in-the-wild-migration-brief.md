# Art in the Wild — Migration Brief
**From:** MERN (MongoDB, Express, React/Vite, Node) + Heroku
**To:** Strapi (backend/CMS) + Next.js (frontend)

This is a working brief intended to be handed to Claude Code as a starting point. Each phase is meant to be a self-contained session — get it working, verify it, commit, then move to the next phase.

---

## Current Architecture (for reference)
- `server.js` — Express entry point
- `config/` — DB connection, auth/middleware config
- `controllers/` — route handlers (likely: art pieces, users, auth, uploads)
- `models/` — Mongoose schemas (Art, User, possibly Favorites)
- `src/` — React frontend (Vite-built)
- `public/` — static assets
- Auth: JWT-based sessions
- Storage: Amazon S3 for uploaded art photos
- Maps/Geocoding: Mapbox
- Hosting: Heroku

---

## Phase 0 — Inventory & Safety Net
Before touching anything:
1. Document every API route currently exposed by Express (method, path, auth requirement, request/response shape). This becomes your contract that Strapi needs to replicate.
2. List every Mongoose schema and field, including relationships (e.g., does a User have many Art pieces? Favorites as a join?).
3. Confirm environment variables in use (Mongo URI, JWT secret, S3 keys, Mapbox token) — Strapi and Next.js will need their own equivalents.
4. Create a new branch (e.g., `migration/strapi-nextjs`) so `main` stays deployable throughout.

**Goal:** a written map of the current system so nothing gets lost in translation.

---

## Phase 1 — Next.js Frontend, Old Backend Still Running
Lowest-risk starting point — swap the frontend shell without touching data.

1. Scaffold a new Next.js app (App Router) alongside the existing `src/`.
2. Port over components from `src/` into Next.js, converting React Router routes into Next.js file-based routes.
3. Point the new Next.js app at your **existing Express API** (no backend changes yet) — just update fetch calls to use the same endpoints.
4. Re-implement JWT auth handling in Next.js (likely via cookies + middleware instead of whatever client-side token storage you're using now).
5. Port the Mapbox integration — this is mostly portable as-is since it's client-side JS.
6. Get it running locally, side by side with the old frontend, against the same Express backend.

**Goal:** Next.js fully replaces the Vite/React frontend, still talking to Express/MongoDB.

---

## Phase 2 — Strapi Backend, Content Types
Now rebuild the backend independently, without breaking Phase 1's working frontend.

1. Spin up a fresh Strapi project (separate from the Express app).
2. Recreate your Mongoose models as Strapi content types:
   - Art piece (title, artist, description, year, location/coordinates, photo, owner relation)
   - User (Strapi's built-in `users-permissions` plugin replaces your custom JWT auth)
   - Favorites (likely a many-to-many relation between User and Art piece)
3. Set up Strapi's S3 upload provider (`@strapi/provider-upload-aws-s3`) to point at your existing bucket — you may be able to reuse already-uploaded images without re-uploading everything.
4. Configure `users-permissions` roles/permissions to match your current public vs. authenticated access rules.
5. Define API permissions per content type (who can read/create/update art pieces, favorites, etc.).

**Goal:** Strapi running locally with content types mirroring your current data model, and the admin panel usable to create test entries.

---

## Phase 3 — Data Migration
1. Write a one-off script to read from MongoDB and POST into Strapi's REST/GraphQL API (or use Strapi's data import tools if applicable).
2. Migrate in dependency order: Users first, then Art pieces, then Favorites (relations need both sides to exist).
3. Spot-check a sample of migrated records against the original data.
4. Decide what happens to existing S3 image URLs — ideally Strapi just references the same S3 keys rather than re-uploading.

**Goal:** Strapi's database has a faithful copy of your production MongoDB data.

---

## Phase 4 — Rewire Next.js to Strapi
1. Replace Express API calls in the Next.js app with Strapi's REST (or GraphQL) endpoints.
2. Swap your custom JWT auth flow for Strapi's `users-permissions` auth endpoints (`/api/auth/local`, etc.) — adjust login/register/profile pages accordingly.
3. Update the upload flow (art submission form) to hit Strapi's upload API instead of your old controller.
4. Re-test search/filter functionality (title, artist, zip code) — confirm Strapi's filtering/query syntax covers what your old MongoDB queries did, or add custom Strapi controllers/routes if not.
5. Re-test the map page, profile page, and individual art detail page end-to-end against live Strapi data.

**Goal:** Next.js + Strapi fully replace Express + MongoDB + Vite/React in your local dev environment.

---

## Phase 5 — Deployment
1. Decide hosting for each piece — Strapi typically needs a persistent server (Railway, Render, DigitalOcean, etc. — Heroku also works), Next.js deploys cleanly to Vercel or can stay on Heroku.
2. Set up production environment variables for both apps (DB connection, S3, Mapbox, Strapi admin secrets).
3. Point production S3 bucket and Mapbox token at the new apps.
4. Run the data migration script against production MongoDB → production Strapi.
5. Cut over DNS/domain once verified.
6. Keep the old Heroku app dormant (not deleted) for a rollback window.

**Goal:** Live cutover with a rollback path.

---

## Suggested Order of Operations Summary
| Phase | What changes | What stays the same |
|---|---|---|
| 1 | Frontend → Next.js | Backend stays Express/MongoDB |
| 2 | Backend → Strapi (parallel, not live) | Old Express app still running |
| 3 | Data migrated to Strapi | — |
| 4 | Next.js rewired to Strapi | Old Express app now unused |
| 5 | Deploy | — |

---

## Notes for the Claude Code Session
- Work phase by phase, in separate commits, on the `migration/strapi-nextjs` branch.
- Keep the old Express/Vite app untouched and runnable until Phase 4 is verified — it's your fallback.
- Flag any place where Strapi's data model can't cleanly express something MongoDB allowed (e.g., flexible/nested fields) so a decision can be made rather than silently dropping data.
- Ask before deleting or overwriting anything in `models/`, `controllers/`, or `config/` — these are reference material until the migration is verified complete.