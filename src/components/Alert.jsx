import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiErrorWarningLine } from "react-icons/ri";
import { BiX } from "react-icons/bi";

const Alert = ({ isLogined, isUser, setAlertShown, alertShown }) => {
  const ALERT_DELAY = 2 * 60 * 1000; // 2 daqiqa
  const ALERT_RESET_TIME = 5 * 60 * 1000; // Har 5 daqiqada qayta chiqish
  const INITIAL_ALERT_DELAY = 1 * 60 * 1000; // Ro'yxatdan o'tgandan 1 daqiqada chiqadi

  useEffect(() => {
    // Ro'yxatdan o'tgandan so'ng alertni ko'rsatish
    if (isLogined) {
      const lastClosedTime = localStorage.getItem("alertLastClosed");
      const currentTime = Date.now();

      if (!lastClosedTime || currentTime - lastClosedTime > ALERT_RESET_TIME) {
        const initialTimeout = setTimeout(() => {
          setAlertShown(true);
        }, INITIAL_ALERT_DELAY);

        return () => clearTimeout(initialTimeout);
      }
    }
    let alertTimeout;
    if (isLogined) {
      alertTimeout = setTimeout(() => {
        setAlertShown(true);
      }, ALERT_DELAY);
    }

    return () => clearTimeout(alertTimeout);
  }, [isLogined]);

  const handleCloseAlert = () => {
    setAlertShown(false);
    localStorage.setItem("alertLastClosed", Date.now());
  };

  return (
    <div
      className="warning-alert"
      style={alertShown ? { display: "flex" } : { display: "none" }}
    >
      <div className="war-texts">
        <h3>
          <RiErrorWarningLine /> Diqqat:
        </h3>
        <p>Hurmatli, {isUser}. Admin bilan bog'lanishingizni so'raymiz!</p>
      </div>
      <div className="war-options">
        <Link to="https://t.me/ahsanlabs_admin" target="blank">
          <button>Sotib olish</button>
        </Link>
        <BiX onClick={handleCloseAlert} />
      </div>
    </div>
  );
};

export default Alert;
