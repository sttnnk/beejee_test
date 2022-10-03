import ACTypes from "./types";

const initialState = {
  user: {},
}

export const userReducer = (state = initialState, action) => {
  switch (action.type) {

    case ACTypes.LOGIN:
      return { ...state, user: action.payload }

    case ACTypes.LOGOUT:
      return initialState;

    case ACTypes.SET_USER:
      return { ...state, user: action.payload };

    default:
      return state;
  }
}
