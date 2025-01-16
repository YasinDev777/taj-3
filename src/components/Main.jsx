/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from '../components/LineChart';
import { BiLockOpen } from 'react-icons/bi';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { LuScanSearch } from 'react-icons/lu';
import Loader from './Loader';
import { BlockChartAnalytics, chartAnalyticsOpen, PaginationAnalytics } from '../analytics/Analytics';

const Main = ({ isCard, analysis, isGrid, isAlert, setIsAlert, isLogedIn, filterLimit, pointsState, isUser, data, currentPage, setCurrentPage }) => {
  const [loading, setLoading] = useState(true);
  const [ChartsPerPage, setChartsPerPage] = useState(isGrid);
  const [analysisData, setAnalysisData] = useState([]);
  const [currentChart, setCurrentChart] = useState([]);
  const navigate = useNavigate();

  const handleNavigate = (id, symbol) => {
    navigate(`/chart/${id}`, { replace: true });
    chartAnalyticsOpen(symbol);
  };

  useEffect(() => {
    if (analysis) {
      const updatedData = analysis
        .map((item, index) => {
          const [symbol, value] = Object.entries(data).find(([sym]) => sym === item.symbol) || [];
          return value?.lastClosePrice !== undefined ? { ...item, index, symbol, lastClosePrice: value.lastClosePrice } : null;
        })
        .filter((item) => item !== null && item !== undefined); // Filter out null or undefined items
      setAnalysisData(updatedData);
    }
  }, [analysis, filterLimit, pointsState, isLogedIn]);

  useEffect(() => {
    setChartsPerPage(isGrid);
  }, [isGrid, ChartsPerPage]);

  let totalPages = Math.ceil(analysisData.length / ChartsPerPage);

  useEffect(() => {
    const lastChartIndex = currentPage * ChartsPerPage;
    const firstChartIndex = lastChartIndex - ChartsPerPage;

    setCurrentChart(analysisData.slice(firstChartIndex, lastChartIndex));
  }, [analysisData, analysis, ChartsPerPage, currentPage]);

  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const paginate = (number) => setCurrentPage(number);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleScroll = () => {
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (analysisData.length > 0) {
        setLoading(false);
        return; // Skip loading if data is already loaded
      }
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoading(false);
    };
    fetchData();
  }, [analysisData]); // Trigger only when `analysisData` changes

  const calculateTimeDifference = (targetTime) => {
    const targetDate = targetTime.seconds * 1000; // Convert target time to milliseconds
    const now = new Date().getTime(); // Get current time
    const timeDifference = now - targetDate; // Calculate time difference

    const totalMinutes = Math.floor(timeDifference / (1000 * 60)); // Calculate total minutes
    const totalHours = Math.floor(totalMinutes / 60); // Calculate total hours
    const days = Math.floor(totalHours / 24); // Calculate days
    const hours = totalHours % 24; // Calculate remaining hours
    const minutes = totalMinutes % 60; // Calculate remaining minutes

    // Return the result
    if (days > 0) {
      return `${days} kun${hours > 0 ? ` ${hours} soat` : ''} oldin`;
    } else if (totalHours > 0) {
      return `${totalHours} soat${minutes > 0 ? ` ${minutes} daqiqa` : ''} oldin`;
    } else {
      return `${minutes > 0 ? minutes : 1} minut oldin`; // At least 1 minute
    }
  };

  return (
    <div className="main1">
      {loading ? (
        <Loader />
      ) : currentChart.length > 0 ? (
        <>
          <div className="main">
            {currentChart.map((item) => {
              return filterLimit > item.index ? (
                <div onClick={() => handleNavigate(item.analysisId, item.symbol)} key={item.symbol} className="card">
                  <div className="nav-card" style={{ background: 'var(--main-color)', width: '100%' }}>
                    <div className="info">
                      <big>{item.symbol}</big>
                    </div>
                    <div className="salary">
                      <i>{'$' + item.lastClosePrice}</i>
                    </div>
                    <div className="navCardLink">
                      <LuScanSearch className="scanIcon" />
                    </div>
                  </div>

                  <div className="image">
                    <Chart isCard={isCard} isUser={isUser} isLogedIn={isLogedIn} analysis={analysis} data={item.symbol} line={item.lines} />
                  </div>
                  <div className="texx">
                    <p>
                      Aniqlandi:
                      <span> {calculateTimeDifference(item.created_at)} </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="card" key={item.symbol}>
                  <div className="nav-card" style={{ background: 'var(--block-card-color)' }}>
                    <div className="info">
                      <big>{item.symbol}</big>
                    </div>
                    <div className="salary">
                      <i>$0,2648</i>
                    </div>
                    <div className="navCardLink">
                      <LuScanSearch className="scanIcon" />
                    </div>
                  </div>
                  <div className="image" style={{ cursor: 'default' }}>
                    <div className="dont-show" style={{ display: 'flex' }}>
                      <button
                        onClick={() => {
                          setIsAlert(!isAlert);
                          BlockChartAnalytics('open');
                        }}
                      >
                        Qo’lga kiritish <BiLockOpen />
                      </button>
                    </div>
                    <img src="/images/chartimg.jpg" alt="" />
                  </div>
                  <div className="texx">
                    <p>
                      Aniqlandi:
                      <span>{calculateTimeDifference(item.created_at)}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="btns">
            <button
              className="prev-btn"
              onClick={() => {
                prevPage();
                handleScroll();
                PaginationAnalytics('prev');
              }}
              disabled={currentPage === 1}
            >
              <GrFormPrevious />
            </button>
            {getVisiblePages().map((page, index) =>
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => {
                    paginate(page);
                    handleScroll();
                    PaginationAnalytics(page);
                  }}
                  className={page === currentPage ? 'active' : ''}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="dots">
                  ...
                </span>
              ),
            )}
            <button
              className="next-btn"
              onClick={() => {
                nextPage();
                handleScroll();
                PaginationAnalytics('next');
              }}
              disabled={currentPage === totalPages}
            >
              <GrFormNext />
            </button>
          </div>
        </>
      ) : (
        <div className="chartNone">
          <h1>Analizlar mavjud emas</h1>
        </div>
      )}
    </div>
  );
};

export default Main;
