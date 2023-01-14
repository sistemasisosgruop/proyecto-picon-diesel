import { Checkbox, Input } from "@material-tailwind/react";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonImportData,
  ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import { Modal, ModalConfirmDelete } from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateAdministrativo from "../../../../app/components/templates/mantenimiento/TemplateAdministrativo";
import { useModal } from "../../../../app/hooks/useModal";
import * as yup from "yup";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { toast } from "react-toastify";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { useQuery } from "react-query";
import { FormContext } from "../../../../contexts/form.context";

const schema = yup.object().shape({
  nombre: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  telefono: yup.string().required(),
  direccion: yup.string().required(),
  comision: yup.number().required(),
  aprovacionCotizacion: yup.boolean().required(),
});

export default function Vendedores() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();

  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    nombre: null,
    email: null,
    password: null,
    telefono: null,
    direccion: null,
    comision: null,
    aprovacionCotizacion: false,
  });
  const { updateForm, elementId, resetInfo, changeData, setChangeData, setCsvPath } = useContext(FormContext);
  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  useEffect(() => {
    setForm({
      nombre: null,
      email: null,
      password: null,
      telefono: null,
      direccion: null,
      comision: null,
      aprovacionCotizacion: false,
    });
  }, [resetInfo]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/vendedores", {
      ...form,
      empresaId: parseInt(empresaId),
    });

    toast.success(`🦄 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/vendedores/${elementId}`, {
      ...form,
    });

    toast.success(`🦄 Registro guardado exitosamente!`, successProps);
  };

  const deleteData = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/vendedores/${elementId}`);
      toast.success(`🗑️ Registro eliminado exitosamente!`, successProps);
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const saveData = async () => {
    try {
      if (isEdit) {
        await updateRegistro();
      } else {
        await createRegistro();
      }
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
      direccion: null,
      comision: null,
      aprovacionCotizacion: false,
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
      { Header: "Dirección", accessor: "direccion" },
      { Header: "% Comision", accessor: "comision" },
      { Header: "Aprobar Cotización", accessor: "aprovacionCotizacion" },
      { Header: "Estado", accessor: "estado" },
    ],
    []
  );

  const getVendedores = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/vendedores?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("vendedores", getVendedores, {
    initialData: {
      data: [],
    },
  });

  const vendedores = useMemo(
    () =>
      data?.data.map((vendedor) => ({
        ...vendedor,
        aprovacionCotizacion: vendedor.aprovacionCotizacion ? "Si" : "No",
      })),
    [data?.data]
  );

  return (
    <>
      <TemplateAdministrativo>
        <Title text={"Lista Vendedores"}>
          <div className="flex gap-4">
            <ButtonImportData
              handleClick={() =>
                setCsvPath(
                  `/api/mantenimiento/vendedores/upload?empresaId=${empresaId}`
                )
              }
            />
            <ButtonAdd text={"Nuevo vendedor"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={vendedores}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateAdministrativo>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Vendedor" : "Nuevo Vendedor"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input label="Nombre" onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <div className="flex gap-5">
            <Input
              label="Correo"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              defaultValue={isEdit ? updateForm?.email : undefined}
            />
            <Input
              label="Contraseña"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              defaultValue={isEdit ? updateForm?.password : undefined}
            />
          </div>
          <div className="flex gap-5">
            <Input
              label="Teléfono"
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              defaultValue={isEdit ? updateForm?.telefono : undefined}
            />
            <Input
              label="Dirección"
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              defaultValue={isEdit ? updateForm?.direccion : undefined}
            />
          </div>
          <Input
            label="% Comision"
            type="number"
            onChange={(e) => setForm({ ...form, comision: e.target.value })}
            defaultValue={isEdit ? updateForm?.comision : undefined}
          />
          <Checkbox
            label="Aprobación de cotización"
            onChange={(e) => setForm({ ...form, aprovacionCotizacion: e.target.checked })}
            defaultChecked={isEdit && updateForm?.aprovacionCotizacion === "Si" ? true : undefined}
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={deleteData}
        title={"Eliminar Personal"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
