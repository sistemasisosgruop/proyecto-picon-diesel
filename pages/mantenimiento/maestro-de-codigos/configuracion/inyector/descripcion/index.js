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
import { TemplateConfiguracionInyector } from "../../../../../../app/components/templates/mantenimiento/maestro-codigos/TemplateConfiguracionInyector";
import TemplateMaestroCodigos from "../../../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
import { useModal } from "../../../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import * as yup from "yup";
import { useLocalStorage } from "../../../../../../app/hooks/useLocalStorage";
import { errorProps, successProps } from "../../../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../../../app/components/elements/ToastAlert";
import { toast } from "react-toastify";
import { FormContext } from "../../../../../../contexts/form.context";

const schema = yup.object().shape({
  codigo: yup.string().required(),
  descripcion: yup.string().required(),
});

export default function DescripcionInyector() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();

  const [empresaId] = useLocalStorage("empresaId");

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
    await axiosRequest(
      "post",
      "/api/mantenimiento/maestro-de-codigos/configuracion/descripcion-inyector",
      {
        ...form,
        empresaId: parseInt(empresaId),
      }
    );

    toast.success(`🦄 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest(
      "put",
      `/api/mantenimiento/maestro-de-codigos/configuracion/descripcion-inyector/${elementId}`,
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
      descripcion: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Descripcion", accessor: "descripcion" },
    ],
    []
  );

  const getDescripcionInyectores = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/descripcion-inyector?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("descripcionInyectores", getDescripcionInyectores, {
    initialData: {
      data: [],
    },
  });

  const descripcionInyectores = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateMaestroCodigos>
        <TemplateConfiguracionInyector>
          <Title text={"Descripcion de Inyector"}>
            <div className="flex gap-4">
              <ButtonImportData />
              <ButtonAdd text={"Nueva descripcion"} onClick={() => openModal(false)} />
            </div>
          </Title>
          {/* Table list */}
          <TableComplete
            columns={columns}
            data={descripcionInyectores}
            openModal={openModal}
            setIsOpenModalDelete={setIsOpenModalDelete}
          />
        </TemplateConfiguracionInyector>
      </TemplateMaestroCodigos>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Descripcion de Inyector" : "Nueva Descripcion de Inyector"}
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
            label="Descripcion"
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
        title={"Eliminar descripcion"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
