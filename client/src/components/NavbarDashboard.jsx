import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Sun, Moon, LogOut, User, Plus, LayoutDashboard } from "lucide-react";

const NavbarDashboard = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("token_expiry");
    navigate("/");
  };

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { to: "/dashboard/create", icon: Plus, text: "Create" },
    { to: "/dashboard/profile", icon: User, text: "Profile" },
  ];

  return (
    <nav className="bg-containerLight dark:bg-backgroundDark shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group relative gap-2">
              <img
                src="/assets/app_icon.png"
                alt="app_icon"
                className="w-8 h-8"
              />
              <div className="relative">
                <span className="text-2xl md:text-3xl font-titilliumWeb font-bold">
                  To-Do-List
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-banana transition-all duration-200 group-hover:w-full"></span>
              </div>
            </Link>
          </div>

          {/* Bagian Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <div key={link.to} className="group">
                <Link
                  to={link.to}
                  className="relative flex items-center gap-1 px-3 py-2 transition-all duration-300 hover:scale-110"
                >
                  <link.icon className="w-5 h-5" />
                  {link.text}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-banana transition-all duration-200 group-hover:w-full"></span>
                </Link>
              </div>
            ))}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-banana"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-gray-500" />
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>

          {/* Nav Buat Responsif (hamburger) */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-500" />
              ) : (
                <Menu className="w-6 h-6 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu pas hamburger dibuka */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-containerLight dark:bg-backgroundDark shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <link.icon className="w-5 h-5" />
              {link.text}
            </Link>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDashboard;
