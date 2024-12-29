import React, { useState, useEffect } from "react";
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
  filterCards,
}) => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ChartsPerPage, setChartPerPage] = useState(isGrid);
  const [analysisData, setAnalysisData] = useState([]);

  useEffect(() => {
    if (analysis) {
      setAnalysisData(analysis);
    }
  }, [analysis, filterLimit, pointsState, isLogedIn]);

  useEffect(() => {
    setChartPerPage(Number(isGrid));
  }, [isGrid]);

  const totalPages = Math.ceil(analysisData.length / ChartsPerPage);
  const lastChartIndex = currentPage * ChartsPerPage;
  const firstChartIndex = lastChartIndex - ChartsPerPage;
  const currentChart = analysisData.slice(firstChartIndex, lastChartIndex);

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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
    };
    fetchData();
  }, []);

  const calculateTimeDifference = (targetTime) => {
    const targetDate = targetTime.seconds * 1000; // Maqsad vaqtni millisekundga aylantirish
    const now = new Date().getTime(); // Hozirgi vaqt
    const timeDifference = now - targetDate; // Vaqt farqi

    const totalHours = Math.floor(timeDifference / (1000 * 60 * 60)); // Umumiy soatlarni hisoblash
    const days = Math.floor(totalHours / 24); // Kunlarni hisoblash
    const hours = totalHours % 24; // Qoldiq soatlarni hisoblash

    // Natijani qaytarish
    if (days >= 0) {
      return `${days} kun ${hours}`;
    } else {
      return hours;
    }
  };

  return (
    <div className="main1">
      <div className="main">
        {loading ? (
          <Loader />
        ) : (
          <>
            {
              currentChart.filter(item => item.inactive === false).map((item) => {
                
                const symbol = Object.entries(data)
                  .filter(([symbol]) => symbol === item.symbol)
                  .map(([symbol]) => symbol);
                  const lastClosePrice = Object.entries(data).filter(([symbol]) => symbol === item.symbol).map(item => item[1].lastClosePrice)                  
                  return (
                    <Link to={"/chart/" + item.analysisId} className="card" key={item.index}>
                      {filterLimit > item.index ? (
                        <>
                          <div className="nav-card" style={{ background: "var(--main-color)", width: "100%" }}>
                              <div className="info">
                                <big>{item.symbol}</big>
                              </div>
                              <div className="salary">
                                <i>{lastClosePrice}</i>
                              </div>
                            <Link
                              to={"/chart/" + item.analysisId}
                              className="navCardLink"
                            >
                              <LuScanSearch className="scanIcon" />
                            </Link>
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
                              soat oldin
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className="nav-card"
                            style={{ background: "var(--block-card-color)" }}
                          >
                              <div className="info">
                                <big>{item.symbol}</big>
                              </div>
                              <div className="salary">
                                <i>$0,2648</i>
                              </div>
                            <Link
                              to="./Main"
                              className="navCardLink"
                              style={{ pointerEvents: "none", cursor: "default" }}
                              >
                              <LuScanSearch className="scanIcon" />
                            </Link>
                              </div>
                          <div className="image">
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
                              soat oldin
                            </p>
                          </div>
                        </>
                      )}
                    </Link>
                  );
                })
              }
          </>
        )}
      </div>

      {loading ? (
        ""
      ) : (
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
      )}
    </div>
  );
};

export default Main;
