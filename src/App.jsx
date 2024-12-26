import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Chart from "./components/LineChart";
import "./styles/App.css";
import Popup from "./components/Popup";
import Login from "./pages/Login";
import Filter from "./components/Filter"
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

const App = () => {
  const [selectedPreset, setSelectedPreset] = useState("Type");
  const [selectedTicker, setSelectedTicker] = useState("Type");
  const [selectedTime, setSelectedTime] = useState("All");
  const [isGrid, setIsGrid] = useState(6);
  const [isCard, setIsCard] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isUser, setIsUser] = useState("");
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [filterLimit, setFilterLimit] = useState(1);
  const [StartTime, setStartTime] = useState(null);
  const [DiffTime, setDiffTime] = useState(null);
  const [alertShown, setAlertShown] = useState(false);
  const [analysis, setAnalysis] = useState([]);
  const navigate = useNavigate();
  const [pointsState, setPointsState] = useState([]);
  const location = useLocation();

  const handleLogin = async (inputValue) => {
    let foundUser = null;
    try {
      const usersCollection = collection(db, "user");
      const querySnapshot = await getDocs(usersCollection);

      const analysis = collection(db, "analysis");
      const allAnalysis = await getDocs(analysis);
      setAnalysis(allAnalysis);

      // const analysisId = await getDocs(collection(db, "analysis"));
      // const allAnalysisId = analysisId.docs.map((doc) => doc.id);

      const points = collection(db, "points");
      const allPoints = await getDocs(points);
      let pointNew = [];
      allPoints.forEach((docs) => {
        const data = docs.data(); 
        pointNew.push({ ...data });        
      });
      setPointsState(pointNew);

      querySnapshot.forEach((docs) => {
        const userData = docs.data();
        if (userData.user_id === inputValue && userData.is_blocked === true) {
          alert(
            `Hurmatli ${isUser}, siz bloklangansiz iltimos admin bilan bog'laning`
          );
          localStorage.clear();
          return;
        }
        if (isUser && isUser === userData.name) {
          if (userData.is_blocked === true) {
            alert(
              `Hurmatli ${isUser}, siz bloklangansiz iltimos admin bilan bog'laning`
            );
            localStorage.clear();
            return;
          }
        }
        if (inputValue) {
          if (userData.user_id === inputValue) {
            foundUser = userData;
            localStorage.clear();
            setIsLogedIn(true);
            localStorage.setItem("userName", foundUser.name);
            localStorage.setItem("isLogedIn", "true");
            navigate("/");
            window.location.reload();
          }
        }
        if (userData.name === isUser) {
          switch (userData.subscription_type) {
            case "pro":
              setFilterLimit(Infinity);
              break;
            case "basic":
              setFilterLimit(6);
              break;
            case "free":
              setFilterLimit(3);
              break;
            default:
              setFilterLimit(1);
          }
        }
      });
    } catch (error) {
      console.error("xatolik:", error);
    }
  };

  useEffect(() => {
    handleLogin();
    const storedLogin = localStorage.getItem("isLogedIn");
    const storedUser = localStorage.getItem("userName");
    if (storedLogin === "true" && storedUser) {
      setIsLogedIn(true);
      setIsUser(storedUser);
    }
  }, [filterLimit,isLogedIn]);


  const closeAlert = () => {
    setAlertShown(false);
    localStorage.setItem("alertShown", "false");
  };

  useEffect(() => {
    document.body.style.overflow = isAlert || isVideo ? "hidden" : "auto";
  }, [isAlert, isVideo]);


  return (
    <div className="app">
      {location.pathname.includes("/chart") ||
      location.pathname === "/login" ? null : (
        <Navbar
          isVideo={isVideo}
          setIsVideo={setIsVideo}
          setIsAlert={setIsAlert}
          isAlert={isAlert}
          isUser={isUser}
          isLogedIn={isLogedIn}
          />
        ) }
          {location.pathname.includes("/chart") ||
          location.pathname === "/login" ? null :
         <Filter 
          setIsGrid={setIsGrid}
          isGrid={isGrid} 
          selectedPreset={selectedPreset} 
          setSelectedPreset={setSelectedPreset}
          selectedTicker={selectedTicker}
          setSelectedTicker={setSelectedTicker}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          /> 
          }
      <Routes>
        <Route
          path="/"
          element={
            <Main
              analysis={analysis}
              isCard={isCard}
              setIsCard={setIsCard}
              isGrid={isGrid}
              isAlert={isAlert}
              setIsAlert={setIsAlert}
              isLogedIn={isLogedIn}
              filterLimit={filterLimit}
              pointsState={pointsState}
              isUser={isUser}
              selectedPreset={selectedPreset}
            />
          }
        />
        <Route
          path="/chart/:id"
          element={<Chart isUser={isUser} isLogedIn={isLogedIn} pointsState={pointsState} />}
        />
        <Route
          path="/login"
          element={
            <Login
              isUser={isUser}
              setIsUser={setIsUser}
              isLogedIn={isLogedIn}
              setisLogedIn={setIsLogedIn}
              setFilterLimit={setFilterLimit}
              handleLogin={handleLogin}
            />
          }
        />
      </Routes>
      <Popup
        isAlert={isAlert}
        setIsAlert={setIsAlert}
        isVideo={isVideo}
        setIsVideo={setIsVideo}
        closeAlert={closeAlert}
        />
    </div>
  // </>
  );
};

export default App;