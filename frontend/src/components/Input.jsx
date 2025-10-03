import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Reusable input component that accepts an optional icon (on the left)
 * and can show/hide password field when enabled.
 *
 * Props:
 * - icon: React component for left-side icon (e.g., email/user icon)
 * - showPasswordIcon: boolean to toggle the Eye/EyeOff toggle button
 * - All other props (e.g. type, placeholder, onChange, value) are spread
 */
const Input = ({
  icon: Icon,
  showPasswordIcon = false,
  type = "text",
  ...props
}) => {
  // Local state to toggle password visibility if needed
  const [showPassword, setShowPassword] = useState(false);

  // Determine actual input type based on show/hide toggle
  const inputType = showPasswordIcon
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="relative mb-6">
      {/* Left icon inside the input field */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-green-500" />
      </div>

      {/* Main input element */}
      <input
        {...props}
        type={inputType} // Controlled internally when showPasswordIcon is true
        className="w-full pl-10 pr-10 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
      />

      {/* Optional toggle button for password visibility (on the right) */}
      {showPasswordIcon && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <EyeOff className="size-5 text-green-500" />
          ) : (
            <Eye className="size-5 text-green-500" />
          )}
        </button>
      )}
    </div>
  );
};

export default Input;
