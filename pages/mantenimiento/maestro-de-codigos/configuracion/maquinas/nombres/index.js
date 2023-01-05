import { Input } from "@material-tailwind/react";
import { useEffect, useMemo, useState } from "react";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonImportData,
  ButtonSave,
} from "../../../../../../app/components/elements/Buttons";
import { Title } from "../../../../../../app/components/elements/Title";
import {
  Modal,
  ModalConfirmDelete,
} from "../../../../../../app/components/modules/Modal";
import TableComplete from "../../../../../../app/components/modules/TableComplete";
import { TemplateConfiguracionMaquinas } from "../../../../../../app/components/templates/mantenimiento/maestro-codigos/TemplateConfiguracionMaquinas";
import TemplateMaestroCodigos from "../../../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
import { useModal } from "../../../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import * as yup from "yup";
import {
  errorProps,
  successProps,
} from "../../../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../../../app/components/elements/ToastAlert";
import { useLocalStorage } from "../../../../../../app/hooks/useLocalStorage";
import {  toast } from "react-toastify";

const schema = yup.object().shape({
  codigo: yup.string().required(),
  nombre: yup.string().required(),
});

export default function NombresMaquina() {
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
      await axiosRequest(
        "post",
        "/api/mantenimiento/maestro-de-codigos/configuracion/nombre",
        {
          ...form,
          empresaId: parseInt(empresaId),
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
    setForm({
      codigo: null,
      nombre: null,
    })
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre", accessor: "nombre" },
    ],
    []
  );

  const getNombreMaquinas = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/nombre?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("nombreMaquinas", getNombreMaquinas, {
    initialData: {
      data: [],
    },
  });

  const nombreMaquinas = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateMaestroCodigos>
        <TemplateConfiguracionMaquinas>
          <Title text={"Nombres de Máquinas"}>
            <div className="flex gap-4">
              <ButtonImportData />
              <ButtonAdd
                text={"Nuevo nombre"}
                onClick={() => openModal(false)}
              />
            </div>
          </Title>
          {/* Table list */}
          <TableComplete
            columns={columns}
            data={nombreMaquinas}
            openModal={openModal}
            setIsOpenModalDelete={setIsOpenModalDelete}
          />
        </TemplateConfiguracionMaquinas>
      </TemplateMaestroCodigos>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Nombre Máquina" : "Nueva Nombre Máquina"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Código"
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
       
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        title={"Eliminar Nombre"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
