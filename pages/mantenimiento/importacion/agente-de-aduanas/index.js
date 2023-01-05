import { Input, Textarea } from "@material-tailwind/react";
import { useEffect, useMemo, useState } from "react";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonImportData,
  ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import {
  Modal,
  ModalConfirmDelete,
} from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateImportacion from "../../../../app/components/templates/mantenimiento/TemplateImportacion";
import { useModal } from "../../../../app/hooks/useModal";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import * as yup from "yup";
import {  toast } from "react-toastify";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { errorProps, successProps } from "../../../../app/utils/alert-config";

const schema = yup.object().shape({
  nombre: yup.string().required(),
  telefono: yup.string().required(),
  email: yup.string().email().nullable(),
  observaciones: yup.string().nullable(),
});

export default function AgenteAduanas() {
  const {
    isOpenModal,
    isOpenModalDelete,
    isEdit,
    setIsOpenModalDelete,
    closeModal,
    openModal,
  } = useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    nombre: null,
    telefono: null,
    email: null,
    observaciones: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      console.log(empresaId);
      await schema.validate(form, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/agente-aduanas", {
        ...form,
        empresaId: parseInt(empresaId),
      });

      toast.success(`🦄 Registro guardado exitosamente!`, successProps);
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
            <ButtonImportData />
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
          />
          <div className="flex gap-5">
            <Input
              label="Correo"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Teléfono"
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
          </div>
          <Textarea
            label="Observaciones"
            onChange={(e) =>
              setForm({ ...form, observaciones: e.target.value })
            }
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>
       
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        title={"Eliminar Agente de aduanas"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
