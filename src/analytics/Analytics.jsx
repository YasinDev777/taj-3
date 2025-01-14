import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import CryptoJS from "crypto-js";
    const decryptData = (data) => {
      if (!data) {
        return null; 
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
        actionType: "opening website",
        actionTypevalue:"open",
        user_id: decryptData(userId),
        created_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  } 
  
  
  
// Filter Analytics start
  export const FilterAnalaysisAnalytics = async (actionTypeValue) => {
    try {
        await addDoc(collection(db, "analytics"), {
        action: "filter",
        actionType: actionTypeValue,
        actionTypeValue: "All",
        user_id: decryptData(userId),
        created_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  }
  export const FilterAnalaysisTypeAnalytics = async (actionType,actionTypeValue) => {    
    try {
        await addDoc(collection(db, "analytics"), {
        action: "filter",
        actionType: actionType,
        actionTypeValue:actionTypeValue,
        user_id: decryptData(userId),
        created_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  }
  export const FilterGridAnalytics = async (actionTypeValue) => {
    
    try {
        await addDoc(collection(db, "analytics"), {
        action:"filter",
        actionType: "filterGrid",
        actionTypeValue: actionTypeValue,
        user_id: decryptData(userId),
        created_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  }
  export const FilterTimeFrameAnalytics = async (actionTypeValue) => {
    
    try {
        await addDoc(collection(db, "analytics"), {
        action: "filter",
        actionType: "filterTimeFrame",
        actionTypeValue: actionTypeValue,
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
        action: "filterClear",
        actionType: "clearedFilter",
        actionTypeValue:"clear",
        user_id: decryptData(userId),
        created_at: Timestamp.now(),
      });
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  }
// Filter Analytics end

// Pagination Analytics start

// Pagination Analytics end

