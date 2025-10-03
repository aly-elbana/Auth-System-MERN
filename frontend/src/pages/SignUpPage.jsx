/* eslint-disable no-unused-vars */

// -------------------- Import Section --------------------

// Animation library for smooth entrance/exit effects
import { motion } from "framer-motion";

// Custom reusable input component with icon integration
import Input from "../components/Input";

// Icons used next to input fields and loading state
import { Loader, Lock, Mail, User } from "lucide-react";

// React hook for managing component-level state
import { useState, useEffect } from "react";

// React Router: for navigating programmatically and rendering links
import { Link, useNavigate } from "react-router-dom";

// Custom component to visually indicate password strength
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

// Custom auth store (probably Zustand or similar) for authentication logic
import { useAuthStore } from "../store/auth.store";

// -------------------- Component Definition --------------------

/**
 * SignUpPage component allows users to create a new account by
 * entering their full name, email, and password.
 */
const SignUpPage = () => {
  // -------------------- State Variables --------------------

  // Controlled input state for full name
  const [name, setName] = useState("");

  const [err, setErr] = useState(null);
  // Controlled input state for email
  const [email, setEmail] = useState("");

  // Controlled input state for password
  const [password, setPassword] = useState("");

  // Destructure authentication logic and state from the auth store
  const { signUp, isLoading, error } = useAuthStore();

  // Used to navigate to another page programmatically after sign-up
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
   * Handles form submission when user clicks "Sign Up".
   * Prevents default page refresh and attempts to sign up via auth store.
   */
  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Clear any previous errors when starting a new signup attempt
    setErr(null);

    try {
      // Call the signUp method from auth store with entered credentials
      const isSuccess = await signUp(email, password, name);

      // Redirect the user to the email verification page upon success
      if (isSuccess) {
        navigate("/verify-email");
      }
    } catch (e) {
      // Log any unexpected errors (already caught in auth store usually)
      console.error("Signup failed:", e);
      await setErr(e || "Error signing up");
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
          Create Account
        </h2>

        {/* -------------------- Sign-Up Form -------------------- */}
        <form onSubmit={handleSignUp}>
          {/* Input field for full name */}
          <Input
            icon={User} // Icon to display on the left
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (err) setErr(null); // Clear error when user starts typing
            }}
            disabled={isLoading} // Disable while submitting
          />

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

          {/* If there's an error, show animated error message */}
          {err && (
            <motion.p
              className="text-red-500 font-semibold mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {err}
            </motion.p>
          )}

          {/* Show visual meter for password strength */}
          <PasswordStrengthMeter password={password} />

          {/* Submit button with animated hover and tap effects */}
          <motion.button
            type="submit"
            disabled={isLoading} // Prevent multiple submissions
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 
                       text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
                       focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50"
            whileHover={{ scale: 1.02 }} // Slightly grow on hover
            whileTap={{ scale: 0.98 }} // Slightly shrink on click
          >
            {/* Spinner when loading, otherwise show button text */}
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
      </div>

      {/* Bottom section: redirect prompt for existing users */}
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to={"/login"} className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

// Export component for use in routing
export default SignUpPage;
