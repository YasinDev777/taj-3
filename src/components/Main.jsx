import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import { PiEyeFill } from "react-icons/pi";
import { BsQuestionCircleFill } from "react-icons/bs";
import { MdFullscreen } from "react-icons/md";
import { FaAnglesDown } from "react-icons/fa6";
import Chart from '../components/LineChart';

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
                <img src="/images/icon.png" alt="" />
                <big>BMX</big>
                <p>BitMart Token</p>
                <div className="salary">
                  <i>$0,2648</i>
                  <i>-1,19%</i>
                </div>
                <div className="icons">
                  <FaStar size={17} />
                  <Link to="/chart">
                    <PiEyeFill size={17} />
                  </Link>
                  <BsQuestionCircleFill size={17} />
                  <MdFullscreen size={17} />
                </div>
              </div>
              <div className="nav2">
                <div className="method1 method">Descending Triangle</div>
                <div className="method2 method">
                  Bearish <FaAnglesDown />
                </div>
                <p>
                  Profit potential(<span>Sell</span>) +3.42%
                </p>
              </div>
              <div className="text">
                Descending Triangle has broken through the support line at Dec
                3, 0:00 UTC. Possible bearish price movement forecast for the
                next 16 days towards 0.2568.
              </div>
              <div className="image">
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
