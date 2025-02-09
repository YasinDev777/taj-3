// src/redux/reducers/themeReducer.js
const initialState = {
  video: false, // boshlang'ich mavzu
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'IsVideo':
      return { ...state, video: state.video === false ? true : false };
    default:
      return state;
  }
};

export default themeReducer;
