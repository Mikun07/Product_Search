# DevOps and Deployment Strategy

**Project:** MikunStore  
**Version:** v0.1.0  
**Date:** 2025-06-28  
**Author:** Festus-Olaleye Ayomikun  
**Status:** Approved

---

## Table of Contents

1. [Operational Requirements](#1-operational-requirements)
2. [Environment Strategy](#2-environment-strategy)
3. [Containerisation Strategy](#3-containerisation-strategy)
4. [CI/CD Pipeline Design](#4-cicd-pipeline-design)
5. [Infrastructure Architecture](#5-infrastructure-architecture)
6. [Configuration Management](#6-configuration-management)
7. [Monitoring Strategy](#7-monitoring-strategy)
8. [Logging Strategy](#8-logging-strategy)
9. [Backup and Recovery](#9-backup-and-recovery)
10. [Incident Management](#10-incident-management)
11. [Scalability Assessment](#11-scalability-assessment)
12. [Cost Analysis](#12-cost-analysis)
13. [Operational Readiness](#13-operational-readiness)
14. [Learning Concept: GitHub Actions](#14-learning-concept-github-actions)

---

## 1. Operational Requirements

Derived from the requirements and architecture documents:

| Requirement | Source | Target |
|---|---|---|
| Availability | NFR-005 | Application loads from CDN; no backend dependency at v0.1.0 |
| Performance | NFR-001 | Lighthouse Performance 90+; served from CDN edge |
| Deployment repeatability | Version Control framework | Every push to `main` triggers an automated build and deploy |
| Zero-downtime deploy | DevOps principle | Vercel atomic deployments ensure no downtime on update |
| Rollback capability | DevOps principle | Vercel maintains all previous deployments; instant rollback via dashboard |
| Secret management | NFR-007 to NFR-009 | No secrets at v0.1.0; v1.0.0 uses environment variables on Railway |
| Build reproducibility | DevOps principle | `npm ci` (not `npm install`) used in all CI pipelines |

---

## 2. Environment Strategy

### Development Environment

**Purpose:** Feature development and local testing  
**Infrastructure:** Developer machine  
**Command:** `npm run dev` (Vite dev server on port 5173)  
**Data:** `src/data/product.json` (static; no backend connection)  
**State:** Hot module replacement active; no persistence between server restarts beyond localStorage  
**Access:** Developer only

### Staging Environment

**Purpose:** Pre-production validation of each pull request  
**Infrastructure:** Vercel Preview Deployments (automatic on every pull request)  
**Command:** Triggered automatically by Vercel GitHub integration on PR open/update  
**URL:** Unique per PR (e.g. `mikunstore-git-feature-branch.vercel.app`)  
**Data:** Same static JSON as production  
**Access:** Developer and reviewers only (Vercel password protection optional)

### Production Environment

**Purpose:** Live application available to users  
**Infrastructure:** Vercel CDN (deployed from `main` branch)  
**URL:** Custom domain or `mikunstore.vercel.app`  
**Data:** Same static JSON at v0.1.0; PostgreSQL via Railway at v1.0.0  
**Access:** Public

---

## 3. Containerisation Strategy

### v0.1.0 Assessment

A `dockerfile` exists in the repository from a prior iteration. It runs `npm run dev` inside a container, which is not appropriate for production. The Vite dev server is not a production server.

**Decision for v0.1.0:** Docker is not used in the deployment pipeline. The application is a static SPA; the build output in `dist/` is deployed directly to Vercel CDN. No container runtime is needed.

**Revised dockerfile (for local reproducibility only):**

The dockerfile should be updated to serve the production build rather than the dev server. The appropriate pattern for a static SPA is:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

This multi-stage build produces a minimal nginx image that serves the production bundle. It is suitable for running the application locally in a container or for future self-hosted deployment.

### v1.0.0 Backend Containerisation

The backend repository will use Docker for the Node/Express API. The frontend repository does not change.

---

## 4. CI/CD Pipeline Design

### Pipeline file

Location: `.github/workflows/ci.yml`

### Pipeline stages

```
Push to main / PR to main
        |
        v
[Job 1: Lint]
  - Checkout code
  - Install dependencies (npm ci)
  - Run ESLint (zero warnings allowed)
        |
        | (on success)
        v
[Job 2: Build]
  - Install dependencies
  - Run npm run build
  - Upload dist/ as artifact
        |
        | (on success)
        v
[Job 3: E2E Tests]
  - Install dependencies
  - Download dist/ artifact
  - Start Vite preview server
  - Wait for server ready (port 4173)
  - Run Cypress headlessly
  - Upload screenshots on failure
  - Upload videos always
        |
        | (on all jobs success, main branch only)
        v
[Vercel auto-deploy]
  - Vercel GitHub integration detects main branch push
  - Deploys dist/ to CDN automatically
```

### Job dependencies

```
lint  -->  build  -->  e2e
```

E2E tests run against the production build artifact, not the dev server. This ensures that tests validate the same code that will be deployed.

### Rollback procedure

Vercel maintains a deployment history. To roll back:
1. Open the Vercel project dashboard
2. Navigate to the Deployments tab
3. Click "Promote to Production" on any previous deployment
4. The rollback completes in under 30 seconds

No code changes or git reverts are required for a Vercel rollback.

---

## 5. Infrastructure Architecture

### v0.1.0

```
GitHub Repository
       |
       | push to main
       v
GitHub Actions (ubuntu-latest runner)
       |
       | on success
       v
Vercel Edge Network (CDN)
  - HTML, JS chunks, CSS served from CDN edge nodes globally
  - No origin server; all assets are pre-built static files
       |
       v
Browser
```

**No server, no database, no backend process at v0.1.0.**

### v1.0.0 (planned)

```
GitHub Repositories (2)
  frontend-repo  -->  Vercel (static SPA)
  backend-repo   -->  Railway (Node/Express API)
                           |
                     Railway PostgreSQL
```

**Networking:**
- Frontend communicates with backend via HTTPS REST API calls
- CORS configured on the backend to allow requests from the Vercel domain only
- No direct database access from the frontend

---

## 6. Configuration Management

### v0.1.0

No environment variables are required. All configuration is embedded in source code (exchange rates, language strings, category list). This is acceptable because no sensitive values exist at v0.1.0.

### v1.0.0 Environment Variables

**Frontend (Vercel):**

| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API | `https://api.mikunstore.com` |

**Backend (Railway):**

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWT access tokens |
| `REFRESH_TOKEN_SECRET` | Secret for signing refresh tokens |
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGIN` | Frontend domain for CORS policy |

**Rules:**
- No secrets are committed to any repository
- Environment variables are set through the Vercel and Railway dashboards
- `.env` files are listed in `.gitignore`
- Developers use a `.env.local` file locally (not committed)

---

## 7. Monitoring Strategy

### v0.1.0

Vercel provides built-in analytics for the free tier:
- Page view counts
- Deployment status
- Build logs

No custom application monitoring is configured at v0.1.0.

### v1.0.0 (planned)

**System monitoring:** Railway provides CPU, memory, and network dashboards for the API container.

**Application monitoring:**

| Metric | Tool | Alert threshold |
|---|---|---|
| API response time (p95) | Railway metrics | Over 1000 ms for 5 minutes |
| API error rate (5xx) | Railway logs | Over 1% of requests in 5 minutes |
| Database connection pool | Railway metrics | Pool utilisation over 80% |

**Business monitoring:**

| Metric | Source | Review frequency |
|---|---|---|
| Orders created per day | PostgreSQL query on orders table | Weekly |
| Active users per day | Vercel analytics | Weekly |
| Cart abandonment rate | Orders created vs carts initiated | Monthly |

---

## 8. Logging Strategy

### v0.1.0

No server-side logging exists. Browser console logs are used during development and are not present in production builds (`console.log` statements are removed by Vite's production optimiser).

### v1.0.0 (planned)

**Structured logging format:**

All backend log entries will use JSON with the following fields:

```json
{
  "timestamp": "2025-06-28T12:00:00.000Z",
  "level": "info",
  "correlationId": "uuid-v4",
  "method": "POST",
  "path": "/api/v1/cart/items",
  "statusCode": 201,
  "durationMs": 45,
  "userId": "uuid-v4-or-null"
}
```

**Log levels:**

| Level | When used |
|---|---|
| `error` | Unhandled exceptions, database errors, authentication failures |
| `warn` | Deprecated endpoint called, slow query threshold exceeded |
| `info` | Request completed, order created |
| `debug` | Not emitted in production |

**Retention:** Railway persists logs for 7 days on the Starter plan. Critical errors will be forwarded to a free-tier Sentry project for error tracking and alerting.

**Correlation IDs:** Every HTTP request will receive a unique `X-Correlation-Id` header. This id is attached to every log line generated during that request, enabling full request tracing across middleware layers.

---

## 9. Backup and Recovery

### v0.1.0

No database exists. The only persistent data is in the user's browser (localStorage). No backup strategy is required.

### v1.0.0 (planned)

**Database backups:**

Railway Starter plan provides automatic daily PostgreSQL backups with a 7-day retention period.

**Recovery procedure:**

| Scenario | Recovery action | Target recovery time |
|---|---|---|
| Accidental data deletion | Restore from Railway daily backup | Under 30 minutes |
| Database corruption | Restore from Railway daily backup | Under 30 minutes |
| Full platform outage (Railway) | Deploy backend to Render (secondary platform) using the same environment variables | Under 2 hours |

**Recovery point objective (RPO):** 24 hours (daily backup cadence).  
**Recovery time objective (RTO):** 2 hours (manual recovery from backup).

---

## 10. Incident Management

### Incident Classification

| Severity | Definition | Example |
|---|---|---|
| P1: Critical | Production is completely unavailable | Vercel deploy failed; site returns 500 for all users |
| P2: Major | Core feature is broken for all users | Cart cannot be updated |
| P3: Minor | Non-critical feature is broken | Currency switcher shows wrong symbol |
| P4: Cosmetic | Visual issue with no functional impact | Discount badge overlaps image on one breakpoint |

### Detection

- P1/P2: Detected via Vercel deployment failure notification or user report
- P3/P4: Detected via Cypress CI failure or user report

### Response Procedure

1. Confirm the issue is reproducible
2. Classify severity
3. For P1: roll back to the previous Vercel deployment immediately; investigate root cause after service is restored
4. For P2+: open a GitHub issue with steps to reproduce; fix in a hotfix branch; merge through the full CI pipeline
5. Document root cause and add a regression test

---

## 11. Scalability Assessment

### v0.1.0

The application is a static SPA served from Vercel CDN. There is no origin server. Vercel's CDN scales automatically to any number of concurrent users at no additional cost on the Hobby plan.

The only scalability limit is the user's browser. Filtering 100 products in memory is O(n) and completes in under 1 ms on any modern device.

### v1.0.0 (planned)

| Concern | Assessment | Strategy |
|---|---|---|
| Concurrent API users | Railway Starter: single container | Acceptable for portfolio traffic; upgrade to Railway Pro if needed |
| Database connections | PostgreSQL connection pool (pg-pool) with max 10 connections | Sufficient for low concurrent load |
| Product catalogue growth | Currently 100 products; server-side pagination added at v1.0.0 | No client-side scaling concern |
| CDN scaling | Vercel handles automatically | No action required |

---

## 12. Cost Analysis

### v0.1.0 Monthly Cost

| Service | Plan | Cost |
|---|---|---|
| GitHub | Free | $0 |
| GitHub Actions | Free (2000 CI minutes/month) | $0 |
| Vercel (frontend) | Hobby (free) | $0 |
| **Total** | | **$0/month** |

### v1.0.0 Monthly Cost (estimated)

| Service | Plan | Cost |
|---|---|---|
| GitHub | Free | $0 |
| GitHub Actions | Free (2000 CI minutes/month) | $0 |
| Vercel (frontend) | Hobby (free) | $0 |
| Railway (Node/Express API) | Starter | $5/month |
| Railway (PostgreSQL) | Starter | $5/month |
| **Total** | | **~$10/month** |

**Cost optimisation notes:**
- Railway's free trial provides $5 of credit per month. The first month may be at zero cost.
- If traffic remains low (portfolio-level), the Railway Starter plan is sufficient indefinitely.
- Vercel Hobby plan supports unlimited bandwidth for personal projects.

---

## 13. Operational Readiness

| Gate | v0.1.0 Status |
|---|---|
| CI/CD pipeline defined | Complete: `.github/workflows/ci.yml` |
| Infrastructure defined | Complete: Vercel CDN |
| Monitoring defined | Partial: Vercel built-in analytics; full monitoring planned for v1.0.0 |
| Logging defined | Partial: no server logs at v0.1.0; structured logging planned for v1.0.0 |
| Security reviewed | Complete: no sensitive data at v0.1.0; ADR-003 governs v1.0.0 auth |
| Recovery strategy defined | Complete: Vercel instant rollback for frontend |
| Incident management defined | Complete: classification and response procedure documented above |
| Scalability reviewed | Complete: CDN auto-scales; no backend to worry about at v0.1.0 |

---

## 14. Learning Concept: GitHub Actions

### What it is

GitHub Actions is a CI/CD platform built into GitHub. Workflows are defined as YAML files in `.github/workflows/`. Each workflow consists of jobs, and each job consists of steps. Steps can run shell commands or call reusable actions published by the community (such as `actions/checkout`, `actions/setup-node`, and `cypress-io/github-action`).

Workflows are triggered by GitHub events: `push`, `pull_request`, `schedule`, `workflow_dispatch`, and others.

### Why it was selected

- It is integrated directly into the GitHub repository with no additional account or service required.
- The free tier provides 2000 CI minutes per month for public repositories and 500 minutes for private repositories, which is sufficient for a portfolio project with multiple daily pushes.
- Community actions for Node.js setup, Cypress, and artifact management exist and are well-maintained.
- Vercel's GitHub integration automatically deploys when CI passes on `main`, completing the full CD pipeline without additional configuration.

### How it improves operations

Without CI, a developer might push code that breaks the build or fails tests without knowing until a user reports an error. GitHub Actions enforces that every change passes lint, build, and E2E tests before it can be merged to `main`. The pipeline also uploads Cypress screenshots and videos as artifacts, making it possible to diagnose E2E failures without running them locally.

### Trade-offs

- YAML syntax is error-prone. Indentation errors silently cause workflow failures that can be hard to debug.
- CI minutes are consumed even for trivial changes. For a solo developer, this is acceptable. For teams, selective triggering (path filters) reduces unnecessary runs.
- Secrets must be configured per repository in GitHub Settings. They are not shared between repositories, which means the frontend and backend pipelines each manage their own secrets.

### Interview discussion

GitHub Actions demonstrates an understanding of automated quality enforcement. The key points to communicate in an interview are: why `npm ci` instead of `npm install` (reproducible installs using the lockfile), why the E2E job depends on the build job (tests validate the production artifact, not the dev build), and why artifacts are uploaded (failure investigation without local reproduction).
