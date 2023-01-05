import { Input } from "@material-tailwind/react";
import { useEffect, useMemo, useState } from "react";
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

const schema = yup.object().shape({
  codigo: yup.string().required(),
  nombre: yup.string().required(),
  abreviatura: yup.string().required(),
});
export default function DocumentosAdministrativos() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    codigo: null,
    nombre: null,
    abreviatura: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/documentos-administrativos", {
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
      codigo: null,
      nombre: null,
      abreviatura: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre", accessor: "nombre" },
      { Header: "Abreviatura", accessor: "abreviatura" },
    ],
    []
  );
  const getDocumentosAdministrativos = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/documentos-administrativos?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("getDocumentosAdministrativos", getDocumentosAdministrativos, {
    initialData: {
      data: [],
    },
  });

  const documentosAdministrativos = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateComercial>
        <Title text={"Lista Documentos Administrativos"}>
          <div className="flex gap-4">
            <ButtonAdd text={"Nuevo documento"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={documentosAdministrativos}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateComercial>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Documento administrativo" : "Nuevo Documento administrativo"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input label="Código" onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
          <div className="flex gap-5">
            <Input label="Nombre" onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <Input
              label="Abreviatura"
              onChange={(e) => setForm({ ...form, abreviatura: e.target.value })}
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
        title={"Eliminar Documento administrativo"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
