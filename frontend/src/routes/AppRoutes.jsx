import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import ClientLayout from '../components/layout/ClientLayout.jsx';

/* ========== Phase 0 / A — Onboarding & Authentication (the funnel) ========== */
import SplashScreen from '../pages/auth/SplashScreen.jsx';
import LanguageSelection from '../pages/auth/LanguageSelection.jsx';
import Login from '../pages/auth/Login.jsx';
import AccountTypeSelection from '../pages/auth/AccountTypeSelection.jsx';
import OtpVerification from '../pages/auth/OtpVerification.jsx';
import MfaSetup from '../pages/auth/MfaSetup.jsx';
import LawyerRegistration from '../pages/auth/LawyerRegistration.jsx';
import AccountUnderReview from '../pages/auth/AccountUnderReview.jsx';
import BiometricLogin from '../pages/auth/BiometricLogin.jsx';
import AuthSuccess from '../pages/auth/AuthSuccess.jsx';
import Register from '../pages/auth/Register.jsx';
import ForgotPassword from '../pages/auth/ForgotPassword.jsx';
import ResetPassword from '../pages/auth/ResetPassword.jsx';

/* ================= Phase B — The Client Journey ================= */
import Home from '../pages/Home.jsx';
import MapView from '../pages/MapView.jsx';
import SearchResults from '../pages/SearchResults.jsx';
import LawyerProfile from '../pages/LawyerProfile.jsx';
import Favorites from '../pages/Favorites.jsx';
import Booking from '../pages/Booking.jsx';
import Payment from '../pages/Payment.jsx';
import Cases from '../pages/Cases.jsx';
import Policy from '../pages/Policy.jsx';

/* ================= Phase C — Lawyer Workspace (10 screens) ================= */
import WorkspaceLayout from '../layouts/WorkspaceLayout.jsx';
import Dashboard   from '../pages/lawyer/Dashboard.jsx';
import Calendar    from '../pages/lawyer/Calendar.jsx';
import WCases      from '../pages/lawyer/Cases.jsx';
import CaseDetails from '../pages/lawyer/CaseDetails.jsx';
import Team        from '../pages/lawyer/Team.jsx';
import Assignment  from '../pages/lawyer/Assignment.jsx';
import Services    from '../pages/lawyer/Services.jsx';
import Membership  from '../pages/lawyer/Membership.jsx';
import Plans       from '../pages/lawyer/Plans.jsx';
import Reviews     from '../pages/lawyer/Reviews.jsx';

/* ================= Phase D — Legal Commerce & AI Intelligence (7 screens) ================= */
import Marketplace  from '../pages/market/Marketplace.jsx';
import Editor       from '../pages/market/Editor.jsx';
import Analysis     from '../pages/market/Analysis.jsx';
import Advisor      from '../pages/market/Advisor.jsx';
import Signature    from '../pages/market/Signature.jsx';
import TxSuccess    from '../pages/market/Success.jsx';
import Transactions from '../pages/market/Transactions.jsx';

/* ================= Phase E — Community, Education & Communication (7 screens) ================= */
import VideoLibrary   from '../pages/community/VideoLibrary.jsx';
import LegalNews      from '../pages/community/LegalNews.jsx';
import Chat           from '../pages/community/Chat.jsx';
import Notifications  from '../pages/community/Notifications.jsx';
import Referral       from '../pages/community/Referral.jsx';
import FinanceReports from '../pages/community/FinanceReports.jsx';
import HelpCenter     from '../pages/community/HelpCenter.jsx';

/**
 * Unified 44-screen route map.
 * Phase A  — Onboarding funnel  (public)           /welcome → /success
 * Phase B  — Client Journey     (protected)         / → /cases
 * Phase C  — Lawyer Workspace   (lawyer/office)     /workspace/*
 * Phase D  — Legal Commerce & AI (protected)        /market/*
 * Phase E  — Community & Edu    (protected)         /community/*
 */
const AppRoutes = () => (
  <Routes>
    {/* ---------- Onboarding & Auth (public) ---------- */}
    <Route path="/welcome" element={<SplashScreen />} />
    <Route path="/language" element={<LanguageSelection />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<AccountTypeSelection />} />
    <Route path="/register/details" element={<Register />} />
    <Route path="/verify" element={<OtpVerification />} />
    <Route path="/biometric" element={<BiometricLogin />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />

    {/* ---------- Auth steps that require a session ---------- */}
    <Route path="/mfa-setup" element={<ProtectedRoute><MfaSetup /></ProtectedRoute>} />
    <Route path="/lawyer-credentials" element={<ProtectedRoute><LawyerRegistration /></ProtectedRoute>} />
    <Route path="/under-review" element={<ProtectedRoute><AccountUnderReview /></ProtectedRoute>} />
    <Route path="/success" element={<ProtectedRoute><AuthSuccess /></ProtectedRoute>} />

    {/* ---------- Phase B — Client Journey (protected) ---------- */}
    <Route element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/lawyer/:id" element={<LawyerProfile />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/booking/:id" element={<Booking />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/cases" element={<Cases />} />
      <Route path="/policy" element={<Policy />} />
    </Route>

    {/* ---------- Phase C — Lawyer Workspace (lawyer / office roles) ---------- */}
    <Route path="/workspace" element={<ProtectedRoute roles={['lawyer', 'office']}><WorkspaceLayout /></ProtectedRoute>}>
      <Route index element={<Dashboard />} />
      <Route path="calendar"   element={<Calendar />} />
      <Route path="cases"      element={<WCases />} />
      <Route path="cases/:id"  element={<CaseDetails />} />
      <Route path="team"       element={<Team />} />
      <Route path="assignment" element={<Assignment />} />
      <Route path="services"   element={<Services />} />
      <Route path="membership" element={<Membership />} />
      <Route path="plans"      element={<Plans />} />
      <Route path="reviews"    element={<Reviews />} />
    </Route>

    {/* ---------- Phase D — Legal Commerce & AI Intelligence ---------- */}
    <Route element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
      <Route path="/market"                  element={<Marketplace />} />
      <Route path="/market/editor/:id"       element={<Editor />} />
      <Route path="/market/analyze"          element={<Analysis />} />
      <Route path="/market/advisor"          element={<Advisor />} />
      <Route path="/market/sign/:id"         element={<Signature />} />
      <Route path="/market/success/:id"      element={<TxSuccess />} />
      <Route path="/market/transactions"     element={<Transactions />} />
    </Route>

    {/* ---------- Phase E — Community, Education & Communication ---------- */}
    <Route element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
      <Route path="/community/videos"        element={<VideoLibrary />} />
      <Route path="/community/news"          element={<LegalNews />} />
      <Route path="/community/chat"          element={<Chat />} />
      <Route path="/community/notifications" element={<Notifications />} />
      <Route path="/community/referral"      element={<Referral />} />
      <Route path="/community/finance"       element={<FinanceReports />} />
      <Route path="/community/help"          element={<HelpCenter />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
