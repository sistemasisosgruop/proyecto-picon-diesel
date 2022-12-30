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
import TemplateMaestroCodigos from "../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
import { useModal } from "../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import * as yup from "yup";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastContainer, toast } from "react-toastify";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";

const schema = yup.object().shape({
  codigo: yup.string().required(),
  descripcion: yup.string().required(),
  abreviatura: yup.string().required(),
});

export default function Caracteristicas() {
  const {
    isOpenModal,
    isOpenModalDelete,
    isEdit,
    setIsOpenModalDelete,
    closeModal,
    openModal,
  } = useModal();

  const [empresaId] = useLocalStorage("empresaId");
  const [caracteristicaForm, setCaracteristicaForm] = useState({
    codigo: null,
    descripcion: null,
    abreviatura: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(caracteristicaForm, { abortEarly: false });
      await axiosRequest(
        "post",
        "/api/mantenimiento/maestro-de-codigos/caracteristicas",
        {
          ...caracteristicaForm,
          empresaId,
        }
      );

      toast.success(`🦄 Registro guardado exitosamente!`, successProps);
      setChangeData(!changeData);
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  useEffect(() => {
    setCaracteristicaForm({
      codigo: null,
      descripcion: null,
      abreviatura: null,
    })
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Descripción", accessor: "descripcion" },
      { Header: "Abreviatura", accessor: "abreviatura" },
    ],
    []
  );

  const getCaracteristicas = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/caracteristicas?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("caracteristicas", getCaracteristicas, {
    initialData: {
      data: [],
    },
  });

  const caracteristicas = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateMaestroCodigos>
        <Title text={"Lista Características"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd
              text={"Nuevo característica"}
              onClick={() => openModal(false)}
            />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={caracteristicas}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateMaestroCodigos>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Característica" : "Nuevo Característica"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Código"
            onChange={(e) => {
              setCaracteristicaForm({
                ...caracteristicaForm,
                codigo: e.target.value,
              });
            }}
          />
          <Input
            label="Descripción"
            onChange={(e) => {
              setCaracteristicaForm({
                ...caracteristicaForm,
                descripcion: e.target.value,
              });
            }}
          />
          <Input
            label="Abreviatura"
            onChange={(e) => {
              setCaracteristicaForm({
                ...caracteristicaForm,
                abreviatura: e.target.value,
              });
            }}
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
        title={"Eliminar Característica"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
