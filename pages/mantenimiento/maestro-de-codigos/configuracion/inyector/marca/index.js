import { Input } from "@material-tailwind/react";
import { useMemo } from "react";
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
import { TemplateConfiguracionInyector } from "../../../../../../app/components/templates/mantenimiento/maestro-codigos/TemplateConfiguracionInyector";
import TemplateMaestroCodigos from "../../../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
import { useModal } from "../../../../../../app/hooks/useModal";
import { useQuery } from "react-query";
import { axiosRequest } from "../../../../../../app/utils/axios-request";

export default function MarcasInyector() {
  const {
    isOpenModal,
    isOpenModalDelete,
    isEdit,
    setIsOpenModalDelete,
    closeModal,
    openModal,
  } = useModal();

  const saveData = () => {
    closeModal();
  };

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Marca", accessor: "marca" },
    ],
    []
  );

  const getmMarcasFabricaInyector = async () => {
    const empresaId = localStorage.getItem("empresaId");
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/marca-fabrica-inyector?empresaId=${empresaId}`
    );

    return data;
  };

  const { data } = useQuery("marcasFabricaInyector", getmMarcasFabricaInyector, {
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
            data={marcasFabricasInyector}
            openModal={openModal}
            setIsOpenModalDelete={setIsOpenModalDelete}
          />
        </TemplateConfiguracionInyector>
      </TemplateMaestroCodigos>
      {/* Modal agregar */}
      <Modal
        title={
          isEdit
            ? "Editar Marca de fabrica Inyector"
            : "Nueva Marca de Inyector"
        }
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input label="Código" />
          <Input label="Marca" />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        title={"Eliminar marca"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
