// @ts-nocheck
import jwtDecode from "jwt-decode";

const TOKEN_KEY = "token";
const EMPRESA_ID = "empresaId";

const defaultUser = {
  email: "",
  nombre: "",
  isAuthenticated: false,
  token: "",
  id: -1,
  empresas: [],
  roles: [],
  empresaId: -1,
};

const setToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY) || null;
  }
};

const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMPRESA_ID);
  }
};

export const authenticate = (token) => {
  if (token) {
    setToken(token);
  }

  const _token = token ?? getToken();

  if (!_token) {
    return { ...defaultUser };
  }

  const decoded = jwtDecode(_token);
  const currentTime = Date.now() / 1000;

  if (decoded.exp < currentTime) {
    removeToken();
    return { ...defaultUser };
  }

  localStorage.setItem("empresaId", decoded?.empresas[0]?.id);

  return {
    email: decoded.username,
    isAuthenticated: true,
    id: decoded.id,
    token: _token,
    nombre: decoded.name,
    empresas: decoded?.empresas,
    roles: decoded?.roles,
    empresaId: decoded?.empresas[0]?.id,
  };
};

export const logout = () => {
  removeToken();

  return { ...defaultUser };
};
