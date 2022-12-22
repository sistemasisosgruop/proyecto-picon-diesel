import { createContext, useState } from "react";

export const EmpresaContext = createContext(null);

export const EmpresaProvider = ({ children }) => {
  const [empresa, setEmpresa] = useState({ id: "", nombre: "" });
  return (
    <EmpresaContext.Provider value={{ empresa, setEmpresa }}>
      {children}
    </EmpresaContext.Provider>
  );
};
