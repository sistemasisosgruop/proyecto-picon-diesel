import { useState } from "react";

export const useModal = () => {

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);


  const openModal = (isEdit) => {
		setIsOpenModal(true);
		setIsEdit(isEdit);
  };

  const closeModal = () => {
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