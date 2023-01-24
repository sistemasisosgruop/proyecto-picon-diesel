import { Input, Textarea } from "@material-tailwind/react";
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
import TemplateImportacion from "../../../../app/components/templates/mantenimiento/TemplateImportacion";
import { useModal } from "../../../../app/hooks/useModal";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import * as yup from "yup";
import { toast } from "react-toastify";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { FormContext } from "../../../../contexts/form.context";

const schema = yup.object().shape({
  nombre: yup.string().required(),
  telefono: yup.string().required(),
  email: yup.string().email().nullable(),
  observaciones: yup.string().nullable(),
});

export default function AgenteAduanas() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    nombre: null,
    telefono: null,
    email: null,
    observaciones: null,
  });

  const { updateForm, elementId, resetInfo, changeData, setChangeData, setCsvPath } =
    useContext(FormContext);

  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  useEffect(() => {
    setForm({
      nombre: null,
      telefono: null,
      email: null,
      observaciones: null,
    });
  }, [resetInfo]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/agente-aduanas", {
      ...form,
      empresaId: parseInt(empresaId),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/agente-aduanas/${elementId}`, {
      ...form,
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };
  const deleteData = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/agente-aduanas/${elementId}`);
      toast.success(`🗑️ Registro eliminado exitosamente!`, successProps);
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
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
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  useEffect(() => {
    setForm({
      nombre: null,
      telefono: null,
      email: null,
      observaciones: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre", accessor: "nombre" },
      { Header: "Correo", accessor: "email" },
      { Header: "Teléfono", accessor: "telefono" },
      { Header: "Observaciones", accessor: "observaciones" },
    ],
    []
  );
  const getAgentes = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/agente-aduanas?empresaId=${empresaId}`
    );

    return data;
  };
  const { data, refetch } = useQuery("getAgentes", getAgentes, {
    initialData: {
      data: [],
    },
  });

  const agentes = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateImportacion>
        <Title text={"Lista Agente de aduanas"}>
          <div className="flex gap-4">
            <ButtonImportData
              handleClick={() =>
                setCsvPath(`/api/mantenimiento/agente-aduanas/upload?empresaId=${empresaId}`)
              }
            />
            <ButtonAdd text={"Nuevo agente"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={agentes}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateImportacion>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Agente de aduanas" : "Nuevo Agente de aduanas"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Nombre"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            defaultValue={isEdit ? updateForm?.nombre : undefined}
          />
          <div className="flex gap-5">
            <Input
              label="Correo"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              defaultValue={isEdit ? updateForm?.email : undefined}
            />
            <Input
              label="Teléfono"
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              defaultValue={isEdit ? updateForm?.telefono : undefined}
            />
          </div>
          <Textarea
            label="Observaciones"
            onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
            defaultValue={isEdit ? updateForm?.observaciones : undefined}
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
        title={"Eliminar Agente de aduanas"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
