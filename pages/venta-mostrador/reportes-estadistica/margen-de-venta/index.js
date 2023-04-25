import { useMemo } from "react";
import { ButtonAdd, ButtonCancel, ButtonSave } from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import { Modal, ModalConfirmDelete } from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import { useModal } from "../../../../app/hooks/useModal";
import TemplateReportes from "../../../../app/components/templates/venta-mostrador/TemplateReportes";

export default function CentroCostos() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "N° Reporte", accessor: "numeroDeReporte" },
      { Header: "Desde", accessor: "desde" },
      { Header: "Hasta", accessor: "hasta" },
    ],
    []
  );

  return (
    <>
      <TemplateReportes>
        <Title text={"Reportes de Margen de Ventas"}>
          <div className="flex gap-4">
            <ButtonAdd text={"Nuevo reporte"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={[]}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateReportes>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar margende venta" : "Nuevo margen de venta"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={undefined} />
          </div>
        </form>
      </Modal>
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={undefined}
        title={"Eliminar margen de venta"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
