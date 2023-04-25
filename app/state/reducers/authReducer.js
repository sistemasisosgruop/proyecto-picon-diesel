import { authenticate, logout } from "../../utils/auth";

export const authInitialState = authenticate();

export const AuthReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case "login":
      newState = authenticate(action.token);
      return { ...newState };
    case "logout":
      newState = logout();
      return { ...newState };
    default:
      return state;
  }
};
