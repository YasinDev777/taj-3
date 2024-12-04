import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Footer from "./components/Footer";
import Chart from './components/LineChart';
import "./styles/App.css";
import array from "./array";

const App = () => {
  const [selectedPreset, setSelectedPreset] = useState("My Presets");
  const [selectedTicker, setSelectedTicker] = useState("Ticker");
  const [selectedDesc, setSelectedDesc] = useState("Desc");
  const [selectedSignal, setSelectedSignal] = useState("None all stocks");
  const [inputValue, setInputValue] = useState("");
  const [isCard, setIsCard] = useState(false)
  const [isGrid, setIsGrid] = useState(6)

  const location = useLocation();

  const filtered = array.filter((item) => {
    const presetMatch =
      selectedPreset === "My Presets" || item.presets === selectedPreset;
    const tickerMatch =
      selectedTicker === "Ticker" || item.order === selectedTicker;
    const descMatch =
      selectedDesc === "Desc" || item.desc === selectedDesc;
    const signalMatch =
      selectedSignal === "None all stocks" || item.signal === selectedSignal;
    const inputMatch =
      inputValue === "" || item.name.toLowerCase().includes(inputValue.toLowerCase());

    return presetMatch && tickerMatch && descMatch && signalMatch && inputMatch;
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
          selectedDesc={selectedDesc}
          setSelectedDesc={setSelectedDesc}
          selectedSignal={selectedSignal}
          setSelectedSignal={setSelectedSignal}
          inputValue={inputValue}
          setInputValue={setInputValue}
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
