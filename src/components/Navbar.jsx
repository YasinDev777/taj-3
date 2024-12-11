import { BiSupport } from "react-icons/bi";
import { FiArrowRightCircle } from "react-icons/fi";
import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { LuFilterX } from "react-icons/lu";
import { Link } from "react-router-dom";
import { RxVideo } from "react-icons/rx";
const CustomSelect = ({ options, selectedValue, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="custom-select">
      {label && <span className="custom-select-label">Anlyze</span>}
      <div
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
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
  setIsVideo
}) => {
  const presetOptions = [
    { value: "Pattern", label: "Pattern" },
    { value: "Order-block", label: "Order-block" },
    { value: "Imbalance1", label: "Imbalance" },
    { value: "Imbalance2", label: "Imbalance" },
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

  return (
    <>
      <div className="nav" id="nav">
        <div className="logo-name">AHSAN SCREENER</div>
        <div className="options">
          <button className="video-btn" onClick={()=> setIsVideo(!isVideo)} style={isVideo === true ? {display: "none"} : {display: "flex"}}>
            <RxVideo /> Foydalanish videosi
          </button>
          <BiSupport />
          <Link to={"/login"}>
          <button>
            Kirish <FiArrowRightCircle />
          </button>
          </Link>
        </div>
      </div>
      <div className="nav-bar">
        <div className="tex">
          <h1>Texnik analizlar</h1>
          <p>Chart patterns</p>
        </div>
        <nav>
          <div className="fixed-div">
            <div className="options-div">
              <div className="div">
                <CustomSelect
                  options={presetOptions}
                  selectedValue={selectedPreset}
                  onChange={setSelectedPreset}
                  label="Presets"
                />
              </div>
              <div className="div">
                <span>Pattern</span>
                <CustomSelect
                  options={tickerOptions}
                  selectedValue={selectedTicker}
                  onChange={setSelectedTicker}
                />
              </div>
              <div className="div">
                <span>grid</span>
                <CustomSelect
                  options={gridOptions}
                  selectedValue={isGrid}
                  onChange={setIsGrid}
                />
              </div>
              <div className="div">
                <span>Timeframe</span>
                <CustomSelect
                  options={timeOptions}
                  selectedValue={selectedTime}
                  onChange={setSelectedTime }
                />
              </div>
              <LuFilterX className="filter-svg"/>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
