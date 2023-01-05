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
import * as yup from "yup";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import {  toast } from "react-toastify";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { useQuery } from "react-query";

const schema = yup.object().shape({
  nombre: yup.string().required(),
  descripcion: yup.string().required(),
});

export default function TiposVias() {
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
    descripcion: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/tipo-vias", {
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
      descripcion: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre", accessor: "nombre" },
      { Header: "Descripción", accessor: "descripcion" },
    ],
    []
  );

  const getTipoVias = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/tipo-vias?empresaId=${empresaId}`
    );

    return data;
  };
  const { data, refetch } = useQuery("getTipoVias", getTipoVias, {
    initialData: {
      data: [],
    },
  });

  const tipoVias = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateImportacion>
        <Title text={"Lista Tipos de vías"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd text={"Nuevo tipo"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={tipoVias}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateImportacion>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Tipo de vía" : "Nuevo Tipo de vía"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Nombre"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <Textarea
            label="Descripción"
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>
       
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        title={"Eliminar Tipo de vía"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
