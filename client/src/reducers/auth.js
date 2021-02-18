import React from "react";

export const AuthContext = React.createContext();
export const initialState = {
  user: null,
  token: null,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_LOGIN":
      return {
        user: action.payload.details,
        token: action.payload.token,
      };
    case "AUTH_SIGNOUT":
      return {
        user: null,
        token: null,
      };
    default:
      return state;
  }
};
