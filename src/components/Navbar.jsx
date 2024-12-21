import { PiHeadsetBold } from "react-icons/pi";
import { FiArrowRightCircle } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { LuFilterX } from "react-icons/lu";
import { Link } from "react-router-dom";
import { RxVideo } from "react-icons/rx";
import Alert from "./Alert";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FaLock } from "react-icons/fa6";

const CustomSelect = ({
  options,
  selectedValue,
  onChange,
  label,
  openSelect,
  setOpenSelect,
  id,
  isLogined
}) => {
  const [fireData, setFireData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allCollections = ["analysis", "points", "screening_type", "screening_type_value", "timeframe", "user"];

        const fetchedData = [];

        for (const collectionName of allCollections) {
          const collectionRef = collection(db, collectionName);
          const querySnapshot = await getDocs(collectionRef);

          const collectionData = [];
          for (const doc of querySnapshot.docs) {
            const parentData = {
              id: doc.id,
              name: doc.data().name || collectionName,
              isLocked: doc.data().is_locked,
            };

            try {
              const subCollectionRef = collection(doc.ref, "screening_type_value");
              const subCollectionSnapshot = await getDocs(subCollectionRef);

              const subData = subCollectionSnapshot.docs.map((subDoc) => ({
                id: subDoc.id,
                name: subDoc.data().name,
                isLocked: subDoc.data().is_locked || parentData.isLocked,
              }));

              parentData.subCollection = subData;
            } catch (error) {
              console.warn(`Подколлекция отсутствует для ${doc.id}`);
            }
            collectionData.push(parentData);
          }

          fetchedData.push({
            collectionName,
            data: collectionData,
          });
        }

        setFireData(fetchedData);
      } catch (error) {
        console.error("Ошибка при загрузке секций:", error);
      }
    };

    fetchData();
  }, []);

  const isOpen = openSelect === id;

  const handleSelect = (value) => {
    onChange(value);
    setOpenSelect(null);
  };

  const toggleDropdown = () => {
    setOpenSelect(isOpen ? null : id);
  };

  const getOptionsForSelect = () => {
    switch (id) {
      case "preset":
        return fireData.find((d) => d.collectionName === "screening_type")?.data || [];
      case "ticker":
        const screeningTypeValue = fireData.find((d) => d.collectionName === "screening_type_value")?.data || [];
        return screeningTypeValue.map(item => ({
          ...item,
          isLocked: item.isLocked // Use the isLocked value from Firebase
        }));
      case "grid":
      case "timeframe":
        return options.map((opt) => ({ ...opt, isLocked: false }));
      default:
        return [];
    }
  };

  const selectOptions = getOptionsForSelect();

  return (
    <div className="custom-select">
      {label && <span className="custom-select-label">{label}</span>}
      <div className="custom-select-trigger" onClick={toggleDropdown}>
        <span>{selectedValue}</span>
        <FiChevronDown className="dropdown-icon" />
      </div>
      {isOpen && (
        <div className="custom-options">
          {selectOptions.map((data, index) => (
            <div
              key={index}
              className={`custom-option ${data.isLocked ? "disabled" : ""}`}
              onClick={() => !data.isLocked && handleSelect(data.name || options[index]?.value)}
            >
              {data.name || options[index]?.label || `Option ${index + 1}`}
              {data.isLocked === true ? <FaLock /> : ""}
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
  setLimit,
  limit,
}) => {

  const [presetOptions, setPresetOptions] = useState([]);
  const [tickerOptions, setTickerOptions] = useState([])
  const [timeOptions, setTimeOptions] = useState([])

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const presetsCollection = collection(db, "screening_type");
        const querySnapshot = await getDocs(presetsCollection);

        const options = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          options.push({ value: data.name, label: data.name, isLocked: data.is_locked });
        });

        setPresetOptions(options);
      } catch (error) {
        console.error("Ошибка при загрузке опций:", error);
      }
    };

    fetchPresets()

    const fetchTicker = async () => {
      try {
        const presetsCollection = collection(db, "screening_type_value");
        const querySnapshot = await getDocs(presetsCollection);

        const options = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          options.push({
            value: data.name,
            label: data.name,
            isLocked: data.is_locked
          });
        });

        setTickerOptions(options);
      } catch (error) {
        console.error("Ошибка при загрузке опций:", error);
      }
    };

    fetchTicker();

    const fetchTime = async () => {
      try {
        const presetsCollection = collection(db, "timeframe");
        const querySnapshot = await getDocs(presetsCollection);

        const options = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          options.push({
            value: data.name,
            label: data.name,
            isLocked: true
          });
        });

        setTimeOptions(options);
      } catch (error) {
        console.error("Ошибка при загрузке опций:", error);
      }
    };

    fetchTime();

  }, [isLogined])

  const gridOptions = [
    { value: "6", label: "6", isLocked: false },
    { value: "12", label: "12", isLocked: false },
    { value: "24", label: "24", isLocked: false },
  ];

  const [openSelect, setOpenSelect] = useState(null);
  const handleChange = () => {
    setIsGrid(6);
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
        setLimit={setLimit}
        limit={limit}
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
                  isLogined={isLogined}
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
                  isLogined={isLogined}
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