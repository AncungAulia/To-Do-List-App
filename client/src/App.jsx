import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Onboard from "./components/Onboard";
import Dashboard from "./components/Dashboard";
import Create from "./components/Create";
import Profile from "./components/Profile";

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className={theme}>
      <div className="flex flex-row h-screen w-screen items-center justify-center overflow-auto text-primaryTextLight dark:text-primaryTextDark bg-backgroundLight dark:bg-backgroundDark">
        <Router>
          <div className="w-full ">
            <Routes>
              <Route
                path="/"
                element={<Onboard theme={theme} toggleTheme={toggleTheme} />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
              <Route
                path="/dashboard"
                element={<Dashboard theme={theme} toggleTheme={toggleTheme} />}
              />
              <Route
                path="/dashboard/create"
                element={<Create theme={theme} toggleTheme={toggleTheme} />}
              />
              <Route
                path="/dashboard/profile"
                element={<Profile theme={theme} toggleTheme={toggleTheme} />}
              />
            </Routes>
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
