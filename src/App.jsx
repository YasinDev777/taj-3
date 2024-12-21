import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Chart from "./components/LineChart";
import "./styles/App.css";
import array from "./array";
import Popav from "./components/Popav";
import Login from "./pages/Login";
import { collection, getDocs, doc, updateDoc ,query, where, } from "firebase/firestore";
import { db } from "./firebase";

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
  const [filterLimit, setFilterLimit] = useState(1);
  const [PrimiumTaken, setPrimiumTaken] = useState(null);
  const [filteredArray] = useState(array);
  const [StartTime, setStartTime] = useState(null);
  const [DiffTime, setDiffTime] = useState(null);
  const [alertShown, setAlertShown] = useState(false);
 

  const navigate = useNavigate();

  const handleLogin = async (inputValue) => {
    let foundUser = null;
    try {
      const usersCollection = collection(db, "user");
      const querySnapshot = await getDocs(usersCollection);
      querySnapshot.forEach((docs) => {
        const userData = docs.data();
        if (inputValue) {
          if (userData.user_id == inputValue) {
            foundUser = userData;
          } else {
            // alert("Siz hali ma'lumotlar omboriga qo'shilganingiz yo'q. Iltimos Admin bilan bog'langan holda ro'yxatdan o'tishingizni so'raymiz");
          }
        }

        if (userData.name === isUser) {
          console.log(userData.subscription_type);
          
          switch (userData.subscription_type) {
            case "pro":
              setFilterLimit(20);
              break;
            case "basic":
              setFilterLimit(10);
              break;
            case "free":
              setFilterLimit(3);
              break;
            default:
              setFilterLimit(1);
          }
        }
      });

      if (foundUser) {
        setIsLogined(true);
        localStorage.clear();
        localStorage.setItem("isLogined", "true");
        localStorage.setItem("userName", foundUser.name);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Ошибка при проверке данных:", error);
      alert("Произошла ошибка. Попробуйте снова.");
    }
  };

  useEffect(() => {
    handleLogin();
    const storedLogin = localStorage.getItem("isLogined");
    const storedUser = localStorage.getItem("userName");
    if (storedLogin === "true" && storedUser) {
      setIsLogined(true);
      setIsUser(storedUser);
    }
  }, [isLogined]);

  const closeAlert = () => {
    setAlertShown(false);
    localStorage.setItem("alertShown", "false");
  };


  useEffect(() => {
    document.body.style.overflow = isAlert || isVideo ? "hidden" : "auto";
  }, [isAlert, isVideo]);



// Subscription turini o'zgartiruvchi funksiya


  return (
    <div className="app">

      {location.pathname === "/chart" ||
      location.pathname === "/login" ? null : (
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
          setIsLogined={setIsLogined}
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
              handleLogin={handleLogin}
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
