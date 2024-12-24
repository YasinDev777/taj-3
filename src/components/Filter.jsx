import { PiHeadsetBold } from "react-icons/pi";
import { FiArrowRightCircle } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { LuFilterX } from "react-icons/lu";
import { Link } from "react-router-dom";
import { RxVideo } from "react-icons/rx";
import Alert from "./Alert";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FaLock } from "react-icons/fa6";

const CustomSelect = ({
    options,
    selectedValue,
    onChange,
    label,
    openSelect,
    setOpenSelect,
    selectedPreset,
    id,
}) => {
    const [fireData, setFireData] = useState([]);
    const [selectedScreeningType, setSelectedScreeningType] = useState(null);
    const [typeValue, setTypeValue] = useState([]);
    const [newData, setNewData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const allCollections = ["screening_type", "screening_type_value"];
                // const fetchedData = [];

                // for (const collectionName of allCollections) {
                //   const collectionRef = collection(db, collectionName);
                //   const querySnapshot = await getDocs(collectionRef);

                //   const collectionData = [];
                //   for (const doc of querySnapshot.docs) {
                //     const parentData = {
                //       id: doc.id,
                //       name: doc.data().name || collectionName,
                //       isLocked: doc.data().is_locked,
                //       screening_type_id: doc.data().value_id,
                //     };

                //     try {
                //       const subCollectionRef = collection(doc.ref, "screening_type");
                //       const subCollectionSnapshot = await getDocs(subCollectionRef);

                //       const subData = subCollectionSnapshot.docs.map((subDoc) => ({
                //         id: subDoc.id,
                //         name: subDoc.data().name,
                //         isLocked: subDoc.data().is_locked || parentData.isLocked,
                //         screening_type_id: subDoc.data().type_id,
                //       }));

                //       if (id === "screening_type" && selectedValue === undefined && subData.length > 0) {
                //         parentData.name = subData[0].name;
                //       } else if (id === "screening_type" && subData.some(sub => sub.id === selectedValue)) {
                //         parentData.name = subData.find(sub => sub.type_id === selectedValue).name;
                //       }

                //       parentData.subCollection = subData;
                //     } catch (error) {
                //       console.warn(`Подколлекция отсутствует для ${doc.id}`);
                //     }
                //     collectionData.push(parentData);
                //   }

                //   fetchedData.push({
                //     collectionName,
                //     data: collectionData,
                //   });
                // }

                // setFireData(fetchedData);

                const screeningTypes = collection(db, "screening_type")
                const screeningTypesGet = await getDocs(screeningTypes)


                const screeningTypesValue = collection(db, "screening_type_value")
                const screeningTypesValueGet = await getDocs(screeningTypesValue)


                screeningTypesGet.forEach((docs) => {
                    const data = docs.data()
                    console.log(data);

                })



            } catch (error) {
                console.error("Ошибка при загрузке секций:", error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        const fetchAllNames = async () => {
            try {
                const collectionRef = collection(db, "screening_type");
                const querySnapshot = await getDocs(collectionRef);
                const namesArray = [];

                // Перебираем все документы в коллекции
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    namesArray.push(data);  // Добавляем каждое имя в массив
                });

                setTypeValue(namesArray);

            } catch (error) {
                console.error("Ошибка при загрузке имен:", error);
            }
        };

        fetchAllNames();
    }, []);



    const isOpen = openSelect === id;

    const handleSelect = (value) => {
        onChange(value);
        setOpenSelect(null);

        if (id === "preset") {
            const foundItem = typeValue.find((item) => item.name === value);

            if (foundItem) {
                const foundTypeId = foundItem.type_id;
                if (newData !== foundTypeId) {
                    setNewData(foundTypeId);
                }
            } else {
                console.warn("Имя не найдено в Firebase:", value);
            }
        }
    };



    const toggleDropdown = () => {
        setOpenSelect(isOpen ? null : id);
    };

    const getOptionsForSelect = () => {
        switch (id) {
            case "preset":
                const presetData = fireData.find((d) => d.collectionName === "screening_type")?.data;
                return presetData || [];
            case "ticker":
                const screeningTypeValue = fireData.find((d) => d.collectionName === "screening_type_value")?.data || [];
                return screeningTypeValue.filter(item => !selectedScreeningType || item.screening_type_id === selectedScreeningType);
            default:
                return [];
        }
    };


    const selectOptions = getOptionsForSelect();

    return (
        <div className="custom-select">
            {label && <span className="custom-select-label">{label}</span>}
            <div className="custom-select-trigger" onClick={toggleDropdown}>
                <span>{selectedValue}</span>
                <FiChevronDown className="dropdown-icon" />
            </div>
            {isOpen && (
                <div className="custom-options">
                    {selectOptions && selectOptions.map((data, index) => (
                        id !== "preset" && newData === data.screening_type_id ? (
                            <div
                                key={index}
                                className={`custom-option ${data.isLocked ? "disabled" : ""}`}
                                onClick={() => !data.isLocked && handleSelect(data.name)}
                            >
                                {data.name}
                                {/* {console.log("%cNatija:", "color: #36a398", newData)} */}
                                {data.isLocked ? <FaLock /> : ""}
                            </div>
                        ) : id === "preset" ? (
                            <div
                                key={index}
                                className={`custom-option ${data.isLocked ? "disabled" : ""}`}
                                onClick={() => !data.isLocked && handleSelect(data.name)}
                            >
                                {data.name}
                            </div>
                        ) : null
                    ))}

                </div>
            )}
        </div>
    );
};

