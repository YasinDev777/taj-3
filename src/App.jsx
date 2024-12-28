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
import axios from "axios";

const App = () => {
  const [selectedPreset, setSelectedPreset] = useState("Type");
  const [selectedTicker, setSelectedTicker] = useState("Type");
  const [selectedTime, setSelectedTime] = useState("All");
  const [selectValues, setSelectValues] = useState("")
  const [foundTimeId, setFoundTimeId] = useState("salom")
  const [isGrid, setIsGrid] = useState(6);
  const [isCard, setIsCard] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isUser, setIsUser] = useState("");
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [filterLimit, setFilterLimit] = useState(1);
  const [filterCards, setFilterCards] = useState([])
  const [alertShown, setAlertShown] = useState(false);
  const [analysis, setAnalysis] = useState([]);
  const [pointsState, setPointsState] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();



  const handleLogin = async (inputValue) => {
    let foundUser = null;
    try {
      const usersCollection = collection(db, "user");
      const querySnapshot = await getDocs(usersCollection);

      const analysisGet = collection(db, "analysis");
      const allAnalysis = await getDocs(analysisGet);

      const fetchedData = [];

      let number = 0;
      allAnalysis.forEach((doc) => {
        const analysisId = doc.id;
        const analysisMain = doc.data();
        const index = number++;
        const lines =
          pointsState &&
          pointsState.filter((state) => state.analysis_id === analysisId);

        fetchedData.push({
          lines,
          ...analysisMain,
          analysisId,
          index,
        });

        const filteredCards = fetchedData.filter((card) => {
          // Проверяем фильтры на соответствие
          const matchesPreset = !selectedPreset || card.screening_type_id === selectValues; // Условие для анализа
          const matchesTicker = !selectedTicker || card.screening_type_value_id === selectedTicker; // Условие для тикера
          const matchesTime = !selectedTime || card.timeframe_id === foundTimeId; // Условие для времени

          return matchesPreset && matchesTicker && matchesTime;
        });

        setFilterCards(filteredCards);
        // console.log(filteredCards);
        // console.log(selectedTime_id)
      });


      setAnalysis(fetchedData);
      // console.log(analysis);
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

//   useEffect(() => {
//     console.log("forFilterData:", forFilterData);
//     console.log("forTimeData:", forTimeData);
//     console.log("cardsData:", cardsData);
// }, [forFilterData, forTimeData, cardsData]);


  const [data, setData] = useState({});
  const [setError] = useState(null);

  // const fetchKlines = async (symbol) => {
  //   const API_URL = `https://api.binance.com/api/v3/klines`;
  //   try {
  //     const response = await axios.get(API_URL, {
  //       params: {
  //         symbol: symbol,
  //         interval: '1h',
  //         limit: 10,
  //       },
  //     });

  //     // let lastClosePrice =""
  //     // if (response.data) {
  //     //   const formattedData = response.data.map((item) => ({
  //     //     time: item[0] / 1000,
  //     //     open: parseFloat(item[1]),
  //     //     high: parseFloat(item[2]),
  //     //     low: parseFloat(item[3]),
  //     //     close: parseFloat(item[4]),
  //     //   }));

  //     //   if (formattedData.length > 0) {
  //     //     lastClosePrice = formattedData[formattedData.length - 1].close;
  //     //   }}
  //     let lastClosePrice = ""

  //     if (response.data) {
  //       const formattedData = response.data.map(item => ({
  //         time: item[0] / 1000,
  //         open: parseFloat(item[1]),
  //         high: parseFloat(item[2]),
  //         low: parseFloat(item[3]),
  //         close: parseFloat(item[4])
  //       }));

  //       if (formattedData.length > 0) {
  //       lastClosePrice = formattedData[formattedData.length - 1].close;
  //       }
  //     }
  //     // Update state with fetched data grouped by symbol
  //     setData((prevData) => ({
  //       ...prevData,
  //       [symbol]: response.data,
  //     }));   

  //   } catch (err) {
  //     setError(`Muammo: ${err.message}`);
  //   }
  // };

  const fetchKlines = async (symbol) => {
    const API_URL = `https://api.binance.com/api/v3/klines`;
    try {
      const response = await axios.get(API_URL, {
        params: {
          symbol: symbol,
          interval: '1h',
          limit: 10,
        },
      });

      let lastClosePrice = "";

      if (response.data) {
        const formattedData = response.data.map(item => ({
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

      // Agar activeSymbols ichida symbol bo'lsa, lastClosePrice qo'shamiz
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
          [symbol]: response.data, // Faqat data
        }));
      }
    } catch (err) {
      setError(`Muammo: ${err.message}`);
    }
  };


  useEffect(() => {
    const activeSymbols = new Set(analysis.map((item) => item.symbol));
    activeSymbols.forEach((symbol) => fetchKlines(symbol));


  }, [filterLimit, isLogedIn]);

  useEffect(() => {
    handleLogin()
    // handle_block();
    const storedLogin = localStorage.getItem("isLogedIn");
    const storedUser = localStorage.getItem("userName");
    if (storedLogin === "true" && storedUser) {
      setIsLogedIn(true);
      setIsUser(storedUser);
    }
  }, [filterLimit, isLogedIn]);

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
        console.error("error:", error);
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
        console.error("error:", error);
      }
    };
    fetchOptions2();
  }, [filterLimit, isLogedIn]);

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
      )}
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
          setSelectValues={setSelectValues}
          selectValues={selectValues}
          foundTimeId={foundTimeId}
          setFoundTimeId={setFoundTimeId}
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
              data={data}
              filterCards={filterCards}
              setFilterCards={setFilterCards}
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
              isUser={isUser}
              setIsUser={setIsUser}
              isLogedIn={isLogedIn}
              setIsLogedIn={setIsLogedIn}
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