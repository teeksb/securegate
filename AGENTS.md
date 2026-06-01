## 1. What we are building

SecureGate is a **standalone Next.js 14 authentication app**, not a full product. It exists to demonstrate identity and access management done correctly. Scope is small on purpose: signup, email verification, login, forgot/reset password, protected dashboard, rate limiting, logout. **Nothing else.**

If a feature is not in `Section 4` of `SecureGate_PRD.docx`, do not build it. Do not add social login, MFA, audit logs, role-based access, organisations, billing, profile editing, or admin panels. YAGNI is enforced at the agent level.

---


## 2. Stack — fixed, do not substitute

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | `src/` directory enabled |
| Language | TypeScript | `strict: true` in tsconfig |
| Styling | Tailwind CSS | No CSS modules, no styled-components, no shadcn unless asked |
| DB | PostgreSQL | Hosted on Neon |
| ORM | Prisma | Singleton client in `src/lib/prisma.ts` |
| Auth | NextAuth.js (Credentials provider only) | JWT session strategy |
| Hashing | `bcryptjs` | 12 salt rounds, never lower |
| Validation | Zod | Schemas live in `src/lib/validations/` |
| Email | Resend + React Email | Templates in `src/emails/` |
| Rate limit | `@upstash/ratelimit` + `@upstash/redis` | Sliding window |
| Deployment | Vercel | Env vars set via dashboard, never hardcoded |

Approved deps:
`next next-auth@beta @auth/prisma-adapter prisma @prisma/client bcryptjs @types/bcryptjs zod resend react-email @react-email/components @upstash/ratelimit @upstash/redis tailwindcss`

Anything outside this list requires my approval.

---

## 4. Folder structure (target)

```
src/
  app/
    (auth)/
      login/page.tsx
      signup/page.tsx
      forgot-password/page.tsx
      reset-password/[token]/page.tsx
      verify-email/[token]/page.tsx
    dashboard/page.tsx
    api/
      auth/
        [...nextauth]/route.ts
        signup/route.ts
        forgot-password/route.ts
        reset-password/route.ts
        resend-verification/route.ts
  components/
    PasswordStrengthIndicator.tsx
    FormField.tsx
    SubmitButton.tsx
  lib/
    prisma.ts
    auth.ts          # NextAuth config
    email.ts         # Resend client + send helpers
    tokens.ts        # crypto.randomBytes helper
    rate-limit.ts    # Upstash limiters + getIp()
    validations/
      auth.ts        # Zod schemas
  emails/
    VerificationEmail.tsx
    PasswordResetEmail.tsx
  hooks/             # only if genuinely needed
middleware.ts        # NextAuth middleware at project root
prisma/
  schema.prisma
  migrations/
```

One component per file. Co-locate page-specific components inside the page's folder only if they are not reused. Shared components live in `src/components/`.

---

## 5. Non-negotiable security rules

These are tested by the grading rubric. Violating any of them is a bug.

- **Passwords:** bcrypt with `saltRounds = 12`. Never store plain text, never log the plain value, never return it from any endpoint.
- **Tokens:** generated with `crypto.randomBytes(32).toString('hex')`. Never use `Math.random`, never use predictable IDs or timestamps as tokens.
- **Token expiry:** verification = 15 minutes. Password reset = 1 hour. Both enforced server-side on every use.
- **Token consumption:** on successful use, **delete the row**. Do not mark-as-used. A token must not be reusable.
- **Email enumeration:** signup with an existing email, login with a wrong email, and forgot-password with an unknown email must all return responses indistinguishable from the "happy" path. Same status code, same message, similar response time.
- **Login error message:** exactly `"Invalid credentials"` for every failure mode — wrong password, wrong email, unverified account, rate-limited. No variation.
- **Rate limits:** login 5 per IP per 10 minutes. Forgot-password 3 per IP per 10 minutes. Sliding window. Blocked responses match normal failure responses.
- **Error responses:** never include stack traces, Prisma error codes, or internal field names. Wrap every route handler in try/catch. Log the real error server-side with `console.error`, return a generic message to the client.
- **Headers:** set `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` in `next.config.js`.
- **Secrets:** every secret comes from `process.env`. Never hardcode. Never log. `.env.local` is gitignored before the first commit.
- **Protected route:** `/dashboard` requires both an authenticated session and `emailVerified !== null`. Both checks. Middleware enforces session; the page or session callback enforces verified status.

---

## 6. Coding conventions

- **TypeScript strict mode.** No `any` unless justified in a comment. No `@ts-ignore` without a reason.
- **Server components by default.** Add `"use client"` only when state, effects, or browser APIs are required.
- **All API routes** validate input with Zod before any business logic. Validation failure → 400 with field-level messages.
- **Path alias:** `@/*` maps to `src/*`. Use it everywhere; no relative imports going up more than one level.
- **Naming:** components `PascalCase.tsx`, utilities `camelCase.ts`, route segments lowercase. Zod schemas suffixed with `Schema` (e.g. `signUpSchema`).
- **Comments:** explain *why*, not *what*. A comment that restates the code is noise.
- **Imports:** grouped — node built-ins, external packages, `@/` aliases, relative. One blank line between groups.
- **No console.log in committed code** except `console.error` for server-side error logging.

---

## 7. UI conventions

- Tailwind utility classes only. No inline styles, no custom CSS files beyond `globals.css`.
- Colour palette: `slate` for neutrals, `indigo-600` for primary actions, `red-500` for errors, `emerald-500` for success.
- Every form: `<label htmlFor>` linked to its input, focus rings visible, real validation messages (never "Something went wrong"), submit button shows a loading state.
- Every page: centered card layout, `max-w-md`, comfortable padding, mobile-first.
- Password strength indicator on signup and reset-password — scores length ≥ 12, uppercase, lowercase, number, symbol; renders weak/fair/strong with a coloured bar.
- Empty form submission must not crash; it must show field-level errors.

---

## 8. Database conventions

- Migrations are committed. Never edit a migration that has been pushed.
- Schema is the source of truth. If the schema changes, run `prisma migrate dev` and commit the new migration in the same PR/commit.
- Use Prisma's `select` to return only what is needed. Never return the `password` field from any query that reaches the client.
- Cascading deletes are deliberate — discuss before adding `onDelete: Cascade` on a relation.

---

## 9. Environment variables

The full set, all required:

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
RESEND_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

- `.env.local` is the dev source. Add `.env.local` to `.gitignore` **before the first commit**.
- `.env.local.example` lists every variable with empty values — this one is committed.
- Production values live only in the Vercel dashboard. Never paste them into chat, code, or commits.
- `NEXTAUTH_SECRET` is generated with `openssl rand -base64 32`.

---