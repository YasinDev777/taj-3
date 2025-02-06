const initialState = {
  user: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOG_OUT':
      return { ...state, user: null };
      case 'VIDEO':
        return { ...state, user: action.payload };
    default:
      return state;
  }
};

export default userReducer;
