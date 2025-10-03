import { Check, X } from "lucide-react"; // Importing check and X icons for visual feedback
/**
 * PasswordCriteria Component
 * Displays individual password rules and whether they're met, with icons.
 *
 * Props:
 * - password: the current password string to evaluate
 */
const PasswordCriteria = ({ password }) => {
  // Define validation rules and check if each is met
  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="mt-2 space-y-1">
      {/* Render each criterion with an icon and label */}
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-xs">
          {/* Icon: green check if met, gray X if not */}
          {item.met ? (
            <Check className="size-4 text-green-500 mr-2" />
          ) : (
            <X className="size-4 text-gray-500 mr-2" />
          )}

          {/* Label: green text if met, gray if not */}
          <span className={item.met ? "text-green-500" : "text-gray-400"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * PasswordStrengthMeter Component
 * Visual indicator of how strong the password is + criteria checker.
 *
 * Props:
 * - password: the current password string to evaluate
 */
const PasswordStrengthMeter = ({ password }) => {
  /**
   * Calculate password strength score (0 to 4)
   */
  const getStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++; // Minimum length
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++; // Case mix
    if (/\d/.test(password)) strength++; // Contains number
    if (/[^a-zA-Z\d]/.test(password)) strength++; // Special character
    return strength;
  };

  /**
   * Return bar color based on strength score
   */
  const getColor = (strength) => {
    if (strength === 0) return "bg-red-500";
    if (strength === 1) return "bg-red-400";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-yellow-400";
    return "bg-green-500";
  };

  /**
   * Return label text based on strength score
   */
  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  const strength = getStrength(password);

  return (
    <div className="mt-2">
      {/* Header row: left label and strength level text */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Password strength</span>
        <span className="text-xs text-gray-400">
          {getStrengthText(strength)}
        </span>
      </div>

      {/* Strength meter bar with 4 segments */}
      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`
              h-1 w-1/4 rounded-full transition-colors duration-300 
              ${index < strength ? getColor(strength) : "bg-gray-600"}
            `}
          />
        ))}
      </div>

      {/* Display criteria checklist */}
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;
