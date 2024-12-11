import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Link } from 'react-router-dom';
import { BiSupport } from "react-icons/bi";
import { FiArrowRightCircle } from "react-icons/fi";
import { BsArrowLeftCircle } from 'react-icons/bs';
import axios from 'axios';
import news from "../new.json"
// c504a279-fe1d-49ec-b85b-09c9c4d7a636
const Chart = ({ isCard, setIsCard }) => {
  const chartContainerRef = useRef(null);
  const [candlestickData, setCandlestickData] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

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

    // const fetchBitCoinData = async () => {
    //   try {
    //     const response = await axios.get(
    //       'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/historical',
    //       {
    //         headers: {
    //           'Accepts': 'application/json',
    //           'X-CMC_PRO_API_KEY': 'c504a279-fe1d-49ec-b85b-09c9c4d7a636',
    //         },
    //         params: {
    //           symbol: 'BTC',
    //           convert: 'USD',
    //           time_start: '2022-01-01',
    //           time_end: '2022-12-31',
    //         },
    //       }
    //     );

    //     console.log('API Response:', response.data);

    //     if (response.data && response.data.data) {
    //       const formattedData = response.data.data.map((item) => ({
    //         time: new Date(item.date).getTime() / 1000,
    //         open: parseFloat(item.open.replace(/,/g, '')) || 0,
    //         high: parseFloat(item.high.replace(/,/g, '')) || 0,
    //         low: parseFloat(item.low.replace(/,/g, '')) || 0,
    //         close: parseFloat(item.close.replace(/,/g, '')) || 0,
    //       }));

    //       console.log('Formatted Data:', formattedData);

    //       if (formattedData.length > 0) {
    //         setCandlestickData(formattedData);
    //       } else {
    //         console.log('No valid data available');
    //       }

    //       formattedData.sort((a, b) => a.time - b.time);

    //     } else {
    //       console.log('No data in response');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching data:', error.message);
    //   }

    // };
    // fetchBitCoinData()
  }, []);


  console.log(candlestickData);


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

      const findCandleIndex = (candles, targetDate) => {
        const targetTime = new Date(targetDate).getTime() / 1000;
        return candles.findIndex(candle => candle.time === targetTime);
      };

      const pointA = "2021-09-07";
      const pointB = "2021-09-18";

      const indexA = findCandleIndex(candlestickData, pointA);
      const indexB = findCandleIndex(candlestickData, pointB);

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: isDarkMode ? '#A2C4C9' : '#4caf50',
        downColor: isDarkMode ? '#F6B26B' : '#f44336',
        borderUpColor: isDarkMode ? '#719CA4' : '#4caf50',
        borderDownColor: isDarkMode ? '#422C19' : '#f44336',
        wickUpColor: isDarkMode ? '#719CA4' : '#4caf50',
        wickDownColor: isDarkMode ? '#F6B26B' : '#f44336',
      });

      candlestickSeries.setData(candlestickData);


      const lineSeries1 = chart.addLineSeries({
        color: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : '#000000',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      const trendLineData1 = [
        { time: new Date('2021-08-27').getTime() / 1000, value: 46307 },
        { time: new Date('2021-09-06').getTime() / 1000, value: 52751 },
      ];
      lineSeries1.setData(trendLineData1);

      const lineSeries2 = chart.addLineSeries({
        color: isDarkMode ? 'rgba(28, 75, 228, 0.8)' : '#888888',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      const trendLineData2 = [
        { time: new Date('2021-09-07').getTime() / 1000, value: 43000 },
        { time: new Date('2021-09-22').getTime() / 1000, value: 49730 },
      ];
      lineSeries2.setData(trendLineData2);

      const lineSeries3 = chart.addLineSeries({
        color: isDarkMode ? 'rgba(21, 255, 0, 0.8)' : '#888888',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      });

      const trendLineData3 = [
        { time: new Date('2021-09-07').getTime() / 1000, value: 52900 },
        { time: new Date('2021-09-20').getTime() / 1000, value: 43200 },
      ];
      lineSeries3.setData(trendLineData3);

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
        <div className="logo-name">AHSAN SCREENER</div>
        <div className="options">
          <BiSupport />
          <Link to="/login">
            <button>
              Kirish <FiArrowRightCircle />
            </button>
          </Link>
        </div>
      </div>
      <div
        ref={chartContainerRef}
        className="chart-container"
        style={isCard === false ? { width: 'calc(var(--index)*20)', height: 'calc(var(--index)*13)', transform: "translateY(0)" } : { width: '100%', height: 'calc(var(--index)*25)' }}
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
