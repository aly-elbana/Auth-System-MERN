/* eslint-disable no-unused-vars */

// -------------------- Import Section --------------------

// Zustand: lightweight state management library for React
import { create } from "zustand";

// Axios: for HTTP requests to the backend API
import axios from "axios";

// React Hot Toast: for showing feedback messages to the user
import toast from "react-hot-toast";

// -------------------- Configuration --------------------

// Base URL for all authentication-related API requests
const API_URL = "http://localhost:1502/api/v1/auth";

// Ensure that cookies (e.g., JWT tokens) are included in every request
axios.defaults.withCredentials = true;

// -------------------- Store Definition --------------------

/**
 * Zustand store for managing user authentication state.
 * This store handles all authentication-related operations including:
 * - User signup and email verification
 * - User login and logout
 * - Session management and token validation
 * - Loading states and error handling
 */
export const useAuthStore = create((set, get) => ({
    // ===========================
    // 🔐 GLOBAL STATE VARIABLES
    // ===========================

    user: null,                 // Stores logged-in user data (e.g., name, email, isVerified)
    error: null,                // Holds error message to be shown on frontend
    success: null,              // Indicates if the last auth action was successful
    isAuthenticated: false,     // Boolean flag: true if user is logged in
    isLoading: false,           // Boolean flag: true during async operations (signup/login/etc.)
    isCheckingAuth: true,       // true while app checks session on initial load

    // ===========================
    // ✉️ SIGNUP FUNCTION
    // ===========================

    /**
 * Handles user registration by sending signup data to the backend.
 * Creates a new user account and sends verification email.
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password (min 8 characters)
 * @param {string} name - User's full name
 * @returns {Promise<boolean>} - true if signup successful, false otherwise
 */
    signUp: async (email, password, name) => {
        // Begin loading state and clear any previous error/success
        set({ isLoading: true, error: null, success: false });

        try {
            // Send signup data to backend API
            const response = await axios.post(`${API_URL}/signup`, {
                email,
                password,
                name,
            });

            // Update the state with received user data and auth status
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                success: response.data.success,
                error: null,
            });

            // Display a success message if signup succeeded
            if (get().success) {
                toast.success("Signup successful. Please check your email.");
            }

            return true; // Return true on success

        } catch (error) {
            // Safely extract error message from response or fallback
            const message = error?.response?.data?.message || "An unexpected error occurred.";

            // If session-related error, clear auth state
            if (message === "Unauthorized. Please login to continue.") {
                set({
                    isLoading: false,
                    error: null,
                    success: false,
                    isAuthenticated: false,
                });
            } else {
                // For all other errors: update error state and show a toast
                set({ isLoading: false, error: message, success: false });
                toast.error(message);
            }

            return false; // Return false on error
        }
    },

    // ===========================
    // ✅ EMAIL VERIFICATION FUNCTION
    // ===========================

    /**
     * Verifies user's email address using the provided verification code.
     * Updates user's verification status and automatically logs them in.
     * 
     * @param {string} code - 6-digit verification code sent to user's email
     * @returns {Promise<boolean>} - true if verification successful, false otherwise
     */
    verifyEmail: async (code) => {
        // Set loading state and reset error/success
        set({ isLoading: true, error: null, success: false });

        try {
            // Send verification code to backend
            const response = await axios.post(`${API_URL}/verify-email`, { code });

            // Update state with verified user and mark as authenticated
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                success: true,
                error: null,
            });

            // Notify user of success
            toast.success("Email verified successfully");
            return true;

        } catch (error) {
            // Extract error message or fallback
            const message = error?.response?.data?.message || "Email verification failed.";
            set({ isLoading: false, error: message, success: false });
            toast.error(message);
            return false;
        }
    },

    // ===========================
    // 🔑 LOGIN FUNCTION
    // ===========================

    /**
 * Handles user login by sending credentials to the backend.
 * Authenticates user and sets up session if credentials are valid.
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<boolean>} - true if login successful, false otherwise
 */
    login: async (email, password) => {
        // Begin loading and reset error
        set({ isLoading: true, error: null, success: false });

        try {
            // Send login credentials to backend
            const response = await axios.post(`${API_URL}/login`, { email, password });

            // If successful, update auth state and user
            set({
                isAuthenticated: true,
                user: response.data.user,
                error: null,
                isLoading: false,
                success: true,
            });

            // Show success message
            toast.success("Login successful");
            return true;

        } catch (error) {
            // Extract error message or fallback
            const message = error?.response?.data?.message || "Error logging in";

            // Set error in state and stop loading
            set({
                error: message,
                isLoading: false,
                success: false,
            });

            toast.error(message);
            return false;
        }
    },

    // ===========================
    // 🚪 LOGOUT FUNCTION
    // ===========================

    /**
 * Handles user logout by clearing session on backend and local state.
 * Removes authentication tokens and resets user data.
 * 
 * @returns {Promise<boolean>} - true if logout successful, false otherwise
 */
    logout: async () => {
        set({ isLoading: true, error: null, success: false });

        try {
            // Send logout request to backend to clear session
            await axios.post(`${API_URL}/logout`);

            // Clear local authentication state
            set({
                isAuthenticated: false,
                user: null,
                error: null,
                isLoading: false,
                success: true,
            });

            toast.success("Logged out successfully");
            return true;
        } catch (error) {
            const message = error?.response?.data?.message || "Error logging out";
            set({ error: message, isLoading: false, success: false });
            toast.error(message);
            return false;
        }
    },

    // ===========================
    // 🔍 CHECK AUTH STATUS ON APP LOAD
    // ===========================

    /**
 * Checks if user has a valid session on app startup.
 * Validates JWT token and retrieves user data if session is active.
 * This function is called when the app first loads.
 * 
 * @returns {Promise<boolean>} - true if session valid, false otherwise
 */
    checkAuth: async () => {
        // Begin auth-check loading state
        set({ isCheckingAuth: true, error: null, success: false });

        try {
            // Send GET request to validate current session/token
            const response = await axios.get(`${API_URL}/check-auth`);

            // If token is valid, update store with user and auth status
            set({
                user: response.data.user,
                isAuthenticated: true,
                isCheckingAuth: false,
                success: response.data.success,
                error: null,
            });

            return true;

        } catch (error) {
            const message = error?.response?.data?.message || "An unexpected error occurred.";

            // Session expired or user not logged in
            if (message === "Unauthorized. Please login to continue.") {
                set({
                    isCheckingAuth: false,
                    error: null,
                    success: false,
                    isAuthenticated: false,
                });
            } else {
                // Other errors
                set({
                    isCheckingAuth: false,
                    error: message,
                    success: false,
                    isAuthenticated: false,
                });
                toast.error(message);
            }

            return false;
        }
    },

    // ===========================
    // 🔁 FORGOT PASSWORD FUNCTION
    // ===========================

    /**
     * Sends a password reset email to the user's email address.
     * Generates a reset token and sends it via email.
     * 
     * @param {string} email - User's email address
     * @returns {Promise<boolean>} - true if email sent successfully, false otherwise
     */
    forgotPassword: async (email) => {
        // Begin loading state and clear any previous error
        set({ isLoading: true, error: null, success: false });

        try {
            // Send forgot password request to backend
            const response = await axios.post(`${API_URL}/forgot-password`, { email });

            // Update state on success
            set({
                isLoading: false,
                success: response.data.success,
                error: null
            });

            // Show success message
            toast.success("Password reset email sent successfully");
            return true;

        } catch (error) {
            // Extract error message or fallback
            const message = error?.response?.data?.message || "Failed to send reset email";
            set({ isLoading: false, error: message, success: false });
            toast.error(message);
            return false;
        }
    },

    // ===========================
    // 🔒 RESET PASSWORD FUNCTION
    // ===========================

    /**
     * Resets user's password using the provided reset token.
     * Updates password in database and clears the reset token.
     * 
     * @param {string} token - Reset token from email
     * @param {string} newPassword - New password to set
     * @returns {Promise<boolean>} - true if password reset successful, false otherwise
     */
    resetPassword: async (token, newPassword) => {
        // Begin loading state and clear any previous error
        set({ isLoading: true, error: null, success: false });

        try {
            // Send reset password request to backend
            const response = await axios.post(`${API_URL}/reset-password/${token}`, {
                password: newPassword
            });

            // Update state on success
            set({
                isLoading: false,
                success: response.data.success,
                error: null
            });

            // Show success message
            return true;

        } catch (error) {
            // Extract error message or fallback
            const message = error?.response?.data?.message || "Failed to reset password";
            set({ isLoading: false, error: message, success: false });
            toast.error(message);
            return false;
        }
    },
}));
