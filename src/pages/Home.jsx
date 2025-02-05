import React, { useEffect, useState } from 'react'
import Main from '../components/Main'
import Filter from '../components/Filter'
import Navbar from '../components/Navbar';
const Home = ({ analysis, mains ,setAlertShown,setAnalysis, setLoading ,isUser ,alertShown,forFilterTimeData,setIsLogedIn,isAlert,setIsAlert ,filterLimit,loading, isLogedIn }) => {
  
  
    const [selectValues, setSelectValues] = useState(null);
    const [selectValuesId, setSelectValuesId] = useState("");
    const [screeningTypeValueId, setScreeningTypeValueId] = useState("");
    const [timeFrameId, setTimeFrameId] = useState("");
    const [foundTimeId, setFoundTimeId] = useState('');
    const [isGrid, setIsGrid] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [isCard] = useState(false);
    const [activeCardFilter] = useState([])

    useEffect(() => {
        const main = [...mains];
        if (selectValuesId || selectValuesId === null || screeningTypeValueId || timeFrameId || timeFrameId === null) {

            const selectFilter = () => {
                setCurrentPage(1);
                const filtered = main.filter((item) => {
                    const isTypeMatch = !selectValuesId || item.screening_type_id === selectValuesId;
                    const isValueMatch = !screeningTypeValueId || item.screening_type_value_id === screeningTypeValueId;
                    const forTimeFrameId = !timeFrameId || item.timeframe_id === timeFrameId;
                    return isTypeMatch && isValueMatch && forTimeFrameId;
                });
                setLoading(true); // Загрузкани бошлаш
                setTimeout(() => {
                    setLoading(false); // Загрузкани тугатиш
                }, 1500); // 1 секунд кутиш
                setAnalysis(filtered);
            };
            selectFilter();
        }

    }, [selectValuesId, screeningTypeValueId, timeFrameId]);

    const [selectedPreset, setSelectedPreset] = useState(selectValues || 'Type');
    const [selectedTicker, setSelectedTicker] = useState(screeningTypeValueId || 'Type');
    const [selectedTime, setSelectedTime] = useState(timeFrameId || 'All');
    return (
        <div>
            <Navbar setIsAlert={setIsAlert} isAlert={isAlert} isUser={isUser} isLogedIn={isLogedIn} />
            <Filter
                setSelectedPreset={setSelectedPreset}
                selectedPreset={selectedPreset}
                selectedTicker={selectedTicker}
                setSelectedTicker={setSelectedTicker}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                setAlertShown={setAlertShown}
                alertShown={alertShown}
                setIsGrid={setIsGrid}
                isGrid={isGrid}
                setSelectValues={setSelectValues}
                selectValues={selectValues}
                foundTimeId={foundTimeId}
                setFoundTimeId={setFoundTimeId}
                selectValuesId={selectValuesId}
                setSelectValuesId={setSelectValuesId}
                screeningTypeValueId={screeningTypeValueId}
                setScreeningTypeValueId={setScreeningTypeValueId}
                setTimeFrameId={setTimeFrameId}
                timeFrameId={timeFrameId}
                isUser={isUser}
                setCurrentPage={setCurrentPage}
                forFilterTimeData={forFilterTimeData}
                setIsLogedIn={setIsLogedIn}
            />
            <Main
                isCard={isCard}
                // setIsCard={setIsCard}
                isGrid={isGrid}
                isAlert={isAlert}
                setIsAlert={setIsAlert}
                isLogedIn={isLogedIn}
                filterLimit={filterLimit}
                // pointsState={pointsState}
                isUser={isUser}
                analysis={analysis}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                // selectedPreset={selectedPreset}
                // selectedTicker={selectedTicker}
                // selectedTime={selectedTime}
                loading={loading}
                // setLoading={setLoading}
                // forFilterTimeData={forFilterTimeData}
                activeCardFilter={activeCardFilter}
            />
        </div>
    )
}

export default Home