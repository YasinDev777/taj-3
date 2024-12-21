import { PiHeadsetBold } from "react-icons/pi";
import { FiArrowRightCircle } from "react-icons/fi";
import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { LuFilterX } from "react-icons/lu";
import { Link } from "react-router-dom";
import { RxVideo } from "react-icons/rx";
import Alert from "./Alert";

const CustomSelect = ({
  options,
  selectedValue,
  onChange,
  label,
  openSelect,
  setOpenSelect,
  id,
}) => {
  const isOpen = openSelect === id;

  const handleSelect = (value) => {
    onChange(value);
    setOpenSelect(null);
  };
  
  
  const toggleDropdown = () => {
    setOpenSelect(isOpen ? null : id);
  };
  
  return (
    <div className="custom-select">
      {label && <span className="custom-select-label">{label}</span>}
      <div className="custom-select-trigger" onClick={toggleDropdown}>
        <span>{selectedValue || "Select an option"}</span>
        <FiChevronDown className="dropdown-icon" />
      </div>
      {isOpen && (
        <div className="custom-options">
          {options.map((option) => (
            <div
            key={option.value}
              className="custom-option"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = ({
  setSelectedPreset,
  setSelectedTicker,
  selectedPreset,
  selectedTicker,
  isGrid,
  setIsGrid,
  selectedTime,
  setSelectedTime,
  isVideo,
  setIsVideo,
  setIsAlert,
  isUser,
  isLogined,
  alertShown,
  setAlertShown,
  setIsLogined,
}) => {
  const presetOptions = [
    { value: "Pattern", label: "Pattern", id: 1},
    { value: "Classic TA", label: "Classic TA", id:2 },
    { value: "SMC", label: "SMC", id:3 },
  ];

  const tickerOptions = [
    { value: "Ticker", label: "Ticker" },
    { value: "Tickers input filter", label: "Tickers Input Filter" },
    { value: "Price/Earnings", label: "Price/Earnings" },
    { value: "Company", label: "Company" },
    { value: "Sector", label: "Sector" },
    { value: "Industry", label: "Industry" },
  ];

  const gridOptions = [
    { value: "6", label: "6" },
    { value: "12", label: "12" },
    { value: "24", label: "24" },
  ];

  const timeOptions = [
    { value: "1d", label: "1d" },
    { value: "4h", label: "4h" },
    { value: "1h", label: "1h" },
  ];

  const [openSelect, setOpenSelect] = useState(null);
  const handleChange = () => {
    setIsGrid(6);
    setSelectedPreset("Pattern");
    setSelectedTicker("Ticker");
    setSelectedTime("1d");
    setOpenSelect(null)
  };

  return (
    <>
      <div className="nav">
        <div className="logo-name">
          <Link to="">AHSAN LABS</Link>
        </div>
        <div className="options">
          <button
            className="video-btn"
            onClick={() => setIsVideo(!isVideo)}
            style={isVideo === true ? { display: "none" } : { display: "flex" }}
          >
            <RxVideo /> Foydalanish videosi
          </button>
          <Link to="https://t.me/ahsanlabs_admin" target="blank">
            <PiHeadsetBold />
          </Link>
          {
            isLogined === false ?
              <Link to="/login" onClick={() => setIsVideo(false)}>
                <button onClick={() => setIsAlert(false)}>
                  Kirish <FiArrowRightCircle />
                </button>
              </Link>
              :
              <h3>{isUser}</h3>
          }
        </div>
      </div>
        <Alert 
        alertShown={alertShown} 
        isLogined={isLogined}
        isUser={isUser} 
        setAlertShown={setAlertShown} 
        setIsLogined={setIsLogined}
        
        />
      <div className="nav-bar">
        <div className="texsss">
          <div className="tex">
            <h1>Texnik analizlar</h1>
            <p>Chart patterns</p>
          </div>
          <button
            className="video-btn2"
            onClick={() => setIsVideo(!isVideo)}
            style={isVideo === true ? { display: "none" } : { display: "flex" }}
          >
            <RxVideo /> Foydalanish videosi
          </button>
        </div>
        <nav>
          <div className="fixed-div">
            <div className="options-div">
              <div className="div">
                <CustomSelect
                  options={presetOptions}
                  selectedValue={selectedPreset}
                  onChange={setSelectedPreset}
                  label="Anlyze"
                  openSelect={openSelect}
                  setOpenSelect={setOpenSelect}
                  id="preset"
                />
              </div>
              <div className="div">
                    <span className="analyze-span">
                      {selectedPreset}
                    </span>
                <CustomSelect
                  options={tickerOptions}
                  selectedValue={selectedTicker}
                  onChange={setSelectedTicker}
                  openSelect={openSelect}
                  setOpenSelect={setOpenSelect}
                  id="ticker"
                />
              </div>
              <div className="div">
                <span>grid</span>
                <CustomSelect
                  options={gridOptions}
                  selectedValue={isGrid}
                  onChange={setIsGrid}
                  openSelect={openSelect}
                  setOpenSelect={setOpenSelect}
                  id="grid"
                />
              </div>
              <div className="div">
                <span>Timeframe</span>
                <CustomSelect
                  options={timeOptions}
                  selectedValue={selectedTime}
                  onChange={setSelectedTime}
                  openSelect={openSelect}
                  setOpenSelect={setOpenSelect}
                  id="timeframe"
                />
              </div>
              <LuFilterX className="filter-svg" onClick={handleChange} />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
