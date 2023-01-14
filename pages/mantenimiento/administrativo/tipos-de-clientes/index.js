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
import TemplateAdministrativo from "../../../../app/components/templates/mantenimiento/TemplateAdministrativo";
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
  tipo: yup.string().required(),
});

export default function TiposClientes() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    tipo: null,
  });

  const { updateForm, elementId, resetInfo, setCsvPath, changeData, setChangeData } =
    useContext(FormContext);

  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  useEffect(() => {
    setForm({
      tipo: null,
    });
  }, [resetInfo]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/clientes/tipos", {
      ...form,
      empresaId: parseInt(empresaId),
    });

    toast.success(`🦄 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/clientes/tipos/${elementId}`, {
      ...form,
    });

    toast.success(`🦄 Registro guardado exitosamente!`, successProps);
  };
  const deleteData = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/clientes/tipos/${elementId}`);
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
      tipo: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Tipo de cliente", accessor: "tipo" },
      { Header: "Estado", accessor: "estado" },
    ],
    []
  );

  const getTipoClientes = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/clientes/tipos?empresaId=${empresaId}`
    );

    return data;
  };
  const { data, refetch } = useQuery("tipoClientes", getTipoClientes, {
    initialData: {
      data: [],
    },
  });

  const tipoClientes = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateAdministrativo>
        <Title text={"Lista Tipos de clientes"}>
          <div className="flex gap-4">
            <ButtonImportData
              handleClick={() =>
                setCsvPath(`/api/mantenimiento/clientes/tipos/upload?empresaId=${empresaId}`)
              }
            />
            <ButtonAdd text={"Nuevo tipo de cliente"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={tipoClientes}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateAdministrativo>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Tipo de cliente" : "Nuevo Tipo de cliente"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Tipo de cliente"
            onChange={(e) => setForm({ tipo: e.target.value })}
            defaultValue={isEdit ? updateForm?.tipo : undefined}
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
        title={"Eliminar Tipo de cliente"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
