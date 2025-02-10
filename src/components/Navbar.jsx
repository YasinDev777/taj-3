import { BiChevronRightCircle } from "react-icons/bi";

import {
  burgerMenuAnalytics,
  ConatactAnalytics,
  logoAnalytics,
  pageAnalytics,
  VideoAnalytics,
} from "../analytics/Analytics";
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import logoIcon from "../assets/telegramIcon.svg";
import {
  FiAlignJustify,
  FiArrowLeftCircle,
  FiTrendingUp,
  FiChevronRight,
  FiMap,
} from "react-icons/fi";
import { CiYoutube } from "react-icons/ci";
const Navbar = ({ setIsAlert, isUser, isLogedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const video = useSelector((state) => state.video.video);
  const dispatch = useDispatch();
  const handleVideoChange = () => {
    dispatch({ type: "IsVideo" });
  };
  const handleLoginClick = () => {
    pageAnalytics("toLoginPage");
    setIsAlert(false);
  };
  const location = useLocation();
  return (
    <>
      <nav className="w-full flex justify-between items-center p-4 bg-white">
        <div className="flex items-center justify-between max-lg:gap-2">
          <button
            className="hidden max-lg:flex text-2xl"
            onClick={() => {
              setIsMobileMenuOpen(true);
              burgerMenuAnalytics("open");
            }}
          >
            <FiAlignJustify />
          </button>
          <Link
            to="/"
            className="text-xl md:p-2 sm:text-3xl md:text-3xl font-black"
            onClick={() => logoAnalytics()}
          >
            AHSAN LABS
          </Link>
          <div className="relative cursor-pointer group">
            <div className="flex justify-center items-center text-white text-base rounded-[20px] px-4 h-6 bg-gradient-to-b from-[#180F0F] via-[#3F3B3E] to-[#2C2B34] max-md-plus:px-3 max-sm:text-[8px] max-xs:h-3">
              BETA
            </div>
            <div
              className="betaButtonTooltip absolute z-10 -left-9 top-12 w-40 p-[10px] text-center text-base bg-white border border-gray-300 rounded-[8px] shadow-[0_0_5px_5px_#0000000D] opacity-0 transition-opacity duration-300 
                group-hover:opacity-100 pointer-events-none max-md: max-md-plus:text-xs max-md-plus:w-32 max-md-plus:-left-10 max-md-plus:top-10 "
            >
              Sayt test rejimda ishlamoqda
              <div
                className="absolute w-5 h-5 border-l border-t border-gray-300 
                  left-1/2 -translate-x-1/2 -top-[11px] rotate-45 bg-white hover:p-10"
              ></div>
            </div>
          </div>
        </div>
        <div className="max-lg:hidden justify-center space-x-6 flex text-gray-700 text-base">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-bold ${isActive ? "underline" : ""}`
            }
            onClick={() => pageAnalytics("analizlar")}
          >
            Analizlar
          </NavLink>

          <NavLink
            to="/roadmap"
            className={({ isActive }) =>
              `font-bold ${isActive ? "underline" : ""}`
            }
            onClick={() => pageAnalytics("roadmap")}
          >
            Yo‘l xaritasi
          </NavLink>
          <Link
            onClick={() => {
              handleVideoChange();
              VideoAnalytics("open");
            }}
            className="font-bold"
          >
            Video qo‘llanma
          </Link>
        </div>

        <div className="flex space-x-2 items-center md:space-x-5">
          <Link
            to="https://t.me/ahsanlabs_admin"
            onClick={() => ConatactAnalytics("contactAdminIcon")}
            target="blank"
          >
            <img className="w-7 max-md-plus:w-5" src={logoIcon} alt="" />
          </Link>
          {isLogedIn === false ? (
            // <Link onClick={handleLoginClick} to="/login"
            //   className="flex items-center gap-2 bg-black text-white rounded-full text-2xl px-5 py-1 max-md-plus:gap-1 max-md-plus:text-xs px"
            // >
            //   Kirish <FiArrowRightCircle />

            <Link
              to="/login"
              className="flex items-center space-x-2 transition duration-300 ease-in-out hover:bg-white hover:text-black hover:border border bg-black text-white px-4 py-2 rounded-lg max-xs:p-2"
            >
              <span
                className="flex items-center gap-3 text-lg max-xs:text-sm max-xs:gap-1"
                onClick={handleLoginClick}
              >
                Kirish <BiChevronRightCircle />
              </span>
            </Link>
          ) : (
            <h3 className="text-3xl font-semibold max-sm:text-xl ">{isUser}</h3>
          )}
        </div>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex">
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.4 }}
              className="w-64 bg-white h-full p-4 shadow-lg"
            >
              <button
                className="mb-4"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  burgerMenuAnalytics("close");
                }}
              >
                <FiArrowLeftCircle size={35} />
              </button>
              <hr />
              <nav className="space-y-4 mt-4">
                <Link
                  to="/"
                  onClick={() => pageAnalytics("analizlar")}
                  className="flex justify-between items-center space-x-2 font-medium text-[18px] leading-[25.1px] hover:text-black"
                >
                  <span className="flex gap-3">
                    <FiTrendingUp className="mt-1" />
                    Analizlar
                  </span>
                  <FiChevronRight />
                </Link>
                <Link
                  to="/roadmap"
                  onClick={() => pageAnalytics("roadmap")}
                  className="flex justify-between items-center space-x-2 font-medium text-[18px] leading-[25.1px] hover:text-black"
                >
                  <span className="flex gap-3">
                    <FiMap className="mt-1" />
                    Yo‘l xaritasi
                  </span>
                  <FiChevronRight />
                </Link>

                <Link
                  onClick={() => {
                    handleVideoChange();
                    VideoAnalytics("open");
                  }}
                  className="flex justify-between items-center font-medium text-[18px] leading-[25.1px] space-x-2 hover:text-black"
                >
                  <span className="flex gap-3">
                    {" "}
                    <CiYoutube className="mt-1" />
                    Video qo‘llanma
                  </span>
                  <FiChevronRight />
                </Link>
              </nav>
            </motion.div>
          </div>
        )}
      </nav>
    </>
  );
};
export default Navbar;
{
  /* <button
              onClick={() => setIsAlert(false)} */
}
