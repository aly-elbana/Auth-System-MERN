/* eslint-disable no-unused-vars */

// -------------------- Import Section --------------------

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/auth.store";
import toast from "react-hot-toast";

// -------------------- Component Definition --------------------

const EmailVerificationPage = () => {
  // -------------------- State Variables --------------------
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [err, setErr] = useState(null);
  const { verifyEmail, isLoading, error, success } = useAuthStore();

  const lastAttemptedCode = useRef(""); // Prevent auto-resubmit for wrong code

  // -------------------- Event Handlers --------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    // Prevent submitting same wrong code again
    if (verificationCode === lastAttemptedCode.current) return;

    // Clear any previous errors when starting a new verification attempt
    setErr(null);

    lastAttemptedCode.current = verificationCode;
    setCode(["", "", "", "", "", ""]);

    try {
      const isSuccess = await verifyEmail(verificationCode);
      if (isSuccess) navigate("/", { replace: true });
    } catch (error) {
      console.error("Verification failed:", error);
      setErr(error || "Verification failed");
    }
  };

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    // Clear error when user starts typing
    if (err) setErr(null);

    const newCode = [...code];

    // Handle full code paste
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pasted[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").slice(0, 6);
    if (!/^\d{6}$/.test(pastedData)) return;

    const newCode = pastedData.split("");
    setCode(newCode);
    inputRefs.current[5]?.focus();
  };

  // -------------------- Auto Verify Effect --------------------

  useEffect(() => {
    const verificationCode = code.join("");

    if (
      code.every((digit) => digit) &&
      !isLoading &&
      verificationCode !== lastAttemptedCode.current
    ) {
      lastAttemptedCode.current = verificationCode;

      const verifyAndNavigate = async () => {
        try {
          const isSuccess = await verifyEmail(verificationCode);
          if (isSuccess) navigate("/", { replace: true });
        } catch (error) {
          console.error("Auto-verification failed:", error);
        }
      };

      verifyAndNavigate();
    }
  }, [code, verifyEmail, navigate, isLoading]);

  // -------------------- JSX Structure --------------------

  return (
    <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>

        <p className="text-center text-gray-300 mb-6">
          Enter The 6-Digit Code Sent To Your Email
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                aria-label={`Digit ${index + 1}`}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>

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

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
