import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Chart from '../components/LineChart';
import '../styles/App.css';
import Popup from '../components/Popup';
import Login from '../pages/Login';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { AnalysisContext } from '../context/Context';
import CryptoJS from 'crypto-js';
import { loginAnalytics, openWebsite } from '../analytics/Analytics';
import { useDispatch } from "react-redux";
import Home from './Home';
import RoadMap from './RoadMap';

const MainPage = () => {

    const [isAlert, setIsAlert] = useState(false);
    const [isUser, setIsUser] = useState('');
    const [isLogedIn, setIsLogedIn] = useState(false);
    const [filterLimit, setFilterLimit] = useState(1);
    const [alertShown, setAlertShown] = useState(false);
    const [mains, setMains] = useState([]);
    const [analysis, setAnalysis] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [forFilterTimeData] = useState([]);
    const [selectedPreset, setSelectedPreset] = useState("Type");
    const [selectedTicker, setSelectedTicker] = useState("Type");
    const [selectedTime, setSelectedTime] = useState("All");
    const encryptData = (data) => {
        return CryptoJS.AES.encrypt(JSON.stringify(data), 'your-secret-key').toString();
    };
    //////
    const dispatch = useDispatch();
    const updateData = () => {
        dispatch({
            type: "SET_DATA",
            payload: ["olma", "nok", "banan"], // Yangi data
        });
    };

    useEffect(() => {
        updateData()
    }, [])
    //////
    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const analysisFunction = async () => {
            try {
                const usersRef = collection(db, "analysis");
                const usersQuery = query(usersRef, where("inactive", "==", false)); // Faqat aktiv userlar
                const usersSnapshot = await getDocs(usersQuery); // Firestore'dan hujjatlarni olish
            
                // Timeframe data ni faqat bir marta olish
                const timeFrameData = collection(db, "timeframe");
                const timeFrameDataGet = await getDocs(timeFrameData);
                timeFrameDataGet.forEach((docs) => {
                  const data = docs.data();
                  forFilterTimeData.push(data);
                });

                // Points collection queryini oldindan yaratish
                const pointsRef = collection(db, "points");
            
                // Har bir foydalanuvchi uchun barcha operatsiyalarni parallel ravishda bajarish
                const allStatePromises = usersSnapshot.docs.map(async (doc) => {
                  const analysisId = doc.id;
                  const data = doc.data();
            
                  // Points hujjatlarini olish
                  const lineQuery = query(pointsRef, where("analysis_id", "==", analysisId));
                  const linesSnapshot = await getDocs(lineQuery);
                  const lines = linesSnapshot.docs.map((lineDoc) => lineDoc.data());
            
                  // TimeFrameNamesni olish
                  const timeFrameNames = forFilterTimeData
                    .filter((item) => item.timeframe_id === data.timeframe_id)
                    .map((item) => item.name);
            
                  return {
                    analysisId,
                    ...data,
                    timeFrameNames,
                    lines,
                  };
                });
            
                // Barcha foydalanuvchilarni bir vaqtda olish
                const allState = await Promise.all(allStatePromises);
                if (isMounted) {
                    setMains(allState.sort((a, b) => b.created_at - a.created_at));
                    setAnalysis(allState.sort((a, b) => b.created_at - a.created_at));
                }
            } catch (err) {
                setLoading(false);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1500);
            }
        };
        analysisFunction();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleLogin = async (inputValue) => {
        let foundUser = null;
        try {
            const User = localStorage.getItem('subscriptionType');
            let userForm = '';
            if (User) {
                userForm = decryptData(User);
            } else {
                userForm = inputValue;
            }
            
            const usersCollection = collection(db, 'user');
            const user_query = await query(usersCollection, where('user_id', '==', userForm));
            const querySnapshot = await getDocs(user_query);
            if (querySnapshot.empty) {
                alert("Bunday ma'lumotga ega foydalanuvchi afsuski topilmadi!");
                loginAnalytics('login', 'authentication', 'invalid');
                localStorage.clear();
                return;
            } else {
                querySnapshot.forEach((docs) => {
                    const userData = docs.data();
                    if (userData.is_blocked === true || querySnapshot.empty) {
                        alert(`Hurmatli foydalanuvchi siz bloklangansiz iltimos admin bilan bog'laning`);
                        setIsLogedIn(false)
                        loginAnalytics('login', 'authentication', 'userBlock');
                        localStorage.clear();
                        window.location.reload();
                    } else {
                        foundUser = userData;
                        setIsLogedIn(true);
                        localStorage.setItem('userName', foundUser.name);
                        localStorage.setItem('isLogedIn', 'true');
                        localStorage.setItem('subscriptionType', encryptData(foundUser.user_id));
                        if (inputValue) {
                            loginAnalytics('login', 'authentication', 'valid', docs.id);
                            window.location.reload();
                        }
                        navigate('/');
                        switch (userData.subscription_type) {
                            case 'pro':
                                setFilterLimit(Infinity);
                                break;
                            case 'basic':
                                setFilterLimit(5);
                                break;
                            case 'free':
                                setFilterLimit(3);
                                break;
                            default:
                                setFilterLimit(1);
                        }
                    }
                });
            }

        } catch (error) {
            console.error();
        }
    };

    const decryptData = (data) => {
        if (!data) {
            return null;
        }
        const bytes = CryptoJS.AES.decrypt(data, 'your-secret-key');
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    };



    useEffect(() => {
        handleLogin();
        const storedLogin = localStorage.getItem('isLogedIn');
        const storedUser = localStorage.getItem('userName');
        if (storedLogin === 'true' && storedUser) {
            setIsLogedIn(true);
            setIsUser(storedUser);
        }
    }, [filterLimit, isLogedIn]);

    const closeAlert = () => {
        setAlertShown(false);
        localStorage.setItem('alertShown', 'false');
    };
    // useEffect(() => {
    //     document.body.style.overflow = isAlert || isVideo ? 'hidden' : 'auto';
    // }, [isAlert, isVideo]);
    useEffect(() => {
        openWebsite();
    }, []);

    return (
        <div className="app">

            <AnalysisContext.Provider value={analysis}  >
                <Routes>
                    <Route path="/" element={<Home setAnalysis={setAnalysis} setLoading={setLoading} analysis={analysis} loading={loading} isLogedIn={isLogedIn} isAlert={isAlert} setIsAlert={setIsAlert} filterLimit={filterLimit} mains={mains} setAlertShown={setAlertShown} alertShown={alertShown} isUser={isUser} forFilterTimeData={forFilterTimeData} setIsLogedIn={setIsLogedIn}  
                    setSelectedTime={setSelectedTime}
                    selectedTime={selectedTime}
                    setSelectedTicker={setSelectedTicker}
                    setSelectedPreset={setSelectedPreset}
                    selectedPreset={selectedPreset}
                    selectedTicker={selectedTicker} />} />
                    <Route path="/chart/:id" element={<Chart setIsAlert={setIsAlert} isUser={isUser} isLogedIn={isLogedIn} analysis={analysis} forFilterTimeData={forFilterTimeData} />} />
                    <Route path="/login" element={<Login setIsUser={setIsUser} setIsLogedIn={setIsLogedIn} handleLogin={handleLogin} />} />
                    <Route path='/roadmap' element={<RoadMap />} />
                </Routes>
            </AnalysisContext.Provider>
            <Popup isAlert={isAlert} setIsAlert={setIsAlert} closeAlert={closeAlert} />
        </div>
    );
};

export default MainPage;