import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import Chart from '../components/LineChart';
import { BiLockOpen } from 'react-icons/bi';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { LuScanSearch } from 'react-icons/lu';
import Loader from './Loader';
import { BlockChartAnalytics, chartAnalyticsOpen, PaginationAnalytics } from '../analytics/Analytics';

const Main = memo(({
  isCard,
  analysis,
  isGrid,
  isAlert,
  setIsAlert,
  isLogedIn,
  filterLimit,
  isUser,
  data,
  currentPage,
  setCurrentPage,
  loading,
  activeCardFilter
}) => {
  const [chartsPerPage, setChartsPerPage] = useState(isGrid);
  const [currentChart, setCurrentChart] = useState([]);

  const [totallength, setTotallength] = useState("")

  useEffect(() => {


    if (analysis && data) {
      // `analysis` ichidagi elementlarni `data` obyektidan tekshiramiz
      const updatedData = analysis
          .map((item) => {
              const matchedData = data[item.symbol]; // Objektdan `symbol` bo‘yicha ma’lumot olish
              if (matchedData) {
                  return {
                      ...item,
                      lastClosePrice: matchedData.lastClosePrice,
                      active_card: matchedData.active_card
                  };
              }
              return null;
          })  
          .filter(Boolean); // `null` qiymatlarni olib tashlaymiz

          // `active_card === true` bo'lganlarni qoldiramiz va indeks qo'shamiz
          const filteredData = updatedData
          .filter(item => item.active_card === true)
          .map((item, index) => ({ ...item, index }));
          
          // Paginatsiya hisoblash
          setTotallength(filteredData.length);
      const lastChartIndex = currentPage * chartsPerPage;
      const firstChartIndex = lastChartIndex - chartsPerPage;
      setCurrentChart(filteredData.slice(firstChartIndex, lastChartIndex));
  }
  
  }, [data, currentPage, chartsPerPage]);


  useEffect(() => setChartsPerPage(isGrid), [isGrid]);

  const calculateTimeDifference = (targetTime) => {
    const targetDate = targetTime.seconds * 1000;
    const now = Date.now();
    const timeDifference = now - targetDate;

    const totalMinutes = Math.floor(timeDifference / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;

    if (days > 0) return `${days} kun${hours > 0 ? ` ${hours} soat` : ''} oldin`;
    if (totalHours > 0) return `${totalHours} soat${minutes > 0 ? ` ${minutes} daqiqa` : ''} oldin`;
    return `${minutes > 0 ? minutes : 1} daqiqa oldin`;
  };

  const getVisiblePages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };
  const paginate = (number) => setCurrentPage(number);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      setTimeout(() => handleScroll(), 50);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setTimeout(() => handleScroll(), 50);
    }
  };
  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredChart2 = currentChart.filter((item) => item.active_card === false);
  const filteredChart = currentChart.filter((item) => item.active_card === true && item.lastClosePrice !== undefined);
  activeCardFilter.length = 0;
  activeCardFilter.push(...filteredChart2);

  const totalPages = Math.ceil(totallength / chartsPerPage);

  return (
    <div className="main1">
      {loading ? (
        <Loader />
      ) : analysis.length > 0 && currentChart.length > 0 ? (
        <>
          <div className="main">

            {filteredChart.map((item) => {
              return filterLimit > item.index ? (
                <Link
                  to={`/chart/${item.analysisId}`}
                  onClick={() => chartAnalyticsOpen(item.symbol)}
                  key={item.index}
                  className="card"
                >
                  <div
                    className="nav-card"
                    style={{ background: 'var(--main-color)', width: '100%' }}
                  >
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
                    <Chart
                      isCard={isCard}
                      isUser={isUser}
                      isLogedIn={isLogedIn}
                      analysis={analysis}
                      data={item.symbol}
                      line={item.lines}
                      foundedTimeframe={item.timeFrameNames.toString()}
                      screeningTypeValue={item.screening_type_value_id}
                    />
                  </div>
                  <div className="texx">
                    <p>
                      Aniqlandi:
                      <span> {calculateTimeDifference(item.created_at)} </span>
                    </p>
                    <p>{item.timeFrameNames.toString()}</p>
                  </div>
                </Link>
              ) : (
                <div className="card" key={item.index}>
                  <div
                    className="nav-card"
                    style={{ background: 'var(--block-card-color)' }}
                  >
                    <div className="info">
                      <big className="block-info">{item.symbol}</big>
                    </div>
                    <div className="salary block-salary">
                      <i>{'$' + item.lastClosePrice}</i>
                    </div>
                    <div className="navCardLink" style={{ cursor: 'default' }}>
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
                    PaginationAnalytics(page);
                    handleScroll();
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
          {
            currentChart.some((item) => item.lastClosePrice === undefined) ?
              <h1>Analizlar mavjud emas. <br /> Server bilan muammo</h1> :
              <h1>Analizlar mavjud emas</h1>
          }
        </div>
      )}
    </div>
  );
});

export default Main;
