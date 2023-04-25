import { Input } from "@material-tailwind/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { ButtonAdd, ButtonCancel, ButtonSave } from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import { ModalConfirmDelete, Modal } from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateGeneral from "../../../../app/components/templates/mantenimiento/TemplateGeneral";
import { useModal } from "../../../../app/hooks/useModal";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import * as yup from "yup";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { toast } from "react-toastify";
import { FormContext } from "../../../../contexts/form.context";

const schema = yup.object().shape({
  codigo: yup.string().required(),
  nombre: yup.string().required(),
});

export default function Paises() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();

  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    codigo: null,
    nombre: null,
  });

  const { updateForm, elementId, changeData, setChangeData } = useContext(FormContext);
  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/paises", {
      ...form,
      empresaId: parseInt(empresaId),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/paises/${elementId}`, {
      ...form,
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const deleteData = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/paises/${elementId}`);
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
      nombre: null,
    });
    refetch();
  }, [changeData]);

  // Datos de los paises
  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre", accessor: "nombre" },
    ],
    []
  );

  const getPaises = async () => {
    const { data } = await axiosRequest("get", `/api/mantenimiento/paises?empresaId=${empresaId}`);

    return data;
  };

  const { data, refetch } = useQuery("paises", getPaises, {
    initialData: {
      data: [],
    },
  });

  const paises = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateGeneral>
        <Title text={"Lista Países"}>
          <ButtonAdd text={"Nuevo País"} onClick={() => openModal(false)} />
        </Title>

        {/* Table List */}
        <TableComplete
          columns={columns}
          data={paises}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateGeneral>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Pais" : "Nuevo Pais"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Codigo"
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            defaultValue={isEdit ? updateForm?.codigo : undefined}
          />
          <Input
            label="Nombre"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            defaultValue={isEdit ? updateForm?.nombre : undefined}
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
        title={"Eliminar País"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
