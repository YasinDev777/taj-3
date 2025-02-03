/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { LuFilterX } from 'react-icons/lu';
import { RxVideo } from 'react-icons/rx';
import Alert from './Alert';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { FaLock } from 'react-icons/fa6';
import { FilterAnalaysisAnalytics, FilterAnalaysisTypeAnalytics, FilterClearAnalytics, FilterGridAnalytics, FilterTimeFrameAnalytics, VideoAnalytics } from '../analytics/Analytics';
const Filter = ({
  setIsVideo,
  isVideo,
  isUser,
  alertShown,
  isLogedIn,
  setIsLogedIn,
  setAlertShown,
  setIsGrid,
  isGrid,
  selectValues,
  setSelectValues,
  setFoundTimeId,
  setScreeningTypeValueId,
  setTimeFrameId,
  setSelectedPreset,
  selectedPreset,
  selectedTicker,
  setSelectedTicker,
  selectedTime,
  setSelectedTime,
  setCurrentPage,
  setSelectValuesId,
  forFilterTimeData
}) => {
  const [forFilterData, setForFilterData] = useState([]);
  const [forTimeData] = useState([]);
 
  useEffect(() => {
    const fetchs = async () => {
      try {
        const screeningTypes = collection(db, 'screening_type');
        const screeningTypesGet = await getDocs(screeningTypes);

        const screeningTypesValue = collection(db, 'screening_type_value');
        const screeningTypesValueGet = await getDocs(screeningTypesValue);
       
        const screeningTypesValueGetMain = [];
        screeningTypesValueGet.forEach((docs) => {
          const data = docs.data();
          screeningTypesValueGetMain.push(data);
        });

        const screeningTypesGetMain = [];
        screeningTypesGet.forEach((docs) => {
          const data = docs.data();
          let addScreenTypeAndValue = screeningTypesValueGetMain && screeningTypesValueGetMain.filter((item) => item.screening_type_id === data.type_id);
          screeningTypesGetMain.push({ data, addScreenTypeAndValue });
          setForFilterData(screeningTypesGetMain);
        });

        // const timeframeGetMain = [];
       
      } catch (error) {
        console.log(error);
      }
    };
    fetchs();
  }, []);

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  const gridOptions = [6, 12, 24];

  useEffect(() => {
    const foundPresetData = forFilterData.find((item) => item.data.name === selectedPreset);
    if (foundPresetData) {
      setSelectValues(foundPresetData.data.type_id);
    } else {
      setSelectValues(null);
    }

    const foundTimeData = forTimeData.find((item) => item.addAnalsisAndTimeframe.name === selectedTime);
    if (foundTimeData) {
      const foundTypeIdTime = foundTimeData.addAnalsisAndTimeframe.id;
      setFoundTimeId(foundTypeIdTime);
    } else {
      setFoundTimeId(null);
    }
  }, [selectedPreset, selectedTime, forFilterData, forTimeData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.options-div')) {
        setOpen(false);
        setOpen1(false);
        setOpen2(false);
        setOpen3(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleToDefoult = () => {
    setOpen(false);
    setOpen1(false);
    setOpen2(false);
    setOpen3(false);
    setSelectedPreset('All');
    setSelectedTicker('All');
    setSelectedTime('All');
    setSelectValues(null);
    setScreeningTypeValueId(null);
    setSelectValuesId(null)
    setTimeFrameId(null);
    setIsGrid(6);
    FilterClearAnalytics();
  };
  return (
    <>
      <Alert alertShown={alertShown} isLogedIn={isLogedIn} isUser={isUser} setAlertShown={setAlertShown} setIsLogedIn={setIsLogedIn} />
      <div className="nav-bar">
        <div className="texsss">
          <div className="tex">
            <h1>Texnik analizlar</h1>
            <p>Chart patterns</p>
          </div>
          {/* <button
            className="video-btn2"
            onClick={() => {
              setIsVideo(!isVideo);
              VideoAnalytics('open');
            }}
            style={isVideo === true ? { display: 'none' } : { display: 'flex' }}
          >
            <RxVideo /> Foydalanish videosi
          </button> */}
        </div>
        <nav>
          <div className="fixed-div">
            <div className="options-div">
              <div className="main-select">
                <span className="name">Analaysis</span>
                <div className="option">
                  <div
                    className="selected-option select-one"
                    onClick={() => {
                      setOpen(!open);
                      setOpen1(open1 === true ? false : false);
                      setOpen2(open2 === true ? false : false);
                      setOpen3(open3 === true ? false : false);
                    }}
                  >
                    <span>{selectedPreset}</span>
                    <FiChevronDown />
                  </div>
                  <div className="select-options" style={open === false || forFilterData.some((item) => item.data.length <= 0) ? { display: 'none' } : { display: 'flex' }}>
                    <div
                      className="opt"
                      onClick={() => {
                        setOpen(!open);
                        setScreeningTypeValueId(null);
                        setSelectValuesId(null)
                        setSelectedPreset('All');
                        setSelectValues(null);
                        setSelectedTicker('All');
                        FilterAnalaysisAnalytics('All');
                      }}
                    >
                      <span>All</span>
                    </div>
                    {forFilterData &&
                      forFilterData.map((item, index) => (
                        <div
                          key={index}
                          className={`opt ${item.data.is_locked === true ? 'opt-lock' : ''} `}
                          onClick={() => {
                            setOpen(!open);
                            setSelectedPreset(item.data.name);
                            setSelectValues(item.data.type_id);
                            setSelectedTicker('All');
                            setScreeningTypeValueId(null);
                            setSelectValuesId(item.data.type_id)
                            FilterAnalaysisAnalytics(item.data.type_id);
                          }}
                        >
                          <span>{item.data.name}</span>
                          {item.data.is_locked === true ? <FaLock /> : null}
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="main-select">
                <span className="name">{selectedPreset}</span>
                <div className="option">
                  <div
                    className="selected-option select-two"
                    onClick={() => {
                      setOpen1(!open1);
                      setOpen(open === true ? false : false);
                      setOpen2(setOpen2 === true ? false : false);
                      setOpen3(setOpen3 === true ? false : false);
                    }}
                  >
                    <span>{selectedTicker}</span>
                    <FiChevronDown />
                  </div>
                  <div className="select-options" style={open1 === false || selectedPreset === 'All' || selectedPreset === 'Type' ? { display: 'none' } : { display: 'flex' }}>
                    {selectValues && (
                      <div
                        className="opt"
                        onClick={() => {
                          setOpen1(!open1);
                          setSelectedTicker('All');
                          setScreeningTypeValueId(null);
                          FilterAnalaysisTypeAnalytics(selectValues, 'All');
                        }}
                      >
                        <span>All</span>
                      </div>
                    )}
                    {forFilterData &&
                      forFilterData.map((item) =>
                        item.addScreenTypeAndValue
                          .filter((item) => item.screening_type_id === selectValues)
                          .map((item, idx) => (
                            <div
                              key={`${item.name}-${idx}`}
                              className={`opt ${item.is_locked === true ? 'opt-lock' : ''}`}
                              onClick={() => {
                                setOpen1(!open1);
                                setSelectedTicker(item.name);
                                setScreeningTypeValueId(item.value_id);
                                FilterAnalaysisTypeAnalytics(selectValues, item.value_id);
                              }}
                            >
                              <span>{item.name}</span>
                              {item.is_locked === true ? <FaLock /> : null}
                            </div>
                          )),
                      )}
                  </div>
                </div>
              </div>
              <div className="main-select">
                <span className="name">Grid</span>
                <div className="option">
                  <div
                    className="selected-option select-three"
                    onClick={() => {
                      setOpen2(!open2);
                      setOpen(open === true ? false : false);
                      setOpen1(open1 === true ? false : false);
                      setOpen3(setOpen3 === true ? false : false);
                    }}
                  >
                    <span>{isGrid}</span>
                    <FiChevronDown />
                  </div>
                  <div className="select-options" style={open2 === false ? { display: 'none' } : { display: 'flex' }}>
                    {gridOptions.map((item, index) => (
                      <div
                        key={index}
                        className="opt"
                        onClick={() => {
                          setOpen2(!open2);
                          setIsGrid(item);
                          FilterGridAnalytics(item);
                          setCurrentPage(1);
                        }}
                      >
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="main-select">
                <span className="name">Timeframe</span>
                <div className="option">
                  <div
                    className="selected-option select-four"
                    onClick={() => {
                      setOpen3(!open3);
                      setOpen(open === true ? false : false);
                      setOpen1(open1 === true ? false : false);
                      setOpen2(open2 === true ? false : false);
                    }}
                  >
                    <span>{selectedTime}</span>
                    <FiChevronDown />
                  </div>
                  <div className="select-options" style={open3 === false || forFilterTimeData.some((item) => item.length <= 0) ? { display: 'none' } : { display: 'flex' }}>
                    <div
                      className="opt"
                      onClick={() => {
                        setOpen3(!open3);
                        setSelectedTime('All');
                        setTimeFrameId(null);
                        FilterTimeFrameAnalytics('All');
                      }}
                    >
                      <span>All</span>
                    </div>
                    {forFilterTimeData.map((item, index) => (
                      <div
                        key={`${item.name}-${index}`}
                        className="opt"
                        onClick={() => {
                          setOpen3(!open3);
                          setSelectedTime(item.name);
                          setTimeFrameId(item.timeframe_id);
                          FilterTimeFrameAnalytics(item.timeframe_id);
                        }}
                      >
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <LuFilterX className="filter-svg" onClick={handleToDefoult} />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};
export default Filter;
