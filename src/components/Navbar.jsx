import { BiSupport } from "react-icons/bi";
import { FiArrowRightCircle } from "react-icons/fi";
import React, { useState } from "react";

const CustomSelect = ({ options, selectedValue, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="custom-select">
      {label && <span className="custom-select-label">{label}</span>}
      <div
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValue || "Select an option"}
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
              <span>Order by</span>
              <CustomSelect
                options={tickerOptions}
                selectedValue={selectedTicker}
                onChange={setSelectedTicker}
              />
            </div>
            <div className="div">
              <span>Per Page pagination</span>
              <CustomSelect
                options={gridOptions}
                selectedValue={isGrid}
                onChange={setIsGrid}
              />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
