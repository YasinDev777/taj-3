import React, { useContext, useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { PiHeadsetBold } from "react-icons/pi";
import { Link, useParams } from "react-router-dom";
import { FiArrowRightCircle } from "react-icons/fi";
import { BsArrowLeftCircle } from "react-icons/bs";
import axios from "axios";
import { AnalysisContext } from "../context/Context";

const Chart = ({ isCard, isUser, isLogedIn, pointsState, data, line }) => {
  
  const [analysisData, setAnalysisData] = useState([]);
  const [analysisSymbols, setAnalysisSymbols] = useState("");

  const [timeFrameIdState, setTimeFrameIdState] = useState("1d")
  const { id } = useParams();
  const [cursor, setCursor] = useState("grab");
  const handleMouseDown = () => setCursor("grabbing");
  const handleMouseUp = () => setCursor("crosshair");
  const handleMouseLeave = () => setCursor("crosshair");

  const analysis = useContext(AnalysisContext)

  useEffect(() => {
    const fetchAnalysisData = async () => {
      if (!line && pointsState && id) {
        const lines = pointsState.filter((state) => state.analysis_id === id);
        setAnalysisData(lines);
      } else if (data) {
        setAnalysisData(line);
      }
    };

    fetchAnalysisData();
  }, [isLogedIn, pointsState, id, data]);

  const chartContainerRef = useRef(null);
  const [candlestickData, setCandlestickData] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDarkMode] = useState(true);

  
//   //     if (filteredItems[0].timeframe_id === "four_hours") {
//   //       setTimeFrameIdState("4h")
//   //     } else if(filteredItems[0].timeframe_id === "one_hour") {
//   //       setTimeFrameIdState("1h")
//   //     } else if(filteredItems[0].timeframe_id === "daily") {
//   //       setTimeFrameIdState("1d")            
//   //     } 
//     }

  useEffect(() => {
    if (!data && analysis) {
      const filteredItems = analysis.filter(item => item.analysisId === id);
      if (filteredItems.length > 0) {
        setAnalysisSymbols(filteredItems[0].symbol);
        console.log(filteredItems[0].symbol);
      } 
    }else {
      setAnalysisSymbols(data.toString());
    }
    const fetchBitCoinData = async () => {
      try {
        const response = await axios.get('https://api.binance.com/api/v3/klines', {
          params: {
            symbol: analysisSymbols,
            interval: "1d",
            limit: 1000
          }
        });
        if (response.data) {
          const formattedData = response.data.map(item => ({
            time: item[0] / 1000,
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            close: parseFloat(item[4])
          }));
          if (formattedData.length > 0) {
            setCandlestickData(formattedData);
          }
         }} catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchBitCoinData();
  }, [isLogedIn, pointsState, id, data,analysisSymbols]);

  useEffect(() => {
    if (chartContainerRef.current && candlestickData.length > 0) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: isDarkMode ? darkMode.layout : lightMode.layout,
        grid: isDarkMode ? darkMode.grid : lightMode.grid,
        timeScale: {
          ...(isDarkMode ? darkMode.timeScale : lightMode.timeScale),
          scrollable: isCard,
          rightOffset: 10,
          barSpacing: 12,
          leftOffset: -10,
        },
        handleScale: isCard,
        handleScroll: isCard,
        rightPriceScale: {
          ...(isDarkMode ? darkMode.rightPriceScale : lightMode.rightPriceScale),
          scaleMargins: { top: 0.1, bottom: 0.1 },
        },
        crosshair: isDarkMode ? darkMode.crosshair : lightMode.crosshair,
      });

      const timeScale = chart.timeScale();
      timeScale.scrollToPosition(-12, false);

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: isDarkMode ? "#27a691" : "#4caf50",
        downColor: isDarkMode ? "#f23645" : "#f44336",
        borderUpColor: isDarkMode ? "#27a691" : "#4caf50",
        borderDownColor: isDarkMode ? "#f23645 " : "#f44336",
        wickUpColor: isDarkMode ? "#27a691" : "#4caf50",
        wickDownColor: isDarkMode ? "#f23645" : "#f44336",
      });
      candlestickSeries.setData(candlestickData);

      const lineSeries1 = chart.addLineSeries({
        color: isDarkMode ? "rgba(0, 0, 0, 0.8)" : "#000000",
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      if (analysisData.length > 0) {
        const upperLowerData = analysisData
          .filter(item => item.position === "upper" || item.position === "lower")
          .map(item => ({
            time: item.date.seconds,
            value: item.price,
            position: item.position
          }))
          .sort((a, b) => a.time - b.time);

        lineSeries1.setData(upperLowerData);
      }
      const singleData = analysisData
        .filter(item => item.position === "single")
        .map(item => ({
          value: item.price,
        }));


      candlestickSeries.createPriceLine({
        price: singleData.length > 0 ? singleData[0].value : NaN,
        color: "rgba(255, 0, 0, 0.8)",
        lineWidth: 2,
        lineStyle: 0,
        axisLabelVisible: true,
      });

      chart.timeScale().fitContent();

      const handleResize = () => {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      };

      chart.timeScale().setVisibleRange({
        from: candlestickData[candlestickData.length - (isCard === false ? 50 : 260)]?.time || candlestickData[0]?.time,
        to: candlestickData[candlestickData.length - 1]?.time,
      });

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    }
  }, [analysisData, candlestickData, isMouseDown]);

  const darkMode = {
    layout: {
      background: { type: "solid", color: "#fff" },
      textColor: "#000",
    },
    grid: {
      vertLines: { visible: true, color: "rgba(0, 0, 0, 0.1)", style: 0 },
      horzLines: { visible: true, color: "rgba(0, 0, 0, 0.1)", style: 0 },
      style: 1,
    },
    timeScale: {
      borderColor: "rgba(255, 255, 255, 0.2)",
      rightOffset: 12,
      barSpacing: 8,
    },
    rightPriceScale: {
      borderColor: "rgba(255, 255, 255, 0.2)",
      scaleMargins: { top: 0.1, bottom: 0.1 },
    },
    crosshair: {
      mode: 0,
      vertLine: {
        color: "rgba(44, 43, 43, 0.589)",
        width: 1,
        style: 3,
        visible: true,
      },
      horzLine: {
        color: "rgba(44, 43, 43, 0.589)",
        width: 1,
        style: 3,
        visible: true,
      },
    },
  };

  const lightMode = {
    layout: {
      background: { type: "solid", color: "#ffffff" },
      textColor: "#000000",
    },
    grid: {
      vertLines: { visible: false, color: "rgba(0, 0, 0, 0.1)", style: 0 },
      horzLines: {
        visible: true,
        style: 3,
        color: "rgba(0, 0, 0, 0.1)",
        style: 0,
      },
    },
    timeScale: {
      borderColor: "rgba(0, 0, 0, 0.2)",
      rightOffset: 12,
      barSpacing: 8,
    },
    rightPriceScale: {
      borderColor: "rgba(0, 0, 0, 0.2)",
      scaleMargins: { top: 0.1, bottom: 0.1 },
    },
    crosshair: {
      mode: 0,
      vertLine: { color: "#2ecc71", width: 1, style: 3, visible: true },
      horzLine: { color: "#2ecc71", width: 1, style: 3, visible: true },
    },
  };

  useEffect(() => {
    if (isMouseDown && chartContainerRef.current) {
      chartContainerRef.current.style.cursor = "grabbing";
    } else {
      chartContainerRef.current.style.cursor = "crosshair";
    }
  }, [isMouseDown]);

  return (
    <div>
      <div
        className="nav"
        id="nav"
        style={isCard === false ? { display: "none" } : { display: "flex" }}
      >
        <div className="logo-name">
          <Link to="/">AHSAN LABS</Link>
        </div>
        <div className="options">
          <Link to="https://t.me/ahsanlabs_admin" target="blank">
            <PiHeadsetBold />
          </Link>
          {isLogedIn === false ? (
            <Link to="/login">
              <button>
                Kirish <FiArrowRightCircle />
              </button>
            </Link>
          ) : (
            <h3>{isUser}</h3>
          )}
        </div>
      </div>
      <div
        ref={chartContainerRef}
        className={`chart-container ${isCard === false ? "chart-container-mobile" : ""}`}
        style={
          isCard === false
            ? {
              width: "calc(var(--index)*20)",
              height: "calc(var(--index)*15.5)",
              transform: "translateY(0)",
            }
            : { width: "100%", height: "77.6dvh", cursor }
        }
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="exit-svg"
          style={isCard === false ? { display: "none" } : { display: "flex" }}
        >
          <Link to="/" >
            <BsArrowLeftCircle className="exitsvg" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Chart;