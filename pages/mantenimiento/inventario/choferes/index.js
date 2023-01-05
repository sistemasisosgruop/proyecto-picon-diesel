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
import * as yup from "yup";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import {  toast } from "react-toastify";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { useQuery } from "react-query";

const schema = yup.object().shape({
  nombre: yup.string().required(),
  dni: yup.string().required(),
  licencia: yup.string().required(),
  fechaVencimiento: yup.string().required(),
  tarjetaDePropiedad: yup.string().required(),
  telefono: yup.string().required(),
  email: yup.string().email().required(),
});

export default function Choferes() {
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
    dni: null,
    licencia: null,
    fechaVencimiento: null,
    tarjetaDePropiedad: null,
    telefono: null,
    email: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/choferes", {
        ...form,
        fechaVencimiento: new Date(form.fechaVencimiento).toISOString(),
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
      dni: null,
      licencia: null,
      fechaVencimiento: null,
      tarjetaDePropiedad: null,
      telefono: null,
      email: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre", accessor: "nombre" },
      { Header: "DNI", accessor: "dni" },
      { Header: "Telefono", accessor: "telefono" },
      { Header: "Correo", accessor: "correo" },
      { Header: "Licencia", accessor: "licencia" },
      { Header: "Fecha Vencimiento", accessor: "fechaVencimiento" },
    ],
    []
  );
  const getChoferes = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/choferes?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("getChoferes", getChoferes, {
    initialData: {
      data: [],
    },
  });

  const choferes = useMemo(
    () =>
      data?.data.map(({ fechaVencimiento, ...data }) => ({
        ...data,
        fechaVencimiento: fechaVencimiento.split("T")[0],
      })),
    [data?.data]
  );

  return (
    <>
      <TemplateInventario>
        <Title text={"Lista Choferes"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd text={"Nuevo chofer"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={choferes}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateInventario>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar chofer" : "Nuevo chofer"}
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
              label="DNI"
              onChange={(e) => setForm({ ...form, dni: e.target.value })}
            />
            <Input
              label="Licencia"
              onChange={(e) => setForm({ ...form, licencia: e.target.value })}
            />
          </div>
          <div className="flex gap-5">
            <Input
              label="Fecha de vencimiento"
              type="date"
              onChange={(e) =>
                setForm({ ...form, fechaVencimiento: e.target.value })
              }
            />
            <Input
              label="Tarjeta de propiedad"
              onChange={(e) =>
                setForm({ ...form, tarjetaDePropiedad: e.target.value })
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
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
        title={"Eliminar Chofer"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
