import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Chart from "./components/LineChart";
import "./styles/App.css";
import Popup from "./components/Popup";
import Login from "./pages/Login";
import Filter from "./components/Filter";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import axios from "axios";
import { AnalysisContext } from "./context/Context";
import CryptoJS from "crypto-js";
const App = () => {
  const [selectValues, setSelectValues] = useState(null);
  const [screeningTypeValueId, setScreeningTypeValueId] = useState(null)
  const [timeFrameId, setTimeFrameId] = useState(null)
  const [foundTimeId, setFoundTimeId] = useState("");
  const [isGrid, setIsGrid] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);  
  const [isCard, setIsCard] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isUser, setIsUser] = useState("");
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [filterLimit, setFilterLimit] = useState(1);
  const [alertShown, setAlertShown] = useState(false);
  const [analysis, setAnalysis] = useState([]);
  const [pointsState, setPointsState] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [mains, setMains] = useState([])


  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), 'your-secret-key').toString();
  };

  const handleLogin = async (inputValue) => {
    let foundUser = null;
    try {
      const analysisGet = collection(db, "analysis");
      const q = await query(analysisGet, where("inactive", "==", false))
      const allAnalysis = await getDocs(q);

      const fetchedData = [];

      allAnalysis.forEach((doc) => {
        const analysisId = doc.id;
        const analysisMain = doc.data();
        const lines =
          pointsState &&
          pointsState.filter((state) => state.analysis_id === analysisId);
        fetchedData.push({
          lines,
          ...analysisMain,
          analysisId,
        });
      });
      setMains(fetchedData.sort((a, b) => a.created_at - b.created_at));
      setAnalysis(fetchedData.sort((a, b) => b.created_at - a.created_at));

      const points = collection(db, "points");
      const allPoints = await getDocs(points);
      let pointNew = [];
      allPoints.forEach((docs) => {
        const data = docs.data();
        pointNew.push({ ...data });
      });
      
      setPointsState(pointNew);
      const User = localStorage.getItem("subscriptionType")
      let userForm = ""
      if (User) {
        userForm = decryptData(User)
      } else {
        userForm = inputValue
      }

      const usersCollection = collection(db, "user");
      const user_query = await query(usersCollection, where("user_id", "==", userForm))
      const querySnapshot = await getDocs(user_query);
      if (querySnapshot.empty) {
        alert("Bunday ma'lumotga ega User afsuski topilmadi!");
      } else {
        querySnapshot.forEach((docs) => {
          const userData = docs.data();
          if (userData.is_blocked === true) {
            alert(
              `Hurmatli ${isUser}, siz bloklangansiz iltimos admin bilan bog'laning`
            );
            localStorage.clear();
            return;
          } else {
            foundUser = userData;
            setIsLogedIn(true);
            localStorage.setItem("userName", foundUser.name);
            localStorage.setItem("isLogedIn", "true");
            localStorage.setItem("subscriptionType", encryptData(foundUser.user_id));
            navigate("/");
              switch (userData.subscription_type) {
                case "pro":
                  setFilterLimit(Infinity);
                  break;
                case "basic":
                  setFilterLimit(5);
                  break;
                case "free":
                  setFilterLimit(3);
                  break;
                default:
                  setFilterLimit(1);
              
            }

          }
          // if (isUser && isUser === userData.name) {
          //   if (userData.is_blocked === true) {
          //     alert(
          //       `Hurmatli ${isUser}, siz bloklangansiz iltimos admin bilan bog'laning`
          //     );
          //     localStorage.clear();
          //     return;
          //   } 
          // }
        });
      }

    } catch (error) {
      console.error("xatolik:", error);
    }
  };

  const decryptData = (data) => {
    if (!data) {
      return null; // Возвращаем null, если данных нет
    }
    const bytes = CryptoJS.AES.decrypt(data, 'your-secret-key');
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  // useEffect(() => {
  //   const storedSubscriptionType = localStorage.getItem("subscriptionType");
  //   if (storedSubscriptionType) {
  //     const decryptedSubscriptionType = decryptData(storedSubscriptionType);
  //     if (decryptedSubscriptionType) {
  //       switch (decryptedSubscriptionType) {
  //         case "pro":
  //           setFilterLimit(Infinity);
  //           break;
  //         case "basic":
  //           setFilterLimit(5);
  //           break;
  //         case "free":
  //           setFilterLimit(3);
  //           break;
  //         default:
  //           setFilterLimit(1);
  //       }
  //     }
  //   }
  // }, []);


  useEffect(() => {
    const main = [...mains]
    const selectFilter = () => {
      const filtered = main.filter((item) => {
        const isTypeMatch = !selectValues || item.screening_type_id === selectValues;
        const isValueMatch = !screeningTypeValueId || item.screening_type_value_id === screeningTypeValueId;
        const forTimeFrameId = !timeFrameId || item.timeframe_id === timeFrameId
        return isTypeMatch && isValueMatch && forTimeFrameId;
      });

      setAnalysis(filtered);

    };
    selectFilter();
  }, [selectValues, screeningTypeValueId, timeFrameId]);

  const [data, setData] = useState({});

  const fetchKlines = async (symbol) => {
    const API_URL = `https://api.binance.com/api/v3/klines`;
    try {
      const response = await axios.get(API_URL, {
        params: {
          symbol: symbol,
          interval: "1h",
          limit: 10,
        },
      });

      let lastClosePrice = "";

      if (response.data) {
        const formattedData = response.data.map((item) => ({
          time: item[0] / 1000,
          open: parseFloat(item[1]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          close: parseFloat(item[4]),
        }));

        if (formattedData.length > 0) {
          lastClosePrice = formattedData[formattedData.length - 1].close;
        }
      }

      if (symbol) {
        setData((prevData) => ({
          ...prevData,
          [symbol]: {
            data: response.data,
            lastClosePrice: lastClosePrice,
          },
        }));
      } else {
        setData((prevData) => ({
          ...prevData,
          [symbol]: response.data,
        }));
      }
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    const activeSymbols = new Set(analysis.map((item) => item.symbol));
    activeSymbols.forEach((symbol) => fetchKlines(symbol));
  }, [filterLimit, isLogedIn, analysis]);

  useEffect(() => {
    handleLogin();
    const storedLogin = localStorage.getItem("isLogedIn");
    const storedUser = localStorage.getItem("userName");
    if (storedLogin === "true" && storedUser) {
      setIsLogedIn(true);
      setIsUser(storedUser);
    }
  }, [filterLimit, isLogedIn]);


  const closeAlert = () => {
    setAlertShown(false);
    localStorage.setItem("alertShown", "false");
  };

  useEffect(() => {
    document.body.style.overflow = isAlert || isVideo ? "hidden" : "auto";
  }, [isAlert, isVideo]);

  const [selectedPreset, setSelectedPreset] = useState(selectValues || "Type");
  const [selectedTicker, setSelectedTicker] = useState(screeningTypeValueId || "Type");
  const [selectedTime, setSelectedTime] = useState(timeFrameId || "All");

  return (
    <div className="app">
      {location.pathname.includes("/chart") ||
        location.pathname === "/login" ? null : (
        <>
          <Navbar
            isVideo={isVideo}
            setIsVideo={setIsVideo}
            setIsAlert={setIsAlert}
            isAlert={isAlert}
            isUser={isUser}
            isLogedIn={isLogedIn}
          />
          <Filter
            setSelectedPreset={setSelectedPreset}
            selectedPreset={selectedPreset}
            selectedTicker={selectedTicker}
            setSelectedTicker={setSelectedTicker}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            setAlertShown={setAlertShown}
            alertShown={alertShown}
            setIsGrid={setIsGrid}
            isGrid={isGrid}
            setSelectValues={setSelectValues}
            selectValues={selectValues}
            foundTimeId={foundTimeId}
            setFoundTimeId={setFoundTimeId}
            screeningTypeValueId={screeningTypeValueId}
            setScreeningTypeValueId={setScreeningTypeValueId}
            setTimeFrameId={setTimeFrameId}
            timeFrameId={timeFrameId}
            isUser={isUser}
          />
        </>
      )}
      <AnalysisContext.Provider value={analysis}>
        <Routes>
          <Route
            path="/"
            element={
              <Main
                isCard={isCard}
                setIsCard={setIsCard}
                isGrid={isGrid}
                isAlert={isAlert}
                setIsAlert={setIsAlert}
                isLogedIn={isLogedIn}
                filterLimit={filterLimit}
                pointsState={pointsState}
                isUser={isUser}
                data={data}
                analysis={analysis}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            }
          />
          <Route
            path="/chart/:id"
            element={
              <Chart
                isUser={isUser}
                isLogedIn={isLogedIn}
                pointsState={pointsState}
                analysis={analysis}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                setIsUser={setIsUser}
                setIsLogedIn={setIsLogedIn}
                handleLogin={handleLogin}
              />
            }
          />
        </Routes>
      </AnalysisContext.Provider>
      <Popup
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