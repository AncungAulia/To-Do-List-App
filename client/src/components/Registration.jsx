import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Full Name Is Required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email Is Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid Email Format";
    }
    if (!formData.password) {
      newErrors.password = "Password Is Required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password Must Be At Least 6 Characters Long";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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
      const response = await axios.post("http://localhost:5000/register", formData);

      // Registration successful, navigate to login page with email pre-filled
      navigate("/login", { 
        state: { 
          email: formData.email,
          registrationSuccess: true 
        } 
      });
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setErrors({ email: error.response.data.error });
            break;
          case 500:
            setErrors({ message: error.response.data.error });
            break;
          default:
            setErrors({ message: "An unexpected error occurred" });
        }
      } else {
        setErrors({
          message: "Unable to connect to server. Please check your internet connection."
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-containerLight/75 dark:bg-containerDark">
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleSubmit}
          className="bg-backgroundLight dark:bg-containerDark shadow-lg rounded-3xl px-8 pt-6 pb-8 mb-4 border-2 border-banana"
          noValidate
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-primaryTextLight dark:text-primaryTextDark">
            Create your account
          </h1>

          {errors.message && (
            <div className="mb-4 p-3 rounded bg-red-100 text-errorText text-sm">
              {errors.message}
            </div>
          )}

          <div className="mb-4">
            <label 
              className="block text-primaryTextLight dark:text-primaryTextDark text-sm font-bold mb-2"
              htmlFor="name"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 rounded-2xl bg-slate-200/50 dark:bg-slate-50
                focus:outline-none focus:ring-2 focus:ring-button
                dark:text-primaryTextLight
                ${errors.name ? 'ring-2 ring-errorText' : ''}`}
              placeholder="Enter Your Full Name"
            />
            {errors.name && (
              <p className="text-errorText text-sm mt-1">{errors.name}</p>
            )}
          </div>

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

          <div className="mb-4">
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
              placeholder="Enter your password"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-errorText text-sm mt-1">{errors.password}</p>
            )}
            <div className="mt-2">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={() => setShowPassword(!showPassword)}
                />
                Show Password
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
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="mt-4 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-button hover:underline font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;