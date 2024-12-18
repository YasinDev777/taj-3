import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Chart from '../components/LineChart';
import { BiLockOpen } from "react-icons/bi";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { LuScanSearch } from "react-icons/lu";
import Loader from './Loader';
import array from '../array';

const Main = ({ 
  filtered, 
  isCard,
  setIsCard, 
  isGrid, 
  isAlert, 
  setIsAlert,
  isLogined,
  filterLimit,
}) => {
  const [Charts, setCharts] = useState(filtered);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ChartsPerPage, setChartPerPage] = useState(isGrid);

  const totalPages = Math.ceil(Charts.length / ChartsPerPage);

  useEffect(() => {
    setCharts(filtered); 
    
  }, [filtered,isLogined]);

  useEffect(() => {
    setChartPerPage(Number(isGrid));
  }, [isGrid]);

  const lastChartIndex = currentPage * ChartsPerPage;
  const firstChartIndex = lastChartIndex - ChartsPerPage;
  const currentChart = Charts.slice(firstChartIndex, lastChartIndex);

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
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }
    return pages;
  };

  const paginate = (number) => setCurrentPage(number);

  const nextPgae = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleScroll = () =>{
    window.scrollTo({top: 0})
  }


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
    };
  
    fetchData();
  
    if (isLogined === true) {
      const updatedCharts = filtered.map((item, index) => {
        return {
          ...item,
          login: index < filterLimit ? true : false,
        };
      });
  
      setCharts(updatedCharts);
    }
  }, [isLogined, filtered, filterLimit]);  

  return (
    <div className="main1">
      <div className="main">
        {loading ? (
          <Loader />
        ) : (
          currentChart.map((item, index) => (
            <div className="card" key={index}>
              <div
                className="nav-card"
                style={
                  item.login === true ?
                    { background: "var(--main-color)" }
                    : {background: "var(--block-card-color)"}
                }
              >
                <div className="infors">
                  <div className="info">
                    <img src="/images/icon.png" alt="fullScreenIcon" />
                    <big>BMX</big>
                    <p>BitMart Token</p>
                  </div>
                  <div className="salary">
                    <i>$0,2648</i>
                    <i
                      style={
                        item.salarys === "-"
                          ? { color: "var(--card-other-text)" }
                          : { color: "var(--salary-plus)" }
                      }
                    >
                      {item.salarys}1,19%
                    </i>
                  </div>
                </div>
                  <Link
                   className='navCardLink'
                    to="/chart"
                    style={
                      item.login === false
                        ? { pointerEvents: "none", cursor: "default" }
                        : { pointerEvents: "auto", cursor: "pointer" }
                    }
                  >
                    <LuScanSearch className='scanIcon' />
                  </Link>
              </div>
              <div className="image">
                <div
                  className="dont-show"
                  style={
                    item.login === false
                      ? { display: "flex", cursor: "default" }
                      : { display: "none", pointerEvents: "auto" }
                  }
                >
                  <button onClick={() => setIsAlert(!isAlert)}>
                    Qo’lga kiritish <BiLockOpen />
                  </button>
                </div>
                {
                  item.login === true ? 
                  <Chart isCard={isCard} setIsCard={setIsCard} />
                  : <img src="/images/chartimg.jpg" alt="" />
                }
                {
                  item.openfor === "basic" && isLogined === true ?
                  item.login = true : ""
                }
              </div>
              <div className="texx">
                <p>Aniqlandi: {item.searched} oldin</p>
              </div>
            </div>
          ))
        )}
      </div>
      {loading ? "" :
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
            nextPgae();
            handleScroll();
          }}
          disabled={currentPage === totalPages}
        >
          <GrFormNext />
        </button>
      </div>
  }
    </div>
  );
};

export default Main;
