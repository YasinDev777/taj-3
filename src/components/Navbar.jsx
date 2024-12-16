import { PiHeadsetBold } from "react-icons/pi";
import { FiArrowRightCircle } from "react-icons/fi";
import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { LuFilterX } from "react-icons/lu";
import { Link } from "react-router-dom";
import { RxVideo } from "react-icons/rx";
import { RiErrorWarningLine } from "react-icons/ri";
import { BiX } from "react-icons/bi";

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
    setOpenSelect(null); // Закрыть селект после выбора
  };

  const toggleDropdown = () => {
    setOpenSelect(isOpen ? null : id); // Открыть/закрыть текущий селект
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
  isAlert,
  setIsAlert,
  isUser,
  isLogined,
  alertShown,
  setAlertShown
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
      <div className="warning-alert" style={alertShown === false ? {display: "none"} : {display: "flex"}}>
        <div className="war-texts">
            <h3><RiErrorWarningLine /> Eslatma:</h3>
            <p>Hurmatli, Aliakbar aka 1 haftadan so’ng obunangiz bekor qilinadi. Iltimos, admin bilan bog’laning!</p>
        </div>
        <div className="war-options">
          <Link to="https://t.me/ahsanlabs_admin" target="blank">
          <button>Sotib olish</button>
          </Link>
          <BiX onClick={() => setAlertShown(!alertShown)} />
       </div>
      </div>
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
                <span>Pattern</span>
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



// apikey vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A
// secretkey NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j
