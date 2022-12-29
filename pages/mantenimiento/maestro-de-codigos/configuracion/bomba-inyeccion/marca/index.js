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
import { TemplateConfiguracionBombaInyeccion } from "../../../../../../app/components/templates/mantenimiento/maestro-codigos/TemplateConfiguracionBombaInyeccion";
import TemplateMaestroCodigos from "../../../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
import { useModal } from "../../../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import * as yup from "yup";
import { useLocalStorage } from "../../../../../../app/hooks/useLocalStorage";
import {
  errorProps,
  successProps,
} from "../../../../../../app/utils/alert-config";
import { ToastContainer, toast } from "react-toastify";
import { ToastAlert } from "../../../../../../app/components/elements/ToastAlert";

const schema = yup.object().shape({
  codigo: yup.string().required(),
  marca: yup.string().required(),
});

export default function MarcasBombaInyeccion() {
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
    marca: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      await axiosRequest(
        "post",
        "/api/mantenimiento/maestro-de-codigos/configuracion/marca-fabrica-sistema-inyeccion",
        {
          ...form,
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

  const getMarcasSistemaInyeccion = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/marca-fabrica-sistema-inyeccion?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery(
    "marcasSistemasInyeccion",
    getMarcasSistemaInyeccion,
    {
      initialData: {
        data: [],
      },
    }
  );

  const marcasSistemasInyeccion = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateMaestroCodigos>
        <TemplateConfiguracionBombaInyeccion>
          <Title text={"Marcas de Fabricas de Sistemas de Inyeccion"}>
            <div className="flex gap-4">
              <ButtonImportData />
              <ButtonAdd
                text={"Nueva marca"}
                onClick={() => openModal(false)}
              />
            </div>
          </Title>
          {/* Table list */}
          <TableComplete
            columns={columns}
            data={marcasSistemasInyeccion}
            openModal={openModal}
            setIsOpenModalDelete={setIsOpenModalDelete}
          />
        </TemplateConfiguracionBombaInyeccion>
      </TemplateMaestroCodigos>
      {/* Modal agregar */}
      <Modal
        title={
          isEdit
            ? "Editar Marca Bomba de Inyeccion"
            : "Nueva Marca Bomba de Inyeccion"
        }
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
            label="Marca"
            onChange={(e) => setForm({ ...form, marca: e.target.value })}
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
        title={"Eliminar marca"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
