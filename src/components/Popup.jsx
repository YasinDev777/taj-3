/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { BiX } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { BlockChartAnalytics, VideoAnalytics } from '../analytics/Analytics';
import { useSelector, useDispatch } from 'react-redux';


const Popav = ({ isAlert, setIsAlert}) => {
  const video = useSelector((state) => state.video.video);

  const dispatch = useDispatch();

  const handleVideoChange = () => {
    dispatch({ type: 'IsVideo' });
  };


  const handleNone = (e) => {
    const textss_btn = document.querySelector('.textsss-btn');
    if (e.target.classList.contains('popav')) {
      setIsAlert(false);
      handleVideoChange()
    }
    if (textss_btn) {
      textss_btn.style.display = 'flex';
    }
  };

  return (
    <div className="popav" style={isAlert === true || video === true ? { display: 'flex' } : { display: 'none' }} onClick={handleNone}>
      <div className="alert" style={video === true ? { display: 'none' } : { display: 'flex' }}>
        <h3>
          Yana bir qadam ⚡<br />
          Analizlarni ko'rish uchun ro'yxatdan o'ting!
        </h3>
        <p>Pastdagi tugmani bosing va telegram orqali admin bilan bog'laning!</p>
        <div className="btn-div">
          <button
            onClick={() => {
              setIsAlert(!isAlert);
              BlockChartAnalytics('exit');
            }}
          >
            Chiqish
          </button>
          <Link to="https://t.me/ahsanlabs_admin" target="blank" onClick={() => BlockChartAnalytics('contactAdmin')}>
            <button onClick={() => setIsAlert(!isAlert)}>Bog'lanish</button>
          </Link>
        </div>
      </div>
      <div className="video-alert" style={video === true ? { display: 'flex' } : { display: 'none' }}>
        <div className="textss">
          <p>Video qo'llanma 😎</p>
          <BiX
            onClick={() => {
              handleVideoChange()
              setIsAlert(false);
              VideoAnalytics('close');
            }}
            className="textsss-btn"
          />
        </div>
        <iframe width="100%" height="100%" src={video === true ? `https://www.youtube.com/embed/Hd8IWQ8M1NY` : ''} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
    </div>
  );
};

export default Popav;
