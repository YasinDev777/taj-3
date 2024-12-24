import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Chart from "./components/LineChart";
import "./styles/App.css";
import Popav from "./components/Popav";
import Login from "./pages/Login";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const App = () => {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [selectedTime, setSelectedTime] = useState("1d");
  const [isGrid, setIsGrid] = useState(6);
  const [isCard, setIsCard] = useState(false);
  const location = useLocation();
  const [isAlert, setIsAlert] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isUser, setIsUser] = useState("");
  const [isLogined, setIsLogined] = useState(false);
  const [filterLimit, setFilterLimit] = useState(1);
  // const [filteredArray] = useState(array);
  const [StartTime, setStartTime] = useState(null);
  const [DiffTime, setDiffTime] = useState(null);
  const [alertShown, setAlertShown] = useState(false);

  const [analysis, setAnalysis] = useState([]);
  const navigate = useNavigate();

  const [pointsState, setPointsState] = useState([]);

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
            setIsLogined(true);
            localStorage.setItem("userName", foundUser.name);
            localStorage.setItem("isLogined", "true");
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
    // handle_block();
    const storedLogin = localStorage.getItem("isLogined");
    const storedUser = localStorage.getItem("userName");
    if (storedLogin === "true" && storedUser) {
      setIsLogined(true);
      setIsUser(storedUser);
    }
  }, [filterLimit,isLogined]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const usersCollection = collection(db, "screening_type");
        const querySnapshot = await getDocs(usersCollection);
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push(doc.data());
        });

        if (documents.length >= 2) {
          setSelectedPreset(documents[1].name);
        }
      } catch (error) {
        console.error("Ошибка при получении данных пользователей:", error);
      }
    };

    fetchOptions();

    const fetchOptions2 = async () => {
      try {
        const usersCollection = collection(db, "screening_type_value");
        const querySnapshot = await getDocs(usersCollection);
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push(doc.data());
        });

        if (documents.length >= 2) {
          setSelectedTicker(documents[0].name);
        }
      } catch (error) {
        console.error("Ошибка при получении данных пользователей:", error);
      }
    };
    fetchOptions2();
  }, []);


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
              analysis={analysis}
              isCard={isCard}
              setIsCard={setIsCard}
              isGrid={isGrid}
              isAlert={isAlert}
              setIsAlert={setIsAlert}
              isLogined={isLogined}
              filterLimit={filterLimit}
              pointsState={pointsState}
              isUser={isUser}
            />
          }
        />
        <Route
          path="/chart/:id"
          element={<Chart isUser={isUser} isLogined={isLogined} pointsState={pointsState} />}
        />
        <Route
          path="/login"
          element={
            <Login
              isUser={isUser}
              setIsUser={setIsUser}
              isLogined={isLogined}
              setIsLogined={setIsLogined}
              setFilterLimit={setFilterLimit}
              handleLogin={handleLogin}
            />
          }
        />
      </Routes>
      <Popav
        isAlert={isAlert}
        setIsAlert={setIsAlert}
        isVideo={isVideo}
        setIsVideo={setIsVideo}
        closeAlert={closeAlert}
      />
    </div>
  );
};

export default App;
