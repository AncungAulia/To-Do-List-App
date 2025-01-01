import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Sun, Moon, Menu, X } from "lucide-react";

const NavbarOnboard = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 200);
  };

  return (
    <nav className="sticky top-0 z-50 bg-backgroundLight dark:bg-backgroundDark shadow-md">
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

          {/* Bagian Navigation */}
          <div className="hidden sm:flex items-center space-x-4">
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

            <Link
              to="/login"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/login");
              }}
              className="flex items-center gap-1 bg-banana text-primaryTextDark px-4 py-2 rounded-2xl
                transform transition-all duration-200 ease-out
                hover:scale-105 hover:ring-2 hover:ring-backgroundDark hover:brightness-110
                dark:hover:ring-backgroundLight focus:outline-none focus:ring-2 focus:ring-banana"
            >
              <span>Sign In</span>
              <LogIn className="w-5 h-5" />
            </Link>
          </div>

          {/* Nav Buat Responsif (hamburger)*/}
          <div className="flex sm:hidden items-center space-x-2">
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-banana"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-500 dark:text-white" />
              ) : (
                <Menu className="w-6 h-6 text-gray-500 dark:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Pas Hamburger dibuka */}
        <div
          className={`sm:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-48 opacity-100 pb-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col items-center space-y-4 pt-2">
            <Link
              to="/login"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/login");
              }}
              className="w-full flex items-center justify-center gap-1 bg-banana text-primaryTextDark
                px-4 py-2 rounded-2xl transform transition-all duration-200 ease-out
                hover:scale-105 hover:ring-2 hover:ring-backgroundDark hover:brightness-110
                dark:hover:ring-backgroundLight focus:outline-none focus:ring-2 focus:ring-banana"
            >
              <span>Sign In</span>
              <LogIn className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarOnboard;
