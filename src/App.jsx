import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Footer from "./components/Footer";
import Chart from './components/LineChart';
import "./styles/App.css";
import array from "./array";

const App = () => {
  const [selectedPreset, setSelectedPreset] = useState("Pattern");
  const [selectedTicker, setSelectedTicker] = useState("Ticker");
  const [selectedTime, setSelectedTime] = useState("1d");
  const [isCard, setIsCard] = useState(false)
  const [isGrid, setIsGrid] = useState(6)

  const location = useLocation();

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
      {/* Показываем Navbar только если текущий маршрут не "/chart" */}
      {location.pathname !== "/chart" && (
        <Navbar
          selectedPreset={selectedPreset}
          setSelectedPreset={setSelectedPreset}
          selectedTicker={selectedTicker}
          setSelectedTicker={setSelectedTicker}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          setIsGrid={setIsGrid}
          isGrid={isGrid}
        />
      )}
      <Routes>
        <Route path="/" element={<Main 
        filtered={filtered} isCard={isCard}
        setIsCard={setIsCard} 
        isGrid={isGrid}
        />} />
        <Route path="/chart" element={<Chart />} />
      </Routes>
    </div>
  );
};

export default App;
