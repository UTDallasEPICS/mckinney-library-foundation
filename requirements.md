# Requirements

Append project requirements as new rows.

## 1. Requirement Matrix

Use the matrix below to track requirements throughout the project lifecycle.

- **Category:** Functional (REQ-F), Non-Functional (REQ-NF)
- **Status:** Backlog, In-progress, Verified, Deferred, Deprecated
- **Mapping:** baseline requirements map to the source that implements them; project
  requirements you add should map to a GitHub issue.

| ID        | Description                                                                                      | Status      | Target Semester | Mapping (source / issue)                                       |
| --------- | ------------------------------------------------------------------------------------------------ | ----------- | --------------- | ---------------------------------------------------------------- |
| REQ-F-01  | Passwordless sign-in via email OTP (Better Auth + Nodemailer); OTP emailed to an existing user   | Verified    | 2026F           | `server/utils/auth.ts`, `components/Forms/LoginForm.vue`         |
| REQ-F-02  | Server API gateway rejects unauthenticated requests to non-public routes with HTTP 401           | Verified    | 2026F           | `server/utils/requireSession.ts`                                  |
| REQ-F-03  | Client route guard redirects signed-out users to `/` and signed-in users away from `/`           | In-progress | 2026F           | per-page checks in `pages/*.vue`; no global route middleware yet  |
| REQ-NF-01 | Persistence is type-safe: Prisma ORM schema with generated client types                          | Verified    | 2026F           | `prisma/schema.prisma`                                            |
| REQ-NF-02 | CI runs lint, type-check, and the test suite on every PR and on `dev`/`stage`/`prod` pushes       | Backlog     | 2026F           | not implemented — `.github/workflows/` only builds and deploys   |
| REQ-NF-03 | Deploy pipeline order is build → migrate → push → deploy, so a failed migration never ships       | Verified    | 2026F           | `.github/workflows/deploy.yml`                                     |
| REQ-NF-04 | `stage`/`prod` auto-deploy to AWS ECS via GitHub OIDC — no static AWS keys stored                | Verified    | 2026F           | `.github/workflows/{stage,main}.yml`, `.github/workflows/deploy.yml` |
| REQ-NF-05 | App ships as a container image with the toolchain to compile native modules in the builder       | Backlog     | 2026F           | `Dockerfile` — `node:lts-alpine` base has no `python3`/`make`/`g++` |
| REQ-NF-06 | Test baseline runs with no `.env`, database, email, or browser (`pnpm test` works on clone)      | Backlog     | 2026F           | not implemented — no `vitest.config.ts` or `tests/` directory     |
| REQ-NF-07 | Dependency versions are pinned for reproducible, deploy-safe builds                              | Backlog     | 2026F           | `package.json` — uses `^` ranges; `vue`/`vue-router` pinned to `latest` |

## 2. Change Log

Track major changes, additions, or deprecations to the project scope.

| Date       | Requirement ID | Change Description                                                                   | Author      | Approved By |
| ---------- | -------------- | ------------------------------------------------------------------------------------ | ----------- | ----------- |
| YYYY-MM-DD | REQ-F-00       | *Example row — replace with your own entry when a requirement changes*               | @handle     | @handle     |
