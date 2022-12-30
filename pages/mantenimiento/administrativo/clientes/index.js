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
import TemplateAdministrativo from "../../../../app/components/templates/mantenimiento/TemplateAdministrativo";
import { useModal } from "../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { useQuery } from "react-query";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";

const schema = yup.object().shape({
  nombre: yup.string().required(),
  tipoDocumento: yup.string().required(),
  numeroDocumento: yup.number().required(),
  email: yup.string().email().required(),
  telefono: yup.string().required(),
  tipo: yup.number().required(),
});

export default function Clientes() {
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
    tipoDocumento: null,
    telefono: null,
    tipo: null,
    numeroDocumento: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/clientes", {
        ...form,
        empresaId: parseInt(empresaId),
        tipoClienteId: parseInt(form.tipo),
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
      tipoDocumento: null,
      telefono: null,
      tipo: null,
      numeroDocumento: null,
    });
    refetch();
  }, [changeData]);
  
  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre", accessor: "nombre" },
      { Header: "Tipo Documento", accessor: "tipoDocumento" },
      { Header: "N° de documento", accessor: "numeroDocumento" },
      { Header: "Tipo", accessor: "tipo" },
      { Header: "Teléfono", accessor: "telefono" },
      { Header: "Correo", accessor: "email" },
      { Header: "Estado", accessor: "estado" },
    ],
    []
  );

  const getTipoClientes = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/clientes/tipos?empresaId=${empresaId}`
    );

    return data;
  };
  const { data: tipoClientes } = useQuery("tipoClientes", getTipoClientes, {
    initialData: {
      data: [],
    },
  });

  const getClientes = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/clientes?empresaId=${empresaId}`
    );

    return data;
  };
  const { data, refetch } = useQuery("clientes", getClientes, {
    initialData: {
      data: [],
    },
  });

  const clientes = useMemo(
    () =>
      data?.data.map(({ tipoCliente, ...props }) => ({
        ...props,
        tipo: tipoCliente?.tipo,
      })),
    [data?.data]
  );

  return (
    <>
      <TemplateAdministrativo>
        <Title text={"Lista Clientes / Proveedores"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd
              text={"Nuevo cliente / proveedor"}
              onClick={() => openModal(false)}
            />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={clientes}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateAdministrativo>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Cliente" : "Nuevo Cliente"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Nombre o Razon Social"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <div className="flex gap-5">
            <Select
              label="Tipo de documento"
              onChange={(value) =>
                setForm({
                  ...form,
                  tipoDocumento: value.toString().toUpperCase(),
                })
              }
            >
              <Option value="dni">DNI</Option>
              <Option value="ruc">RUC</Option>
            </Select>
            <Input
              label="N° de documento"
              type="number"
              onChange={(e) =>
                setForm({ ...form, numeroDocumento: e.target.value })
              }
            />
          </div>
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
          <Select
            label="Tipo"
            onChange={(value) => setForm({ ...form, tipo: value })}
          >
            {tipoClientes?.data?.map((item) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.tipo}
                </Option>
              );
            })}
          </Select>
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>
      <ToastContainer />
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        title={"Eliminar Cliente"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
