import React, { useState, useEffect } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { LuClipboardCopy } from "react-icons/lu";
import { FiArrowRightCircle } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { ConatactAnalytics, pageAnalytics } from "../analytics/Analytics";
import ChatBotImage from "../assets/ChatBot.png"
import ethImage from "../assets/ETH.png"
import solImage from "../assets/SOL.png"
import workingImage from "../assets/Working.png"
import starAtlasImage from "../assets/StarAtlas.png"
const Login = ({ setIsLogedIn, setIsUser, handleLogin }) => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputValue(text);
    } catch (err) {
      console.error(err);
      alert();
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
    <div className="w-full h-dvh flex items-center justify-center bg-body">
      <div className="w-11/12 h-[90%] rounded-2xl bg-white overflow-hidden grid grid-cols-2 max-md:grid-cols-1">
        <div className="w-full h-full bg-main flex items-start justify-between flex-col max-md:hidden">
          <div className="text-white cursor-pointer pl-5 pt-5 text-3xl absolute z-10">
            <a href="/" onClick={() => pageAnalytics("exitLoginPage")}>
              <BsArrowLeftCircle />
            </a>
          </div>
          <div className="w-full h-full mt-7">
            <Swiper
              loop={true}
              autoplay={{ delay: 10000 }}
              pagination={{ clickable: true }}
              modules={[Pagination, Autoplay]}
              className="w-full h-full"
            >
              <SwiperSlide className="flex flex-col items-start gap-5 p-5 w-full h-full px-10">
                <div className="text-white w-full h-full flex items-start justify-center flex-col relative">
                  <h1 className="text-white font-bold text-3xl w-10/12">
                    Kripto bozoridagi eng so'nggi texnik analizlar 😉
                  </h1>
                  <p className="text-white font-light py-4 text-xl">
                    Ahsan Labs orqali eng yangi tahlillar va halol kripto
                    imkoniyatlarini kuzating.
                  </p>
                  <img
                    className="animate-float duration-1000 absolute w-44 left-8 top-12"
                    src={ethImage}
                    alt="eth"
                  />
                  <img
                    src={starAtlasImage}
                    alt="starAtlas"
                    className="animate-float [animation-delay:2000ms] duration-1000 absolute w-44 left-8 bottom-20"
                  />
                  <img
                    src={solImage}
                    alt="sol"
                    className="animate-float [animation-delay:1000ms] duration-1000 absolute w-44 right-4 bottom-0 delay-700"
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide className="flex flex-col items-start justify-center gap-5 p-5 px-10">
                <h1 className="text-white font-bold text-3xl w-10/12">
                  Bozorda ishonchli tahlil bilan ish boshlang 💯
                </h1>
                <p className="text-white font-light py-4 text-xl w-10/12">
                  Ahsan Labs orqali eng yangi tahlillar bilan ish boshlab
                  daromadingizni oshiring!
                </p>
                <img
                  className="object-contain h-72 p-3"
                  src={ChatBotImage}
                  alt="chatBot"
                />
              </SwiperSlide>
              <SwiperSlide className="flex flex-col items-start justify-center gap-5 p-5 px-10">
                <h1 className="text-white font-bold text-3xl w-10/12">
                  Biz bilan vaqtingizni tejang 🕒
                </h1>
                <p className="text-white font-light py-4 text-xl w-10/12">
                  Ahsan Labs orqali eng yangi tahlillar va halol kripto
                  imkoniyatlarini oson filterlar bilan kuzating.
                </p>
                <img
                  src={workingImage}
                  alt="working"
                  className="object-contain h-80 p-3"
                />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        <div className="w-full h-full bg-white text-center flex flex-col justify-center relative">
          <div className="hidden text-text max-md:flex cursor-pointer pl-5 pt-5 text-3xl top-2 absolute z-10">
            <Link to="/" onClick={() => pageAnalytics("exitLoginPage")}>
              <BsArrowLeftCircle />
            </Link>
          </div>
          <h1 className="font-extrabold text-5xl text-text mt-10">AHSAN.</h1>
          <div className="w-10/12 m-auto bg-alert border border-solid border-1 border-cardText flex justify-between items-start flex-col px-10 pb-16 pt-4 gap-5 mt-5 rounded-2xl">
            <h3 className="font-bold text-text text-2xl">Log In</h3>
            <div className="w-full h-auto flex flex-col items-center gap-5">
              <div className="w-full">
                <label className="block text-start mt-5">
                  Tokenni kiriting
                </label>
                <div className="w-full h-16 mt-3 flex items-center justify-between px-2 overflow-hidden rounded-xl border border-cardText bg-white text-text">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="w-full h-full outline-none text-2xl"
                  />
                  <LuClipboardCopy onClick={handlePaste} className="text-3xl" />
                </div>
              </div>
              <button
                className="bg-main text-white w-auto text-3xl px-6 py-2 rounded-full flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => handleLogin(inputValue)}
              >
                Kirish <FiArrowRightCircle />
              </button>
              <p className="underline">
                <Link target="black"
                  to="https://t.me/ahsanlabs_admin"
                  onClick={() => ConatactAnalytics("loginContactAdmin")}
                >
                  <p className="font-bold">@ahsan_admin</p>
                  <p>bilan bog'laning va tokeninginzni oling.</p>
                </Link>
              </p>
            </div>
          </div>
          <p className="font-normal mb-5">©Ahsan 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
