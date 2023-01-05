import { Input, Option, Select } from "@material-tailwind/react";
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
import * as yup from "yup";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import {  toast } from "react-toastify";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { useQuery } from "react-query";

const schema = yup.object().shape({
  nombre: yup.string().required(),
  tipoDocumento: yup.string().required(),
  numeroDocumento: yup.string().required(),
  telefono: yup.string().required(),
  email: yup.string().email().required(),
  direccion: yup.string().required(),
});

export default function AgenciaTransporte() {
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
    tipoDocumento: null,
    numeroDocumento: null,
    telefono: null,
    email: null,
    direccion: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/agencia-transporte", {
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
      tipoDocumento: null,
      numeroDocumento: null,
      telefono: null,
      email: null,
      direccion: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre / Razon Social", accessor: "nombre" },
      { Header: "Tipo de documento", accessor: "tipoDocumento" },
      { Header: "N° de documento", accessor: "numeroDocumento" },
      { Header: "Teléfono", accessor: "telefono" },
      { Header: "Correo", accessor: "correo" },
      { Header: "Dirección", accessor: "direccion" },
    ],
    []
  );

  const getAgenciasTransportes = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/agencia-transporte?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery(
    "getAgenciasTransportes",
    getAgenciasTransportes,
    {
      initialData: {
        data: [],
      },
    }
  );

  const agenciasTransportes = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateInventario>
        <Title text={"Lista Agencias de transporte"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd
              text={"Nueva agencia"}
              onClick={() => openModal(false)}
            />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={agenciasTransportes}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateInventario>
      {/* Modal agregar */}
      <Modal
        title={
          isEdit
            ? "Editar Agencia de transporte"
            : "Nueva Agencia de transporte"
        }
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Nombre / Razon Social"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <div className="flex gap-5">
            <Select
              label="Tipo de documento"
              onChange={(value) => setForm({ ...form, tipoDocumento: value })}
            >
              <Option value="DNI">DNI</Option>
              <Option value="RUC">RUC</Option>
            </Select>
            <Input
              label="N° de documento"
              onChange={(e) =>
                setForm({ ...form, numeroDocumento: e.target.value })
              }
            />
          </div>
          <div className="flex gap-5">
            <Input
              label="Teléfono"
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
            <Input
              label="Correo"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <Input
            label="Dirección"
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>
       
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        title={"Eliminar Agencia de transporte"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
