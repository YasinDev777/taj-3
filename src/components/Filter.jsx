
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
    selectedPreset,
    selectedTicker,
    setSelectedPreset,
    setSelectedTicker,
    setIsGrid,
    isGrid,
    setSelectedTime,
    selectedTime,
    setSelectedTime_id,
    selectedTime_id
}) => {
    const [forFilterData, setForFilterData] = useState([])
    const [forTimeData, setForTimeData] = useState([])

    useEffect(() => {
        const fetchs = async () => {
            try {
                const screeningTypes = collection(db, "screening_type")
                const screeningTypesGet = await getDocs(screeningTypes)


                const screeningTypesValue = collection(db, "screening_type_value")
                const screeningTypesValueGet = await getDocs(screeningTypesValue)
                const screeningTypesValueGetMain = []
                screeningTypesValueGet.forEach((docs) => {
                    const data = docs.data()
                    screeningTypesValueGetMain.push(data)
                })

                const screeningTypesGetMain = []
                screeningTypesGet.forEach((docs) => {
                    const data = docs.data()

                    let addScreenTypeAndValue = screeningTypesValueGetMain && screeningTypesValueGetMain
                        .filter(item => item.value_id === data.type_id)
                    screeningTypesGetMain.push({ data, addScreenTypeAndValue })
                    setForFilterData(screeningTypesGetMain)
                })

                const Timeframe = []
                const timeFrameData = collection(db, "timeframe")
                const timeFrameDataGet = await getDocs(timeFrameData)
                timeFrameDataGet.forEach((docs) =>{
                    const data = docs.data()
                    Timeframe.push(data)
                })

                console.log(forFilterData);
            }
            catch (error) {
                console.log(error);
            }
        }

        fetchs()
    }, [])



    const [selectValues, setSelectValues] = useState("")
    const [open, setOpen] = useState(false)
    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [open3, setOpen3] = useState(false)
    const gridOptions = [6, 12, 24]

    useEffect(() => {
        const foundData = forFilterData.find((item) => item.data.name === selectedPreset)
        const foundDataTime = forTimeData.find((item) => item.name === selectedTime)
        if (foundData) {
            const foundTypeId = foundData.data.type_id;
            setSelectValues(foundTypeId)
        }

        if (foundDataTime) {
            setSelectedTime_id(foundDataTime.id)
            console.log(selectedTime_id);
        }
        
    }, [selectedPreset, selectedTime])

    const handleToDefoult = () =>{
        setOpen(false)
        setOpen1(false)
        setOpen2(false)
        setOpen3(false)
        setSelectedPreset("All")
        setSelectedTicker("All")
        setSelectedTime("All")
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
                                    <div className="opt" onClick={() => { setOpen(!open); setSelectedPreset("All"); setSelectValues(""); setSelectedTicker("All") }}>
                                        <span>All</span>   
                                    </div>
                                        {forFilterData && forFilterData.map(item =>
                                            <div className={`opt ${item.data.is_locked === true ? "opt-lock" : ""} `} onClick={() => { setOpen(!open); setSelectedPreset(item.data.name); setSelectValues(item.data.type_id); setSelectedTicker("All") }}>
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
                                    <div className="opt" onClick={() => { setOpen1(!open1); setSelectedTicker("All") }}>
                                        <span>All</span>   
                                    </div>
                                        {forFilterData && forFilterData.map(item =>
                                            item.addScreenTypeAndValue.filter(item => item.value_id === selectValues).map(item =>
                                                <div className={`opt ${item.is_locked === true ? "opt-lock" : ""}`} onClick={() => { setOpen1(!open1); setSelectedTicker(item.name) }}>
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
                                        {gridOptions.map(item => (
                                           <div className="opt" onClick={() => {setOpen2(!open2); setIsGrid(item)}}>
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
                                    <div className="opt" onClick={() => { setOpen3(!open3); setSelectedTime("All"); }}>
                                        <span>All</span>   
                                    </div>
                                        {forTimeData.map(item => (
                                            <div className="opt" onClick={() => {setOpen3(!open3); setSelectedTime(item.name)}}>
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
    )
}

export default Filter