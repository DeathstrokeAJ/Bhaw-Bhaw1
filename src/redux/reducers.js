// reducer.js
const initialState = {
    email: '',
    password: '',
    isSubscribed: false,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SAVE_CREDENTIALS":
        return {
          ...state,
          email: action.payload.email,
          password: action.payload.password,
        };
      case "SET_NEWSLETTER_SUBSCRIPTION":
        return {
          ...state,
          isSubscribed: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  