"use client";
import { createContext, useState } from "react";

export const FormContext = createContext(null);

export const FormProvider = ({ children }) => {
  const [updateForm, setUpdateForm] = useState(null);
  const [elementId, setElementId] = useState(null);
  const [csvPath, setCsvPath] = useState(null);

  return (
    <FormContext.Provider
      value={{ updateForm, setUpdateForm, elementId, setElementId, csvPath, setCsvPath }}
    >
      {children}
    </FormContext.Provider>
  );
};
