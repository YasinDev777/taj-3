import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { RiErrorWarningLine } from "react-icons/ri";
import { BiX } from "react-icons/bi";

const Alert = ({
  setIsLogined,
  isLogined,
  isUser,
  setAlertShown,
  alertShown,
  limit,
  setLimit,
}) => {
  const ONE_MINUTE = 1 * 60 * 1000; // 1 daqiqa
  const TWO_MINUTES = 2 * 60 * 1000; // 2 daqiqa
  const FIVE_MINUTES = 5 * 60 * 1000; // 5 daqiqa

  useEffect(() => {
    if (isLogined) {
      let registeredTime = localStorage.getItem("registeredTime");
      let alertShownState = JSON.parse(
        localStorage.getItem("alertShownState")
      ) || {
        oneMinute: false,
        twoMinutes: false,
      };

      // Agar ro'yxatdan o'tgan vaqt yo'q bo'lsa, hozirgi vaqtni yozib qo'yamiz
      if (!registeredTime) {
        registeredTime = Date.now();
        localStorage.setItem("registeredTime", registeredTime);
      } else {
        registeredTime = parseInt(registeredTime, 10);
      }

      const currentTime = Date.now();

      // 1 daqiqadan keyin alert ko'rsatish
      if (
        currentTime - registeredTime >= ONE_MINUTE &&
        currentTime - registeredTime < TWO_MINUTES &&
        !alertShownState.oneMinute
      ) {
        setAlertShown(true);
        setLimit(false);
      }

      // 2 daqiqadan keyin alert ko'rsatish
      if (
        currentTime - registeredTime >= TWO_MINUTES &&
        currentTime - registeredTime < FIVE_MINUTES &&
        !alertShownState.twoMinutes
      ) {
        setAlertShown(true);
        setLimit(true);
       
      }

      // 5 daqiqadan keyin logout qilish
      if (currentTime - registeredTime >= FIVE_MINUTES) {
        setIsLogined(false);
        localStorage.setItem("isLogined", "false");
      }
    }
  }, [isLogined, setAlertShown, setLimit, setIsLogined]);

  const handleCloseAlert = () => {
    if (isLogined) {
      let alertShownState = JSON.parse(
        localStorage.getItem("alertShownState")
      ) || {
        oneMinute: false,
        twoMinutes: false,
      };
      alertShownState.oneMinute = true;
      localStorage.setItem("alertShownState", JSON.stringify(alertShownState));
      
      if (isLogined && alertShownState.oneMinute) {
        alertShownState.twoMinutes = true;
        localStorage.setItem(
          "alertShownState",
          JSON.stringify(alertShownState)
        );
      }
      setAlertShown(false);
      
    }
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
            Hurmatli, {isUser} 1 haftadan so’ng obunangiz bekor qilinadi.
            Iltimos, admin bilan bog’laning!
          </p>
        </div>
      ) : (
        <div className="war-texts">
          <h3>
            <RiErrorWarningLine /> Diqqat:
          </h3>
          <p>
            Hurmatli, {isUser} 1 kundan so’ng bekor qilindi. Iltimos, admin
            bilan bog’laning!
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
