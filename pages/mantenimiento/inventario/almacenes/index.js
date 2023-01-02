import { Input } from "@material-tailwind/react";
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
import TemplateInventario from "../../../../app/components/templates/mantenimiento/TemplateInventario";
import { useModal } from "../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import * as yup from "yup";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { ToastContainer, toast } from "react-toastify";

const schema = yup.object().shape({
  nombre: yup.string().required(),
  direccion: yup.string().required(),
  telefono: yup.string().required(),
});

export default function FactorInternamiento() {
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
    direccion: null,
    telefono: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/almacenes", {
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
      direccion: null,
      telefono: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre", accessor: "nombre" },
      { Header: "Dirección", accessor: "direccion" },
      { Header: "Teléfono", accessor: "telefono" },
    ],
    []
  );
  const getAlmacenes = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/almacenes?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("getAlmacenes", getAlmacenes, {
    initialData: {
      data: [],
    },
  });

  const almacenes = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateInventario>
        <Title text={"Lista Almacenes"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd
              text={"Nuevo almacen"}
              onClick={() => openModal(false)}
            />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={almacenes}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateInventario>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar almacen" : "Nuevo almacen"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Nombre"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <Input
            label="Dirección"
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />
          <Input
            label="Teléfono"
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
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
        title={"Eliminar Almacen"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
