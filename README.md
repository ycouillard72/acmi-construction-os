# ACMI Construction OS — MVP scaffold

A polished, multi-tenant contractor operating workspace for a Florida general contractor and roofing company. The first MVP includes an interactive demo UI, a PostgreSQL/Supabase-compatible schema, realistic seed data, role-based access foundations, server endpoints, and typed integration contracts—without connecting external credentials.

## Included modules

- Operating dashboard with pipeline, production, schedule, job-cost, and attention signals
- Contacts and companies relationship directory
- Leads and opportunities Kanban pipeline
- Property records shared across sales, estimating, and production
- Estimates with value, cost, margin, version, and status foundations
- Projects/jobs with GC and roofing stages plus basic job-cost fields
- Subcontractor/vendor directory with COI and performance fields
- Document metadata register prepared for SharePoint/OneDrive
- Tasks and activities for follow-ups, site work, inspections, and milestones
- Role preview and a server-side permission matrix for six tenant roles
- Integration placeholders for Microsoft 365, email, Power Automate/webhooks, and AI

The UI starts in demo mode and requires no account or external service. Quick-create interactions intentionally save a local draft message only until authentication and persistence are connected.

## Stack

- Next.js-style App Router UI on React 19 and TypeScript
- Vinext/Vite build targeting Cloudflare Worker-compatible ESM
- PostgreSQL 15+ schema designed for Supabase Auth and Row Level Security
- Plain SQL migrations and seeds, keeping the data layer portable
- Typed service boundaries for future integrations

## Run locally

Requirements: Node.js 22.13 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
npm run build
npm run lint
```

The app remains fully usable in demo mode with blank environment variables.

## Connect Supabase later

1. Create a dedicated Supabase project for the desired environment.
2. Apply `supabase/migrations/0001_acmi_contractor_os.sql`.
3. Apply `supabase/seed.sql` only to a local or preview environment.
4. Copy the project URL and keys into `.env.local`.
5. Replace the demo repositories with tenant-scoped Supabase repositories.
6. Create tenant, profile, and first administrator membership in one service-role onboarding transaction.
7. Test all Row Level Security policies with at least two tenants before production.

Do not expose `SUPABASE_SERVICE_ROLE_KEY` or any provider secret to browser code.

## Environment variables

| Variable | Purpose | Current MVP behavior |
|---|---|---|
| `DATABASE_URL` | Server-side PostgreSQL connection | Optional / unused in demo mode |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Optional / unused in demo mode |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase client key | Optional / unused in demo mode |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged onboarding/background work | Placeholder; server only |
| `NEXT_PUBLIC_APP_URL` | Canonical app origin | Defaults to local development |
| `DEFAULT_TENANT_SLUG` | Initial tenant lookup | `acmi-construction` |
| `APP_ENCRYPTION_KEY` | Application-managed encryption if needed | Placeholder |
| `MICROSOFT_*` | Microsoft Entra/Graph and SharePoint setup | Placeholders only |
| `EMAIL_*` | Transactional email provider | Placeholders only |
| `WEBHOOK_SIGNING_SECRET` | Signed inbound/outbound automation events | Placeholder only |
| `POWER_AUTOMATE_WEBHOOK_URL` | Power Automate trigger endpoint | Placeholder only |
| `OPENAI_API_KEY` | Future tenant-scoped AI service | Placeholder only |

## Database design

The SQL migration creates:

- tenancy and access: `tenants`, `profiles`, `memberships`
- CRM: `companies`, `contacts`, `properties`, `opportunities`
- preconstruction: `estimates`, `estimate_items`
- operations: `projects`, `project_cost_entries`
- partners/compliance: `partners`
- collaboration: `documents`, `activities`
- integrations/audit: `integration_connections`, `webhook_events`, `audit_events`

Every operational table carries a required `tenant_id`. Row Level Security checks active membership before reads and role membership before writes. The generic first migration is deliberately conservative; production work should narrow field-crew and accounting writes with table-specific column controls or trusted server actions.

## Server endpoints

- `GET /api/health` — build mode, database readiness, and integration placeholder status
- `GET /api/demo/dashboard` — tenant-scoped demo dashboard payload

These endpoints return non-sensitive demo data and establish the shape for authenticated server routes.

## Systems-of-record boundary

This application is the command, visibility, and workflow layer. Until deliberate integrations are complete, signed contracts, official accounting/job-cost transactions, payroll, regulated safety records, and insurer-required claim documents should remain in their designated systems of record. The UI communicates that boundary directly.

## Prioritized next phases

1. **Authentication + persistence:** Supabase Auth, tenant onboarding, repository layer, server actions, audit trail, and verified cross-tenant tests.
2. **Microsoft 365 foundation:** Entra OAuth, SharePoint project folders, OneDrive links, Outlook calendar/email, secret storage, and sync observability.
3. **CRM + estimating workflow:** lead capture API, duplicate handling, estimating line items, proposal generation, approvals, e-sign handoff, and follow-up automation.
4. **Project execution:** schedules, daily logs, photos, inspections, purchase orders, change orders, submittals, punch lists, and warranty closeout.
5. **Financial controls:** accounting integration, cost-code mapping, commitments versus actuals, billing/draws, lien-waiver status, and margin exception alerts.
6. **Trade-partner portal:** onboarding, W-9/COI collection, invitations, bid requests, performance scorecards, and expiration notifications.
7. **Automation + AI:** signed webhooks, Power Automate flows, permission-aware search, project summaries, draft communications, and human approval gates.

See `docs/ARCHITECTURE.md` for deeper component, security, integration, and deployment decisions.

