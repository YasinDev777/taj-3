import { collection, addDoc, Timestamp } from "firebase/firestore";

import { db } from "../firebase";
import CryptoJS from "crypto-js";
    const decryptData = (data) => {
      if (!data) {
        return null; // Возвращаем null, если данных нет
      }
      const bytes = CryptoJS.AES.decrypt(data, 'your-secret-key');
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    };
  const userId = localStorage.getItem("subscriptionType")

  // Filterni Firebase'ga yozish funksiyasi
 export const openWebsite = async () => {
    try {
        await addDoc(collection(db, "analytics"), {
        action:"open website",
        user_id: decryptData(userId),
        created_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  } 

  export const FilterGridAnalytics = async (actionType) => {
    
    try {
        await addDoc(collection(db, "analytics"), {
        action:"Grid",
        gridAction: actionType,
        user_id: decryptData(userId),
        created_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  }


  export const FilterTimeFrameAnalytics = async (actionType) => {
    
    try {
        await addDoc(collection(db, "analytics"), {
        action: "TimeFrame",
        timeFrame: actionType,
        user_id: decryptData(userId),
        created_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  }  



  export const FilterAnalaysisAnalytics = async (actionType) => {
    try {
        await addDoc(collection(db, "analytics"), {
        action: "Analaysis",
        analaysis: actionType,
        user_id: decryptData(userId),
        created_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  }


  
  export const FilterClearAnalytics = async () => {
    try {
        await addDoc(collection(db, "analytics"), {
        action: "FilterClear",
        user_id: decryptData(userId),
        created_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  }
