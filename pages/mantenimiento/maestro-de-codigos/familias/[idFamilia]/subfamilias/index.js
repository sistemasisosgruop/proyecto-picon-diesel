import { Input } from "@material-tailwind/react";
import { Back } from "iconsax-react";
import Link from "next/link";
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
import TemplateMaestroCodigos from "../../../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
import { useModal } from "../../../../../../app/hooks/useModal";
import { familias } from "../../../../../../data/familias";
import { axiosRequest } from "../../../../../../app/utils/axios-request";
import { useQuery } from "react-query";

export default function SubFamilias({ familia }) {
  const { codigo, id } = familia;
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
      { Header: "Descripción", accessor: "descripcion" },
    ],
    []
  );

  const getSubFamilias = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/familias/subfamilias?familiaId=${id}`
    );

    return data;
  };

  const { data } = useQuery("subfamilias", getSubFamilias, {
    initialData: {
      data: [],
    },
  });

  const subfamilias = useMemo(() => data?.data, [data?.data]);

  return (
    <>
      <TemplateMaestroCodigos>
        <Link
          href="/mantenimiento/maestro-de-codigos/familias"
          className="flex gap-5 font-regular text-primary-500 hover:text-primary hover:font-bold"
        >
          <Back />
          <span>Familias</span>
        </Link>
        <Title text={"Lista Subfamilias"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd
              text={"Nueva subfamilia"}
              onClick={() => openModal(false)}
            />
          </div>
        </Title>
        {/* Table list */}
        <div className="flex gap-5 shadow p-4 border border-primary-400 rounded-lg">
          <h1 className="font-semibold">Familia: </h1>
          <p>{codigo}</p>
        </div>
        <TableComplete
          columns={columns}
          data={subfamilias}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateMaestroCodigos>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar subfamilia" : "Nuevo subfamilia"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input label="Código" />
          <Input label="Descripción" />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        title={"Eliminar subfamilia"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}

export const getServerSideProps = async ({ params }) => {
  const familia = familias.find(
    (familia) => familia.codigo === params.idFamilia
  );

  return {
    props: {
      familia,
    },
  };
};
