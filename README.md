# محاميك — Egypt LawHub · Unified Web App (44 Screens)

A single, end-to-end web application merging all five phases into one product:

- **Phase 0 / A — Onboarding & Authentication** (10 screens)
- **Phase B — The Client Journey** (10 screens)
- **Phase C — Lawyer Workspace** (10 screens)
- **Phase D — Legal Commerce & AI Intelligence** (7 screens)
- **Phase E — Community, Education & Communication** (7 screens)

**One backend, one frontend, real JWT authentication** protecting the whole platform.  
Theme: *Legal Luxury* — deep navy `#0A0E17` + warm gold `#C9A24B`, full Arabic **RTL** with Arabic ⇄ English switch.

```
lawhub-app/
├── backend/     # Node.js + Express + MongoDB
└── frontend/    # React + Vite + Tailwind (44 screens, unified routing)
```

---

## 🧭 The unified flow

```
/welcome → /language → /login ──► /success ──► / (Client Home)
                                    ▲
    register → /verify → /mfa-setup─┘
                │
  (lawyer/office)└► /lawyer-credentials → /under-review

Once authenticated:
/  ·  /map  ·  /search  ·  /lawyer/:id  ·  /favorites
/booking/:id  ·  /payment  ·  /cases  ·  /policy

/workspace/*  (lawyer/office only)

/market  ·  /market/analyze  ·  /market/advisor
/market/editor/:id  ·  /market/sign/:id
/market/transactions  ·  /market/success/:id

/community/videos  ·  /community/news  ·  /community/chat
/community/notifications  ·  /community/referral
/community/finance  ·  /community/help
```

---

## 🖥️ The 44 Screens

### Phase 0/A — Onboarding & Auth (10 screens)
`/welcome` · `/language` · `/login` · `/register` · `/register/details`  
`/verify` · `/mfa-setup` · `/biometric` · `/lawyer-credentials` · `/under-review` · `/success`

### Phase B — Client Journey (10 screens)
`/` · `/map` · `/search` · `/lawyer/:id` · `/favorites`  
`/booking/:id` · `/payment` · `/cases` · `/policy`

### Phase C — Lawyer Workspace (10 screens)
`/workspace` · `/workspace/calendar` · `/workspace/cases` · `/workspace/cases/:id`  
`/workspace/team` · `/workspace/assignment` · `/workspace/services`  
`/workspace/membership` · `/workspace/plans` · `/workspace/reviews`

### Phase D — Legal Commerce & AI (7 screens)
`/market` · `/market/editor/:id` · `/market/analyze` · `/market/advisor`  
`/market/sign/:id` · `/market/success/:id` · `/market/transactions`

### Phase E — Community, Education & Communication (7 screens)
`/community/videos` · `/community/news` · `/community/chat`  
`/community/notifications` · `/community/referral`  
`/community/finance` · `/community/help`

---

## 🗂️ Structure

```
backend/src/
├── models/        user, otp, lawyer, review, article, category, favorite,
│                  consultation, case, advice, analysis, template, transaction,
│                  member, plan, profile, appointment, workspace
│                  + [E] video, news, chat, notification, referral, finance, support
├── controllers/   auth, lawyer, meta, favorite, consultation, case,
│                  workspace, market, ai
│                  + [E] content, chat
├── routes/        unified index.js (Phases A→E)
├── middlewares/   auth (protect), validate, upload, error
├── services/      token, otp, email
├── utils/         ApiError, asyncHandler, generateOtp, seed
└── app.js · server.js

frontend/src/
├── api/           axiosClient, authApi, client, lawhubApi, normalize,
│                  phaseDApi, phaseEApi
├── context/       AuthContext · LanguageContext · AppContext
├── i18n/          ar/en translations
├── components/    ui/* · layout/ClientLayout · ai/*
├── layouts/       AuthLayout · WorkspaceLayout
├── pages/         auth/* (Phase A) · (Phase B roots) · lawyer/* (Phase C)
│                  market/* (Phase D) · community/* (Phase E)
├── routes/        AppRoutes (unified 44-screen) · ProtectedRoute
└── styles/index.css
```

---

## Phase E — API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos` | E1: Video library (filterable by category) |
| GET | `/api/news` | E2: Legal news feed |
| GET | `/api/conversations` | E3: Chat conversations |
| GET | `/api/conversations/:id/messages` | E3: Messages in conversation |
| POST | `/api/conversations/:id/messages` | E3: Send message |
| GET | `/api/notifications` | E4: User notifications |
| PATCH | `/api/notifications/:id/read` | E4: Mark notification read |
| PATCH | `/api/notifications/read-all` | E4: Mark all read |
| GET | `/api/referral` | E5: Referral code + leaderboard |
| GET | `/api/finance` | E6: Financial reports |
| GET | `/api/faqs` | E7: FAQ list |
| GET | `/api/tickets` | E7: My support tickets |
| POST | `/api/tickets` | E7: Create support ticket |

---

## 🔮 Next Ideas
- Real **WebSocket** for live chat (Socket.io).
- Real **WebAuthn** for the biometric screen.
- **Phase F** — Admin Dashboard (user management, content moderation).
- Real file uploads (Multer) for booking documents.

*One product, 44 screens, connected end-to-end.*
