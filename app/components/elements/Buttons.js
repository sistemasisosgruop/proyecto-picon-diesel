"use client";
import { Tooltip } from "@material-tailwind/react";
import { Add, Edit, Eye, Note, TableDocument, TrushSquare } from "iconsax-react";
import Link from "next/link";
import { useContext, useState, useEffect, useRef } from "react";
import { Excel } from "./icons/Excel";
import { FormContext } from "../../../contexts/form.context";
import { axiosRequest } from "../../utils/axios-request";
import { toast } from "react-toastify";
import { successProps } from "../../utils/alert-config";
import { useMutation } from "react-query";

export const ButtonAdd = ({ text, onClick }) => {
  return (
    <button
      type="button"
      className="flex justify-center items-center p-[10px] gap-1 bg-secundary text-primary rounded-lg cursor-pointer hover:bg-secundary-800"
      onClick={onClick}
    >
      <Add />
      {text}
    </button>
  );
};

export const ButtonEdit = ({ onClick }) => {
  return (
    <Tooltip content="Editar" className="bg-white text-primary-800 shadow">
      <button
        type="button"
        className="flex justify-center items-center p-[6px] bg-primary-50 shadow text-primary-500 hover:text-primary-800 rounded-lg cursor-pointer hover:bg-primary-100 "
        onClick={onClick}
      >
        <Edit />
      </button>
    </Tooltip>
  );
};

export const ButtonDelete = ({ onClick }) => {
  return (
    <Tooltip content="Eliminar" className="bg-white text-primary-600 shadow">
      <button
        type="button"
        className="flex justify-center items-center p-[6px] bg-primary-100 shadow text-primary-500 hover:text-primary-800 rounded-lg cursor-pointer hover:bg-primary-200"
        onClick={onClick}
      >
        <TrushSquare />
      </button>
    </Tooltip>
  );
};

export const ButtonInspect = ({ onClick }) => {
  return (
    <Tooltip content="Ver" className="bg-white text-primary-600 shadow">
      <button
        type="button"
        className="flex justify-center items-center p-[6px] bg-primary-100 shadow text-primary-500 hover:text-primary-800 rounded-lg cursor-pointer hover:bg-primary-200"
        onClick={onClick}
      >
        <Eye />
      </button>
    </Tooltip>
  );
};

export const ButtonPDF = ({ onClick }) => {
  return (
    <Tooltip content="Ver PDF" className="bg-white text-primary-600 shadow">
      <button
        type="button"
        className="flex justify-center items-center p-[6px] bg-primary-100 shadow text-primary-500 hover:text-primary-800 rounded-lg cursor-pointer hover:bg-primary-200"
        onClick={onClick}
      >
        <TableDocument />
      </button>
    </Tooltip>
  );
};

export const ButtonSave = ({ onClick }) => {
  return (
    <button
      type="button"
      className="flex justify-center items-center p-[10px] gap-1 bg-secundary text-primary rounded-lg cursor-pointer hover:bg-secundary-800 shadow-md"
      onClick={onClick}
    >
      Guardar
    </button>
  );
};
export const ButtonCancel = ({ onClick }) => {
  return (
    <button
      type="button"
      className="flex justify-center items-center p-[10px] gap-1 bg-primary-50 shadow-md text-primary rounded-lg cursor-pointer hover:bg-primary-100"
      onClick={onClick}
    >
      Cancelar
    </button>
  );
};

export const ButtonImportData = ({ handleClick = undefined }) => {
  const [fileExcel, setfileExcel] = useState(null);
  const { csvPath, setCsvPath } = useContext(FormContext);
  const fileInput = useRef(null);

  const handleFile = async (e) => {
    setfileExcel(e.target.files[0]);
  };

  const mutate = useMutation(() => {
    const formData = new FormData();
    formData.append("file", fileExcel);
    return axiosRequest("POST", csvPath, formData, "text/csv");
  });

  useEffect(() => {
    if (!fileExcel) return;

    const loadPromise = mutate.mutateAsync();
    toast
      .promise(loadPromise, {
        pending: "Importando data...",
      })
      .then(() => toast.success("Data importada correctamente", successProps));

    fileInput.current.value = "";
    setCsvPath("");
  }, [fileExcel]);

  return (
    <>
      <input
        onClick={handleClick}
        type="file"
        name="excel"
        id="excel"
        className="w-0 h-0 opacity-0 overflow-hidden absolute z-[-1]"
        accept=".xlsx, .xls, .csv"
        onChange={(e) => handleFile(e)}
        ref={fileInput}
      />
      <label
        htmlFor="excel"
        className=" flex justify-center items-center p-[10px] gap-1 bg-primary-50 shadow-md text-primary rounded-lg cursor-pointer hover:bg-primary-100"
      >
        <Excel />
        <p className="max-w-xs text-ellipsis whitespace-nowrap overflow-hidden">
          {fileExcel && mutate.isLoading ? fileExcel.name : "Importar data"}
        </p>
      </label>
    </>
  );
};

export const ButtonSubfamilia = ({ link }) => {
  return (
    <Link
      href={link}
      type="button"
      className="flex justify-center items-center p-[10px] gap-1 bg-primary-300 shadow-md text-primary-700 rounded-lg cursor-pointer hover:bg-primary hover:text-white transition-colors"
    >
      Subfamilia
    </Link>
  );
};

export const ButtonCodigos = ({ text, onClick }) => {
  return (
    <Tooltip content={text} className="bg-white text-primary-800 shadow">
      <button
        type="button"
        className="flex justify-center items-center p-[10px] gap-1 bg-primary-50 shadow-md text-primary rounded-lg cursor-pointer hover:bg-primary-100"
        onClick={onClick}
      >
        <Note />
      </button>
    </Tooltip>
  );
};
