"use client";

import { createContext, useContext, useReducer } from "react";
import { AuthReducer, authInitialState } from "../app/state/reducers/authReducer";

export const AuthStateContext = createContext(authInitialState);
export const AuthDispatchContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, dispatch] = useReducer(AuthReducer, authInitialState);

  return (
    <AuthStateContext.Provider value={{ ...user }}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => {
  const context = useContext(AuthStateContext);

  if (context === undefined) {
    throw new Error("useAuthState must be used within an AuthProvider");
  }

  return context;
};

export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);

  if (context === undefined) {
    throw new Error("useAuthDispatch must be used within an AuthProvider");
  }

  return context;
};
