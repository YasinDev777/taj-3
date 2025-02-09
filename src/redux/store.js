// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import klinesReducer from "./slices/BinanceApi";
import fetchBitCoinData from "./slices/BinanceApiForChart";
import isVidoes from './reducers/isVideos';
import data from './reducers/data';

const store = configureStore({
    reducer: {
        video: isVidoes,
        data: data,
        klines: klinesReducer,
        candlestick: fetchBitCoinData,
    },
});

export default store;
