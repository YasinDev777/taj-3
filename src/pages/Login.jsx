import React, { useState, useEffect } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { LuClipboardCopy } from "react-icons/lu";
import { FiArrowRightCircle } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";

const Login = ({
  setIsLogedIn,
  setIsUser,
  handleLogin
}) => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate()

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputValue(text);
    } catch (err) {
      console.error("Xatolik yuz berdi:", err);
      alert("Text quyishda xatolik yuz berdi. Ruxsat borligini tekshiring.");
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    
    if (event.key === "Enter") {
      handleLogin(inputValue);
    }
  };

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLogedIn");
    const storedUser = localStorage.getItem("userName");
    if (storedLogin === "true" && storedUser) {
      setIsLogedIn(true);
      setIsUser(storedUser);
      navigate("/");
    }
  }, [setIsLogedIn, setIsUser, navigate]);

  return (
    <div className="login">
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
              pagination={{ clickable: true }}
              modules={[Pagination, Autoplay]}
              className="mySwiper"
            >
              <SwiperSlide className="swiper-slide">
                <div className="textx">
                  <h1>Kripto bozoridagi eng so'nggi texnik analizlar 😉</h1>
                  <p>
                    Ahsan Labs orqali eng yangi tahlillar va halol kripto
                    imkoniyatlarini kuzating.
                  </p>
                  <img src="./images/ETH.png" alt="eth" />
                  <img
                    src="./images/StarAtlas.png"
                    alt="starAtlas"
                    className="img1"
                  />
                  <img src="./images/SOL.png" alt="sol" className="img2" />
                </div>
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <h1>Bozorda ishonchli tahlil bilan ish boshlang 💯</h1>
                <p>
                  Ahsan Labs orqali eng yangi tahlillar bilan ish boshlab
                  daromadingizni oshiring!
                </p>
                <img src="/images/ChatBot.png" alt="chatBot" />
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <h1>Biz bilan vaqtingizni tejang 🕒</h1>
                <p>
                  Ahsan Labs orqali eng yangi tahlillar va halol kripto
                  imkoniyatlarini oson filterlar bilan kuzating.
                </p>
                <img src="/images/Working.png" alt="working" className="img3" />
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
                    onKeyDown={handleKeyDown}
                  />

                  <LuClipboardCopy onClick={handlePaste} />
                </div>
              </div>
              <button onClick={() => handleLogin(inputValue)}>
                Kirish <FiArrowRightCircle />
              </button>
              <p>
                <Link to="https://t.me/ahsanlabs_admin">
                  <span>@ahsan_admin</span> bilan bog'laning va <br /> tokeninginzni
                  oling.
                </Link>
              </p>
            </div>
          </div>
          <p className="p">©Ahsan 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;