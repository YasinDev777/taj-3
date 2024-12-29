
import React, { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { LuFilterX } from "react-icons/lu";
import { RxVideo } from "react-icons/rx";
import Alert from "./Alert";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FaLock } from "react-icons/fa6";


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
    setTimeFrameId
}) => {
    const [forFilterData, setForFilterData] = useState([])
    const [forTimeData, setForTimeData] = useState([])
    const [forFilterTimeData, setFilterTimeData] = useState([])

    useEffect(() => {
        const fetchs = async () => {
            try {
                const screeningTypes = collection(db, "screening_type")
                const screeningTypesGet = await getDocs(screeningTypes)

                const screeningTypesValue = collection(db, "screening_type_value")
                const screeningTypesValueGet = await getDocs(screeningTypesValue)

                // const analysis = collection(db, "analysis")
                // const analysisGet = await getDocs(analysis)

                const timeFrameData = collection(db, "timeframe")
                const timeFrameDataGet = await getDocs(timeFrameData)

                const screeningTypesValueGetMain = []
                screeningTypesValueGet.forEach((docs) => {
                    const data = docs.data()
                    screeningTypesValueGetMain.push(data)
                })

                const screeningTypesGetMain = []
                screeningTypesGet.forEach((docs) => {
                    const data = docs.data()
                    let addScreenTypeAndValue = screeningTypesValueGetMain && screeningTypesValueGetMain
                        .filter(item => item.screening_type_id === data.type_id)
                    screeningTypesGetMain.push({ data, addScreenTypeAndValue, })
                    setForFilterData(screeningTypesGetMain)
                })

                const timeframeGetMain = []
                timeFrameDataGet.forEach((docs) =>{
                    const data = docs.data()
                    timeframeGetMain.push(data)
                    forFilterTimeData.push(data)
                })

            }
            catch (error) {
                console.log(error);
            }
        }

        fetchs()
    }, [])

    const [open, setOpen] = useState(false)
    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [open3, setOpen3] = useState(false)

      const [selectedPreset, setSelectedPreset] = useState("Type");
      const [selectedTicker, setSelectedTicker] = useState("Type");
      const [selectedTime, setSelectedTime] = useState("All");
    const gridOptions = [6, 12, 24]

    useEffect(() => {
        // Фильтрация на основе selectedPreset
        
            const foundPresetData = forFilterData.find((item) => item.data.name === selectedPreset);
            if (foundPresetData) {
                setSelectValues(foundPresetData.data.type_id);
                
            } else {
                setSelectValues(null);
            }        
    
        const foundTimeData = forTimeData.find((item) => item.addAnalsisAndTimeframe.name === selectedTime);
        if (foundTimeData) {
            const foundTypeIdTime = foundTimeData.addAnalsisAndTimeframe.id;
            // Включаем обновление для времени
            setFoundTimeId(foundTypeIdTime); 
        } else {
            setFoundTimeId(null); // Сбрасываем значение, если ничего не найдено
        }
    }, [selectedPreset, selectedTime, forFilterData, forTimeData]); // Убедись, что зависимости указаны корректно
    
    

    const handleToDefoult = () =>{
        setOpen(false)
        setOpen1(false)
        setOpen2(false)
        setOpen3(false)
        setSelectedPreset("All")
        setSelectedTicker("All")
        setSelectedTime("All")
        setSelectValues(null)
        setScreeningTypeValueId(null)
        setTimeFrameId(null)

    }
    return (
        <>
            <Alert
                alertShown={alertShown}
                isLogedIn={isLogedIn}
                isUser={isUser}
                setAlertShown={setAlertShown}
                setIsLogedIn={setIsLogedIn}
            />
            <div className="nav-bar">
                <div className="texsss">
                    <div className="tex">
                        <h1>Texnik analizlar</h1>
                        <p>Chart patterns</p>
                    </div>
                    <button
                        className="video-btn2"
                        onClick={() => setIsVideo(!isVideo)}
                        style={isVideo === true ? { display: "none" } : { display: "flex" }}
                    >
                        <RxVideo /> Foydalanish videosi
                    </button>
                </div>
                <nav>
                    <div className="fixed-div">
                        <div className="options-div">

                            <div className="main-select">
                                <span className="name">Analayze</span>
                                <div className="option">
                                    <div className="selected-option select-one" onClick={() => { 
                                        setOpen(!open);
                                        setOpen1(open1 === true ? false : false);
                                        setOpen2(open2 === true ? false : false);
                                        setOpen3(open3 === true ? false : false) 
                                        }}
                                        >
                                        <span>{selectedPreset}</span>
                                        <FiChevronDown />
                                    </div>
                                    <div className="select-options" style={open === false ? { display: "none" } : { display: "flex" }}>
                                    <div className="opt" onClick={() => { setOpen(!open); setSelectedPreset("All"); setSelectValues(null); setSelectedTicker("All") }}>
                                        <span>All</span>
                                    </div>
                                        {forFilterData && forFilterData.map((item, index) =>
                                            <div key={index} className={`opt ${item.data.is_locked === true ? "opt-lock" : ""} `} onClick={() => { setOpen(!open); setSelectedPreset(item.data.name); setSelectValues(item.data.type_id); setSelectedTicker("All") }}>
                                                <span>
                                                    {item.data.name}
                                                </span>
                                                {item.data.is_locked === true ? <FaLock /> : null}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="main-select">
                                <span className="name">{selectedPreset}</span>
                                <div className="option">
                                    <div className="selected-option select-two" 
                                    onClick={() => { 
                                        setOpen1(!open1); 
                                        setOpen(open === true ? false : false); 
                                        setOpen2(setOpen2 === true ? false : false); 
                                        setOpen3(setOpen3 === true ? false : false) 
                                        }}
                                    >
                                        <span>{selectedTicker}</span>
                                        <FiChevronDown />
                                    </div>
                                    <div className="select-options" style={open1 === false ? { display: "none" } : { display: "flex" }}>
                                    <div className="opt" onClick={() => { setOpen1(!open1); setSelectedTicker("All");setScreeningTypeValueId(null) }}>
                                        <span>All</span>   
                                    </div>
                                        {forFilterData && forFilterData.map((item) =>
                                            item.addScreenTypeAndValue.filter(item => item.screening_type_id === selectValues).map((item, idx) =>
                                                <div key={`${item.name}-${idx}`} className={`opt ${item.is_locked === true ? "opt-lock" : ""}`} onClick={() => { setOpen1(!open1); setSelectedTicker(item.name); setScreeningTypeValueId(item.value_id) }}>
                                                <span>
                                                    {item.name}
                                                </span>
                                                {item.is_locked === true ? <FaLock /> : null}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="main-select">
                                <span className="name">Grid</span>
                                <div className="option">
                                    <div className="selected-option select-three" 
                                    onClick={() => { 
                                        setOpen2(!open2);
                                        setOpen(open === true ? false : false); 
                                        setOpen1(open1 === true ? false : false); 
                                        setOpen3(setOpen3 === true ? false : false) }} 
                                        >
                                        <span>{isGrid}</span>
                                        <FiChevronDown />
                                    </div>
                                    <div className="select-options" style={open2 === false ? {display: "none"} : {display: "flex"}}>
                                        {gridOptions.map((item, index) => (
                                           <div key={index} className="opt" onClick={() => {setOpen2(!open2); setIsGrid(item)}}>
                                            <span>{item}</span>
                                           </div> 
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="main-select">
                                <span className="name">Timeframe</span>
                                <div className="option">
                                    <div className="selected-option select-four" 
                                    onClick={() => {
                                        setOpen3(!open3);
                                        setOpen(open === true ? false : false);
                                        setOpen1(open1 === true ? false : false)
                                        setOpen2(open2 === true ? false : false)
                                    }}>
                                        <span>{selectedTime}</span>
                                        <FiChevronDown />
                                    </div>
                                    <div className="select-options" style={open3 ===false ? {display: "none"} : {display: "flex"}}>
                                    <div className="opt" onClick={() => { setOpen3(!open3); setSelectedTime("All"); setTimeFrameId(null) }}>
                                        <span>All</span>   
                                    </div>
                                        {forFilterTimeData.map((item, index) =>
                                            <div key={`${item.name}-${index}`} className="opt" onClick={() => {setOpen3(!open3); setSelectedTime(item.name); setTimeFrameId(item.timeframe_id)}}>
                                                <span>{item.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <LuFilterX className="filter-svg" onClick={handleToDefoult} />
                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default Filter