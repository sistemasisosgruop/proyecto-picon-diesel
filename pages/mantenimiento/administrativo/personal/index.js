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
import TemplateAdministrativo from "../../../../app/components/templates/mantenimiento/TemplateAdministrativo";
import { useModal } from "../../../../app/hooks/useModal";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import * as yup from "yup";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  nombre: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  telefono: yup.string().required(),
  puesto: yup.string().required(),
  direccion: yup.string().required(),
});

export default function Personal() {
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
    email: null,
    password: null,
    telefono: null,
    puesto: null,
    direccion: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/personal", {
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
      email: null,
      password: null,
      telefono: null,
      puesto: null,
      direccion: null,
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
      { Header: "Cargo", accessor: "cargo" },
      { Header: "Area", accessor: "area" },
      { Header: "Estado", accessor: "estado" },
    ],
    []
  );

  const getPersonal = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/personal?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("personal", getPersonal, {
    initialData: {
      data: [],
    },
  });

  const personal = useMemo(
    () =>
      data?.data.map((personal) => ({
        ...personal,
        cargo: "Administrador",
        area: "Administración",
      })),
    [data?.data]
  );

  return (
    <>
      <TemplateAdministrativo>
        <Title text={"Lista Personal"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd
              text={"Nuevo personal"}
              onClick={() => openModal(false)}
            />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={personal}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateAdministrativo>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Personal" : "Nuevo Personal"}
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
              label="Contraseña"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="flex gap-5">
            <Input
              label="Teléfono"
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
            <Input
              label="Dirección"
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
            />
          </div>
          <Input
            label="Puesto"
            onChange={(e) => setForm({ ...form, puesto: e.target.value })}
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        title={"Eliminar Personal"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
