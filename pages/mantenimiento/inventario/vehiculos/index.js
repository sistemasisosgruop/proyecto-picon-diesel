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
  placa: yup.string().required(),
  marca: yup.string().required(),
  modelo: yup.string().required(),
  tipo: yup.string().required(),
  color: yup.string().required(),
  tarjetaPropiedad: yup.string().required(),
  descripcion: yup.string().nullable(),
});

export default function Vehiculos() {
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
    placa: null,
    marca: null,
    modelo: null,
    tipo: null,
    color: null,
    tarjetaPropiedad: null,
    descripcion: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/vehiculos", {
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
      placa: null,
      marca: null,
      modelo: null,
      tipo: null,
      color: null,
      tarjetaPropiedad: null,
      descripcion: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Placa", accessor: "placa" },
      { Header: "Marca", accessor: "marca" },
      { Header: "Modelo", accessor: "modelo" },
      { Header: "Color", accessor: "color" },
      { Header: "Tarjeta de propiedad", accessor: "tarjetaPropiedad" },
      { Header: "Descripción", accessor: "descripcion" },
    ],
    []
  );

  const getVehiculos = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/vehiculos?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("getVehiculos", getVehiculos, {
    initialData: {
      data: [],
    },
  });

  const vehiculos = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateInventario>
        <Title text={"Lista Vehículos"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd
              text={"Nuevo vehículo"}
              onClick={() => openModal(false)}
            />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={vehiculos}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateInventario>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Vehículo" : "Nuevo Vehículo"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <div className="flex gap-5">
            <Input
              label="Placa"
              onChange={(e) => setForm({ ...form, placa: e.target.value })}
            />
            <Input
              label="Marca"
              onChange={(e) => setForm({ ...form, marca: e.target.value })}
            />
          </div>
          <div className="flex gap-5">
            <Input
              label="Modelo"
              onChange={(e) => setForm({ ...form, modelo: e.target.value })}
            />
            <Input
              label="Tipo"
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            />
          </div>
          <div className="flex gap-5">
            <Input
              label="Color"
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
            <Input
              label="Tarjeta de propiedad"
              onChange={(e) =>
                setForm({ ...form, tarjetaPropiedad: e.target.value })
              }
            />
          </div>
          <Input
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
        title={"Eliminar Vehículo"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
