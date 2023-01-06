"use client"
import { useContext, useState } from "react";
import { FormContext } from "../../contexts/form.context";

export const useModal = () => {

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { resetInfo, setResetInfo } = useContext(FormContext);


  const openModal = (isEdit) => {
		setIsOpenModal(true);
		setIsEdit(isEdit);
  };

  const closeModal = () => {
    setResetInfo(!resetInfo);
    setIsOpenModal(false);
  };

  return {
    isOpenModal,
    isOpenModalDelete,
    isEdit,
    setIsOpenModalDelete,
    closeModal,
    openModal,
  }
}