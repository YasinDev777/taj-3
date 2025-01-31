import React, { useContext, useEffect, useRef, useState } from "react";

import { createChart } from "lightweight-charts";
import { PiHeadsetBold } from "react-icons/pi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowRightCircle } from "react-icons/fi";
import { BsArrowLeftCircle } from "react-icons/bs";
import axios from "axios";
import { AnalysisContext } from "../context/Context";
import {
  chartAnalyticsClose,
  ConatactAnalytics,
  logoAnalytics,
  pageAnalytics,
} from "../analytics/Analytics";
import { darkMode, lightMode } from "./ChartLines/UIMode";

const Chart = ({
  isCard,
  isUser,
  isLogedIn,
  // pointsState,
  data,
  line,
  foundedTimeframe,
  screeningTypeValue,
}) => {
  const [analysisData, setAnalysisData] = useState([]);
  const [analysisSymbols, setAnalysisSymbols] = useState("");

  const [timeFrameIdState, setTimeFrameIdState] = useState("");
  const { id } = useParams();
  const [cursor, setCursor] = useState("grab");
  const handleMouseDown = () => setCursor("grabbing");
  const handleMouseUp = () => setCursor("crosshair");
  const handleMouseLeave = () => setCursor("crosshair");

  const analysis = useContext(AnalysisContext);
  const chartContainerRef = useRef(null);
  const [candlestickData, setCandlestickData] = useState([]);
  const [isMouseDown] = useState(false);
  const [isDarkMode] = useState(true);


  useEffect(() => {
    const fetchAnalysisData = async () => {
      if (!data && analysis && !line  && id) {
        const filteredItems = analysis.filter((item) => item.analysisId === id);
        if (filteredItems.length > 0) {
          // console.log(f);
          setAnalysisData({
            line: filteredItems[0].lines,
            screeningTypeValue: filteredItems[0].screening_type_value_id,
          });
          setTimeFrameIdState(filteredItems[0].timeFrameNames.toString());
          setAnalysisSymbols(filteredItems[0].symbol);
        }
      } else {
        setAnalysisSymbols(data.toString());
        setTimeFrameIdState(foundedTimeframe);
        setAnalysisData({
          line: line,
          screeningTypeValue: screeningTypeValue,
        });
      }
    };
    fetchAnalysisData();
  }, [ data, line]);

  useEffect(() => {
    const fetchBitCoinData = async () => {
      try {
        const response = await axios.get(
          "https://api.binance.com/api/v3/klines",
          {
            params: {
              symbol: analysisSymbols,
              interval: timeFrameIdState,
              limit: 1000,
            },
          }
        );
        if (response.data) {
          const formattedData = response.data.map((item) => ({
            time: item[0] / 1000,
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            close: parseFloat(item[4]),
          }));

          if (formattedData.length > 0) {
            const lastDataPointTime =
              formattedData[formattedData.length - 1].time;
            const extendedData = [...formattedData];
            let currentTime = lastDataPointTime;

            let endDate =
              new Date(
                new Date().setDate(new Date().getDate() + 100)
              ).getTime() / 1000;
            let time = "";
            if (timeFrameIdState === "1d") {
              time = 24 * 60 * 60;
            } else if (timeFrameIdState === "4h") {
              endDate =
                new Date(
                  new Date().setDate(new Date().getDate() + 20)
                ).getTime() / 1000;
              time = 4 * 60 * 60;
            } else {
              endDate =
                new Date(
                  new Date().setDate(new Date().getDate() + 3)
                ).getTime() / 1000;
              time = 60 * 60;
            }
            while (currentTime < endDate) {
              currentTime += time;
              extendedData.push({
                time: currentTime,
                open: NaN,
                high: NaN,
                low: NaN,
                close: NaN,
              });
            }

            setCandlestickData(extendedData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    if (analysisSymbols) {
      fetchBitCoinData();
    }
  }, [ id, data, analysisSymbols]);

  useEffect(() => {
    function defaultTickMarkFormatter(timePoint, tickMarkType, locale) {
      const formatOptions = {};
      switch (tickMarkType) {
        case 0: //TickMarkType.Year:
          formatOptions.year = "numeric";
          break;
        case 1: // TickMarkType.Month:
          formatOptions.month = "short";
          break;
        case 2: //TickMarkType.DayOfMonth:
          formatOptions.day = "numeric";
          break;
        case 3: //TickMarkType.Time:
          formatOptions.hour12 = false;
          formatOptions.hour = "2-digit";
          formatOptions.minute = "2-digit";
          break;
        case 4: //TickMarkType.TimeWithSeconds:
          formatOptions.hour12 = false;
          formatOptions.hour = "2-digit";
          formatOptions.minute = "2-digit";
          formatOptions.second = "2-digit";
          break;
        default:
        // ensureNever(tickMarkType);
      }
      const date =
        timePoint.businessDay === undefined
          ? new Date(timePoint.timestamp * 1000)
          : new Date(
              Date.UTC(
                timePoint.businessDay.year,
                timePoint.businessDay.month - 1,
                timePoint.businessDay.day
              )
            );

      const localDateFromUtc = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds()
      );

      return localDateFromUtc.toLocaleString(locale, formatOptions);
    }
    const localTimezoneOffset = new Date().getTimezoneOffset() * 60;
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
          barSpacing: 5,
          leftOffset: -10,
          fixRightEdge: true,
          timeVisible: true,
          tickMarkFormatter: (time, tickMarkType, locale) => {
            return defaultTickMarkFormatter(
              { timestamp: time - localTimezoneOffset },
              tickMarkType,
              locale
            );
          },
        },
        handleScale: isCard,
        handleScroll: isCard,
        rightPriceScale: {
          ...(isDarkMode
            ? darkMode.rightPriceScale
            : lightMode.rightPriceScale),
          scaleMargins: { top: 0.1, bottom: 0.1 },
        },
        crosshair: isDarkMode ? darkMode.crosshair : lightMode.crosshair,
      });
      if (isCard === undefined) {
        chart.subscribeCrosshairMove((param) => {
          if (!param || !param.time) {
            customTimeLabel.style.display = "none"; // Agar crosshair chetda bo'lsa, yashirish
            return;
          }

          const originalTime = param.time; // Unix timestamp (seconds)
          const modifiedTime = new Date(originalTime * 1000); // Millisekundga aylantirish

          const formattedTime = `${modifiedTime.getFullYear()}-${String(
            modifiedTime.getMonth() + 1
          ).padStart(2, "0")}-${String(modifiedTime.getDate()).padStart(
            2,
            "0"
          )} ${String(modifiedTime.getHours()).padStart(2, "0")}:${String(
            modifiedTime.getMinutes()
          ).padStart(2, "0")}`;

          // Labelni yangilash
          customTimeLabel.textContent = formattedTime;
          customTimeLabel.style.display = "block";

          // Crosshair joylashuvi bilan sinxronlashtirish
          const chartRect = document
            .querySelector("canvas")
            .getBoundingClientRect();
          customTimeLabel.style.left = `${
            chartRect.left + param.point.x - 55
          }px`; // X koordinatasi
          customTimeLabel.style.top = `${
            chartRect.top + chartRect.height - 30
          }px`; // Y koordinatasi
        });
        const customTimeLabel = document.createElement("div");
        customTimeLabel.style.position = "absolute";
        customTimeLabel.style.background = "black";
        customTimeLabel.style.color = "white";
        customTimeLabel.style.padding = "5px";
        customTimeLabel.style.borderRadius = "5px";
        customTimeLabel.style.fontSize = "12px";
        customTimeLabel.style.display = "none"; // Avval yashiringan
        document.body.appendChild(customTimeLabel);
      }

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
        axisLabelVisible: false,
      });

      if (analysisData.screeningTypeValue === "trendline") {
        lineSeries1.setData(
          analysisData.line
            .map((item) => {
              const date = new Date(item.date.seconds * 1000); // Firebase timestampni UTC asosida o'qish
              // date.setHours(date.getHours() + 5); // 5 soatni qo'shish
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0"); // Oyni 2 xonali qilib formatlash
              const day = String(date.getDate()).padStart(2, "0"); // Sanani 2 xonali qilib formatlash
              const hours = String(date.getHours()).padStart(2, "0"); // Soatni 2 xonali qilib formatlash
              const timeforHours =
                new Date(`${year}-${month}-${day} ${hours}:00:00`).getTime() /
                1000;
              const timeforDaily =
                new Date(`${year}-${month}-${day}`).getTime() / 1000;

              return {
                time: timeFrameIdState === "1h" ? timeforHours : timeforDaily, // Unix timestamp (lightweight-charts uchun)
                value: item.price, // Narx qiymati
              };
            })
            .sort((a, b) => a.time - b.time) // Unix timestamp bo'yicha tartiblash
        );
      } else if (analysisData.screeningTypeValue === "support" || analysisData.screeningTypeValue === "resistance") {
        const singleData = analysisData.line.map((item) => ({
          value: item.price,
        }));

        candlestickSeries.createPriceLine({
          price: singleData.length > 0 ? singleData[0].value : NaN,
          color: "rgba(255, 0, 0, 0.8)",
          lineWidth: 2,
          lineStyle: 0,
          axisLabelVisible: true,
        });
      } else if (analysisData.screeningTypeValue === "fibonacci") {
        // Fibonacci darajalari
        // Fibonacci sonlarini hisoblash uchun massiv
        const fibonacciNumbers = [0, 0.236, 0.382, 0.5, 0.618, 1];

        // `times` va `values` massivlari bitta arraydan kelmoqda
        const data = [
          // { time: "2025-01-20", value: 100000 },
          { time: "2025-01-10", value: 120000 },
          { time: "2025-02-12", value: 100000 },
        ];

        // Har bir Fibonacci darajasi uchun qiymatlarni hisoblash
        const fibonacciLevels = fibonacciNumbers.map((level) => ({
          value:
            data[0].value +
            (data[data.length - 1].value - data[0].value) * level,
        }));

        // Har bir daraja uchun chiziq va markerlar yaratish
        fibonacciLevels.forEach((level, index) => {
          const line = chart.addLineSeries({
            priceLineVisible: false,
            // lastValueVisible: false,
            axisLabelVisible: false,
            color: "#FF0000",
            lineWidth: 1,
          });

          // Chiziq uchun ma'lumotlarni yaratish
          const lineData = data.map((entry) => ({
            time: entry.time,
            value: level.value, // Fibonacci daraja qiymati
          }));

          line.setData(lineData);

          // Markerlarni yaratish
          const marker = {
            time: data[data.length - 1].time, // Markerning vaqt nuqtasi (2025-02-12)
            position: "aboveBar",
            color: "black",
            size: 0,
            text: `${fibonacciNumbers[index]}`, // Fibonacci soni matni
          };

          // Markerlarni o'rnatish
          line.setMarkers([marker]);
        });
      }

      // Crosshair vaqt labeli uchun element yaratish

      // Crosshair harakati kuzatiladi
      const handleResize = () => {
        chart.applyOptions({
          crosshair: {
            vertLine: {
              labelVisible: false, // Asl labelni yashirish
            },
          },
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      };

      if (!candlestickData || candlestickData.length === 0) return;
      chart.timeScale().setVisibleRange({
        from:
          candlestickData[
            candlestickData.length - (isCard === false ? 200 : 260)
          ]?.time || candlestickData[0]?.time,
        to: candlestickData[candlestickData.length - 1]?.time,
      });
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    }
  }, [analysisData, candlestickData, isMouseDown]);

  useEffect(() => {
    if (isMouseDown && chartContainerRef.current) {
      chartContainerRef.current.style.cursor = "grabbing";
    } else {
      chartContainerRef.current.style.cursor = "crosshair";
    }
  }, [isMouseDown]);

  const navigate = useNavigate();
  const home = () => {
    navigate("/");
    chartAnalyticsClose(analysisSymbols);
  };

  return (
    <div>
      <div
        className="nav"
        id="nav"
        style={isCard === false ? { display: "none" } : { display: "flex" }}
      >
        <div className="logo-name">
          <Link to="/" onClick={logoAnalytics}>
            AHSAN LABS
          </Link>
        </div>
        <div className="options">
          <Link
            to="https://t.me/ahsanlabs_admin"
            onClick={() => ConatactAnalytics("contactAdminIcon")}
            target="blank"
          >
            <PiHeadsetBold />
          </Link>
          {isLogedIn === false ? (
            <Link to="/login" onClick={() => pageAnalytics("openLoginPage")}>
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
        className={`chart-container ${
          isCard === false ? "" : "chart-container-mobile"
        }`}
        style={
          isCard === false
            ? {
                width: "calc(var(--index)*30)",
                height: "calc(var(--index)*15.5)",
                transform: "translateY(0px)",
              }
            : { width: "100%", height: "77dvh", cursor }
        }
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="exit-svg"
          style={isCard === false ? { display: "none" } : { display: "flex" }}
        >
          <div onClick={home}>
            <BsArrowLeftCircle className="exitsvg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
