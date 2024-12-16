import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { PiHeadsetBold } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { BiSupport } from "react-icons/bi";
import { FiArrowRightCircle } from "react-icons/fi";
import { BsArrowLeftCircle } from 'react-icons/bs';
import axios from 'axios';
import news from "../new.json"

const Chart = ({ isCard, setIsCard, isUser, isLogined }) => {
  const chartContainerRef = useRef(null);
  const [candlestickData, setCandlestickData] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleMouseDown = () => setIsMouseDown(true);
  const handleMouseUp = () => setIsMouseDown(false);

  useEffect(() => {
    const fetchBitCoinData = async () => {
      try {
        const response = await axios.get(
          'https://api.binance.com/api/v3/klines', {
          params: {
            symbol: 'BTCUSDT',
            interval: '1h',
            limit: 1000
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },

          proxy: {
            protocol: 'https',
            host: 'cors-anywhere.herokuapp.com',
            port: 443
          }
        }
        );

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
          } else {
            console.error('No valid data available');
          }
        } else {
          console.error('No data in response');
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        // Implement retry logic
        if (error.code === 'ERR_NETWORK' || error.code === 'ERR_SSL_PROTOCOL_ERROR') {
          console.log('Retrying request...');
          setTimeout(fetchBitCoinData, 2000); // Retry after 2 seconds
        }
      }
    };

    fetchBitCoinData();
  }, []);

  useEffect(() => {
    if (chartContainerRef.current && candlestickData.length > 0) {
      // Создание графика
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: isDarkMode ? darkMode.layout : lightMode.layout,
        grid: isDarkMode ? darkMode.grid : lightMode.grid,
        timeScale: {
          ...isDarkMode ? darkMode.timeScale : lightMode.timeScale,
          scrollable: isCard,
          rightOffset: 10, // Decreased rightOffset to show more candles on the right
          barSpacing: 12,
          leftOffset: -10,
        },
        handleScale: isCard,
        handleScroll: isCard,
        rightPriceScale: {
          ...isDarkMode ? darkMode.rightPriceScale : lightMode.rightPriceScale,
          scaleMargins: { top: 0.1, bottom: 0.1 },
        },
        crosshair: isDarkMode ? darkMode.crosshair : lightMode.crosshair,
      });

      const timeScale = chart.timeScale();
      timeScale.scrollToPosition(-12, false);

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: isDarkMode ? '#27a691' : '#4caf50',
        downColor: isDarkMode ? '#f23645' : '#f44336',
        borderUpColor: isDarkMode ? '#27a691' : '#4caf50',
        borderDownColor: isDarkMode ? '#f23645 ' : '#f44336',
        wickUpColor: isDarkMode ? '#27a691' : '#4caf50',
        wickDownColor: isDarkMode ? '#f23645' : '#f44336',
      });
      candlestickSeries.setData(candlestickData);

      const lineSeries1 = chart.addLineSeries({
        color: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : '#000000',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      lineSeries1.setData([
        { time: new Date('2021-08-27').getTime() / 1000, value: 46307 },
        { time: new Date('2021-09-06').getTime() / 1000, value: 52751 },
      ]);

      const lineSeries2 = chart.addLineSeries({
        color: isDarkMode ? 'rgba(28, 75, 228, 0.8)' : '#888888',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      lineSeries2.setData([
        { time: new Date('2021-09-07').getTime() / 1000, value: 43000 },
        { time: new Date('2021-09-22').getTime() / 1000, value: 49730 },
      ]);

      const lineSeries3 = chart.addLineSeries({
        color: isDarkMode ? 'rgba(21, 255, 0, 0.8)' : '#888888',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      lineSeries3.setData([
        { time: new Date('2021-09-07').getTime() / 1000, value: 52900 },
        { time: new Date('2021-09-20').getTime() / 1000, value: 43200 },
      ]);

      candlestickSeries.createPriceLine({
        price: candlestickData[13]?.low || 0,
        color: 'rgba(255, 0, 0, 0.8)',
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

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }

  }, [candlestickData, isDarkMode]);


  const darkMode = {
    layout: {
      background: { type: 'solid', color: '#fff' },
      textColor: '#000',
    },
    grid: {
      vertLines: { visible: true, color: 'rgba(0, 0, 0, 0.1)', style: 0 },
      horzLines: { visible: true, color: 'rgba(0, 0, 0, 0.1)', style: 0 },
      style: 1
    },
    timeScale: { borderColor: 'rgba(255, 255, 255, 0.2)', rightOffset: 12, barSpacing: 8 },
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
    timeScale: { borderColor: 'rgba(0, 0, 0, 0.2)', rightOffset: 12, barSpacing: 8 },
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

  useEffect(() => {
    if (isMouseDown && chartContainerRef.current) {
      chartContainerRef.current.style.cursor = "grabbing";
    } else {
      chartContainerRef.current.style.cursor = "crosshair";
    }
  }, [isMouseDown]);

  return (
    <div>
      <div className="nav" id="nav" style={isCard === false ? { display: "none" } : { display: "flex" }}>
        <div className="logo-name">
          <Link to="/">
            AHSAN LABS
          </Link>
        </div>
        <div className="options">
          <Link to="https://t.me/ahsanlabs_admin" target="blank">
            <PiHeadsetBold />
          </Link>
          {
            isLogined === false ?
              <Link to="/login">
                <button>
                  Kirish <FiArrowRightCircle />
                </button>
              </Link>
              :
              <h3>{isUser}</h3>
          }
        </div>
      </div>
      <div
        ref={chartContainerRef}
        className={`chart-container ${isCard === false ? "chart-container-mobile" : ""}`}
        style={isCard === false ? { width: 'calc(var(--index)*20)', height: 'calc(var(--index)*13.5)', transform: "translateY(0)" } : { width: '100%', height: '77.6dvh' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div className="exit-svg" style={isCard === false ? { display: "none" } : { display: "flex" }}>
          <Link to="/">
            <BsArrowLeftCircle className='exitsvg' />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Chart;
