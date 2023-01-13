import { Input } from "@material-tailwind/react";
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
import { TemplateConfiguracionMaquinas } from "../../../../../../app/components/templates/mantenimiento/maestro-codigos/TemplateConfiguracionMaquinas";
import TemplateMaestroCodigos from "../../../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
import { useModal } from "../../../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import * as yup from "yup";
import { useLocalStorage } from "../../../../../../app/hooks/useLocalStorage";
import { toast } from "react-toastify";
import { errorProps, successProps } from "../../../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../../../app/components/elements/ToastAlert";
import { FormContext } from "../../../../../../contexts/form.context";

const schema = yup.object().shape({
  codigo: yup.string().required(),
  modelo: yup.string().required(),
});

export default function ModelosMaquina() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();

  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    codigo: null,
    modelo: null,
  });
  const [changeData, setChangeData] = useState(false);
  const { updateForm, elementId, setCsvPath } = useContext(FormContext);
  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/maestro-de-codigos/configuracion/modelo", {
      ...form,
      empresaId: parseInt(empresaId),
    });

    toast.success(`🦄 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest(
      "put",
      `/api/mantenimiento/maestro-de-codigos/configuracion/modelo/${elementId}`,
      {
        ...form,
      }
    );

    toast.success(`🦄 Registro guardado exitosamente!`, successProps);
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
      modelo: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Modelo", accessor: "modelo" },
    ],
    []
  );

  const getModelosMaquinas = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/modelo?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("modelosMaquinas", getModelosMaquinas, {
    initialData: {
      data: [],
    },
  });

  const modelosMaquinas = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateMaestroCodigos>
        <TemplateConfiguracionMaquinas>
          <Title text={"Modelo de Máquinas"}>
            <div className="flex gap-4">
              <ButtonImportData
                handleClick={() =>
                  setCsvPath(
                    `/api/mantenimiento/maestro-de-codigos/configuracion/modelo/upload?empresaId=${empresaId}`
                  )
                }
              />
              <ButtonAdd text={"Nuevo modelo"} onClick={() => openModal(false)} />
            </div>
          </Title>
          {/* Table list */}
          <TableComplete
            columns={columns}
            data={modelosMaquinas}
            openModal={openModal}
            setIsOpenModalDelete={setIsOpenModalDelete}
          />
        </TemplateConfiguracionMaquinas>
      </TemplateMaestroCodigos>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Modelo Máquina" : "Nueva Modelo Máquina"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Código"
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            defaultValue={isEdit ? updateForm?.codigo : undefined}
          />
          <Input
            label="Modelo"
            onChange={(e) => setForm({ ...form, modelo: e.target.value })}
            defaultValue={isEdit ? updateForm?.modelo : undefined}
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>

      {/* Modal Eliminar */}
      <ModalConfirmDelete
        title={"Eliminar Máquina"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
