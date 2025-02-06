import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RiErrorWarningLine } from 'react-icons/ri';
import { BiX } from 'react-icons/bi';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const Alert = ({ isLogedIn, isUser, setAlertShown, alertShown }) => {
  const [subscriptionDateEnd, setSubscriptionDateEnd] = useState(null);
  const [limit, setLimit] = useState(true);
  const updateSubscriptionToFree = async (userName) => {
    try {
      const usersCollection = collection(db, 'user');
      const userQuery = query(usersCollection, where('name', '==', userName));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Hujjatni olamiz
        const userRef = doc(db, 'user', userDoc.id); // Hujjat manzilini aniqlaymiz
        await updateDoc(userRef, { subscription_type: 'free' }); // Yangilash
      }
    } catch (error) {
      console.error( error);
    }
  };

  const fetchSubscriptionData = async (userName) => {
    try {
      const usersCollection = collection(db, 'user');
      const userQuery = query(usersCollection, where('name', '==', userName));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        const expirationDate = userDoc.subscription_expiration_date.seconds * 1000;
        setSubscriptionDateEnd(expirationDate);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (isUser) {
      fetchSubscriptionData(isUser);
    }
  }, [isUser]);

  useEffect(() => {
    const currentTime = new Date().getTime();
    let alertShowState = localStorage.getItem('alert1') || false;
    let alertShowState2 = localStorage.getItem('alert2') || false;

    if (subscriptionDateEnd) {
      if (currentTime < subscriptionDateEnd - 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem('alert1');
        localStorage.removeItem('alert2');
      }
      if (currentTime > subscriptionDateEnd - 7 * 24 * 60 * 60 * 1000 && currentTime < subscriptionDateEnd && !alertShowState) {
        setAlertShown(true);
        setLimit(false);
      }
      if (currentTime >= subscriptionDateEnd - 24 * 60 * 60 * 1000 && currentTime < subscriptionDateEnd && !alertShowState2) {
        setAlertShown(true);
        setLimit(true);
      localStorage.setItem('alert1', false);
      }
      if (currentTime >= subscriptionDateEnd) {
        updateSubscriptionToFree(isUser);
        localStorage.setItem('alert1', false);
        localStorage.setItem('alert2', false);
      }
    }
  }, [isLogedIn, subscriptionDateEnd, alertShown]);

  const handleCloseAlert = () => {
    setAlertShown(false);
    let alert1 = JSON.parse(localStorage.getItem('alert1'));
    if (alert1 === false) {
      localStorage.setItem('alert2', false);
    }
    localStorage.setItem('alert1', false);
  };

  return (
    <div className="w-11/12 m-auto my-5 flex justify-between items-center bg-blockCard text-white  p-5 pr-8 rounded-2xl max-sm:w-[98%] max-sm:p-2 max-sm:pr-3 max-sm:rounded-lg" style={alertShown ? { display: 'flex' } : { display: 'none' }}>
      {limit === false ? (
        <div>
          <h3 className='flex gap-2 items-center text-2xl max-sm:text-base'>
            <RiErrorWarningLine /> Eslatma:
          </h3>
          <p className='pl-8 max-sm:text-[8px] max-sm:pl-6 '>Hurmatli, {isUser} 1 haftadan so’ng obunangiz bekor qilinadi. Iltimos, admin bilan bog’laning!</p>
        </div>
      ) : (
        <div>
          <h3 className='flex gap-2 items-center text-2xl'>
            <RiErrorWarningLine /> Diqqat:
          </h3>
          <p>Hurmatli, {isUser} 1 kundan so’ng obunangiz bekor qilinadi. Iltimos, admin bilan bog’laning!</p>
        </div>
      )}
      <div className="flex items-center gap-8 max-sm:gap-3">
        <Link to="https://t.me/ahsanlabs_admin" className='border p-2 rounded-md max-sm:w-[85px] max-sm:text-sm ' target="blank">
          <button>Sotib olish</button>
        </Link>
        <div className="border bottom-1 h-10 bg-white max-sm:hidden "></div>
        <BiX onClick={handleCloseAlert} className='text-2xl cursor-pointer' />
      </div>
    </div>
  );
};

export default Alert;