// src/redux/store.js
import { createStore, combineReducers } from 'redux';

import isVidoes from './reducers/isVideos';
import data from './reducers/data';


// Reducerlarni birlashtirish (combineReducers)
const rootReducer = combineReducers({
  video: isVidoes,
  data: data,

});

// Store yaratish
const store = createStore(rootReducer);

export default store;
