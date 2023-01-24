import { Input } from "@material-tailwind/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { ButtonAdd, ButtonCancel, ButtonSave } from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import { Modal, ModalConfirmDelete } from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import { useModal } from "../../../../app/hooks/useModal";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { useQuery } from "react-query";
import * as yup from "yup";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { toast } from "react-toastify";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { FormContext } from "../../../../contexts/form.context";
import TemplateReportes from "../../../../app/components/templates/venta-mostrador/TemplateReportes";

const schema = yup.object().shape({
  nombre: yup.string().required(),
  responsable: yup.string().required(),
});

export default function CentroCostos() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    nombre: null,
    responsable: null,
  });

  const { updateForm, elementId, resetInfo, changeData, setChangeData } = useContext(FormContext);

  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  useEffect(() => {
    setForm({
      nombre: null,
      responsable: null,
    });
  }, [resetInfo]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/centro-costos", {
      ...form,
      empresaId: parseInt(empresaId),
    });

    toast.success(`🦄 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/centro-costos/${elementId}`, {
      ...form,
    });

    toast.success(`🦄 Registro guardado exitosamente!`, successProps);
  };
  const deleteData = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/centro-costos/${elementId}`);
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
      responsable: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "N° Reporte", accessor: "numeroDeReporte" },
      { Header: "Desde", accessor: "desde" },
      { Header: "Hasta", accessor: "hasta" },
    ],
    []
  );

  const getCostos = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/centro-costos?empresaId=${empresaId}`
    );

    return data;
  };
  const { data, refetch } = useQuery("costos", getCostos, {
    initialData: {
      data: [],
    },
  });

  const costos = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateReportes>
        <Title text={"Reportes de record de clientes"}>
          <div className="flex gap-4">
            <ButtonAdd text={"Nuevo reporte"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={costos}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateReportes>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Centro de costos" : "Nuevo Centro de costos"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <div className="flex gap-5">
            <Input
              label="Nombre"
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              defaultValue={isEdit ? updateForm?.nombre : undefined}
            />
            <Input
              label="Responsable"
              onChange={(e) => setForm({ ...form, responsable: e.target.value })}
              defaultValue={isEdit ? updateForm?.responsable : undefined}
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
        title={"Eliminar Centro de Costos"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
