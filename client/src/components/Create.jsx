import React, { useState } from "react";
import NavbarDashboard from "./NavbarDashboard";
import { Calendar, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Create = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.title.trim()) {
      errors.push("Title is required");
    }
    if (!formData.description.trim()) {
      errors.push("Description is required");
    }
    if (!formData.due_date) {
      errors.push("Due date is required");
    }
    if (!formData.priority) {
      errors.push("Priority is required");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        navigate("/login");
        return;
      }

      const formattedData = {
        ...formData,
        due_date: new Date(formData.due_date).toISOString(),
      };

      const response = await axios.post(
        "http://localhost:5000/todos",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Todo created successfully!");

      setFormData({
        title: "",
        description: "",
        due_date: "",
        priority: "medium",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("auth_token");
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Failed to create todo");
      }
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { value: "high", label: "High", color: "bg-red-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "low", label: "Low", color: "bg-green-500" },
  ];

  return (
    <div className="max-h-screen bg-gray-50 dark:bg-backgroundDark overflow-auto">
      <NavbarDashboard theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-4xl mx-auto px-4 py-8 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Task
            </h1>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors"
                  placeholder="Enter task title"
                  maxLength={100}
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors resize-none"
                  placeholder="Enter task description"
                  maxLength={500}
                />
              </div>

              {/* Tanggal */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="datetime-local"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-colors"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

              {/* Prioritas */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Priority Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {priorityOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`
                        relative flex items-center justify-center p-3 rounded-lg border 
                        cursor-pointer transition-all duration-200
                        ${
                          formData.priority === option.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-blue-400"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={option.value}
                        checked={formData.priority === option.value}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div
                        className={`w-3 h-3 rounded-full ${option.color} mr-2`}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-3 px-4 rounded-lg bg-banana text-white font-medium
                  transition-all duration-200
                  ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-banana/90 active:bg-banana/50"
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Clock className="animate-spin mr-2" />
                    Creating Task...
                  </div>
                ) : (
                  "Create Task"
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p>{success}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Create;
