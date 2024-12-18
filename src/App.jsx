import React, { useState, useEffect, useRef } from "react";
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
  const [limit, setLimit] = useState(false);
  const [filterLimit, setFilterLimit] = useState(1);
  const [PrimiumTaken, setPrimiumTaken] = useState(null);
  const [filteredArray] = useState(array)
  const [StartTime, setStartTime] = useState(null)
  const [DiffTime, setDiffTime] = useState(null)
  
  const [alertShown, setAlertShown] = useState(false);
  const timers = useRef([]);  


  useEffect(() => {
    const storedLogin = localStorage.getItem("isLogined");
    const storedUser = localStorage.getItem("userName");
    const storedStartDate = localStorage.getItem("premiumStartDate");
    // const storedAlertShown = localStorage.getItem("alertShown");

    if (storedLogin === "true" && storedUser) {
      setIsLogined(true);
      setIsUser(storedUser);
      setFilterLimit(3);
    }

    // if (storedStartDate) {
    //   checkPremiumLimit(new Date(storedStartDate));
    // }

    // if (storedAlertShown === "true") {
    //   setAlertShown(true);
    // }
  }, []);

 //o'zgarish
  // useEffect(() => {
  //   if (isLogined) {
  //     const now = new Date();
  //     const storedStartDate = localStorage.getItem("premiumStartDate");

  //     if (!storedStartDate) {
  //       localStorage.setItem("premiumStartDate", now.toISOString());
  //       checkPremiumLimit(now);
  //     } else {
  //       checkPremiumLimit(new Date(storedStartDate));
  //     }
  //   }
  // }, [isLogined]);





   //o'zgarish
  // const checkPremiumLimit = (premiumStartDate) => {
  //   const now = new Date();
  //   const timeSinceStart = now.getTime() - premiumStartDate.getTime();

  //   const firstAlertTime = 1 * 60 * 1000; // Через 1 минуту
  //   const secondAlertTime = 5 * 60 * 1000; // Через 2 минуты
  //   const endTime = 10 * 60 * 1000; // Через 3 минуты

  //   if (timeSinceStart >= endTime) {
  //     setFilterLimit(1);
  //     setAlertShown(false);
  //     localStorage.setItem("alertShown", "false");
  //     return;
  //   }

  //   const timer1 = setTimeout(() => {
  //     setAlertShown(true);
  //     setLimit(false);
  //     localStorage.setItem("alertShown", "true");
  //     localStorage.setItem("limit", "false");
  //   }, firstAlertTime - timeSinceStart);
    
  //   const timer2 = setTimeout(() => {
  //     setAlertShown(true);
  //     setLimit(true);
  //     localStorage.setItem("alertShown", "true");
  //     localStorage.setItem("limit", "true");
  //   }, secondAlertTime - timeSinceStart);

  //   const timer3 = setTimeout(() => {
  //     setFilterLimit(1);
  //     setAlertShown(false);
  //     localStorage.setItem("alertShown", "false");
  //   }, endTime - timeSinceStart);

  //   timers.current = [timer1, timer2, timer3];
  //   setStartTime(timer1)
  //   setDiffTime(timer2)
  // };

  // useEffect(() => {
  //   return () => {
  //     timers.current.forEach(clearTimeout);
  //   };
  // }, []);
  const closeAlert = () => {
    setAlertShown(false);
    localStorage.setItem("alertShown", "false");
  };

  // useEffect для управления переполнением страницы
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
          StartTime={StartTime}
          setStartTime={setStartTime}
          setDiffTime={setDiffTime}
          DiffTime={DiffTime}
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
        closeAlert={closeAlert} // Передаем функцию закрытия в Popav
      />
    </div>
  );
};

export default App;
