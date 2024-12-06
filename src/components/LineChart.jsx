import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { CiSun } from "react-icons/ci";
import { GiMoon } from "react-icons/gi";
import news from "../new.json";

const Chart = ({ isCard, setIsCard }) => {
  const chartContainerRef = useRef(null);
  const [candlestickData, setCandlestickData] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Режим по умолчанию — темный

  const handleMouseDown = () => setIsMouseDown(true);
  const handleMouseUp = () => setIsMouseDown(false);

  useEffect(() => {
    const fetchBitcoinData = async () => {
      const formattedData = news.map((item) => {
        return {
          time: new Date(item.Date).getTime() / 1000,
          open: parseFloat(item.Open.replace(/,/g, '')),
          high: parseFloat(item.High.replace(/,/g, '')),
          low: parseFloat(item.Low.replace(/,/g, '')),
          close: parseFloat(item.Price.replace(/,/g, '')),
        };
      });

      formattedData.sort((a, b) => a.time - b.time);
      setCandlestickData(formattedData);
    };

    fetchBitcoinData();
  }, []);

  useEffect(() => {
    if (chartContainerRef.current && candlestickData.length > 0) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: isDarkMode ? darkMode.layout : lightMode.layout,
        grid: isDarkMode ? darkMode.grid : lightMode.grid,
        timeScale: {
          ...isDarkMode ? darkMode.timeScale : lightMode.timeScale,
        scrollable: isCard,
        },
        handleScale: isCard,
        handleScroll: isCard,
        rightPriceScale: {
          ...isDarkMode ? darkMode.rightPriceScale : lightMode.rightPriceScale,
          scaleMargins: { top: 0.1, bottom: 0.1 },
        },
        crosshair: isDarkMode ? darkMode.crosshair : lightMode.crosshair,
      });
      
  
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: isDarkMode ? '#A2C4C9' : '#4caf50',
        downColor: isDarkMode ? '#F6B26B' : '#f44336',
        borderUpColor: isDarkMode ? '#719CA4' : '#4caf50',
        borderDownColor: isDarkMode ? '#422C19' : '#f44336',
        wickUpColor: isDarkMode ? '#719CA4' : '#4caf50',
        wickDownColor: isDarkMode ? '#F6B26B' : '#f44336',
      });
  
      candlestickSeries.setData(candlestickData);
  
      // Трендовая линия 1
      const lineSeries1 = chart.addLineSeries({
        color: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : '#000000',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      const trendLineData1 = [
        { time: candlestickData[11].time, value: candlestickData[11].high },
        { time: candlestickData[23].time, value: candlestickData[23].high },
      ];
      lineSeries1.setData(trendLineData1);
  
      // Трендовая линия 2
      const lineSeries2 = chart.addLineSeries({
        color: isDarkMode ? 'rgba(28, 75, 228, 0.8)' : '#888888',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      const trendLineData2 = [
        { time: candlestickData[0].time, value: candlestickData[0].low },
        { time: candlestickData[7].time, value: candlestickData[7].high },
      ];
      lineSeries2.setData(trendLineData2);
  
      const priceLine = candlestickSeries.createPriceLine({
        price: candlestickData[13].low,
        color: 'rgba(255, 0, 0, 0.8)',
        lineWidth: 2,
        lineStyle: 0,
        axisLabelVisible: true,
      });
  
      chart.timeScale().fitContent();
  
      return () => chart.remove();
    }
  }, [candlestickData, isDarkMode]);
  

  const darkMode = {
    layout: {
      background: { type: 'solid', color: '#fff' },
      textColor: '#000',
    },
    grid: {
      vertLines: { visible: false, color: 'rgba(73, 70, 70, 0.1)', style: 0 },
      horzLines: { visible: true, color: 'rgba(56, 54, 54, 0.301)', style: 0 },
      style: 1
    },
    timeScale: { borderColor: 'rgba(255, 255, 255, 0.2)', rightOffset: 10, barSpacing: 8 },
    rightPriceScale: {
      borderColor: 'rgba(255, 255, 255, 0.2)',
      scaleMargins: { top: 0.1, bottom: 0.1 },
    },
    crosshair: {
      mode: 0,
      vertLine: { color: 'rgba(44, 43, 43, 0.589)', width: 1, style: 3, visible: true },
      horzLine: { color: 'rgba(44, 43, 43, 0.589)', width: 1, style: 3, visible: true },
    },
  };

  const lightMode = {
    layout: {
      background: { type: 'solid', color: '#ffffff' },
      textColor: '#000000',
    },
    grid: {
      vertLines: { visible: false, color: 'rgba(0, 0, 0, 0.1)', style: 0 },
      horzLines: { visible: true, style: 3, color: 'rgba(0, 0, 0, 0.1)', style: 0 },
    },
    timeScale: { borderColor: 'rgba(0, 0, 0, 0.2)', rightOffset: 10, barSpacing: 8 },
    rightPriceScale: {
      borderColor: 'rgba(0, 0, 0, 0.2)',
      scaleMargins: { top: 0.1, bottom: 0.1 },
    },
    crosshair: {
      mode: 0,
      vertLine: { color: '#2ecc71', width: 1, style: 3, visible: true },
      horzLine: { color: '#2ecc71', width: 1, style: 3, visible: true },
    },
  };

  const toggleMode = () => setIsDarkMode((prev) => !prev);

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
        className={`${isCard === false ? "none-nav" : "navbar"}`}
        style={isDarkMode ? { background: "#232730" } : { background: "#ccc" } }
      >
        <div className="logo"></div>
        <div className="list">
          {isDarkMode ? (
            <CiSun onClick={toggleMode} size={30} 
            style={isDarkMode ? { color: "#fff" } : { color: "#232730" }}
/>
          ) : (
            <GiMoon onClick={toggleMode} size={30} 
            style={isDarkMode ? { color: "#fff" } : { color: "#232730" }}/>
          )}
        </div>
      </div>
      <div
        ref={chartContainerRef}
        className="chart-container"
        style={ isCard === false ? { width: 'calc(var(--index)*20.5)', height: 'calc(var(--index)*15.1)' } : { width: '100%', height: 'calc(100dvh - 60px)'}}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      ></div>
    </div>
  );
};

export default Chart;
