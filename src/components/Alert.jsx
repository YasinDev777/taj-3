import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiErrorWarningLine } from "react-icons/ri";
import { BiX } from "react-icons/bi";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../firebase";

const Alert = ({
  isLogedIn,
  isUser,
  setAlertShown,
  alertShown,
}) => {
  const [subscriptionDateEnd, setSubscriptionDateEnd] = useState(null);
  const [limit, setLimit] = useState(true);

  const updateSubscriptionToFree = async (userName) => {
    try {
      const usersCollection = collection(db, "user");
      const userQuery = query(usersCollection, where("name", "==", userName));
      const querySnapshot = await getDocs(userQuery);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Hujjatni olamiz
        const userRef = doc(db, "user", userDoc.id); // Hujjat manzilini aniqlaymiz
  
        await updateDoc(userRef, { subscription_type: "free" }); // Yangilash
      } else {
        console.log("Foydalanuvchi topilmadi.");
      }
    } catch (error) {
      console.error("Subscription turini o'zgartirishda xatolik:", error);
      alert("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    }
  };
  
  const fetchSubscriptionData = async (userName) => {
    try {
      const usersCollection = collection(db, "user");
      const userQuery = query(usersCollection, where("name", "==", userName));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        const expirationDate = userDoc.subscription_expiration_date.seconds * 1000;
        setSubscriptionDateEnd(expirationDate);

      } else {
        alert("Foydalanuvchi topilmadi.");
      }
    } catch (error) {
      console.error("Subscription ma'lumotlarini olishda xatolik:", error);
    }
  };
  
  useEffect(() => {
    if (isUser) {
      fetchSubscriptionData(isUser);    
    }
  }, [isUser]); // Faqat isUser ga qarash, chunki subscriptionDateEnd ni qaramlikka olishning keragi yo'q
  

  useEffect(() => {
    const currentTime = new Date().getTime();
    let alertShowState = localStorage.getItem("alert1") || false;
    let alertShowState2 = localStorage.getItem("alert2") || false;

    if (subscriptionDateEnd) {
      if (currentTime < subscriptionDateEnd - 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem("alert1");
        localStorage.removeItem("alert2");
      }
      if (
        currentTime > subscriptionDateEnd - 7 * 24 * 60 * 60 * 1000 &&
        !alertShowState
      ) {
        setAlertShown(true);
        setLimit(false);
      }
      if (
        currentTime > subscriptionDateEnd - 1 * 24 * 60 * 60 * 1000 &&
        !alertShowState2
      ) {
        setAlertShown(true);
        setLimit(true);
      }
      if (currentTime > subscriptionDateEnd) {
        updateSubscriptionToFree(isUser);
        localStorage.setItem("alert1", false);
        localStorage.setItem("alert2", false);
      }
    }
  }, [
    isLogedIn,
    subscriptionDateEnd,
    alertShown
  ]);

  const handleCloseAlert = () => {
    setAlertShown(false);
    let alert1 = JSON.parse(localStorage.getItem("alert1"));
    if (alert1 === false) {
      localStorage.setItem("alert2", false);
    }
    localStorage.setItem("alert1", false);
  };

  return (
    <div
      className="warning-alert"
      style={alertShown ? { display: "flex" } : { display: "none" }}
    >
      {limit === false ? (
        <div className="war-texts">
          <h3>
            <RiErrorWarningLine /> Eslatma:
          </h3>
          <p>
            Hurmatli, {isUser} 1 haftadan so’ng obunangiz bekor qilinadi.
            Iltimos, admin bilan bog’laning!
          </p>
        </div>
      ) : (
        <div className="war-texts">
          <h3>
            <RiErrorWarningLine /> Diqqat:
          </h3>
          <p>
            Hurmatli, {isUser} 1 kundan so’ng obunangiz bekor qilinadi. Iltimos, admin
            bilan bog’laning!
          </p>
        </div>
      )}
      <div className="war-options">
        <Link to="https://t.me/ahsanlabs_admin" target="blank">
          <button>Sotib olish</button>
        </Link>
        <BiX onClick={handleCloseAlert} />
      </div>
    </div>
  );
};

export default Alert;