import { Input } from "@material-tailwind/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { ButtonAdd, ButtonCancel, ButtonSave } from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import { Modal, ModalConfirmDelete } from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateComercial from "../../../../app/components/templates/mantenimiento/TemplateComercial";
import { useModal } from "../../../../app/hooks/useModal";
import * as yup from "yup";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { toast } from "react-toastify";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { useQuery } from "react-query";
import { FormContext } from "../../../../contexts/form.context";

const schema = yup.object().shape({
  codigo: yup.string().required(),
  numeroDeSerie: yup.string().required(),
  nombre: yup.string().required(),
  abreviatura: yup.string().required(),
});

export default function DocumentosContables() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    codigo: null,
    numeroDeSerie: null,
    nombre: null,
    abreviatura: null,
  });

  const { updateForm, elementId, resetInfo, changeData, setChangeData } = useContext(FormContext);

  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  useEffect(() => {
    setForm({
      codigo: null,
      numeroDeSerie: null,
      nombre: null,
      abreviatura: null,
    });
  }, [resetInfo]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/documentos-contables", {
      ...form,
      empresaId: parseInt(empresaId),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("PUT", `/api/mantenimiento/documentos-contables/${elementId}`, {
      ...form,
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };
  const deleteData = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/documentos-contables/${elementId}`);
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
      codigo: null,
      numeroDeSerie: null,
      nombre: null,
      abreviatura: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "N° de serie", accessor: "numeroDeSerie" },
      { Header: "Nombre", accessor: "nombre" },
      { Header: "Abreviatura", accessor: "abreviatura" },
    ],
    []
  );
  const getDocumentosContables = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/documentos-contables?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("getDocumentosContables", getDocumentosContables, {
    initialData: {
      data: [],
    },
  });

  const documentosContables = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateComercial>
        <Title text={"Lista Documentos Contables"}>
          <div className="flex gap-4">
            <ButtonAdd text={"Nuevo documento"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={documentosContables}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateComercial>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Documento contable" : "Nuevo Documento contable"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <div className="flex gap-5">
            <Input
              label="Código"
              onChange={(e) => setForm({ ...form, codigo: e.target.value })}
              defaultValue={isEdit ? updateForm?.codigo : undefined}
            />
            <Input
              label="N° de serie"
              onChange={(e) => setForm({ ...form, numeroDeSerie: e.target.value })}
              defaultValue={isEdit ? updateForm?.numeroDeSerie : undefined}
            />
          </div>
          <div className="flex gap-5">
            <Input
              label="Nombre"
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              defaultValue={isEdit ? updateForm?.nombre : undefined}
            />
            <Input
              label="Abreviatura"
              onChange={(e) => setForm({ ...form, abreviatura: e.target.value })}
              defaultValue={isEdit ? updateForm?.abreviatura : undefined}
            />
          </div>
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>

      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={deleteData}
        title={"Eliminar Documento contable"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
