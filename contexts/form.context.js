"use client";
import { createContext, useState } from "react";

export const FormContext = createContext(null);

export const FormProvider = ({ children }) => {
  const [updateForm, setUpdateForm] = useState(null);
  const [elementId, setElementId] = useState(null);
  const [csvPath, setCsvPath] = useState(null);
  const [needRefetch, setNeedRefetch] = useState(false);
  const [getPath, setGetPath] = useState(null);
  const [resetInfo, setResetInfo] = useState(false);

  return (
    <FormContext.Provider
      value={{
        updateForm,
        setUpdateForm,
        elementId,
        setElementId,
        csvPath,
        setCsvPath,
        needRefetch,
        setNeedRefetch,
        getPath,
        setGetPath,
        resetInfo,
        setResetInfo,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
