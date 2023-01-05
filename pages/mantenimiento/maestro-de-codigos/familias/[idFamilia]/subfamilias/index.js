"use client";
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
import TemplateMaestroCodigos from "../../../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
import { useModal } from "../../../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import * as yup from "yup";
import { toast } from "react-toastify";
import { errorProps, successProps } from "../../../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../../../app/components/elements/ToastAlert";
import axios from "axios";
import { FormContext } from "../../../../../../contexts/form.context";

const schema = yup.object().shape({
  codigo: yup.string().required(),
  descripcion: yup.string().required(),
});

export default function SubFamilias({ familia }) {
  const { codigo, id } = familia;
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();

  const [form, setForm] = useState({
    codigo: null,
    descripcion: null,
  });
  const [changeData, setChangeData] = useState(false);
  const { updateForm, elementId } = useContext(FormContext);
  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/maestro-de-codigos/familias/subfamilias", {
      ...form,
      familiaId: id,
    });

    toast.success(`🦄 Registro guardado exitosamente!`, successProps);
  };
  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest(
      "put",
      `/api/mantenimiento/maestro-de-codigos/familias/subfamilias/${elementId}`,
      {
        ...form,
      }
    );

    toast.success(`🦄 Registro actualizado exitosamente!`, successProps);
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
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/familias/subfamilias?familiaId=${id}`
    );

    return data;
  };

  const { data, refetch } = useQuery("subfamilias", getSubFamilias, {
    initialData: {
      data: [],
    },
  });

  const subfamilias = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateMaestroCodigos>
        <Link
          href="/mantenimiento/maestro-de-codigos/familias"
          className="flex gap-5 font-regular text-primary-500 hover:text-primary hover:font-bold"
        >
          <Back />
          <span>Familias</span>
        </Link>
        <Title text={"Lista Subfamilias"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd text={"Nueva subfamilia"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <div className="flex gap-5 shadow p-4 border border-primary-400 rounded-lg">
          <h1 className="font-semibold">Familia: </h1>
          <p>{codigo}</p>
        </div>
        <TableComplete
          columns={columns}
          data={subfamilias}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateMaestroCodigos>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar subfamilia" : "Nuevo subfamilia"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Código"
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            defaultValue={isEdit ? updateForm.codigo : undefined}
          />
          <Input
            label="Descripción"
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            defaultValue={isEdit ? updateForm.descripcion : undefined}
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={undefined}
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

  const response = await axios({
    method: "get",
    url: `${protocol}://${req.headers.host}/api/mantenimiento/maestro-de-codigos/familias/${params.idFamilia}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return {
    props: {
      familia: response.data,
    },
  };
};
