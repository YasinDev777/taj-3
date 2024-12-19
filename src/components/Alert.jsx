import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiErrorWarningLine } from "react-icons/ri";
import { BiX } from "react-icons/bi";

const Alert = ({ isLogined, isUser, setAlertShown, alertShown, limit, setLimit }) => {
  const ALERT_DELAY = 1 * 60 * 1000;
  const ALERT_RESET_TIME = 2 * 60 * 1000;
  const INITIAL_ALERT_DELAY = 1 * 60 * 1000;

  useEffect(() => {
    const storedAlertShown = localStorage.getItem("alertShown") === "true";
    const storedLimit = localStorage.getItem("limit") === "true";
    const alertClosedCount = parseInt(localStorage.getItem("alertClosedCount") || "0");
    
    setAlertShown(storedAlertShown);
    setLimit(storedLimit);

    if (isLogined) {
      const lastClosedTime = localStorage.getItem("alertLastClosed");
      const currentTime = Date.now();
      
      if (currentTime - lastClosedTime > ALERT_RESET_TIME) {
        const initialTimeout = setTimeout(() => {
          setAlertShown(true);
          setLimit(false);
          localStorage.setItem("alertShown", "true");
          localStorage.setItem("limit", "false");

          // Set limit to true after ALERT_DELAY
          setTimeout(() => {
            setLimit(true);
            localStorage.setItem("limit", "true");
            setAlertShown(true)
            localStorage.setItem("alertShown", "true")
          }, ALERT_DELAY);
        }, INITIAL_ALERT_DELAY);

        return () => clearTimeout(initialTimeout);
      }


      else if (alertClosedCount !== 1 || currentTime - lastClosedTime > ALERT_RESET_TIME) {
        const initialTimeout = setTimeout(() => {
          setAlertShown(true);
          localStorage.setItem("alertShown", "true");
          setLimit(true);
          localStorage.setItem("limit", "true");
          setTimeout(() => {
            setLimit(true);
            localStorage.setItem("limit", "true");
            alertClosedCount++
          }, ALERT_DELAY);
        }, INITIAL_ALERT_DELAY);

        return () => clearTimeout(initialTimeout);
      }

      const limitTimeout = setTimeout(() => {
        setLimit(true);
        localStorage.setItem("limit", "true");
        setAlertShown(true)
        localStorage.setItem("alertShown", "true")
      }, ALERT_DELAY);

      let alertTimeout;
      if (!alertShown && alertClosedCount < 2) {
        alertTimeout = setTimeout(() => {
          setAlertShown(true);
          setLimit(false);
          localStorage.setItem("alertShown", "true");
          localStorage.setItem("limit", "false");
        }, ALERT_DELAY);
      }

      return () => {
        clearTimeout(limitTimeout);
        if (alertTimeout) clearTimeout(alertTimeout);
      };
    }
  }, [isLogined, alertShown]);

  const handleCloseAlert = () => {
    const currentCount = parseInt(localStorage.getItem("alertClosedCount") || "0");
    localStorage.setItem("alertClosedCount", (currentCount + 1).toString());
    
    setAlertShown(false);
    localStorage.setItem("alertShown", "false");
    localStorage.setItem("alertLastClosed", Date.now());
  };

  return (
    <div
      className="warning-alert"
      style={alertShown ? { display: "flex" } : { display: "none" }}
    >
      {limit === false ? (
        <div className="war-texts">
          <h3>
            <RiErrorWarningLine /> Eslatma:
          </h3>
          <p>
            Hurmatli, {isUser} 1 haftadan so'ng obunangiz bekor qilinadi. Iltimos,
            admin bilan bog'laning!
          </p>
        </div>
      ) : (
        <div className="war-texts">
          <h3>
            <RiErrorWarningLine /> Diqqat:
          </h3>
          <p>
            Hurmatli, {isUser} obunangiz bekor qilindi. Iltimos, admin bilan
            bog'laning!
          </p>
        </div>
      )}
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
