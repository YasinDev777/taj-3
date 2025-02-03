// src/redux/store.js
import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import themeReducer from './reducers/themeReducer';
import isVidoes from './reducers/isVideos';


// Reducerlarni birlashtirish (combineReducers)
const rootReducer = combineReducers({
  video: isVidoes,
});

// Store yaratish
const store = createStore(rootReducer);

export default store;
