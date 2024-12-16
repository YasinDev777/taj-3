import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Chart from "./components/LineChart";
import "./styles/App.css";
import array from "./array";
import Popav from "./components/Popav";
import Login from "./pages/Login";

const App = () => {
  const [selectedPreset, setSelectedPreset] = useState("Pattern");
  const [selectedTicker, setSelectedTicker] = useState("Ticker");
  const [selectedTime, setSelectedTime] = useState("1d");
  const [isGrid, setIsGrid] = useState(6);
  const [isCard, setIsCard] = useState(false);
  const location = useLocation();
  const [isAlert, setIsAlert] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isUser, setIsUser] = useState("");
  const [isLogined, setIsLogined] = useState(false);
  const [alertShown, setAlertShown] = useState(false);
  const [premiumExpiryDate, setPremiumExpiryDate] = useState(null);
  const [limit, setLimit] = useState(false)


  useEffect(() => {
    const storedLogin = localStorage.getItem("isLogined");
    const storedUser = localStorage.getItem("userName");
    const storedExpiryDate = localStorage.getItem("premiumExpiryDate");

    if (storedLogin === "true" && storedUser) {
      setIsLogined(true);
      setIsUser(storedUser);
    }

    if (storedExpiryDate) {
      setPremiumExpiryDate(new Date(storedExpiryDate));
    }
  }, []);

  useEffect(() => {
    if (isLogined && !premiumExpiryDate) {
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + 10);
      setPremiumExpiryDate(expiryDate);
      localStorage.setItem("premiumExpiryDate", expiryDate.toISOString());
    }
  }, [isLogined, premiumExpiryDate]);

  useEffect(() => {
    if (premiumExpiryDate) {
      const now = new Date();
      const timeRemaining = premiumExpiryDate - now;
  
      if (timeRemaining <= 0) {
        setIsLogined(false);
        setLimit(true);
        localStorage.removeItem("premiumExpiryDate");
        setAlertShown(false);
      } else if (timeRemaining <= 5 * 60 * 1000) {
        setAlertShown(true);
      }
  
      const timer = setTimeout(() => {
        const updatedTimeRemaining = premiumExpiryDate - new Date();
        if (updatedTimeRemaining <= 0) {
          setIsLogined(false);
          setLimit(true);
          localStorage.removeItem("premiumExpiryDate");
          setAlertShown(false);
        } else if (updatedTimeRemaining <= 5 * 60 * 1000) {
          setAlertShown(true); // Устанавливаем предупреждение, если его не было
        }
      }, Math.min(timeRemaining, 5 * 60 * 1000));
  
      return () => clearTimeout(timer);
    }
  }, [premiumExpiryDate]);


  useEffect(() => {
    document.body.style.overflow = isAlert || isVideo ? "hidden" : "auto";
  }, [isAlert, isVideo]);

  const filtered = array.filter((item) => {
    const presetMatch =
      selectedPreset === "Pattern" || item.presets === selectedPreset;
    const tickerMatch =
      selectedTicker === "Ticker" || item.order === selectedTicker;
    const timeMatch =
      selectedTime === "1d" || item.time === selectedTime;
    return presetMatch && tickerMatch && timeMatch;
  });



  return (
    <div className="app">
      {location.pathname === "/chart" || location.pathname === "/login" ? null : (
        <Navbar
          selectedPreset={selectedPreset}
          setSelectedPreset={setSelectedPreset}
          selectedTicker={selectedTicker}
          setSelectedTicker={setSelectedTicker}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          setIsGrid={setIsGrid}
          isGrid={isGrid}
          isVideo={isVideo}
          setIsVideo={setIsVideo}
          setIsAlert={setIsAlert}
          isAlert={isAlert}
          isUser={isUser}
          isLogined={isLogined}
          alertShown={alertShown}
          setAlertShown={setAlertShown}
          limit={limit}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <Main
              filtered={filtered}
              isCard={isCard}
              setIsCard={setIsCard}
              isGrid={isGrid}
              isAlert={isAlert}
              setIsAlert={setIsAlert}
              isLogined={isLogined}
            />
          }
        />
        <Route
          path="/chart"
          element={<Chart isUser={isUser} isLogined={isLogined} />}
        />
        <Route
          path="/login"
          element={
            <Login
              isUser={isUser}
              setIsUser={setIsUser}
              isLogined={isLogined}
              setIsLogined={setIsLogined}
            />
          }
        />
      </Routes>
      <Popav
        isAlert={isAlert}
        setIsAlert={setIsAlert}
        isVideo={isVideo}
        setIsVideo={setIsVideo}
      />
    </div>
  );
};

export default App;