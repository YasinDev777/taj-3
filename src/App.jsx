import React, { useState } from "react";
import {  Routes, Route, useLocation } from 'react-router-dom';
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
  const [isGrid, setIsGrid] = useState(6)
  const [isCard, setIsCard] = useState(false)
  const location = useLocation();
  const [isAlert, setIsAlert] = useState(false)
  const [isVideo, setIsVideo] = useState(false)
  let body = document.querySelector("body")

  if (isAlert === true || isVideo === true) {
    body.style.overflow = "hidden";
  }else{
    body.style.overflow = "auto";
  }

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
      {location.pathname === "/chart" || location.pathname === "/login" ? "" :
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
        />
      }
      <Routes>
        <Route path="/" element={<Main
          filtered={filtered} isCard={isCard}
          setIsCard={setIsCard}
          isGrid={isGrid}
          isAlert={isAlert}
          setIsAlert={setIsAlert}
        />} />
        <Route path="/chart" element={<Chart />} />
        <Route path="/login" element={<Login />} />
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



