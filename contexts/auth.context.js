//*Este archivo compartirá el estado de autenticación en toda la aplicación 
//* y manejo de las acciones de reducer(dispatch) desde cualquier componente.

"use client";

import { createContext, useContext, useReducer } from "react";
import { AuthReducer, authInitialState } from "../app/state/reducers/authReducer";

export const AuthStateContext = createContext(authInitialState);  //! SHARE EN TODA LA APP
export const AuthDispatchContext = createContext(null); //! SHARE DE ACCIONES DISPATCH EN TODA LA APP


export const AuthProvider = ({ children }) => {
  const [user, dispatch] = useReducer(AuthReducer, authInitialState);
//*  AuthStateContext.Provider: Proporciona estado actual del usuario en toda la app.
//* AuthDispatchContext.Provider: Proporciona función dispatch para q otros components puedan despachar acciones
  return (
    <AuthStateContext.Provider value={{ ...user }}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};


//? Hooks Personalizados:

//! Retorna estado de usuario actual si está autenticado o no
//Si encuentra, devuelve datos de sesión, else devuelve defaultUser
export const useAuthState = () => {
  const context = useContext(AuthStateContext); //Obtiene el valor del contexto 

  if (context === undefined) {  //If componente no está envuelto en un Auth Provider
    throw new Error("useAuthState must be used within an AuthProvider");
  }

  return context;   // Retonar con data del usuario: email,isAuthenitcated,id,token,nombre,...
};

//! Permite dispatch de acciones login/logout

export const useAuthDispatch = () => {
  
  const context = useContext(AuthDispatchContext); // Obtiene el valor de AuthDispatchContext que contiene la función dispatch

  if (context === undefined) {// If componente no está envuelto en un Auth Provider
    throw new Error("useAuthDispatch must be used within an AuthProvider");
  }

  return context;//Entrega funcion dispatch que permite disparar funciones en el reducer
};
