# Graph Report - c:\Users\Mo\Music\LAWHUB_APP  (2026-07-23)

## Corpus Check
- Corpus is ~21,388 words - fits in a single context window. You may not need a graph.

## Summary
- 347 nodes · 771 edges · 15 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Frontend Auth & UI Components
- Backend API Server & Controllers
- Client Journey Pages & API Layer
- Auth Controllers & Middleware
- Backend Dependencies & Config
- Frontend Dependencies & Build
- Axios HTTP Client & Token Refresh
- OTP Model & Email Service
- System Architecture & Roadmap

## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 33 edges
2. `useAuth()` - 20 edges
3. `ApiError` - 15 edges
4. `useApi()` - 13 edges
5. `Button()` - 12 edges
6. `useApp()` - 11 edges
7. `lawhubApi` - 10 edges
8. `AuthLayout()` - 10 edges
9. `Logo()` - 9 edges
10. `asyncHandler()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `start()` --calls--> `connectDB()`  [EXTRACTED]
  backend/src/server.js → backend/src/config/db.js
- `run()` --references--> `User`  [EXTRACTED]
  backend/src/utils/seed.js → backend/src/models/user.model.js
- `AppProvider()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/context/AppContext.jsx → frontend/src/hooks/useAuth.js
- `run()` --calls--> `connectDB()`  [EXTRACTED]
  backend/src/utils/seed.js → backend/src/config/db.js
- `createAndSendOtp()` --references--> `Otp`  [EXTRACTED]
  backend/src/services/otp.service.js → backend/src/models/otp.model.js

## Import Cycles
- None detected.

## Communities (15 total, 0 thin omitted)

### Community 0 - "Frontend Auth & UI Components"
Cohesion: 0.12
Nodes (33): authApi, ClientLayout(), NAV, Button(), Input(), LanguageSwitcher(), Logo(), OtpInput() (+25 more)

### Community 1 - "Backend API Server & Controllers"
Cohesion: 0.06
Nodes (35): app, connectDB(), listCases, createConsultation, myConsultations, payConsultation, listFavorites, toggleFavorite (+27 more)

### Community 2 - "Client Journey Pages & API Layer"
Cohesion: 0.12
Nodes (31): lawhubApi, normalizeReview(), withId(), withIds(), Avatar(), EmptyState(), ErrorState(), LawyerCard() (+23 more)

### Community 3 - "Auth Controllers & Middleware"
Cohesion: 0.07
Nodes (35): enableBiometric, forgotPassword, getMe, login, logout, refresh, refreshCookieOptions, register (+27 more)

### Community 4 - "Backend Dependencies & Config"
Cohesion: 0.05
Nodes (41): author, dependencies, bcryptjs, cookie-parser, cors, dotenv, express, express-rate-limit (+33 more)

### Community 5 - "Frontend Dependencies & Build"
Cohesion: 0.06
Nodes (35): autoprefixer, axios, framer-motion, dependencies, axios, framer-motion, react, react-dom (+27 more)

### Community 6 - "Axios HTTP Client & Token Refresh"
Cohesion: 0.14
Nodes (10): axiosClient, queue, setAccessToken(), api, App(), AppProvider(), AuthContext, AuthProvider() (+2 more)

### Community 7 - "OTP Model & Email Service"
Cohesion: 0.30
Nodes (8): Otp, otpSchema, getTransporter(), sendEmail(), sendOtpEmail(), createAndSendOtp(), verifyOtp(), generateOtp()

### Community 8 - "System Architecture & Roadmap"
Cohesion: 0.38
Nodes (7): Auth System, Backend REST API (/api), Client Journey (product), Future Roadmap, LAWHUB_APP (محاميك), Legal Luxury Design Theme, Onboarding & Auth Flow

## Knowledge Gaps
- **72 isolated node(s):** `name`, `version`, `description`, `main`, `type` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ApiError` connect `Auth Controllers & Middleware` to `Backend API Server & Controllers`, `OTP Model & Email Service`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `asyncHandler()` connect `Backend API Server & Controllers` to `Auth Controllers & Middleware`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Auth & UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.12295081967213115 - nodes in this community are weakly interconnected._
- **Should `Backend API Server & Controllers` be split into smaller, more focused modules?**
  _Cohesion score 0.05889724310776942 - nodes in this community are weakly interconnected._
- **Should `Client Journey Pages & API Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.116701607267645 - nodes in this community are weakly interconnected._
- **Should `Auth Controllers & Middleware` be split into smaller, more focused modules?**
  _Cohesion score 0.07039187227866474 - nodes in this community are weakly interconnected._