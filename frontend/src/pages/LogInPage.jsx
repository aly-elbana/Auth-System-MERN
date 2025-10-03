/* eslint-disable no-unused-vars */

// -------------------- Import Section --------------------

// React hook for managing component-level state
import { useState, useEffect } from "react";

// Animation library for smooth entrance/exit effects
import { motion } from "framer-motion";

// Icons used next to input fields and loading state
import { Mail, Lock, Loader } from "lucide-react";

// React Router: for navigating programmatically and rendering links
import { Link, useNavigate } from "react-router-dom";

// Custom reusable input component with icon integration
import Input from "../components/Input";

// Custom auth store (Zustand) for authentication logic
import { useAuthStore } from "../store/auth.store";

// -------------------- Component Definition --------------------

/**
 * LoginPage component allows users to log into their existing account
 * by entering their email and password credentials.
 */
const LoginPage = () => {
  // -------------------- State Variables --------------------

  // Controlled input state for email
  const [email, setEmail] = useState("");

  // Controlled input state for password
  const [password, setPassword] = useState("");
  // Destructure authentication logic and state from the auth store
  const { login, isLoading, error } = useAuthStore();
  const [err, setErr] = useState(null);
  // Used to navigate to another page programmatically after login
  const navigate = useNavigate();

  // -------------------- Effects --------------------

  // Update local error state when error from store changes
  useEffect(() => {
    if (error) {
      setErr(error);
    }
  }, [error]);

  // -------------------- Event Handlers --------------------

  /**
   * Handles form submission when user clicks "Login".
   * Prevents default page refresh and attempts to log in via auth store.
   */
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Clear any previous errors when starting a new login attempt
    setErr(null);

    try {
      // Call the login method from auth store with entered credentials
      const isSuccess = await login(email, password);

      // If login successful, redirect to home page
      if (isSuccess) {
        navigate("/");
      } else {
        setErr(error || "Invalid email or password");
      }
    } catch (error) {
      // Log any unexpected errors (already caught in auth store usually)
      console.error("Login failed:", error);
      setErr(error || "Invalid email or password");
    }
  };

  // -------------------- JSX Structure --------------------

  return (
    // Animated wrapper using Framer Motion
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start slightly lower with no opacity
      animate={{ opacity: 1, y: 0 }} // Fade and slide into view
      transition={{ duration: 0.5 }} // Smooth transition duration
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl 
                 rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Form wrapper with padding */}
      <div className="p-8">
        {/* Gradient-colored heading */}
        <h2
          className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 
                       text-transparent bg-clip-text"
        >
          Welcome Back
        </h2>

        {/* -------------------- Login Form -------------------- */}
        <form onSubmit={handleLogin}>
          {/* Input field for email */}
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (err) setErr(null); // Clear error when user starts typing
            }}
            disabled={isLoading}
          />

          {/* Input field for password */}
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (err) setErr(null); // Clear error when user starts typing
            }}
            disabled={isLoading}
            showPasswordIcon={true} // Show toggle for password visibility
          />

          {/* Forgot password link */}
          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-green-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Error message and verification link */}
          <div className="flex justify-between items-center mb-6">
            {err && (
              <motion.p
                className="text-red-500 text-sm mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {err}
              </motion.p>
            )}
            {err === "Please verify your email before logging in." && (
              <Link
                to="/verify-email"
                className="text-sm text-green-400 hover:underline mb-4"
              >
                Verify Email
              </Link>
            )}
          </div>

          {/* Submit button with animated hover and tap effects */}
          <motion.button
            whileHover={{ scale: 1.02 }} // Slightly grow on hover
            whileTap={{ scale: 0.98 }} // Slightly shrink on click
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 
                       text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
                       focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50"
            type="submit"
            disabled={isLoading} // Prevent multiple submissions
          >
            {/* Spinner when loading, otherwise show button text */}
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>

      {/* Bottom section: redirect prompt for new users */}
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

// Export component for use in routing
export default LoginPage;
