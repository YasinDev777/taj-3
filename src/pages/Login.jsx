import React, { useState, useEffect } from 'react';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { RiKey2Line } from "react-icons/ri";
import { FiArrowRightCircle } from "react-icons/fi";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import 'swiper/css';
import 'swiper/css/pagination';

const Login = ({ isUser, isLogined, setIsLogined, setIsUser }) => {
    const [inputValue, setInputValue] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedLogin = localStorage.getItem("isLogined");
        const storedUserData = localStorage.getItem("userData");

        if (storedLogin === "true" && storedUserData) {
            const userData = JSON.parse(storedUserData);
            setIsLogined(true);
            setIsUser(userData.name);
            navigate('/');
        }
    }, [setIsLogined, setIsUser, navigate]);

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setInputValue(text);
        } catch (err) {
            console.error("Ошибка доступа к буферу обмена:", err);
            alert("Не удалось вставить текст. Проверьте разрешения.");
        }
    };

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleLogin = async () => {
        try {
            const usersCollection = collection(db, "user");
            const querySnapshot = await getDocs(usersCollection);

            let foundUser = null;

            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                if (userData.id === inputValue) {
                    foundUser = userData;
                }
            });

            if (foundUser) {
                setIsLogined(true);
                setIsUser(foundUser.name);

                localStorage.setItem("isLogined", "true");
                localStorage.setItem("userData", JSON.stringify(foundUser));

                navigate('/');
            } else {
                alert("Пароль неверный или пользователь не найден.");
            }
        } catch (error) {
            console.error("Ошибка при проверке данных:", error);
            alert("Произошла ошибка. Попробуйте снова.");
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className='login'>
            <div className="container">
                <div className="left">
                    <div className="exit-nav">
                        <Link to="/">
                            <BsArrowLeftCircle />
                        </Link>
                    </div>
                    <div className="swiperr">
                        <Swiper
                            spaceBetween={30}
                            loop={true}
                            autoplay={{ delay: 10000 }}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[Pagination, Autoplay]}
                            className="mySwiper"
                        >
                            <SwiperSlide className='swiper-slide'>
                                <div className="textx">
                                    <h1>
                                        Kripto bozoridagi eng so'nggi texnik analizlar!
                                    </h1>
                                    <p>Ahsan Screener orqali eng yangi tahlillar va halol kripto imkoniyatlarini kuzating.</p>
                                    <img src="./images/ETH.png" alt="eth" />
                                    <img src="./images/StarAtlas.png" alt="starAtlas" className='img1' />
                                    <img src="./images/SOL.png" alt="sol" className='img2' />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide className='swiper-slide'>
                                <h1>Kripto bozoridagi eng so'nggi texnik analizlar!</h1>
                                <p>Ahsan Screener orqali eng yangi tahlillar va halol kripto imkoniyatlarini kuzating.</p>
                                <img src="/images/ChatBot.png" alt="chatBot" />
                            </SwiperSlide>
                            <SwiperSlide className='swiper-slide'>
                                <h1>Biz bilan vaqtingizni tejang!</h1>
                                <p>Ahsan Screener orqali eng yangi tahlillar va halol kripto imkoniyatlarini oson filterlar bilan kuzating.</p>
                                <img src="/images/Working.png" alt="working" className='img3' />
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
                <div className="right">
                    <div className="exit-nav2">
                        <Link to="/">
                            <BsArrowLeftCircle />
                        </Link>
                    </div>
                    <h1>AHSAN.</h1>
                    <div className="login-div">
                        <h3>Log In</h3>
                        <div className="logining">
                            <div>
                                <label>Tokenni kiriting</label>
                                <div className="input-div">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={handleChange}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <RiKey2Line onClick={handlePaste} />
                                </div>
                            </div>
                            <button onClick={handleLogin}>Kirish <FiArrowRightCircle /></button>
                                <p>
                                  <Link to="https://t.me/ahsanlabs_admin">
                                    <span>@ahsan_admin</span> bilan bog'laning va tokeninginzni oling.
                                    </Link>
                                </p>
                        </div>
                    </div>
                    <p className='p'>© Ahsan 2024</p>
                </div>
            </div>
        </div>
    );
};

export default Login;