"use client";
import { createContext, useState } from "react";

export const MaterialesContext = createContext(null);

export const MaterialesProvider = ({ children }) => {
  const [codigos, setCodigos] = useState({
    reemplazo: [],
    similitud: [],
    equivalencia: [],
    aplicacionMaquina: [],
  });
  const [correlativo, setCorrelativo] = useState("");
  const [selectedMateriales, setSelectedMateriales] = useState({
    materiales: []
  });
  const [modalInfoIsOpen, setInfoIsOpen] = useState(false);
  const [materialInfo, setMaterialInfo] = useState(null);
  const [caracteristicasForm, setCaracteristicasForm] = useState([]);
  const [selectedMaquina, setSelectedMaquina] = useState(null);

  function openInfoModal() {
    setInfoIsOpen(true);
  }

  function afterOpenInfoModal() {
    const subtitle = { style: { color: "" } };
    subtitle.style.color = "#f00";
  }

  function closeInfoModal() {
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
        selectedMaquina,
        setSelectedMaquina
      }}
    >
      {children}
    </MaterialesContext.Provider>
  );
};
