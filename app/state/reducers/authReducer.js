import { authenticate, logout } from "../../utils/auth";

//Establece estado de autenticación inicial, buscando token
  //Si encuentra, devuelve datos de sesión, else devuelve defaultUser
export const authInitialState = authenticate();


// Ingresa estado y acción,
// verifica si hay token valid y almacenado > retourn datos decodificados
// else > retorna defaultUSer
export const AuthReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case "login":
      newState = authenticate(action.token);// Guarda token y decodifica
      return { ...newState };   //Retorna datos decodificados de user
    case "logout":
      newState = logout();      // Elimina token de localStorage
      return { ...newState };   //retorna userDefault
    default:
      return state;
  }
};
