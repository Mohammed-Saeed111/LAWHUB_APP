import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import ClientLayout from '../components/layout/ClientLayout.jsx';

/* ========== Phase 0 / A — Onboarding & Authentication (the funnel) ========== */
import SplashScreen from '../pages/auth/SplashScreen.jsx';          // 1
import LanguageSelection from '../pages/auth/LanguageSelection.jsx'; // 2
import Login from '../pages/auth/Login.jsx';                        // 3
import AccountTypeSelection from '../pages/auth/AccountTypeSelection.jsx'; // 4
import OtpVerification from '../pages/auth/OtpVerification.jsx';     // 5
import MfaSetup from '../pages/auth/MfaSetup.jsx';                   // 6
import LawyerRegistration from '../pages/auth/LawyerRegistration.jsx'; // 7
import AccountUnderReview from '../pages/auth/AccountUnderReview.jsx'; // 8
import BiometricLogin from '../pages/auth/BiometricLogin.jsx';       // 9
import AuthSuccess from '../pages/auth/AuthSuccess.jsx';             // 10
import Register from '../pages/auth/Register.jsx';                   // supporting
import ForgotPassword from '../pages/auth/ForgotPassword.jsx';       // supporting
import ResetPassword from '../pages/auth/ResetPassword.jsx';         // supporting

/* ================= Phase B — The Client Journey (the product) ================= */
import Home from '../pages/Home.jsx';                    // 1
import MapView from '../pages/MapView.jsx';              // 2
import SearchResults from '../pages/SearchResults.jsx';  // 3
import LawyerProfile from '../pages/LawyerProfile.jsx';  // 4
import Favorites from '../pages/Favorites.jsx';          // 5
import Booking from '../pages/Booking.jsx';              // 6
import Payment from '../pages/Payment.jsx';              // 7
import Cases from '../pages/Cases.jsx';                  // 8 (+ 9 empty state)
import Policy from '../pages/Policy.jsx';                // 10

/**
 * Unified 20-screen route map.
 *
 * Onboarding funnel (public) lives under distinct paths; the splash is at
 * /welcome. The Client Journey lives at the root paths and is fully protected
 * by authentication — unauthenticated users are bounced to /welcome.
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

    {/* ---------- Client Journey (protected, inside the app shell) ---------- */}
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

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
