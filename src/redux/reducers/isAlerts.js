const initialState = {
  alert: false, // boshlang'ich mavzu
};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'IsAlert':
      return { ...state, alert: state.alert === false ? true : false };
    default:
      return state;
  }
};

export default alertReducer;
