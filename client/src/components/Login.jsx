import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Menampilkan success message dari registrasi
  const [successMessage, setSuccessMessage] = useState(
    location.state?.registrationSuccess 
      ? "Registration successful! Please login to continue." 
      : ""
  );

  // Check for stored credentials when component mounts
  useEffect(() => {
    document.title = "Login"
    const storedEmail = localStorage.getItem("remembered_email");
    const storedRememberMe = localStorage.getItem("remember_me") === "true";
    
    if (storedEmail && storedRememberMe) {
      setFormData(prev => ({
        ...prev,
        email: storedEmail
      }));
      setRememberMe(true);
    }
  }, []);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Clear location state after using it
  useEffect(() => {
    if (location.state) {
      window.history.replaceState({}, document.title);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors.message;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/login", formData);

      const { token, expiresIn } = response.data;

      // Handle Remember Me
      if (rememberMe) {
        localStorage.setItem("remembered_email", formData.email);
        localStorage.setItem("remember_me", "true");
      } else {
        localStorage.removeItem("remembered_email");
        localStorage.setItem("remember_me", "false");
      }

      localStorage.setItem("auth_token", token);
      localStorage.setItem("token_expiry", new Date().getTime() + expiresIn);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed. Please try again.";
      setErrors({ 
        message: errorMessage === "Invalid email or password" 
          ? "Invalid email or password. Please try again." 
          : errorMessage 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-containerLight/75 dark:bg-containerDark/75">
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleSubmit}
          className="bg-backgroundLight dark:bg-containerDark shadow-lg rounded-3xl px-8 pt-6 pb-8 mb-4 border-2 border-banana"
          noValidate
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-primaryTextLight dark:text-primaryTextDark">
            Login
          </h1>

          {successMessage && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          {errors.message && (
            <div className="mb-4 p-3 rounded bg-red-100 text-errorText text-sm">
              {errors.message}
            </div>
          )}

          <div className="mb-4">
            <label 
              className="block text-primaryTextLight dark:text-primaryTextDark text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 rounded-2xl bg-slate-200/50 dark:bg-slate-50
                focus:outline-none focus:ring-2 focus:ring-button
                dark:text-primaryTextLight
                ${errors.email ? 'ring-2 ring-errorText' : ''}`}
              placeholder="johndoe@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-errorText text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label 
              className="block text-primaryTextLight dark:text-primaryTextDark text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 rounded-2xl bg-slate-200/50 dark:bg-slate-50
                focus:outline-none focus:ring-2 focus:ring-button
                dark:text-primaryTextLight
                ${errors.password ? 'ring-2 ring-errorText' : ''}`}
              placeholder="Enter Your Password"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-errorText text-sm mt-1">{errors.password}</p>
            )}
            <div className="mt-2 space-y-2">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={() => setShowPassword(!showPassword)}
                />
                Show Password
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg bg-banana text-secondaryTextLight
                font-bold hover:brightness-110 transition-all duration-300
                ${loading ? 'opacity-50 cursor-wait' : 'hover:scale-105'}`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="mt-4 text-sm">
              Don't have an account?{" "}
              <Link
                to="/registration"
                className="text-button hover:underline font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;