/* eslint-disable no-dupe-keys */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef, useState } from 'react';

import { createChart } from 'lightweight-charts';
import { PiHeadsetBold } from 'react-icons/pi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowRightCircle } from 'react-icons/fi';
import { BsArrowLeftCircle } from 'react-icons/bs';
import axios from 'axios';
import { AnalysisContext } from '../context/Context';
import { chartAnalyticsClose, ConatactAnalytics, logoAnalytics, pageAnalytics } from '../analytics/Analytics';

const Chart = ({ isCard, isUser, isLogedIn, pointsState, data, line, timeFrame_id }) => {
  const [analysisData, setAnalysisData] = useState([]);
  const [analysisSymbols, setAnalysisSymbols] = useState('');

  const [timeFrameIdState, setTimeFrameIdState] = useState('');
  const { id } = useParams();
  const [cursor, setCursor] = useState('grab');
  const handleMouseDown = () => setCursor('grabbing');
  const handleMouseUp = () => setCursor('crosshair');
  const handleMouseLeave = () => setCursor('crosshair');

  const analysis = useContext(AnalysisContext);
  const chartContainerRef = useRef(null);
  const [candlestickData, setCandlestickData] = useState([]);
  const [isMouseDown] = useState(false);
  const [isDarkMode] = useState(true);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      if (!line && pointsState && id) {
        const lines = pointsState.filter((state) => state.analysis_id === id);
        setAnalysisData(lines);
      } else {
        setAnalysisData(line);
      }
    };
    fetchAnalysisData();
  }, [pointsState, data, line]);
  useEffect(() => {
    if (!data && analysis) {
      const filteredItems = analysis.filter((item) => item.analysisId === id);
      if (filteredItems.length > 0) {
        if (filteredItems[0].timeframe_id === 'four_hours') {
          setTimeFrameIdState('4h');
        } else if (filteredItems[0].timeframe_id === 'one_hour') {
          setTimeFrameIdState('1h');
        } else if (filteredItems[0].timeframe_id === 'daily') {
          setTimeFrameIdState('1d');
        }
        setAnalysisSymbols(filteredItems[0].symbol);
      }
    } else {
      setAnalysisSymbols(data.toString());
      if (timeFrame_id) {
        if (timeFrame_id === 'four_hours') {
          setTimeFrameIdState('4h');
        } else if (timeFrame_id === 'one_hour') {
          setTimeFrameIdState('1h');
        } else if (timeFrame_id === 'daily') {
          setTimeFrameIdState('1d');
        }
      }

    }

    const fetchBitCoinData = async () => {
      try {
        const response = await axios.get('https://api.binance.com/api/v3/klines', {
          params: {
            symbol: analysisSymbols,
            interval: timeFrameIdState,
            limit: 1000,
          },
        });
        if (response.data) {
          const formattedData = response.data.map((item) => ({
            time: item[0] / 1000,
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            close: parseFloat(item[4]),
          }));

          if (formattedData.length > 0) {
            const lastDataPointTime = formattedData[formattedData.length - 1].time;
            const extendedData = [...formattedData];
            const endDate = new Date(new Date().setDate(new Date().getDate() + 100)).getTime() / 1000;
            let currentTime = lastDataPointTime;

            while (currentTime < endDate) {
              currentTime += 24 * 60 * 60;
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
        console.error('Error fetching data:', error.message);
      }
    };

    if (analysisSymbols) {
      fetchBitCoinData();
    }
  }, [pointsState, id, data, analysisSymbols]);

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
          barSpacing: 5,
          leftOffset: -10,
          fixRightEdge: true,
        },
        handleScale: isCard,
        handleScroll: isCard,
        rightPriceScale: {
          ...(isDarkMode ? darkMode.rightPriceScale : lightMode.rightPriceScale),
          scaleMargins: { top: 0.1, bottom: 0.1 },
        },
        crosshair: isDarkMode ? darkMode.crosshair : lightMode.crosshair,
      });

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
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
        axisLabelVisible: false,
      });

      lineSeries1.setData(
        analysisData
          .filter((item) => item.position === 'lower' || item.position === 'upper')
          .map((item) => {
            const date = new Date(item.date.seconds * 1000); // Firebase timestampni UTC asosida o'qish
            date.setHours(date.getHours());
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Oyni 2 xonali qilib formatlash
            const day = String(date.getDate()).padStart(2, '0'); // Sanani 2 xonali qilib formatlash
            const hours = String(date.getHours()).padStart(2, '0'); // Soatni 2 xonali qilib formatlash
            const timeforHours = new Date(`${year}-${month}-${day} ${hours}:00:00`).getTime() / 1000
            const timeforDay = new Date(`${year}-${month}-${day}`).getTime() / 1000
            return {
              time: timeFrameIdState === '1d' ? timeforDay : timeforHours, // Unix timestamp (lightweight-charts uchun)
              value: item.price, // Narx qiymati
              // Qo'shimcha: Faqat ko'rsatish uchun (zarur bo'lsa)
            };
          })
          .sort((a, b) => a.time - b.time), // Unix timestamp bo'yicha tartiblash
      );


      // lineSeries1.setData([
      //   {time: new Date('2025-01-10 18:00:00').getTime() / 1000, value:9.56},
      //   {time: new Date('2025-01-18 8:00:00').getTime() / 1000,value: 9.90}
      // ])
      const singleData = analysisData
        .filter((item) => item.position === 'single')
        .map((item) => ({
          value: item.price,
        }));

      candlestickSeries.createPriceLine({
        price: singleData.length > 0 ? singleData[0].value : NaN,
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

      if (!candlestickData || candlestickData.length === 0) return;
      chart.timeScale().setVisibleRange({
        from: candlestickData[candlestickData.length - (isCard === false ? 200 : 260)]?.time || candlestickData[0]?.time,
        to: candlestickData[candlestickData.length - 1]?.time,
      });

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [analysisData, candlestickData, isMouseDown]);

  const darkMode = {
    layout: {
      background: { type: 'solid', color: '#fff' },
      textColor: '#000',
    },
    grid: {
      vertLines: { visible: true, color: 'rgba(0, 0, 0, 0.1)', style: 0 },
      horzLines: { visible: true, color: 'rgba(0, 0, 0, 0.1)', style: 0 },
      style: 1,
    },
    timeScale: {
      borderColor: 'rgba(255, 255, 255, 0.2)',
      rightOffset: 12,
      barSpacing: 8,
    },
    rightPriceScale: {
      borderColor: 'rgba(255, 255, 255, 0.2)',
      scaleMargins: { top: 0.1, bottom: 0.1 },
    },
    crosshair: {
      mode: 0,
      vertLine: {
        color: 'rgba(44, 43, 43, 0.589)',
        width: 1,
        style: 3,
        visible: true,
      },
      horzLine: {
        color: 'rgba(44, 43, 43, 0.589)',
        width: 1,
        style: 3,
        visible: true,
      },
    },
  };

  const lightMode = {
    layout: {
      background: { type: 'solid', color: '#ffffff' },
      textColor: '#000000',
    },
    grid: {
      vertLines: { visible: false, color: 'rgba(0, 0, 0, 0.1)', style: 0 },
      horzLines: {
        visible: true,
        style: 3,
        color: 'rgba(0, 0, 0, 0.1)',
        style: 0,
      },
    },
    timeScale: {
      borderColor: 'rgba(0, 0, 0, 0.2)',
      rightOffset: 12,
      barSpacing: 8,
    },
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
      chartContainerRef.current.style.cursor = 'grabbing';
    } else {
      chartContainerRef.current.style.cursor = 'crosshair';
    }
  }, [isMouseDown]);

  const navigate = useNavigate()
  const home = ()=>{
    navigate("/")
    chartAnalyticsClose(analysisSymbols)
  }

  return (
    <div>
      <div className="nav" id="nav" style={isCard === false ? { display: 'none' } : { display: 'flex' }}>
        <div className="logo-name">
          <Link to="/" onClick={logoAnalytics()} >
            AHSAN LABS
          </Link>
        </div>
        <div className="options">
          <Link to="https://t.me/ahsanlabs_admin" onClick={() => ConatactAnalytics('contactAdminIcon')} target="blank">
            <PiHeadsetBold />
          </Link>
          {isLogedIn === false ? (
            <Link to="/login" onClick={() => pageAnalytics('openLoginPage')}>
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
        className={`chart-container ${isCard === false ? '' : 'chart-container-mobile'}`}
        style={
          isCard === false
            ? {
              width: 'calc(var(--index)*30)',
              height: 'calc(var(--index)*15.5)',
              transform: 'translateY(0px)',
            }
            : { width: '100%', height: '77dvh', cursor }
        }
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="exit-svg" style={isCard === false ? { display: 'none' } : { display: 'flex' }}>
          <div onClick={home}>
            <BsArrowLeftCircle className="exitsvg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
