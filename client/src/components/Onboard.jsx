import React from "react";
import NavbarOnboard from "./NavbarOnboard";
import { Link, useNavigate } from "react-router-dom";

const Onboard = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col">
      <NavbarOnboard theme={theme} toggleTheme={toggleTheme} />
      
      <main className="flex flex-col lg:flex-row flex-1 w-full p-6 sm:p-8 md:p-12 lg:p-16 gap-8 lg:gap-4 
        justify-center lg:justify-evenly items-center bg-backgroundLight dark:bg-backgroundDark">
        <div className="flex flex-col text-center lg:text-left lg:flex-1 max-w-2xl lg:max-w-none">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              all-in-one
            </span>{" "}
            solution to manage tasks efficiently.
          </h1>
          
          <h2 className="my-4 text-lg sm:text-xl">
            Start planning, start achieving.
          </h2>
          
          <div className="flex justify-center lg:justify-start">
            <Link
              to="/registration"
              onClick={(e) => {
                e.preventDefault();
                setTimeout(() => {
                  navigate("/registration");
                }, 200);
              }}
              className="w-36 p-4 font-bold sm:p-5 text-lg sm:text-xl bg-yellow-400 text-white text-center 
                rounded-3xl transform transition-all duration-200 ease-out 
                hover:ring-backgroundDark hover:scale-105 hover:brightness-110 
                hover:ring-2 dark:hover:ring-backgroundLight"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="relative flex-1 flex justify-center lg:justify-end w-full max-w-2xl lg:max-w-none">
          <img
            src="/assets/hero.png"
            alt="Task management illustration"
            className="w-4/5 sm:w-3/4 lg:w-3/5 h-auto object-cover rounded-3xl z-20"
          />

          <div className="hidden sm:flex flex-col justify-around w-40 md:w-56 h-48 md:h-64 p-4 md:p-5 
            px-5 md:px-7 rounded-lg bg-yellow-300 z-0 absolute 
            top-0 left-[15%] lg:left-52 border-4 border-backgroundDark 
            dark:border-backgroundLight">
            {[...Array(6)].map((_, i) => (
              <div
                key={`top-line-${i}`}
                className="w-full h-2 bg-backgroundLight dark:bg-black"
              />
            ))}
          </div>

          <div className="hidden sm:flex flex-col justify-around w-40 md:w-56 h-48 md:h-64 p-4 md:p-5 
            px-5 md:px-7 rounded-lg bg-yellow-300 z-10 absolute 
            bottom-0 right-[15%] lg:right-0 border-4 border-backgroundDark 
            dark:border-backgroundLight">
            {[...Array(6)].map((_, i) => (
              <div
                key={`bottom-line-${i}`}
                className="w-full h-2 bg-backgroundLight dark:bg-black"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboard;