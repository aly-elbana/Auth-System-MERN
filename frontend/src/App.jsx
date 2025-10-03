/* eslint-disable no-unused-vars */

// -------------------- Import Section --------------------

// React Router: for routing and navigation
import { Route, Routes, Navigate } from "react-router-dom";

// Toast notifications for user feedback
import { Toaster } from "react-hot-toast";

// React hook for side effects
import { useEffect } from "react";

// Animated background component for visual appeal
import FloatingShape from "./components/FloatingShape";

// Page components for different routes
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LogInPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Auth state management (Zustand store)
import { useAuthStore } from "./store/auth.store";

// Custom loading spinner component
import LoadingSpinner from "./components/LoadingSpinner";

// -------------------- Protected Route Components --------------------

/**
 * ProtectedRoute wrapper: restricts access to authenticated & verified users only.
 * Redirects unauthenticated users to login and unverified users to email verification.
 */
const ProtectedRoute = ({ children }) => {
  // Destructure authentication state from the auth store
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  // Show loading spinner while checking authentication status
  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  // If the user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated but not verified, redirect to email verification page
  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // If authenticated and verified, allow access to the protected route
  return children;
};

/**
 * RedirectAuthenticatedUser wrapper: prevents authenticated & verified users
 * from accessing auth pages (login, signup, verify-email) by redirecting them to home.
 */
const RedirectAuthenticatedUser = ({ children }) => {
  // Destructure authentication state from the auth store
  const { isAuthenticated, user } = useAuthStore();

  // If the user is already logged in and verified, redirect to home page
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the intended public page
  return children;
};

// -------------------- Main App Component --------------------

/**
 * App component serves as the main application container with routing,
 * authentication checks, and animated background elements.
 */
function App() {
  // Destructure auth state and auth checking function from the store
  const { isCheckingAuth, checkAuth } = useAuthStore();

  // -------------------- Side Effects --------------------

  /**
   * On component mount, check if the user is already logged in (e.g., via stored token).
   * This ensures the app knows the user's authentication status on load.
   */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // -------------------- Loading State --------------------

  // Show loading spinner while checking authentication status on app load
  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  // -------------------- JSX Structure --------------------

  return (
    // Main layout with gradient background and centered content
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 
                 flex items-center justify-center relative overflow-hidden"
    >
      {/* -------------------- Animated Background Shapes -------------------- */}

      {/* Floating animated shape: top left */}
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="5%"
        left="10%"
        delay={0}
      />

      {/* Floating animated shape: bottom right */}
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />

      {/* Floating animated shape: mid-left (off-screen) */}
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      {/* -------------------- Application Routes -------------------- */}
      <Routes>
        {/* Home page: accessible only if user is authenticated and verified */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Sign up page: redirect verified users to home */}
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Login page: redirect verified users to home */}
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Email verification page: only accessible for unverified authenticated users */}
        <Route
          path="/verify-email"
          element={
            <RedirectAuthenticatedUser>
              <EmailVerificationPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Forgot password page: only accessible for unverified authenticated users */}
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* Reset password page: only accessible for unverified authenticated users */}
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
      </Routes>

      {/* Global toast notifications for success/error messages */}
      <Toaster />
    </div>
  );
}

// Export component for use as the main application entry point
export default App;