// const Navbar = ({
//   setSelectedPreset,
//   setSelectedTicker,
//   selectedPreset,
//   selectedTicker,
//   isGrid,
//   setIsGrid,
//   selectedTime,
//   setSelectedTime,
//   isVideo,
//   setIsVideo,
//   setIsAlert,
//   isUser,
//   isLogined,
//   alertShown,
//   setAlertShown,
//   setIsLogined,
// }) => {

//   const [presetOptions, setPresetOptions] = useState([]);
//   const [tickerOptions, setTickerOptions] = useState([])
//   const [timeOptions, setTimeOptions] = useState([])
//   const [filteredTickerOptions, setFilteredTickerOptions] = useState([]);

//   useEffect(() => {
//     const fetchPresets = async () => {
//       try {
//         const presetsCollection = collection(db, "screening_type");
//         const querySnapshot = await getDocs(presetsCollection);

//         const options = [];
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           options.push({ value: data.name, label: data.name, isLocked: data.is_locked, id: data.id });
//         });

//         setPresetOptions(options);
//       } catch (error) {
//         console.error("Ошибка при загрузке опций:", error);
//       }
//     };

//     fetchPresets()

//     const fetchTicker = async () => {
//       try {
//         const presetsCollection = collection(db, "screening_type_value");
//         const querySnapshot = await getDocs(presetsCollection);

