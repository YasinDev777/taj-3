/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { LuFilterX } from 'react-icons/lu';
import Alert from './Alert';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { FaLock } from 'react-icons/fa6';
import { useSelector, useDispatch } from 'react-redux';

import { FilterAnalaysisAnalytics, FilterAnalaysisTypeAnalytics, FilterClearAnalytics, FilterGridAnalytics, FilterTimeFrameAnalytics, VideoAnalytics } from '../analytics/Analytics';
const Filter = ({
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
  const video = useSelector((state) => state.video.video);

  const dispatch = useDispatch();

  const handleVideoChange = () => {
    dispatch({ type: 'IsVideo' });
  };
  const [forFilterData, setForFilterData] = useState([]);
  const [forTimeData] = useState([]);

  


  useEffect(() => {
    const fetchs = async () => {
      try {        
        getScreeningData()
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
      const dropdowns = document.querySelectorAll('.dropdown-content');
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target) && !event.target.closest('.dropdown-trigger')) {
          setOpen(false);
          setOpen1(false);
          setOpen2(false);
          setOpen3(false);
        }
      });
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleToDefault = () => {
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
  const firstDropDownAll = () => {
    setOpen(!open);
    setScreeningTypeValueId(null);
    setSelectValuesId(null)
    setSelectedPreset('All');
    setSelectValues(null);
    setSelectedTicker('All');
    FilterAnalaysisAnalytics('All');
  }
  return (
    <>
      <Alert alertShown={alertShown} isLogedIn={isLogedIn} isUser={isUser} setAlertShown={setAlertShown} setIsLogedIn={setIsLogedIn} />
      <div className="flex w-[98%] m-auto mt-5 bg-white justify-between items-center relative p-8 rounded-t-3xl max-lg:block max-sm:p-3">
        <div className="max-lg:w-full max-lg:flex max-lg:justify-between max-lg:items-center">
          <div>
            <h1 className="text-3xl max-xl:text-2xl max-xs:text-sm">Texnik analizlar</h1>
            <p className='text-lg'>Chart patterns</p>
          </div>
          <button
            // style={video === true ? { display: 'none' } : { display: 'flex' }}
            className="hidden max-lg:flex text-base underline"
            onClick={() => {
              handleVideoChange()
              VideoAnalytics('open');
            }}
          >
            Foydalanish videosi
          </button>
        </div>
        <div className="flex shadow-[0_0_5px_5px_#0000000D] rounded-xl w-4/5 items-center justify-between p-4 max-xl:w-full max-xl:my-4 max-xs:shadow-none max-xs:p-0 max-xs:py-1">
          <div className="flex gap-3 items-center">
            <span className="text-border max-md-plus:hidden">Analaysis</span>
            <div className="relative">
              <div
                className="dropdown-trigger flex items-center justify-between w-36 p-2 text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 max-sm:w-28"
                onClick={() => {
                  setOpen(!open);
                  setOpen1(false);
                  setOpen2(false);
                  setOpen3(false);
                }}
              >
                <span className="text-base max-sm:text-sm">{selectedPreset}</span>
                <FiChevronDown className="w-5 h-5 text-gray-400 max-sm:w-4" />
              </div>
              {open && !forFilterData.some((item) => item.data.length <= 0) && (
                <div className="dropdown-content absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  <div
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer max-sm:px-2"
                    onClick={firstDropDownAll}
                  >
                    <span>All</span>
                  </div>
                  {forFilterData &&
                    forFilterData.map((item, index) => (
                      <div
                        key={index}
                        className={`px-4 py-2 text-sm border-t-2 hover:bg-gray-100 cursor-pointer max-sm:px-2 ${item.data.is_locked ? 'text-gray-400 pointer-events-none' : 'text-gray-700'}`}
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
                        <div className="flex items-center justify-between">
                          <span>{item.data.name}</span>
                          {item.data.is_locked && <FaLock className="w-3 h-3" />}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 max-md-plus:hidden">{selectedPreset}</span>
            <div className="relative">
              <div
                className={`dropdown-trigger flex items-center justify-between w-36 p-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:border-gray-400 max-sm:w-24  ${selectValues ? "cursor-pointer" : "cursor-not-allowed"}`}
                onClick={() => {
                  setOpen1(!open1);
                  setOpen(false);
                  setOpen2(false);
                  setOpen3(false);
                }}
              >
                <span className="text-base max-sm:text-sm">{selectedTicker}</span>
                <FiChevronDown className="w-5 h-5 text-gray-400 max-sm:w-4" />
              </div>
              <div className={`dropdown-content absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg ${open1 === false || selectedPreset === 'All' || selectedPreset === 'Type' ? 'hidden' : 'block'}`}>
                {selectValues && (
                  <div
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer max-sm:px-2"
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
                          className={`px-4 py-2 text-sm border-t-2 hover:bg-gray-100 cursor-pointer max-sm:px-2 ${item.is_locked ? 'text-gray-400 pointer-events-none' : 'text-gray-700'}`}
                          onClick={() => {
                            setOpen1(!open1);
                            setSelectedTicker(item.name);
                            setScreeningTypeValueId(item.value_id);
                            FilterAnalaysisTypeAnalytics(selectValues, item.value_id);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span>{item.name}</span>
                            {item.is_locked && <FaLock className="w-3 h-3" />}
                          </div>
                        </div>
                      )),
                  )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 max-md-plus:hidden">Grid</span>
            <div className="relative">
              <div
                className="dropdown-trigger flex items-center justify-between w-20 p-2 text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 max-sm:w-12"
                onClick={() => {
                  setOpen2(!open2);
                  setOpen(false);
                  setOpen1(false);
                  setOpen3(false);
                }}
              >
                <span className="text-base max-sm:text-xs">{isGrid}</span>
                <FiChevronDown className="w-5 h-5 text-gray-400 max-sm:w-4" />
              </div>
              <div className={`dropdown-content absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg ${open2 ? 'block' : 'hidden'}`}>
                {gridOptions.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 text-sm border-t text-gray-700 hover:bg-gray-100 cursor-pointer max-sm:py-2 max-sm:px-2"
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
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 max-md-plus:hidden">Timeframe</span>
            <div className="relative">
              <div
                className="dropdown-trigger flex items-center justify-between w-20 p-2 text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 max-sm:w-12"
                onClick={() => {
                  setOpen3(!open3);
                  setOpen(false);
                  setOpen1(false);
                  setOpen2(false);
                }}
              >
                <span className="text-base max-sm:text-xs">{selectedTime}</span>
                <FiChevronDown className="w-5 h-5 text-gray-400 max-sm:w-4" />
              </div>
              <div className={`dropdown-content absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg ${open3 === false || forFilterTimeData.some((item) => item.length <= 0) ? 'hidden' : 'block'}`}>
                <div
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer max-sm:py-2 max-sm:px-1"
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
                    className="px-4 py-2 border-t text-sm text-gray-700 hover:bg-gray-100 cursor-pointer max-sm:p-2 max-sm:px-1"
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
          <LuFilterX className="text-xl hover:text-gray-600 transition-all max-sm:text-base cursor-pointer" onClick={handleToDefault} />
        </div>
      </div>
    </>
  );
};
export default Filter;
