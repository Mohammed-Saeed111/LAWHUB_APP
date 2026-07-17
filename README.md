# محاميك — Egypt LawHub · Unified Web App (20 Screens)

A single, end-to-end web application that merges the two phases into one product:

- **Phase 0 / A — Onboarding & Authentication** (the funnel: 10 screens)
- **Phase B — The Client Journey** (the product: 10 screens)

**One backend, one frontend, real JWT authentication** protecting the whole
Client Journey. Theme: *Legal Luxury* — deep navy `#0A0E17` + warm gold `#C9A24B`,
full Arabic **RTL** with an Arabic ⇄ English switch.

```
lawhub-app/
├── backend/     # Node.js + Express + MongoDB (Auth + Client Journey API)
└── frontend/    # React + Vite + Tailwind (all 20 screens, unified routing)
```

---

## 🧭 The unified flow

```
/welcome (Splash) → /language → /login ──► /success ──►  /  (Client Home)
        │                                    ▲
        └── register → /verify → /mfa-setup ─┘
                          │
          (lawyer/office) └► /lawyer-credentials → /under-review

Once authenticated, the whole product lives at the root paths:
/  ·  /map  ·  /search  ·  /lawyer/:id  ·  /favorites
/booking/:id  ·  /payment  ·  /cases  ·  /policy
```

- **Unauthenticated** visitors to any product page are bounced to `/welcome`.
- After login/verification, **AuthSuccess → “enter platform” → `/`** (Client Home).

---

## 🖥️ The 20 screens

**Onboarding & Auth (funnel)**
1. Splash `/welcome` · 2. Language `/language` · 3. Login `/login` ·
4. Account Type `/register` · 5. OTP `/verify` · 6. MFA `/mfa-setup` ·
7. Lawyer Credentials `/lawyer-credentials` · 8. Under Review `/under-review` ·
9. Biometric `/biometric` · 10. Success `/success`

**Client Journey (product)**
1. Home `/` · 2. Map `/map` · 3. Search `/search` · 4. Lawyer Profile `/lawyer/:id` ·
5. Favorites `/favorites` · 6. Booking `/booking/:id` · 7. Payment & Escrow `/payment` ·
8. My Cases `/cases` · 9. Empty State (inside `/cases`) · 10. Policy `/policy`

---

## 🚀 Run it (two terminals)

### 1) Backend
```bash
cd backend
npm install
cp .env.example .env         # set MONGO_URI + JWT secrets
npm run seed                 # demo data + a demo client account
npm run dev                  # http://localhost:5000
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev                  # http://localhost:5173  (proxies /api + /uploads)
```

**Demo login** (created by the seed):
```
email:    client@lawhub.eg
password: Client@123
```
Logging in as the demo user shows populated favorites & cases.
Registering a **new** account instead demonstrates the empty-state screen.

Requirements: Node.js ≥ 18 and a running MongoDB instance.

---

## 🔐 How the auth is unified

- **Frontend:** every Client-Journey request goes through the same authenticated
  axios instance (`src/api/axiosClient.js`). `src/api/client.js` wraps it, so
  `lawhubApi` calls automatically carry the **Bearer access token** and get a
  **silent refresh + retry** on 401.
- **State:** `AuthContext` owns the session; `AppContext` (favorites/booking)
  re-loads favorites whenever the auth state changes.
- **Routing:** `ProtectedRoute` guards the whole Client Journey and the
  session-bound auth steps; unauthenticated users are redirected to `/welcome`.
- **Backend:** a single `protect` middleware sets both `req.user` (Phase 0) and
  `req.userId` (Phase B), so both codebases work unchanged. Favorites,
  consultations and cases routes are mounted behind `protect`.

---

## 📡 API surface (`/api`)

**Auth** — `/auth/register`, `/auth/verify-otp`, `/auth/resend-otp`, `/auth/login`,
`/auth/forgot-password`, `/auth/reset-password`, `/auth/refresh`, `/auth/logout`,
`/auth/me`, `/auth/mfa`, `/auth/lawyer-credentials`, `/auth/biometric/enable`

**Client Journey** — `/lawyers` (search/filter), `/lawyers/:id`, `/lawyers/:id/reviews`,
`/categories`, `/cities`, `/articles`, `/favorites` 🔒, `/consultations` 🔒,
`/consultations/:id/pay` 🔒 (escrow), `/cases` 🔒
(🔒 = requires a logged-in user).

---

## 🗂️ Structure

```
backend/src/
├── models/        user, otp, lawyer, review, article, category, favorite, consultation, case
├── controllers/   auth, lawyer, meta, favorite, consultation, case
├── routes/        auth + lawyer + meta + favorite + consultation + case (unified index.js)
├── middlewares/   auth(protect → req.user + req.userId), validate, upload, error
├── services/      token, otp, email
├── utils/         ApiError, asyncHandler, generateOtp, seed
├── app.js  ·  server.js

frontend/src/
├── api/           axiosClient, authApi, client (wraps axios), lawhubApi, normalize
├── context/       AuthContext · LanguageContext · AppContext
├── i18n/          ar/en translations
├── components/    ui/* (Logo, Button, Input, OtpInput, LawyerCard, Rating, …)
│                  layout/ClientLayout (the app shell)
├── layouts/       AuthLayout (the funnel shell)
├── pages/         auth/* (10 funnel screens) + client journey (10 screens)
├── routes/        AppRoutes (unified) · ProtectedRoute
└── styles/index.css
```

---

## 🔮 Next ideas
- Real **WebAuthn** for the biometric screen.
- **Phase C — Lawyer Journey** (manage consultations, calendar, earnings).
- Real file uploads (Multer) for booking documents.

*One product, 20 screens, connected end-to-end.*
