"use client";
import { useContext, useState } from "react";
import { FormContext } from "../../contexts/form.context";
import { MaterialesContext } from "../../contexts/materiales.context";

export const useModal = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { resetInfo, setResetInfo, changeData, setChangeData, setUpdateForm } =
    useContext(FormContext);
  const { setCodigos, setCorrelativo, setMaterialInfo } = useContext(MaterialesContext);

  const openModal = (isEdit) => {
    setIsOpenModal(true);
    setIsEdit(isEdit);
  };

  const closeModal = () => {
    setChangeData(!changeData);
    setCorrelativo("");
    setResetInfo(!resetInfo);
    setCodigos({
      reemplazo: [],
      similitud: [],
      equivalencia: [],
      aplicacionMaquina: [],
    });
    setUpdateForm(null);
    setMaterialInfo(null);
    setIsOpenModal(false);
  };

  return {
    isOpenModal,
    isOpenModalDelete,
    isEdit,
    setIsOpenModalDelete,
    closeModal,
    openModal,
  };
};
