import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Chart from "../components/LineChart";
import { BiLockOpen } from "react-icons/bi";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { LuScanSearch } from "react-icons/lu";
import Loader from "./Loader";

const Main = ({
  isCard,
  analysis,
  isGrid,
  isAlert,
  setIsAlert,
  isLogedIn,
  filterLimit,
  pointsState,
  isUser,
  data,
  currentPage,
  setCurrentPage,
  selectedPreset,
  selectedTime,
  selectedTicker
}) => {
  const [loading, setLoading] = useState(true);
  const [ChartsPerPage, setChartsPerPage] = useState(isGrid);
  const [analysisData, setAnalysisData] = useState([]);
  const [currentChart, setCurrentChart] = useState([])
  useEffect(() => {
    if (analysis) {
        const updatedData = analysis.map((item, index) => ({ ...item, index })); // index qo'shilmoqda
        setAnalysisData(updatedData);
    }
}, [analysis, filterLimit, pointsState, isLogedIn ]);

  useEffect(() => {
    console.log("salom");
    setChartsPerPage(isGrid);
    setCurrentPage(1)
  }, [isGrid, ChartsPerPage]);
  let totalPages = Math.ceil(analysisData.length / ChartsPerPage);
  useEffect(() => {
    
    const lastChartIndex = currentPage * ChartsPerPage;
    const firstChartIndex = lastChartIndex - ChartsPerPage;
    setCurrentChart(analysisData.slice(firstChartIndex, lastChartIndex))
  }, [analysisData , analysis, ChartsPerPage])
  

  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
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
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
    };
    fetchData();
  }, [currentPage, selectedPreset, selectedTime, selectedTicker,ChartsPerPage]);
  

  const calculateTimeDifference = (targetTime) => {
    const targetDate = targetTime.seconds * 1000; // Maqsad vaqtni millisekundga aylantirish
    const now = new Date().getTime(); // Hozirgi vaqt
    const timeDifference = now - targetDate; // Vaqt farqi
  
    const totalMinutes = Math.floor(timeDifference / (1000 * 60)); // Umumiy daqiqalarni ҳисоблаш
    const totalHours = Math.floor(totalMinutes / 60); // Умумий соатларни ҳисоблаш
    const days = Math.floor(totalHours / 24); // Кунларни ҳисоблаш
    const hours = totalHours % 24; // Қолдиқ соатларни ҳисоблаш
    const minutes = totalMinutes % 60; // Қолдиқ дақиқаларни ҳисоблаш
  
    // Натийжани қайтариш
    if (days > 0) {
      return `${days} kun${hours > 0 ? ` ${hours} soat` : ""} oldin`;
    } else if (totalHours > 0) {
      return `${totalHours} soat${minutes > 0 ? ` ${minutes} daqiqa` : ""} oldin`;
    } else {
      return `${minutes > 0 ? minutes : 1} minut oldin`; // Ҳеч бўлмаганда 1 дақиқа
    }
  };

  return (
    <div className="main1">
      {loading ? (
        <Loader />
      ) : 
        currentChart.length > 0  ?
        <>
          <div className="main">
            {
              currentChart && currentChart.map((item,index) => {
                const symbol = Object.entries(data)
                  .filter(([symbol]) => symbol === item.symbol)
                  .map(([symbol]) => symbol);
                const lastClosePrice = Object.entries(data).filter(([symbol]) => symbol === item.symbol).map(item => item[1].lastClosePrice)
                return (
                  <div key={index}>
                    {filterLimit > item.index ? (
                      <Link to={"/chart/" + item.analysisId} key={item.index} className="card">
                        <div className="nav-card" style={{ background: "var(--main-color)", width: "100%" }}>
                          <div className="info">
                            <big>{item.symbol}</big>
                          </div>
                          <div className="salary">
                            <i>{"$"+lastClosePrice}</i>
                          </div>
                          <div
                            className="navCardLink"
                          >
                            <LuScanSearch className="scanIcon" />
                          </div>
                        </div>

                        <div className="image">
                          <Chart
                            isCard={isCard}
                            isUser={isUser}
                            isLogedIn={isLogedIn}
                            analysis={analysis}
                            data={symbol}
                            line={item.lines}
                          />
                        </div>
                        <div className="texx">
                          <p>
                            Aniqlandi:
                            <span> {" "}
                              {calculateTimeDifference(item.created_at)}{" "}
                            </span>
                          </p>
                        </div>
                      </Link>
                    ) : (
                      <div className="card" key={item.index}  >
                        <div
                          className="nav-card"
                          style={{ background: "var(--block-card-color)"}}
                        >
                          <div className="info">
                            <big>{item.symbol}</big>
                          </div>
                          <div className="salary">
                            <i>$0,2648</i>
                          </div>
                          <div
                            className="navCardLink">
                            <LuScanSearch className="scanIcon" />
                          </div>
                        </div>
                        <div className="image" style={{cursor:"default"}} >
                          <div className="dont-show" style={{ display: "flex" }}>
                            <button onClick={() => setIsAlert(!isAlert)}>
                              Qo’lga kiritish <BiLockOpen />
                            </button>
                          </div>
                          <img src="/images/chartimg.jpg" alt="" />
                        </div>
                        <div className="texx">
                          <p>
                            Aniqlandi:
                            <span> {" "}
                              {calculateTimeDifference(item.created_at)}{" "}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            }
          </div>

          <div className="btns">
            <button
              className="prev-btn"
              onClick={() => {
                prevPage();
                handleScroll();
              }}
              disabled={currentPage === 1}
            >
              <GrFormPrevious />
            </button>
            {getVisiblePages().map((page, index) =>
              typeof page === "number" ? (
                <button
                  key={index}
                  onClick={() => {
                    paginate(page);
                    handleScroll();
                  }}
                  className={page === currentPage ? "active" : ""}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="dots">
                  ...
                </span>
              )
            )}
            <button
              className="next-btn"
              onClick={() => {
                nextPage();
                handleScroll();
              }}
              disabled={currentPage === totalPages}
            >
              <GrFormNext />
            </button>
          </div>
      </>
       : 
       <div className="chartNone">
        <h1>Analiz mavjud emas</h1>
      </div>

      }
      
    </div>
  );
};

export default Main;