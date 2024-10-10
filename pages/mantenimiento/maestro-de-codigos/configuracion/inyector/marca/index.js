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
import { useQuery } from "react-query";
import { axiosRequest } from "../../../../../../app/utils/axios-request";
import * as yup from "yup";
import { useLocalStorage } from "../../../../../../app/hooks/useLocalStorage";
import { errorProps, successProps } from "../../../../../../app/utils/alert-config";
import { toast } from "react-toastify";
import { ToastAlert } from "../../../../../../app/components/elements/ToastAlert";
import { FormContext } from "../../../../../../contexts/form.context";

const schema = yup.object().shape({
  codigo: yup.string().nullable(),
  marca: yup.string().required(),
});

export default function MarcasInyector() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();

  const [empresaId] = useLocalStorage("empresaId");

  const [form, setForm] = useState({
    codigo: null,
    marca: null,
  });
  const { updateForm, elementId, setCsvPath, changeData, setChangeData } = useContext(FormContext);
  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest(
      "post",
      "/api/mantenimiento/maestro-de-codigos/configuracion/marca-fabrica-inyector",
      {
        ...form,
        empresaId: parseInt(empresaId),
      }
    );

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest(
      "put",
      `/api/mantenimiento/maestro-de-codigos/configuracion/marca-fabrica-inyector/${elementId}`,
      {
        ...form,
      }
    );

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };
  const deleteData = async () => {
    try {
      await axiosRequest(
        "delete",
        `/api/mantenimiento/maestro-de-codigos/configuracion/marca-fabrica-inyector/${elementId}`
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
      marca: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Marca", accessor: "marca" },
    ],
    []
  );

  const getmMarcasFabricaInyector = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/marca-fabrica-inyector?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("marcasFabricaInyector", getmMarcasFabricaInyector, {
    initialData: {
      data: [],
    },
  });

  const marcasFabricasInyector = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateMaestroCodigos>
        <TemplateConfiguracionInyector>
          <Title text={"Marcas de fabricas de Inyector"}>
            <div className="flex gap-4">
              <ButtonImportData
                handleClick={() =>
                  setCsvPath(
                    `/api/mantenimiento/maestro-de-codigos/configuracion/marca-fabrica-inyector/upload?empresaId=${empresaId}`
                  )
                }
              />
              <ButtonAdd text={"Nueva marca"} onClick={() => openModal(false)} />
            </div>
          </Title>
          {/* Table list */}
          <TableComplete
            columns={columns}
            data={marcasFabricasInyector}
            openModal={openModal}
            setIsOpenModalDelete={setIsOpenModalDelete}
          />
        </TemplateConfiguracionInyector>
      </TemplateMaestroCodigos>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Marca de fabrica Inyector" : "Nueva Marca de Inyector"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Código"
            disabled
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            defaultValue={isEdit ? updateForm?.codigo : undefined}
          />
          <Input
            label="Marca"
            onChange={(e) => setForm({ ...form, marca: e.target.value })}
            defaultValue={isEdit ? updateForm?.marca : undefined}
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
        title={"Eliminar marca"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
