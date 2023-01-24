import { ButtonAdd, ButtonSave, ButtonCancel } from "../../../app/components/elements/Buttons";
import { Container } from "../../../app/components/elements/Containers";
import { Title } from "../../../app/components/elements/Title";
import { ModalConfirmDelete, ModalLg } from "../../../app/components/modules/Modal";
import { useModal } from "../../../app/hooks/useModal";
import { useMemo } from "react";
import "react-toastify/dist/ReactToastify.css";
import TableComplete from "../../../app/components/modules/TableComplete";

export default function DatosEmpresa() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();

  const columns = useMemo(
    () => [
      { Header: "N°", accessor: "id" },
      { Header: "RUC / DNI", accessor: "razonSocial" },
      { Header: "Nombre Cliente", accessor: "nombreCliente" },
      { Header: "Fecha", accessor: "fecha" },
      { Header: "Dias validez", accessor: "diasValidez" },
      { Header: "Forma de pago", accessor: "formaDePago" },
      { Header: "Correo", accessor: "email" },
    ],
    []
  );

  return (
    <>
      <Container whiteColor={true}>
        <Title text={"Pedidos"}>
          <ButtonAdd text={"Nuevo pedido"} onClick={() => openModal(false)} />
        </Title>

        {/* Table List */}

        <TableComplete
          columns={columns}
          data={[]}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </Container>
      {/* Modal agregar */}
      <ModalLg
        title={isEdit ? "Editar Pedido" : "Nuevo pedido"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        <div className="w-full flex justify-end gap-5">
          <ButtonCancel onClick={closeModal} />
          <ButtonSave onClick={undefined} />
        </div>
      </ModalLg>

      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={undefined}
        title={"Eliminar Pedido"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
