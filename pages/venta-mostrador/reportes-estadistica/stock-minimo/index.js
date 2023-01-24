import { useMemo } from "react";
import { ButtonAdd } from "../../../../app/components/elements/Buttons";
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
      { Header: "Fecha", accessor: "fecha" },
    ],
    []
  );

  return (
    <>
      <TemplateReportes>
        <Title text={"Reportes stock minimo"}>
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
        title={isEdit ? "Editar reporte" : "Nuevo reporte"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5"></form>
      </Modal>
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={undefined}
        title={"Eliminar reporte"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
