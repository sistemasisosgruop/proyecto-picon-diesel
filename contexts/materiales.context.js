"use client";
import { createContext, useState } from "react";

export const MaterialesContext = createContext(null);

export const MaterialesProvider = ({ children }) => { //! COMPONENTE PROVEEDOR A TODOS LOS HIJOS PARA ACCEDER A SUS DATOS
  const [codigos, setCodigos] = useState({
    reemplazo: [],
    similitud: [],
    equivalencia: [],
    aplicacionMaquina: [],
  });
  const [correlativo, setCorrelativo] = useState("");
  const [selectedMateriales, setSelectedMateriales] = useState(null);
  const [modalInfoIsOpen, setInfoIsOpen] = useState(false);
  const [materialInfo, setMaterialInfo] = useState(null);
  const [caracteristicasForm, setCaracteristicasForm] = useState([]);

  function openInfoModal() {      //! Cambia el estado para abir modal
    setInfoIsOpen(true);
  }

  function afterOpenInfoModal() {
    const subtitle = { style: { color: "" } };
    subtitle.style.color = "#f00";
  }

  function closeInfoModal() {     //! Cambia el estado para cerrar modal
    setInfoIsOpen(false);
  }

  return (
    <MaterialesContext.Provider
      value={{
        codigos,
        setCodigos,
        selectedMateriales,
        setSelectedMateriales,
        correlativo,
        setCorrelativo,
        modalInfoIsOpen,
        openInfoModal,
        afterOpenInfoModal,
        closeInfoModal,
        materialInfo,
        setMaterialInfo,
        caracteristicasForm,
        setCaracteristicasForm,
      }}
    >
      {children}
    </MaterialesContext.Provider>
  );
};
