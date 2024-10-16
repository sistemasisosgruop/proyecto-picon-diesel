import { Input } from "@material-tailwind/react";
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
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import * as yup from "yup";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { toast } from "react-toastify";
import { FormContext } from "../../../../contexts/form.context";

const schema = yup.object().shape({
  nombre: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  telefono: yup.string().required(),
  puesto: yup.string().required(),
  direccion: yup.string().required(),
  dni:yup.string().required(),
  nombreAbreviado:yup.string().nullable(),
  porcentajeComision:yup.string().nullable(),
});
const schemaUpdate = yup.object().shape({
  nombre: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().nullable(),
  telefono: yup.string().required(),
  puesto: yup.string().required(),
  direccion: yup.string().required(),
  dni:yup.string().required(),
  nombreAbreviado:yup.string().nullable(),
  porcentajeComision:yup.string().nullable(),
});

export default function Personal() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [puestos, setPuestos] = useState();

  const [form, setForm] = useState({
    nombre: null,
    email: null,
    password: null,
    telefono: null,
    puesto: null,
    direccion: null,
    nombreAbreviado:null,
    dni:null,
    porcentajeComision:null
  });
  const { updateForm, elementId, resetInfo, setCsvPath, changeData, setChangeData } =
    useContext(FormContext);
  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/personal", {
      ...form,
      empresaId: parseInt(empresaId),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schemaUpdate.validate(form, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/personal/${elementId}`, {
      ...form,
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const deleteData = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/personal/${elementId}`);
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
      puesto: null,
      direccion: null,
      nombreAbreviado:null,
      dni:null,
      porcentajeComision:null
    });
    refetch();
  }, [changeData]);

  useEffect(() => {
    setForm({
      nombre: null,
      email: null,
      password: null,
      telefono: null,
      puesto: null,
      direccion: null,
      nombreAbreviado:null,
      dni:null,
      porcentajeComision:null
    });
  }, [resetInfo]);

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

  const getPuestos = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/puesto`
    );

    return data;
  };

  const getPersonal = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/personal`
    );
    console.log('PEsonal lista:',personal);
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
            <ButtonImportData
              handleClick={() =>
                setCsvPath(`/api/mantenimiento/personal/upload?empresaId=${empresaId}`)
              }
            />
            <ButtonAdd text={"Nuevo personal"} onClick={() => openModal(false)} />
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
            defaultValue={isEdit ? updateForm?.nombre : undefined}
          />
          <div className="flex gap-5">
            <Input
              label="Nombre Abreviado"
              onChange={(e) => setForm({ ...form, nombreAbreviado: e.target.value })}
              defaultValue={isEdit ? updateForm?.nombreAbreviado : undefined}
            />
            <Input
              label="DNI"
              onChange={(e) => setForm({ ...form, dni: e.target.value })}
              defaultValue={isEdit ? updateForm?.dni : undefined}
            />
          </div>
   
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

          <div className="flex gap-5">
          <Input
            label="Puesto"
            onChange={(e) => setForm({ ...form, puesto: e.target.value })}
            defaultValue={isEdit ? updateForm?.puesto : undefined}
          />
          <Input
            label="Porcentaje de comision"
            onChange={(e) => setForm({ ...form, porcentajeComision: e.target.value })}
            defaultValue={isEdit ? updateForm?.porcentajeComision : undefined}
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
        onClick={deleteData}
        title={"Eliminar Personal"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
