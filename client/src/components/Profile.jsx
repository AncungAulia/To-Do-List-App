import React, { useState, useEffect } from "react";
import NavbarDashboard from "./NavbarDashboard";
import { User, Lock, AlertCircle, Check, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5000/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data);
      setNewName(response.data.name);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("auth_token");
        navigate("/login");
      } else {
        setError(err.response?.data?.error || "Failed to fetch user data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    try {
      setError("");
      setSuccess("");

      if (!newName.trim()) {
        setError("Name cannot be empty");
        return;
      }

      const token = localStorage.getItem("auth_token");
      const response = await axios.put(
        "http://localhost:5000/user/update-name",
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData(response.data.user);
      setSuccess("Name updated successfully");
      setIsEditingName(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update name");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate passwords
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setError("All password fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");
      await axios.put(
        "http://localhost:5000/user/update-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-h-screen overflow-auto bg-gray-50 dark:bg-backgroundDark">
      <NavbarDashboard theme={theme} toggleTheme={toggleTheme} />

      <div className="max-w-2xl mx-auto p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-8">Profile Settings</h1>

        {/* Informasi User (Profilnya) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-md">
          <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
            <User size={20} />
            Profile Information
          </h2>

          <div className="space-y-4">
            {/* Email (Ga Bisa Diganti) */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={userData.email}
                readOnly
                className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500"
              />
            </div>

            {/* Nama */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <div className="flex gap-2">
                {isEditingName ? (
                  <>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 p-3 rounded-lg border focus:ring-2 focus:ring-button
                        dark:bg-gray-700 dark:border-gray-600"
                    />
                    <button
                      onClick={handleUpdateName}
                      className="p-3 text-green-500 hover:bg-green-50 rounded-lg"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setNewName(userData.name);
                      }}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={userData.name}
                      readOnly
                      className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                    />
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="px-4 py-2 text-sm bg-banana text-white rounded-lg
                        hover:bg-opacity-90 transition-colors"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bagian Ubah Password */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
            <Lock size={20} />
            Change Password
          </h2>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-button
                  dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-button
                  dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-button
                  dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-banana text-white rounded-lg
                hover:bg-opacity-90 transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500 text-white rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-500 text-white rounded-lg flex items-center gap-2">
            <Check size={20} />
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
