import { Input } from "@material-tailwind/react";
import { useEffect, useMemo, useState } from "react";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import {
  ModalConfirmDelete,
  Modal,
} from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateGeneral from "../../../../app/components/templates/mantenimiento/TemplateGeneral";
import { useModal } from "../../../../app/hooks/useModal";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import * as yup from "yup";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { ToastContainer, toast } from "react-toastify";

const schema = yup.object().shape({
  codigo: yup.string().required(),
  nombre: yup.string().required(),
});

export default function Paises() {
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
    codigo: null,
    nombre: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/paises", {
        ...form,
        empresaId,
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
      codigo: null,
      nombre: null,
    })
    refetch();
  }, [changeData]);

  // Datos de los paises
  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre", accessor: "nombre" },
    ],
    []
  );

  const getPaises = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/paises?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("paises", getPaises, {
    initialData: {
      data: [],
    },
  });

  const paises = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateGeneral>
        <Title text={"Lista Países"}>
          <ButtonAdd text={"Nuevo País"} onClick={() => openModal(false)} />
        </Title>

        {/* Table List */}
        <TableComplete
          columns={columns}
          data={paises}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateGeneral>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Pais" : "Nuevo Pais"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Codigo"
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
          />
          <Input
            label="Nombre"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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
        title={"Eliminar País"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
