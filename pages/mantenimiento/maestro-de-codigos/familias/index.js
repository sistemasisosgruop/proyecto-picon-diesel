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
import TableMaestroCodigos from "../../../../app/components/modules/TableMaestroCodigos";
import TemplateMaestroCodigos from "../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
import { useModal } from "../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import * as yup from "yup";
import { toast } from "react-toastify";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { FormContext } from "../../../../contexts/form.context";

const schema = yup.object().shape({
  codigo: yup.string().required(),
  descripcion: yup.string().required(),
});

export default function Familias() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    codigo: null,
    descripcion: null,
  });

  const { updateForm, elementId, setCsvPath, changeData, setChangeData } = useContext(FormContext);

  const saveData = async () => {
    try {
      if (isEdit) {
        await updateRegistro();
      } else {
        await createRegistro();
      }
      setChangeData(!changeData);
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };
  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/maestro-de-codigos/familias", {
      ...form,
      empresaId: parseInt(empresaId),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };
  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/maestro-de-codigos/familias/${elementId}`, {
      ...form,
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };
  const deleteData = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/maestro-de-codigos/familias/${elementId}`);
      toast.success(`🗑️ Registro eliminado exitosamente!`, successProps);
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  useEffect(() => {
    setForm({
      codigo: null,
      descripcion: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Descripción", accessor: "descripcion" },
    ],
    []
  );

  const getFamilias = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/familias?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("familias", getFamilias, {
    refetchOnMount: true,
    initialData: {
      data: [],
    },
  });

  const familias = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateMaestroCodigos>
        <Title text={"Lista Familias"}>
          <div className="flex gap-4">
            <ButtonImportData
              handleClick={() =>
                setCsvPath(
                  `/api/mantenimiento/maestro-de-codigos/familias/upload?empresaId=${empresaId}`
                )
              }
            />
            <ButtonAdd text={"Nueva familia"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableMaestroCodigos
          columns={columns}
          data={familias}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateMaestroCodigos>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar familia" : "Nuevo familia"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Código"
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            defaultValue={isEdit ? updateForm?.codigo : undefined}
          />
          <Input
            label="Descripción"
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            defaultValue={isEdit ? updateForm?.descripcion : undefined}
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={deleteData}
        title={"Eliminar familia"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
