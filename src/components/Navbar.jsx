import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { PiHeadsetBold } from 'react-icons/pi';
import { RxVideo } from 'react-icons/rx';
import { FiArrowRightCircle } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';

import { ConatactAnalytics, logoAnalytics, pageAnalytics, VideoAnalytics } from '../analytics/Analytics';

const Navbar = ({ setIsAlert, isUser, isLogedIn }) => {

  const video = useSelector((state) => state.video.video);

  const dispatch = useDispatch();

  const handleVideoChange = () => {
    dispatch({ type: 'IsVideo' });
  };



  ///// 
  const data = useSelector((state) => state.data.data);

  console.log(data);
  ///////

  
  const handleVideoClick = useCallback(() => {
    setIsVideo(prevState => !prevState);
    VideoAnalytics('open');
  }, [video]);

  const handleLoginClick = useCallback(() => {
    setIsVideo(false); // video oynasini yopish
    pageAnalytics('toLoginPage');
  }, [video]);

  return (
    <div className="nav">
      <div className="logo-name">
        <Link to="/" onClick={logoAnalytics}>
          AHSAN LABS
        </Link>
      </div>
      <div className="options">
        {!video && (
          <button className="video-btn" onClick={handleVideoChange}>
            <RxVideo /> Foydalanish videosi
          </button>
        )}

        <Link to="https://t.me/ahsanlabs_admin" onClick={() => ConatactAnalytics('contactAdminIcon')} target="_blank">
          <PiHeadsetBold />
        </Link>

        {isLogedIn === false ? (
          <Link to="/login" onClick={handleLoginClick}>
            <button onClick={() => setIsAlert(false)}>
              Kirish <FiArrowRightCircle />
            </button>
          </Link>
        ) : (
          <h3>{isUser}</h3>
        )}
      </div>
    </div>
  );
};

export default Navbar;
