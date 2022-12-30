import { Input } from "@material-tailwind/react";
import { Settings } from "iconsax-react";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonDelete,
  ButtonEdit,
  ButtonSave,
} from "../../../../app/components/elements/Buttons";
import {
  Table,
  TableD,
  TableDOptions,
  TableH,
  TableRH,
} from "../../../../app/components/elements/Table";
import { Title } from "../../../../app/components/elements/Title";
import {
  Modal,
  ModalConfirmDelete,
} from "../../../../app/components/modules/Modal";
import TemplateGeneral from "../../../../app/components/templates/mantenimiento/TemplateGeneral";
import { useModal } from "../../../../app/hooks/useModal";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { ToastContainer, toast } from "react-toastify";
import * as yup from "yup";

const schema = yup.object().shape({
  nombre: yup.string().required(),
  valor: yup.string().required(),
});

export default function ParametrosGlobales() {
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
    nombre: null,
    valor: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/parametros", {
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
      nombre: null,
      valor: null,
    })
    refetch();
  }, [changeData]);

  const getParametros = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/parametros?empresaId=${empresaId}`
    );

    return data;
  };

  const { data, refetch } = useQuery("parametros", getParametros, {
    initialData: {
      data: [],
    },
  });

  return (
    <>
      <TemplateGeneral>
        <Title text={"Lista Parámetros Globales"}>
          <ButtonAdd
            text={"Nuevo Parámetro"}
            onClick={() => openModal(false)}
          />
        </Title>
        {/* Table list parametros glabales */}
        <Table>
          <thead>
            <TableRH>
              <TableH>Parámetro</TableH>
              <TableH>Valor</TableH>
              <TableH />
            </TableRH>
          </thead>
          <tbody>
            {data?.data.map(({ nombre, valor }, index) => (
              <tr key={index}>
                <TableD>
                  <div className="flex gap-2">
                    <Settings />
                    <p className="font-semibold">{nombre}:</p>
                  </div>
                </TableD>
                <TableD>{valor}</TableD>
                <TableDOptions>
                  <ButtonEdit onClick={() => openModal(true)} />
                  <ButtonDelete onClick={() => setIsOpenModalDelete(true)} />
                </TableDOptions>
              </tr>
            ))}
          </tbody>
        </Table>
      </TemplateGeneral>
      {/* Modal */}
      <Modal
        title={isEdit ? "Editar Parámetro" : "Nuevo Parámetro"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Nombre"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <Input
            label="Valor"
            onChange={(e) => setForm({ ...form, valor: e.target.value })}
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
        title={"Eliminar Parámetro"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