//         const options = [];
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           options.push({
//             value: data.name,
//             label: data.name,
//             isLocked: data.is_locked,
//             parentId: data.id, // Убедись, что parentId существует в данных
//           });
//         });

//         setTickerOptions(options);
//       } catch (error) {
//         console.error("Ошибка при загрузке опций:", error);
//       }
//     };


//     fetchTicker();

//     const fetchTime = async () => {
//       try {
//         const presetsCollection = collection(db, "timeframe");
//         const querySnapshot = await getDocs(presetsCollection);

//         const options = [];
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           options.push({
//             value: data.name,
//             label: data.name,
//             isLocked: true,
//             screening_type_id: "none"
//           });
//         });

//         setTimeOptions(options);
//       } catch (error) {
//         console.error("Ошибка при загрузке опций:", error);
//       }
//     };

//     fetchTime();

//   }, [isLogined])

//   const gridOptions = [
//     { value: "6", label: "6", isLocked: false, screening_type_id: "none" },
//     { value: "12", label: "12", isLocked: false, screening_type_id: "none" },
//     { value: "24", label: "24", isLocked: false, screening_type_id: "none" },
//   ];

//   const [openSelect, setOpenSelect] = useState(null);
//   const handleChange = () => {
//     setIsGrid(6);
//     setOpenSelect(null)
// };

//   const handlePresetChange = (selectedValue) => {
//     setSelectedPreset(selectedValue);
//     const selectedType = presetOptions.find((option) => option.value === selectedValue);

//     if (selectedType) {
//       const filteredOptions = tickerOptions.filter(
//         (ticker) => ticker.parentId === selectedType.id // Убедись, что в данных есть `parentId`
//       );
//       setFilteredTickerOptions(filteredOptions);
//     } else {
//       setFilteredTickerOptions([]);
//     }
//   };


//   return (
//     <>
//       <div className="nav">
//         <div className="logo-name">
//           <Link to="">AHSAN LABS</Link>
//         </div>
//         <div className="options">
//           <button
//             className="video-btn"
//             onClick={() => setIsVideo(!isVideo)}
//             style={isVideo === true ? { display: "none" } : { display: "flex" }}
//           >
//             <RxVideo /> Foydalanish videosi
//           </button>
//           <Link to="https://t.me/ahsanlabs_admin" target="blank">
//             <PiHeadsetBold />
//           </Link>
//           {
//             isLogined === false ?
//               <Link to="/login" onClick={() => setIsVideo(false)}>
//                 <button onClick={() => setIsAlert(false)}>
//                   Kirish <FiArrowRightCircle />
//                 </button>
//               </Link>
//               :
//               <h3>{isUser}</h3>
//           }
//         </div>
//       </div>
//       <Alert
//         alertShown={alertShown}
//         isLogined={isLogined}
//         isUser={isUser}
//         setAlertShown={setAlertShown}
//         setIsLogined={setIsLogined}
//       />
//       <div className="nav-bar">
//         <div className="texsss">
//           <div className="tex">
//             <h1>Texnik analizlar</h1>
//             <p>Chart patterns</p>
//           </div>
//           <button
//             className="video-btn2"
//             onClick={() => setIsVideo(!isVideo)}
//             style={isVideo === true ? { display: "none" } : { display: "flex" }}
//           >
//             <RxVideo /> Foydalanish videosi
//           </button>
//         </div>
//         <nav>
//           <div className="fixed-div">
//     <div className="options-div">
//       <div className="div">
//         <CustomSelect
//           options={presetOptions}
//           selectedValue={selectedPreset}
//           onChange={handlePresetChange}
//           label="Anlyze"
//           openSelect={openSelect}
//           setOpenSelect={setOpenSelect}
//           id="preset"
//           isLogined={isLogined}
//         />
//       </div>
//       <div className="div">
//         <span className="analyze-span">
//           {selectedPreset}
//         </span>
//         <CustomSelect
//           options={filteredTickerOptions}
//           selectedValue={selectedTicker}
//           onChange={setSelectedTicker}
//           openSelect={openSelect}
//           setOpenSelect={setOpenSelect}
//           id="ticker"
//           isLogined={isLogined}
//           selectedPreset={selectedPreset}
//         />

//       </div>
//       <div className="div">
//         <span>grid</span>
//         <CustomSelect
//           options={gridOptions}
//           selectedValue={isGrid}
//           onChange={setIsGrid}
//           openSelect={openSelect}
//           setOpenSelect={setOpenSelect}
//           id="grid"
//           selectedPreset={selectedPreset}
//         />
//       </div>
//       <div className="div">
//         <span>Timeframe</span>
//         <CustomSelect
//           options={timeOptions}
//           selectedValue={selectedTime}
//           onChange={setSelectedTime}
//           openSelect={openSelect}
//           setOpenSelect={setOpenSelect}
//           id="timeframe"
//           selectedPreset={selectedPreset}
//         />
//       </div>
//       <LuFilterX className="filter-svg" onClick={handleChange} />
//     </div>
//   </div>
//         </nav>
//       </div>
//     </>
//   );
// };

// export default Navbar;

const Filter = (
    setSelectedPreset,
    setSelectedTicker,
    selectedTicker,
    isGrid,
    setIsGrid,
    selectedTime,
    setSelectedTime,
    selectedPreset,
    setIsVideo,
    isVideo,
    isUser,
    setIsAlert,
    alertShown,
    isLogined,
    setIsLogined,
    setAlertShown,
) => {

      const [openSelect, setOpenSelect] = useState(null);

    const gridOptions = [
        { value: "6", label: "6", isLocked: false, screening_type_id: "none" },
        { value: "12", label: "12", isLocked: false, screening_type_id: "none" },
        { value: "24", label: "24", isLocked: false, screening_type_id: "none" },
    ];

    const handleChange = () => {
        setIsGrid(6);
        setOpenSelect(null)
    };

    return (
        <>
            <div className="options-div">
                <div className="div">
                    <CustomSelect
                        // options={}
                        selectedValue={selectedPreset}
                        // onChange={handlePresetChange}
                        label="Anlyze"
                        openSelect={openSelect}
                        setOpenSelect={setOpenSelect}
                        id="preset"
                        isLogined={isLogined}
                    />
                </div>
                <div className="div">
                    <span className="analyze-span">
                        {selectedPreset}
                    </span>
                    <CustomSelect
                        // options={filteredTickerOptions}
                        selectedValue={selectedTicker}
                        onChange={setSelectedTicker}
                        openSelect={openSelect}
                        setOpenSelect={setOpenSelect}
                        id="ticker"
                        isLogined={isLogined}
                        selectedPreset={selectedPreset}
                    />

                </div>
                <div className="div">
                    <span>grid</span>
                    <CustomSelect
                        options={gridOptions}
                        selectedValue={isGrid}
                        onChange={setIsGrid}
                        openSelect={openSelect}
                        setOpenSelect={setOpenSelect}
                        id="grid"
                        selectedPreset={selectedPreset}
                    />
                </div>
                <div className="div">
                    <span>Timeframe</span>
                    <CustomSelect
                        // options={timeOptions}
                        selectedValue={selectedTime}
                        onChange={setSelectedTime}
                        openSelect={openSelect}
                        setOpenSelect={setOpenSelect}
                        id="timeframe"
                        selectedPreset={selectedPreset}
                    />
                </div>
                <LuFilterX className="filter-svg" onClick={handleChange} />
            </div>
        </>
    )
}

export default Filter