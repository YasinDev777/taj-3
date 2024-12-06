import { BiSupport } from "react-icons/bi";
import { FiArrowRightCircle } from "react-icons/fi";
import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

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
  setSelectedTime
}) => {
  const presetOptions = [
    { value: "Pattern", label: "Pattern" },
    { value: "Order-block", label: "Order-block" },
    { value: "Imbalance1", label: "Imbalance" },
    { value: "Imbalance2", label: "Imbalance" },
  ];
  

  const tickerOptions = [
    { value: "ticker", label: "Ticker" },
    { value: "tickers-input-filter", label: "Tickers Input Filter" },
    { value: "price-earnings", label: "Price/Earnings" },
    { value: "company", label: "Company" },
    { value: "sector", label: "Sector" },
    { value: "industry", label: "Industry" },
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
      <div className="nav">
        <div className="logo-name">AHSAN SCREENER</div>
        <div className="options">
          <BiSupport />
          <button>
            Kirish <FiArrowRightCircle />
          </button>
        </div>
      </div>
      <div className="nav-bar">
        <div className="tex">
          <h1>Texnik analizlar</h1>
          <p>Chart patterns</p>
        </div>
        <nav>
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
                onChange={setSelectedTime}
              />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
