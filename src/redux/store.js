// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import klinesReducer from "./slices/BinanceApi";
import isVidoes from './reducers/isVideos';
import data from './reducers/data';
import roadmapReducer from "./reducers/roadmap"
import roadmapTableReducer from "./reducers/roadmapTable";
const store = configureStore({
    reducer: {
        video: isVidoes,
        data: data,
        klines: klinesReducer,
        roadmap: roadmapReducer,
        roadmapTable: roadmapTableReducer,
    },
});

export default store;
