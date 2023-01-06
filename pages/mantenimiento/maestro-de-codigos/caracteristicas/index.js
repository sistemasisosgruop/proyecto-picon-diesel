"use client";
import { Input } from "@material-tailwind/react";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonImportData,
  ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import { Modal, ModalConfirmDelete } from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateMaestroCodigos from "../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
import { useModal } from "../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import * as yup from "yup";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { toast } from "react-toastify";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { FormContext } from "../../../../contexts/form.context";

const schema = yup.object().shape({
  codigo: yup.string().required(),
  descripcion: yup.string().required(),
  abreviatura: yup.string().required(),
});

export default function Caracteristicas() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();

  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    codigo: null,
    descripcion: null,
    abreviatura: null,
  });
  const [changeData, setChangeData] = useState(false);
  const { updateForm, elementId, setCsvPath, setUpdateForm } = useContext(FormContext);
  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  useEffect(() => {
    console.log('caracteristicas... ',updateForm);
  }, []);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/maestro-de-codigos/caracteristicas", {
      ...form,
      empresaId: parseInt(empresaId),
    });

    toast.success(`🦄 Registro guardado exitosamente!`, successProps);
  };
  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest(
      "put",
      `/api/mantenimiento/maestro-de-codigos/caracteristicas/${elementId}`,
      {
        ...form,
      }
    );

    toast.success(`🦄 Registro actualizado exitosamente!`, successProps);
  };

  const saveData = async () => {
    try {
      if (isEdit) {
        await updateRegistro();
      } else {
        await createRegistro();
      }
      setChangeData(!changeData);
      closeModal();
      setUpdateForm(null);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  useEffect(() => {
    setForm({
      codigo: null,
      descripcion: null,
      abreviatura: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Descripción", accessor: "descripcion" },
      { Header: "Abreviatura", accessor: "abreviatura" },
    ],
    []
  );

  const getCaracteristicas = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/caracteristicas?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("caracteristicas", getCaracteristicas, {
    initialData: {
      data: [],
    },
  });

  const caracteristicas = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateMaestroCodigos>
        <Title text={"Lista Características"}>
          <div className="flex gap-4">
            <ButtonImportData
              handleClick={() =>
                setCsvPath(
                  `/api/mantenimiento/maestro-de-codigos/caracteristicas/upload?empresaId=${empresaId}`
                )
              }
            />
            <ButtonAdd text={"Nuevo característica"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={caracteristicas}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateMaestroCodigos>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Característica" : "Nuevo Característica"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Código"
            onChange={(e) => {
              setForm({
                ...form,
                codigo: e.target.value,
              });
            }}
            defaultValue={isEdit ? updateForm?.codigo : undefined}
          />
          <Input
            label="Descripción"
            onChange={(e) => {
              setForm({
                ...form,
                descripcion: e.target.value,
              });
            }}
            defaultValue={isEdit ? updateForm?.descripcion : undefined}
          />
          <Input
            label="Abreviatura"
            onChange={(e) => {
              setForm({
                ...form,
                abreviatura: e.target.value,
              });
            }}
            defaultValue={isEdit ? updateForm?.abreviatura : undefined}
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={undefined}
        title={"Eliminar Característica"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
