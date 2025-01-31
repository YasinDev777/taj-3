import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";
import CryptoJS from "crypto-js";
import Bowser from "bowser";

const browserInfo = Bowser.getParser(window.navigator.userAgent);
const browserName = browserInfo.getBrowserName();
let osName = "";
const deviceType = browserInfo.getPlatformType(); // 'mobile', 'tablet', 'desktop'

// Android va iOS ni aniqlash uchun regex

const isAndroid = /Android/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
if (isAndroid === true) {
  osName = "Android";
} else if (isIOS === true) {
  osName = "iOS";
} else {
  osName = browserInfo.getOSName();
}

const decryptData = (data) => {
  if (!data) {
    return "anonymous";
  }
  const bytes = CryptoJS.AES.decrypt(data, "your-secret-key");
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
// userDocId funksiyasi
const userDocId = async () => {
  const userId = localStorage.getItem("subscriptionType");
  if (process.env.NODE_ENV === "production") {
    return "anonymous";
  }
  try {
    const usersCollection = collection(db, "user");
    const user_query = query(
      usersCollection,
      where("user_id", "==", decryptData(userId))
    );
    const querySnapshot = await getDocs(user_query);
    for (const docs of querySnapshot.docs) {
      return docs.id; // Birinchi hujjatning ID-sini qaytaradi
    }
    return "anonymous"; // Agar hujjat topilmasa, 'anonymous' qaytaradi
  } catch (err) {
    console.error("Xatolik yuz berdi:", err);
    return "anonymous";
  }
};

// Analytics uchun umumiy funksiya
const addAnalytics = async (action, param, paramValue, userIdValid) => {
  if (process.env.NODE_ENV === "production") {
    return;
  }
  try {
    const userId = userIdValid ? userIdValid : await userDocId(); // user_id-ni
    await addDoc(collection(db, "analytics"), {
      action: action,
      param: param,
      param_value: paramValue,
      user_id: userId, // Har doim user_id qo'shiladi
      created_at: Timestamp.now(),
      browser: browserName,
      operatingSystem: osName,
      device: deviceType,
    });
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  }
};
// openWebsite funksiyasi
export const openWebsite = async () => {
  await addAnalytics("open", "enteredSite", "enteredWebsite");
};

// Filter funksiyalari
export const FilterAnalaysisAnalytics = async (actionTypeValue) => {
  await addAnalytics("filter", "Analysis", actionTypeValue);
};

export const FilterAnalaysisTypeAnalytics = async (
  actionType,
  actionTypeValue
) => {
  await addAnalytics("filter", actionType, actionTypeValue);
};

export const FilterGridAnalytics = async (actionTypeValue) => {
  await addAnalytics("filter", "filterGrid", actionTypeValue);
};

export const FilterTimeFrameAnalytics = async (actionTypeValue) => {
  await addAnalytics("filter", "filterTimeFrame", actionTypeValue);
};

export const FilterClearAnalytics = async () => {
  await addAnalytics("filterClear", "clearIcon", "clear");
};
// Filter Analytics end

// Pagination Analytics start
export const PaginationAnalytics = async (pageAction) => {
  await addAnalytics("pagination", "paginating", pageAction);
};
// Pagination Analytics end

// Video Analytics start
export const VideoAnalytics = async (alert) => {
  await addAnalytics("videoPlayAlert", "videoAlert", alert);
};
// Video Analytics end

// chart Analytics start
export const chartAnalyticsOpen = async (symbol) => {
  await addAnalytics("chart", "openChart", symbol);
};
export const chartAnalyticsClose = async (symbol) => {
  await addAnalytics("chart", "exitChart", symbol);
};
// chart Analytics end

// Login Analytics start
export const loginAnalytics = async (
  action,
  actionType,
  actionTypeValue,
  userId
) => {
  await addAnalytics(action, actionType, actionTypeValue, userId);
};
// Login Analytics end

// Page Analytics start
export const pageAnalytics = async (action) => {
  await addAnalytics("page", "page", action);
};
// Page Analytics end

export const BlockChartAnalytics = async (action) => {
  await addAnalytics("get", "getButton", action);
};

export const ConatactAnalytics = async (action) => {
  await addAnalytics("contact", "conatctAdmin", action);
};
export const logoAnalytics = async () => {
  await addAnalytics("logo", "navbarLogo", "clicked");
};
