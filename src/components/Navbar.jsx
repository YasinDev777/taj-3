import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRightCircle } from "react-icons/fi";
import {
  ConatactAnalytics,
  logoAnalytics,
  pageAnalytics,
  VideoAnalytics,
} from "../analytics/Analytics";
const Navbar = ({ isVideo, setIsVideo, setIsAlert, isUser, isLogedIn }) => {
  return (
    <>
      <div className="flex justify-between items-center h-20 px-8 bg-white">
        <div class="flex items-center gap-4 max-md-plus:gap-1">
          <Link
            to="/"
            className="text-4xl font-extrabold max-md-plus:text-2xl"
            onClick={() => logoAnalytics()}
          >
            AHSAN LABS
          </Link>
          <div class="relative cursor-pointer group">
            <h1
              class="text-white text-base rounded-[20px] px-4 h-6
               bg-gradient-to-b from-[#180F0F] via-[#3F3B3E] to-[#2C2B34] max-md-plus:text-xs max-md-plus:h-4 max-md-plus:px-3"
            >
              Beta
            </h1>
            <div
              className="betaButtonTooltip absolute z-10 -left-9 top-12 w-40 p-[10px] text-center text-base bg-white border border-gray-300 rounded-[8px] shadow-[0_0_5px_5px_#0000000D] opacity-0 transition-opacity duration-300 
                group-hover:opacity-100 pointer-events-none max-md: max-md-plus:text-xs max-md-plus:w-32 max-md-plus:-left-10 max-md-plus:top-10 "
            >
              Sayt test rejimda ishlamoqda
              <div
                class="absolute w-5 h-5 border-l border-t border-gray-300 
                  left-1/2 -translate-x-1/2 -top-[11px] rotate-45 bg-white hover:p-10"
              ></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 underline max-md-plus:text-sm max-md-plus:gap-2">
          <Link to="/roadmap">Yo'l xaritasi</Link>
          <button
            className="video-btn"
            onClick={() => {
              setIsVideo(!isVideo);
              VideoAnalytics("open");
            }}
            style={isVideo === true ? { display: "none" } : { display: "flex" }}
          >
            Foydalanish videosi
          </button>
        </div>
        <div className="flex items-center gap-8 max-md-plus:gap-2">
          <Link
            to="https://t.me/ahsanlabs_admin"
            onClick={() => ConatactAnalytics("contactAdminIcon")}
            target="blank"
          >
            <img className="w-7 max-md-plus:w-5" src="./images/telegramIcon.svg" alt="" />
          </Link>
          {isLogedIn === false ? (
            <Link
              to="/login"
              onClick={() => {
                setIsVideo(false);
                pageAnalytics("toLoginPage");
              }}
            >
              <button
                onClick={() => setIsAlert(false)}
                className="flex items-center gap-2 bg-black text-white rounded-full text-2xl px-5 py-1 max-md-plus:gap-1 max-md-plus:text-xs px"
              >
                Kirish <FiArrowRightCircle />
              </button>
            </Link>
          ) : (
            <h3 className="text-3xl font-semibold">{isUser}</h3>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
