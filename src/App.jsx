import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
  const [limit, setLimit] = useState(false);
  const [filteredArray, setFilteredArray] = useState(array);
  const [filterLimit, setFilterLimit] = useState(1)
  const [PrimiumTaken, setPrimiumTaken] = useState(null)

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLogined");
    const storedUser = localStorage.getItem("userName");
    const storedStartDate = localStorage.getItem("premiumStartDate");
    const storedAlertShown = localStorage.getItem("alertShown");

    if (storedLogin === "true" && storedUser) {
      setIsLogined(true);
      setIsUser(storedUser);
      setFilterLimit(3)
      const NewDate = new Date().getMinutes() + 4
      setPrimiumTaken(NewDate)
    }

    if (storedStartDate) {
      checkPremiumLimit(new Date(storedStartDate));
    }

    if (storedAlertShown === "true") {
      setAlertShown(true);
    }

  }, [isLogined, setPrimiumTaken]);

  useEffect(() => {
    if (isLogined) {
      const now = new Date();
      const storedStartDate = localStorage.getItem("premiumStartDate");

      if (!storedStartDate) {
        localStorage.setItem("premiumStartDate", now.toISOString());
        checkPremiumLimit(now);
      } else {
        checkPremiumLimit(new Date(storedStartDate));
      }
    }
  }, [isLogined, alertShown]);

  const checkPremiumLimit = (premiumStartDate) => {
    const now = new Date();
    const startTime = new Date(premiumStartDate);
    const timeDiff = Math.floor((now - startTime) / (1000 * 60));
    
    const medium = Math.floor(PrimiumTaken / 2);
    const last = PrimiumTaken;
    
    const storedAlertShown = localStorage.getItem("alertShown");
    const limitReached = localStorage.getItem("limit");
    
    if (timeDiff >= medium && !storedAlertShown && isLogined === true) {
      setAlertShown(true);
      localStorage.setItem("alertShown", "true");
    }
    
    if (timeDiff >= last && !limitReached) {
      setLimit(true)
      // localStorage.setItem("limit", "true");
    }
  };

  useEffect(() => {
    document.body.style.overflow = isAlert || isVideo ? "hidden" : "auto";
  }, [isAlert, isVideo]);

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
              filtered={filteredArray}
              isCard={isCard}
              setIsCard={setIsCard}
              isGrid={isGrid}
              isAlert={isAlert}
              setIsAlert={setIsAlert}
              isLogined={isLogined}
              filterLimit={filterLimit}
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
              PrimiumTaken={PrimiumTaken}
              setPrimiumTaken={setPrimiumTaken}
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
