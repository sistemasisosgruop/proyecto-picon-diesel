"use client";
import { useRouter } from "next/router";
import { Input } from "@material-tailwind/react";
import { Back } from "iconsax-react";
import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonImportData,
  ButtonSave,
} from "../../../../../../app/components/elements/Buttons";
import { Title } from "../../../../../../app/components/elements/Title";
import { Modal, ModalConfirmDelete } from "../../../../../../app/components/modules/Modal";
import TableComplete from "../../../../../../app/components/modules/TableComplete";
import TemplatePresupuesto from "../../../../../../app/components/templates/mantenimiento/TemplatePresupuesto";
import { useModal } from "../../../../../../app/hooks/useModal";
import axios from "axios";
import { useQuery } from "react-query";
import * as yup from "yup";
import { axiosRequest } from "../../../../../../app/utils/axios-request";
import { errorProps, successProps } from "../../../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../../../app/components/elements/ToastAlert";
import { toast } from "react-toastify";
import { FormContext } from "../../../../../../contexts/form.context";
import cookie from 'cookie';

const schema = yup.object().shape({
  codigo: yup.string().nullable(),
  descripcion: yup.string().required(),
});

export default function SubFamilias({ familia }) {
  
  const { codigo} = familia;
  const router = useRouter();
  const { idFamilia } = router.query; // Aquí 'idFamilia' viene del archivo [idFamilia].js en la ruta dinámica

  console.log("El id de la familia es:", idFamilia);

  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [form, setForm] = useState({
    codigo: null,
    descripcion: null,
  });

  const { updateForm, elementId, resetInfo, setCsvPath, changeData, setChangeData } =
    useContext(FormContext);

  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  useEffect(() => {
    setForm({
      codigo: null,
      descripcion: null,
    });
  }, [resetInfo]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/presupuesto/familias/subfamilias", {
      ...form,
      familiaId: parseInt(idFamilia),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };
  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/presupuesto/familias/subfamilias/${elementId}`, {
      ...form,
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };
  const deleteData = async () => {
    try {
      await axiosRequest(
        "delete",
        `/api/mantenimiento/presupuesto/familias/subfamilias/${elementId}`
      );
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
      codigo: null,
      descripcion: null,
    });
    refetch();
  }, [changeData]);
  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Descripción", accessor: "descripcion" },
    ],
    []
  );

  const getSubFamilias = async () => {
    try {
      const { data } = await axiosRequest(
        "get",
        `/api/mantenimiento/presupuesto/familias/subfamilias?familiaId=${idFamilia}`
      );
      return data;
    } catch (error) {
      console.error("Error al obtener las subfamilias:", error);
      throw error; // Si deseas que el error sea manejado más arriba en la cadena de llamadas
    }
  };

  const { data, refetch } = useQuery("subfamilias", getSubFamilias, {
    initialData: {
      data: [],
    },
  });

  const subfamilias = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplatePresupuesto>
        <Link
          href="/mantenimiento/presupuesto/familias"
          className="flex gap-5 font-regular text-primary-500 hover:text-primary hover:font-bold"
        >
          <Back />
          <span>Familias</span>
        </Link>
        <Title text={"Lista Subfamilias"}>
          <div className="flex gap-4">
            <ButtonImportData
              handleClick={() =>
                setCsvPath(
                  `/api/mantenimiento/presupuesto/familias/subfamilias/upload?familia=${codigo}`
                )
              }
            />
            <ButtonAdd text={"Nueva subfamilia"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <div className="flex gap-5 shadow p-4 border border-primary-400 rounded-lg">
          <h1 className="font-semibold">Familia: </h1>
          <p>{idFamilia}</p>
        </div>
        <TableComplete
          columns={columns}
          data={subfamilias}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplatePresupuesto>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar subfamilia" : "Nuevo subfamilia"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          {/* <Input
            label="Código"
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            defaultValue={isEdit ? updateForm?.codigo : undefined}
          /> */}
          <Input
            label="Descripción"
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            defaultValue={isEdit ? updateForm?.descripcion : undefined}
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
        title={"Eliminar subfamilia"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { params, req } = context;
  
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const idFamilia = params.idFamilia;
  // const token = req.headers.cookie; // Aquí obtienes el token almacenado en las cookies

  const rawCookie = req.headers.cookie;
  
  // Separar todas las cookies por ';' y encontrar la que tiene el nombre 'myTokenName'
  const tokenCookie = rawCookie
    ?.split('; ')
    .find(cookie => cookie.startsWith('myTokenName='));

  // Extraer el valor del token si existe
  const token = tokenCookie?.split('=')[1];


  const response = await axios({
    
    method: "get",
    url: `${protocol}://${req.headers.host}/api/mantenimiento/presupuesto/familias?empresaId=${params.idFamilia}`,
    headers: {
        Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  console.log(response.data)
  return {
    props: {
      familia: response.data,
    },
  };
};
