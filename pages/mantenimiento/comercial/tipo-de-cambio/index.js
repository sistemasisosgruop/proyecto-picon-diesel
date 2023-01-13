import { Input } from "@material-tailwind/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { ButtonAdd, ButtonCancel, ButtonSave } from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import { Modal, ModalConfirmDelete } from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateComercial from "../../../../app/components/templates/mantenimiento/TemplateComercial";
import { useModal } from "../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import * as yup from "yup";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { toast } from "react-toastify";
import { FormContext } from "../../../../contexts/form.context";

const schema = yup.object().shape({
  de: yup.string().required(),
  a: yup.string().required(),
  valor: yup.number().required(),
  fecha: yup.string().required(),
});

export default function TipoDeCambio() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    de: null,
    a: null,
    valor: null,
    fecha: null,
  });
  const [changeData, setChangeData] = useState(false);
  const { updateForm, elementId, resetInfo } = useContext(FormContext);

  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  useEffect(() => {
    setForm({
      de: null,
      a: null,
      valor: null,
      fecha: null,
    });
  }, [resetInfo]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/tipo-de-cambio", {
      ...form,
      fecha: new Date(form.fecha).toISOString(),
      valor: parseFloat(form.valor),
      empresaId: parseInt(empresaId),
    });

    toast.success(`🦄 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/tipo-de-cambio/${elementId}`, {
      ...form,
      fecha: new Date(form.fecha).toISOString(),
      valor: parseFloat(form.valor),
    });

    toast.success(`🦄 Registro guardado exitosamente!`, successProps);
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
      de: null,
      a: null,
      valor: null,
      fecha: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "De", accessor: "de" },
      { Header: "A", accessor: "a" },
      { Header: "Valor", accessor: "valor" },
      { Header: "Fecha", accessor: "fecha" },
    ],
    []
  );

  const getTiposCambio = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/tipo-de-cambio?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("getTiposCambio", getTiposCambio, {
    initialData: {
      data: [],
    },
  });

  const tiposDeCambio = useMemo(
    () =>
      data?.data.map(({ fecha, ...data }) => ({
        ...data,
        fecha: fecha.split("T")[0],
      })),
    [data?.data]
  );

  return (
    <>
      <TemplateComercial>
        <Title text={"Lista Tipo de Cambio"}>
          <div className="flex gap-4">
            <ButtonAdd text={"Nuevo tipo de cambio"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={tiposDeCambio}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateComercial>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Tipo de cambio" : "Nuevo Tipo de cambio"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <div className="flex gap-5">
            <Input
              label="De"
              onChange={(e) => setForm({ ...form, de: e.target.value })}
              defaultValue={isEdit ? updateForm?.de : undefined}
            />
            <Input
              label="A"
              onChange={(e) => setForm({ ...form, a: e.target.value })}
              defaultValue={isEdit ? updateForm?.a : undefined}
            />
          </div>
          <div className="flex gap-5">
            <Input
              label="Valor"
              type="number"
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
              defaultValue={isEdit ? updateForm?.valor : undefined}
            />
            <Input
              label="Fecha"
              type="date"
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              defaultValue={isEdit ? updateForm?.fecha : undefined}
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
        title={"Eliminar Tipo de cambio"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
