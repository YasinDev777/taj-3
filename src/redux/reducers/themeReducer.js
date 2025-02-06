// src/redux/reducers/themeReducer.js
const initialState = {
    theme: false, // boshlang'ich mavzu
  };
  
  const themeReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'IsVideo':
        return { ...state, theme: state.theme === false ? true : false };
      default:
        return state;
    }
  };
  
  export default themeReducer;
  