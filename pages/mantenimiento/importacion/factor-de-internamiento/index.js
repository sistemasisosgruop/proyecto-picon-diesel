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
import TemplateImportacion from "../../../../app/components/templates/mantenimiento/TemplateImportacion";
import { useModal } from "../../../../app/hooks/useModal";
import * as yup from "yup";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { FormContext } from "../../../../contexts/form.context";

const schema = yup.object().shape({
  valor: yup.number().required(),
  fecha: yup.string().required(),
});

export default function FactorInternamiento() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    valor: null,
    fecha: null,
  });

  const { updateForm, elementId, resetInfo, changeData, setChangeData, setCsvPath } =
    useContext(FormContext);

  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  useEffect(() => {
    setForm({
      valor: null,
      fecha: null,
    });
  }, [resetInfo]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/factor-internamiento", {
      valor: parseFloat(form.valor),
      fecha: new Date(form.fecha).toISOString(),
      empresaId: parseInt(empresaId),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/factor-internamiento/${elementId}`, {
      valor: parseFloat(form.valor),
      fecha: new Date(form.fecha).toISOString(),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };
  const deleteData = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/factor-internamiento/${elementId}`);
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
      console.log(error);
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  useEffect(() => {
    setForm({
      valor: null,
      fecha: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Valor", accessor: "valor" },
      { Header: "Fecha", accessor: "fecha" },
    ],
    []
  );
  const getFactorInternamiento = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/factor-internamiento?empresaId=${empresaId}`
    );

    return data;
  };
  const { data, refetch } = useQuery("getFactorInternamiento", getFactorInternamiento, {
    initialData: {
      data: [],
    },
  });

  const factorInternamiento = useMemo(
    () =>
      data?.data.map(({ fecha, ...props }) => ({
        ...props,
        fecha: fecha.split("T")[0],
      })),
    [data?.data]
  );

  return (
    <>
      <TemplateImportacion>
        <Title text={"Lista Factor de internamiento"}>
          <div className="flex gap-4">
            <ButtonImportData
              handleClick={() =>
                setCsvPath(`/api/mantenimiento/factor-internamiento/upload?empresaId=${empresaId}`)
              }
            />
            <ButtonAdd text={"Nuevo factor"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={factorInternamiento}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateImportacion>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar factor de internamiento" : "Nuevo factor de internamiento"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
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
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>

      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={deleteData}
        title={"Eliminar factor de internamiento"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
