import { Input } from "@material-tailwind/react";
import { useEffect, useMemo, useState } from "react";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import {
  Modal,
  ModalConfirmDelete,
} from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateComercial from "../../../../app/components/templates/mantenimiento/TemplateComercial";
import { useModal } from "../../../../app/hooks/useModal";
import * as yup from "yup";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastContainer, toast } from "react-toastify";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { useQuery } from "react-query";

const schema = yup.object().shape({
  motivo: yup.string().required(),
  descripcion: yup.string().required(),
});

export default function MotivoGuiaRemision() {
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
    motivo: null,
    descripcion: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      await axiosRequest(
        "post",
        "/api/mantenimiento/motivo-traslado-guia-de-remision",
        {
          ...form,
          empresaId: parseInt(empresaId),
        }
      );

      toast.success(`🦄 Registro guardado exitosamente!`, successProps);
      setChangeData(!changeData);
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  useEffect(() => {
    setForm({
      motivo: null,
      descripcion: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Motivo", accessor: "motivo" },
      { Header: "Descripción", accessor: "descripcion" },
    ],
    []
  );

  const getMotivos = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/motivo-traslado-guia-de-remision?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("getMotivos", getMotivos, {
    initialData: {
      data: [],
    },
  });

  const motivos = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateComercial>
        <Title text={"Lista Motivos de traslado de Guia de Remision"}>
          <div className="flex gap-4">
            <ButtonAdd text={"Nuevo motivo"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={motivos}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateComercial>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Motivo" : "Nuevo Motivo"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Motivo"
            onChange={(e) => setForm({ ...form, motivo: e.target.value })}
          />
          <Input
            label="Descripcion"
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>
      <ToastContainer />
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        title={"Eliminar Motivo"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
