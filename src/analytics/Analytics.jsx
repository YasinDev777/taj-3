import { collection, addDoc, Timestamp } from 'firebase/firestore';

import { db } from '../firebase';
import CryptoJS from 'crypto-js';
import Bowser from 'bowser';
// which browser
const browserInfo = Bowser.getParser(window.navigator.userAgent);
const browserName = browserInfo.getBrowserName();

// which operation system
let operatingSystem = '';
if (navigator && navigator.platform) {
  operatingSystem = navigator.platform;
} else {
  console.log('Operating system information not available.');
}

// which device
const userAgent = navigator.userAgent;
let device = '';
if (/mobile/i.test(userAgent)) {
  device = 'Mobile';
} else if (/tablet/i.test(userAgent)) {
  device = 'Tablet';
} else {
  device = 'Desktop';
}

const decryptData = (data) => {
  if (!data) {
    return 'anonymous';
  }
  const bytes = CryptoJS.AES.decrypt(data, 'your-secret-key');
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
const userId = localStorage.getItem('subscriptionType');

// Filterni Firebase'ga yozish funksiyasi

export const openWebsite = async () => {
  try {
    await addDoc(collection(db, 'analytics'), {
      action: 'open',
      param: 'opening website',
      param_value: 'opened website',
      user_id: decryptData(userId),
      created_at: Timestamp.now(),
      browser: browserName,
      operatingSystem: operatingSystem,
      device: device,
    });
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  }
};

// Filter Analytics start
export const FilterAnalaysisAnalytics = async (actionTypeValue) => {
  try {
    await addDoc(collection(db, 'analytics'), {
      action: 'filter',
      param: actionTypeValue,
      param_value: 'All',
      user_id: decryptData(userId),
      created_at: Timestamp.now(),
      browser: browserName,
      operatingSystem: operatingSystem,
      device: device,
    });
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  }
};

export const FilterAnalaysisTypeAnalytics = async (actionType, actionTypeValue) => {
  try {
    await addDoc(collection(db, 'analytics'), {
      action: 'filter',
      param: actionType,
      param_value: actionTypeValue,
      user_id: decryptData(userId),
      created_at: Timestamp.now(),
      browser: browserName,
      operatingSystem: operatingSystem,
      device: device,
    });
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  }
};
export const FilterGridAnalytics = async (actionTypeValue) => {
  try {
    await addDoc(collection(db, 'analytics'), {
      action: 'filter',
      param: 'filterGrid',
      param_value: actionTypeValue,
      user_id: decryptData(userId),
      created_at: Timestamp.now(),
      browser: browserName,
      operatingSystem: operatingSystem,
      device: device,
    });
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  }
};
export const FilterTimeFrameAnalytics = async (actionTypeValue) => {
  try {
    await addDoc(collection(db, 'analytics'), {
      action: 'filter',
      param: 'filterTimeFrame',
      param_value: actionTypeValue,
      user_id: decryptData(userId),
      created_at: Timestamp.now(),
      browser: browserName,
      operatingSystem: operatingSystem,
      device: device,
    });
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  }
};
export const FilterClearAnalytics = async () => {
  try {
    await addDoc(collection(db, 'analytics'), {
      action: 'filterClear',
      param: 'clearedFilter',
      param_value: 'clear',
      user_id: decryptData(userId),
      created_at: Timestamp.now(),
      browser: browserName,
      operatingSystem: operatingSystem,
      device: device,
    });
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  }
};
// Filter Analytics end

// Pagination Analytics start
export const PaginationAnalytics = async (pageAction) => {
  try {
    await addDoc(collection(db, 'analytics'), {
      action: 'pagination',
      param: 'paginating',
      param_value: pageAction,
      user_id: decryptData(userId),
      created_at: Timestamp.now(),
      browser: browserName,
      operatingSystem: operatingSystem,
      device: device,
    });
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  }
};
// Pagination Analytics end

// Video Analytics start
export const VideoAnalytics = async (alert) => {
  try {
    await addDoc(collection(db, 'analytics'), {
      action: 'videoPlayAlert',
      param: 'video alert',
      param_value: alert,
      user_id: decryptData(userId),
      created_at: Timestamp.now(),
      browser: browserName,
      operatingSystem: operatingSystem,
      device: device,
    });
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  }
};
// Video Analytics end

// chart Analytics start
export const chartAnalyticsOpen = async (symbol) => {
  try {
    await addDoc(collection(db, 'analytics'), {
      action: 'chart',
      param: 'openChart',
      param_value: symbol,
      user_id: decryptData(userId),
      created_at: Timestamp.now(),
      browser: browserName,
      operatingSystem: operatingSystem,
      device: device,
    });
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  }
};
export const chartAnalyticsClose = async () => {
  try {
    await addDoc(collection(db, 'analytics'), {
      action: 'chart',
      param: 'exitChart',
      param_value: 'close',
      user_id: decryptData(userId),
      created_at: Timestamp.now(),
      browser: browserName,
      operatingSystem: operatingSystem,
      device: device,
    });
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  }
};
// chart Analytics end

// Login Analytics start
export const loginAnalytics = async (action) => {
  try {
    await addDoc(collection(db, 'analytics'), {
      action: 'login',
      param: 'authentication',
      param_value: action,
      user_id: decryptData(userId),
      created_at: Timestamp.now(),
      browser: browserName,
      operatingSystem: operatingSystem,
      device: device,
    });
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  }
};
// Login Analytics end

// Page Analytics start
export const pageAnalytics = async (action) => {
  try {
    await addDoc(collection(db, 'analytics'), {
      action: 'page',
      param: 'page',
      param_value: action,
      user_id: decryptData(userId),
      created_at: Timestamp.now(),
      browser: browserName,
      operatingSystem: operatingSystem,
      device: device,
    });
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  }
};
// Page Analytics end

export const BlockChartAnalytics = async (action) => {
  try {
    await addDoc(collection(db, 'analytics'), {
      action: 'blockChart',
      param: 'blockChart',
      param_value: action,
      user_id: decryptData(userId),
      created_at: Timestamp.now(),
      browser: browserName,
      operatingSystem: operatingSystem,
      device: device,
    });
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  }
};

export const ConatactAnalytics = async (action) => {
  try {
    await addDoc(collection(db, 'analytics'), {
      action: 'contact',
      param: 'conatctAdmin',
      param_value: action,
      user_id: decryptData(userId),
      created_at: Timestamp.now(),
      browser: browserName,
      operatingSystem: operatingSystem,
      device: device,
    });
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  }
};
