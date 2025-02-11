import { opinionAnalytics, ConatactAnalytics } from '../../analytics/Analytics'
import React, { useState } from 'react';
import { BsArrowLeftCircle } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { setData } from '../../services/RoadMapData';
import { getRandomSixDigitNumber } from '../randomNumber'
import CryptoJS from 'crypto-js';

const decryptData = (data) => {
  if (!data) {
    return "anonymous_" + getRandomSixDigitNumber();
  }
  const bytes = CryptoJS.AES.decrypt(data, "your-secret-key");
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const userId = decryptData(localStorage.getItem('subscriptionType'))

const RoadmapSidebar = ({closeSidebar}) => {


  const showToast = (message, type = "error") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const [userData, setUserData] = useState({
    title: "",
    telegramUsername: "",
    learnMore: "",
    user_id: userId ? userId : "anonymous_" + getRandomSixDigitNumber()
  });

  // const [inputState, setInputState] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    const { title, telegramUsername, learnMore } = userData;
    
    if (!title.trim() || !telegramUsername.trim() || !learnMore.trim()) {
      // setInputState(false);
      opinionAnalytics("invalid")
      showToast("Barcha maydonlarni to‘ldiring!");
      return;
    }

    // setInputState(true);
    setData(userData);
    showToast("Fikringiz uchun rahmat!", "success");
    opinionAnalytics("valid");

    setUserData({
      title: "",
      telegramUsername: "",
      learnMore: "",
      user_id: userId ? userId : "anonymous_" + getRandomSixDigitNumber()
    });
    closeSidebar();
  };

  return (
    <div className='w-full min-h-screen fixed left-0 top-0 z-{100} backdrop-blur-lg flex items-center justify-end' onClick={closeSidebar}>
      <div className="w-1/2 flex justify-start h-screen p-2 shadow-2xl bg-white flex-col max-md-plus:w-full max-md-plus:bg-[#FCFCFC] overflow-x-hidden relative" onClick={(e) => e.stopPropagation()}>
        <div className="w-full p-4">
          <BsArrowLeftCircle className='text-3xl cursor-pointer' onClick={closeSidebar} />
        </div>
        <div className="w-[90%] flex items-center justify-center flex-col mx-auto font-bold gap-5">
          <h1 className='text-center text-[40px] font-semibold leading-[1.25] max-xs:text-[30px]'>G’oyangizni biz bilan <br /> bo‘lishing 😊</h1>
          <div className="w-full pt-6 pb-12 bg-[#FCFCFC] border border-[#E8EBEF] border-solid rounded-3xl flex flex-col gap-10 justify-center items-center pl-9 pr-9 max-xs:pl-6 max-xs:pr-6 max-md-plus:border-none">
            
            <div className='flex gap-1 flex-col justify-start w-full'>
              <label htmlFor="title" className='text-xl max-xs:text-[17px]'>G’oya nomi</label>
              <input 
                type="text" 
                id='title' 
                value={userData.title} 
                onChange={handleChange} 
                placeholder='Saytdagi yuklanishlarni tezlashtirish' 
                className='w-full border text-[18px] border-[#E8EBEF] border-solid p-4 rounded-lg font-semibold max-xs:text-[16px]'
              />
            </div>

            <div className='flex gap-1 flex-col justify-start w-full'>
              <label htmlFor="telegramUsername" className='text-[20px] max-xs:text-[17px]'>Telegram hisobingiz</label>
              <input 
                type="text" 
                id='telegramUsername'  
                value={userData.telegramUsername}
                onChange={handleChange} 
                placeholder='@ahsanlabsuz' 
                className='w-full border text-[18px] border-[#E8EBEF] border-solid p-4 rounded-lg font-semibold max-xs:text-[16px]'
              />
            </div>
            
            <div className='flex gap-1 flex-col justify-start w-full'>
              <label htmlFor="learnMore" className='text-[20px] max-xs:text-[17px]'>G’oya haqida batafsil</label>
              <textarea 
                id='learnMore' 
                value={userData.learnMore} 
                onChange={handleChange} 
                placeholder='Saytdagi yuklanishlarni tezlashtirish...' 
                className='w-full h-32 border text-[18px] border-[#E8EBEF] border-solid p-4 rounded-lg resize-none font-semibold max-xs:text-[16px]'
              />
            </div>

            <button 
              className='bg-[#2C2B34] font-semibold text-[18px] flex items-center justify-center gap-2 text-white p-2 pl-6 pr-6 rounded-lg cursor-pointer' 
              onClick={handleSubmit}
            >
              Yuborish <FiSend className='text-[20px]'/>
            </button>

            <Link onClick={()=>ConatactAnalytics("sidebarContact")} target="blank" to='https://t.me/ahsanlabs_admin' className='underline hover:no-underline text-[20px] font-normal text-[#2C2B34] text-center max-xs:text-[16px]'>
              Savollar bormi? <br /> 
              <span  className='font-bold text-[#2C2B34]'>@ahsan_admin bilan</span> bog’laning !
            </Link>
          </div>
        </div>
        <h1 className='font-extrabold text-[50px] self-end pt-8'>AHSAN.</h1>
      </div>
    </div>
  );
}

export default RoadmapSidebar;
