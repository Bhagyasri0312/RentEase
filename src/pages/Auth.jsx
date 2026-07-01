import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Phone,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Auth = () => {
  const [authMode, setAuthMode] = useState("login"); // 'login', 'register', 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailError, setResetEmailError] = useState("");
  const [resetEmailSuccess, setResetEmailSuccess] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  };

  const validateName = (name) => {
    return name.trim().length >= 3;
  };

  const validateLoginForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const validateRegisterForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (!validateName(formData.name)) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleResetEmailChange = (e) => {
    setResetEmail(e.target.value);
    if (resetEmailError) {
      setResetEmailError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitSuccess(false);

    if (authMode === "login") {
      const newErrors = validateLoginForm();
      if (Object.keys(newErrors).length === 0) {
        console.log("Login submitted:", formData);
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
          });
        }, 3000);
      } else {
        setErrors(newErrors);
      }
    } else if (authMode === "register") {
      const newErrors = validateRegisterForm();
      if (Object.keys(newErrors).length === 0) {
        console.log("Register submitted:", formData);
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
          });
        }, 3000);
      } else {
        setErrors(newErrors);
      }
    }
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setResetEmailSuccess(false);

    if (!resetEmail) {
      setResetEmailError("Email is required");
      return;
    }

    if (!validateEmail(resetEmail)) {
      setResetEmailError("Please enter a valid email");
      return;
    }

    console.log("Password reset email sent to:", resetEmail);
    setResetEmailSuccess(true);
    setTimeout(() => {
      setResetEmailSuccess(false);
      setResetEmail("");
      setAuthMode("login");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Back Button (Forgot Password Mode) */}
        {authMode === "forgot" && (
          <button
            onClick={() => setAuthMode("login")}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Login
          </button>
        )}

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">RE</span>
            </div>
            <span className="font-bold text-2xl text-slate-900">RentEase</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {authMode === "login" && "Welcome Back"}
            {authMode === "register" && "Create Account"}
            {authMode === "forgot" && "Reset Password"}
          </h1>
          <p className="text-slate-600">
            {authMode === "login" && "Sign in to your account to continue"}
            {authMode === "register" &&
              "Join RentEase to start renting premium items"}
            {authMode === "forgot" &&
              "Enter your email to receive password reset instructions"}
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-green-900">Success!</p>
              <p className="text-sm text-green-700">
                {authMode === "login" && "You have been signed in successfully"}
                {authMode === "register" &&
                  "Your account has been created successfully"}
              </p>
            </div>
          </div>
        )}

        {resetEmailSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-green-900">Check Your Email</p>
              <p className="text-sm text-green-700">
                Password reset link has been sent to {resetEmail}
              </p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6">
          {/* LOGIN FORM */}
          {authMode === "login" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.email
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-slate-200 bg-white focus:border-blue-500"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.password
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-slate-200 bg-white focus:border-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setAuthMode("forgot")}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-400"
                />
                <span className="text-sm text-slate-700">Remember me</span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Sign In
                <ArrowRight size={20} />
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authMode === "register" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.name
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-slate-200 bg-white focus:border-blue-500"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.email
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-slate-200 bg-white focus:border-blue-500"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    maxLength="10"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.phone
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-slate-200 bg-white focus:border-blue-500"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.password
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-slate-200 bg-white focus:border-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.confirmPassword
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-slate-200 bg-white focus:border-blue-500"
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms & Privacy Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-400 mt-1"
                  required
                />
                <span className="text-sm text-slate-700">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Create Account
                <ArrowRight size={20} />
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {authMode === "forgot" && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={handleResetEmailChange}
                    placeholder="you@example.com"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      resetEmailError
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-slate-200 bg-white focus:border-blue-500"
                    }`}
                  />
                </div>
                {resetEmailError && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {resetEmailError}
                  </p>
                )}
              </div>

              {/* Info Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  We'll send you an email with instructions to reset your
                  password. The link will expire in 24 hours.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Send Reset Link
                <ArrowRight size={20} />
              </button>
            </form>
          )}

          {/* Divider */}
          {authMode !== "forgot" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-600">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="py-3 px-4 border-2 border-slate-200 hover:border-blue-300 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-blue-50"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.5C6.201 22.5 1.5 17.799 1.5 12S6.201 1.5 12 1.5 22.5 6.201 22.5 12 17.799 22.5 12 22.5zm3-11.25h-2.25V9h-1.5v2.25H9v1.5h2.25V15h1.5v-2.25H15v-1.5z" />
                  </svg>
                  <span className="text-sm font-semibold text-slate-700">
                    Google
                  </span>
                </button>
                <button
                  type="button"
                  className="py-3 px-4 border-2 border-slate-200 hover:border-blue-300 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-blue-50"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-sm font-semibold text-slate-700">
                    Facebook
                  </span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Toggle Auth Mode */}
        {authMode !== "forgot" && (
          <p className="text-center text-slate-700 mt-6">
            {authMode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setAuthMode(authMode === "login" ? "register" : "login");
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  password: "",
                  confirmPassword: "",
                });
                setErrors({});
              }}
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              {authMode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        )}

        {/* Terms & Privacy (Login & Register) */}
        {authMode !== "forgot" && (
          <p className="text-center text-xs text-slate-600 mt-6">
            By {authMode === "login" ? "signing in" : "creating an account"},
            you agree to our{" "}
            <a
              href="#"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Privacy Policy
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
