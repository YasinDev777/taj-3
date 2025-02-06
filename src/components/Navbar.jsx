
import {
  ConatactAnalytics,
  logoAnalytics,
  pageAnalytics,
  VideoAnalytics,
} from "../analytics/Analytics";
import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRightCircle } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import logoIcon from "../assets/telegramIcon.svg"
const Navbar = ({ setIsAlert, isUser, isLogedIn }) => {

  const video = useSelector((state) => state.video.video);

  const dispatch = useDispatch();

  const handleVideoChange = () => {
    dispatch({ type: 'IsVideo' });
    VideoAnalytics('open');
  };
  ///// 
  // const data = useSelector((state) => state.data.data);

  // console.log(data);
  ///////


  // const handleVideoClick = ()=> {
  //   setIsVideo(prevState => !prevState);
  // }

  const handleLoginClick = () => {  
    // dispatch({ type: 'IsVideo' });
    pageAnalytics('toLoginPage');
  };


  return (
    <>
      <div className="flex justify-between items-center h-20 px-8 bg-white max-sm:px-2">
        <div className="flex items-center gap-4 max-md-plus:gap-1">
          <Link
            to="/"
            className="text-4xl font-extrabold max-sm:text-lg"
            onClick={() => logoAnalytics()}
          >
            AHSAN LABS
          </Link>
          <div className="relative cursor-pointer group">
            <h1
              className="text-white text-base rounded-[20px] px-4 h-6
               bg-gradient-to-b from-[#180F0F] via-[#3F3B3E] to-[#2C2B34] max-md-plus:text-xs max-md-plus:h-4 max-md-plus:px-3 max-sm:text-[4px]\"
            >
              BETA
            </h1>
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
        {/* <div className="flex items-center gap-3 underline max-md-plus:text-sm max-md-plus:gap-2">
          <Link to="/roadmap">Yo'l xaritasi</Link>
          
        </div> */}
        <div className="flex items-center gap-8 max-md-plus:gap-2">
        <button
            className="underline max-lg:hidden"
           
            // style={video === true ? { display: "none" } : { display: "flex" }}
            onClick={handleVideoChange}
          >
            Foydalanish videosi
          </button>
          <Link
            to="https://t.me/ahsanlabs_admin"
            onClick={() => ConatactAnalytics("contactAdminIcon")}
            target="blank"
          >
            <img className="w-7 max-md-plus:w-5" src={logoIcon} alt="" />
          </Link>
          {isLogedIn === false ? (
              <Link onClick={handleLoginClick} to="/login"
                className="flex items-center gap-2 bg-black text-white rounded-full text-2xl px-5 py-1 max-md-plus:gap-1 max-md-plus:text-xs px"
              >
                Kirish <FiArrowRightCircle />
            </Link>
          ) : (
            <h3 className="text-3xl font-semibold max-sm:text-xl ">{isUser}</h3>
          )}
        </div>
      </div>
    </>
  )
}
export default Navbar;
 {/* <button
              onClick={() => setIsAlert(false)} */}