// @ts-nocheck
import jwtDecode from "jwt-decode";

const TOKEN_KEY = "token";
const EMPRESA_ID = "empresaId";

const defaultUser = {               //! usuario por defecto si no hay token o token vencido
  email: "",                        //! significa que el usuario no esta autenticado
  nombre: "",
  isAuthenticated: false,
  token: "",
  id: -1,
  empresas: [],
  roles: [],
  empresaId: -1,
};

const setToken = (token) => {             //! Guarda el token en local storage
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

const getToken = () => {                  //! Recupera token de localstorage
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY) || null;
  }
};

const removeToken = () => {               //! Elimina el token de localstorage
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMPRESA_ID);
  }
};


export const authenticate = (token) => {  //!
    if (token) {
      setToken(token);                    //Si hay toekn entrante > set en localstorage
    }

    const _token = token ?? getToken();   //Obtiene token actual

    if (!_token) {                  
      return { ...defaultUser };          //! No token > retorna defaultUser      
    }

    const decoded = jwtDecode(_token);    //Decodificar el token JWT
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      removeToken();                      //! Token tiempo expirado, se elimina
      return { ...defaultUser };          //! y retorna default user.
    }

    const currentEmpresa = localStorage.getItem("empresaId"); //Obtiene de localstorage empresa
    
    if (!currentEmpresa) {            // Si no hay empresa la guarda en localStorage
      localStorage.setItem("empresaId", decoded?.empresas[0]?.id);
    }

    return {                              // Si está todo autenticado, retorna datos decodificados
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


//! Funcion logout para cierre de sesión
export const logout = () => {           //! Elimina del localStorage token
  removeToken();

  return { ...defaultUser };            //Retorna el defauluser
};

