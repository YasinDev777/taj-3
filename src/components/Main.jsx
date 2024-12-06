import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Chart from '../components/LineChart';
import { BiLockOpen } from "react-icons/bi";
const Main = ({ filtered, isCard, setIsCard, isGrid }) => {
  const [Charts, setCharts] = useState(filtered);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ChartsPerPage, setChartPerPage] = useState(isGrid);

  useEffect(() => {
    setChartPerPage(Number(isGrid)); // Обновляем количество элементов при изменении isGrid
  }, [isGrid]);

  const lastChartIndex = currentPage * ChartsPerPage;
  const firstChartIndex = lastChartIndex - ChartsPerPage;
  const currentChart = Charts.slice(firstChartIndex, lastChartIndex);

  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(Charts.length / ChartsPerPage); i++) {
    pageNumber.push(i);
  }

  const paginate = (number) => setCurrentPage(number);

  return (
    <div className="main1">
      <div className="main">
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          currentChart.map((item, index) => (
            <div className="card" key={index}>
              <div className="nav-card">
                <div className="infors">
                  <div className="info">
                    <img src="/images/icon.png" alt="" />
                    <big>BMX</big>
                    <p>BitMart Token</p>
                  </div>
                  <div className="salary">
                    <i>$0,2648</i>
                    <i>-1,19%</i>
                  </div>
                </div>
                <div className="icons">
                  <Link to="/chart" style={item.login === false ? {pointerEvents: "none", cursor: "default"} : {pointerEvents: "auto", cursor: "pointer"}}>
                    <img src="/images/scan-search.svg" alt="" className='img-scan' />
                  </Link>
                </div>
              </div>
              <div className="image">
                <div className="dont-show" style={item.login === false ? {display: "flex", cursor: "default"} : {display: "none", pointerEvents: "auto"}}>
                  <button>Qo’lga kiritish <BiLockOpen/></button>
                </div>
                <Chart isCard={isCard} setIsCard={setIsCard} />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="btns">
        {pageNumber.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={number === currentPage ? 'active' : ''}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Main;
