import React, { useState } from 'react';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { RiKey2Line } from "react-icons/ri";
import { FiArrowRightCircle } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { database, ref, set } from "../firebase";
import 'swiper/css';
import 'swiper/css/pagination';

const Login = () => {
    const [inputValue, setInputValue] = useState("")

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


    const handleSave = () => {
        if (!inputValue.trim()) {
            alert("Поле не должно быть пустым!");
            return;
        }

        set(ref(database, "users/" + Date.now()), {
            number: inputValue,
        })
            .then(() => {
                console.log("Данные успешно сохранены!");
            })
            .catch((error) => {
                console.error("Ошибка при сохранении:", error.message);
            });
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
                                    />
                                    <RiKey2Line onClick={handlePaste} />
                                </div>
                            </div>
                            <button onClick={handleSave}>Kirish <FiArrowRightCircle /></button>
                            <p>
                                <span>@ahsan_admin</span> bilan bog’laning va tokeninginzni oling.
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