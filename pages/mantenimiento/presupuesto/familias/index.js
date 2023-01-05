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
import TablePresupuesto from "../../../../app/components/modules/TablePresupuesto";
import TemplatePresupuesto from "../../../../app/components/templates/mantenimiento/TemplatePresupuesto";
import { useModal } from "../../../../app/hooks/useModal";
import * as yup from "yup";
import { toast } from "react-toastify";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useQuery } from "react-query";

const schema = yup.object().shape({
  codigo: yup.string().required(),
  descripcion: yup.string().required(),
});

export default function Familias() {
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
    descripcion: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/presupuesto/familias", {
        ...form,
        empresaId: parseInt(empresaId),
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

  const getFamilias = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/presupuesto/familias?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("familias", getFamilias, {
    initialData: {
      data: [],
    },
  });

  const familias = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplatePresupuesto>
        <Title text={"Lista Familias"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd
              text={"Nueva familia"}
              onClick={() => openModal(false)}
            />
          </div>
        </Title>
        {/* Table list */}
        <TablePresupuesto
          columns={columns}
          data={familias}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplatePresupuesto>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar familia" : "Nuevo familia"}
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
            label="Descripción"
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        title={"Eliminar familia"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
