import { Input, Option, Select } from "@material-tailwind/react";
import { useEffect, useMemo, useState } from "react";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { GroupInputs } from "../../../../app/components/elements/Form";
import { Title } from "../../../../app/components/elements/Title";
import {
  Modal,
  ModalConfirmDelete,
} from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplatePresupuesto from "../../../../app/components/templates/mantenimiento/TemplatePresupuesto";
import { useModal } from "../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { useQuery } from "react-query";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";

const schema = yup.object().shape({
  familia: yup.string().required(),
  subFamilia: yup.string().required(),
  nombre: yup.string().required(),
  precio: yup.number().required(),
});

export default function Materiales() {
  const {
    isOpenModal,
    isOpenModalDelete,
    isEdit,
    setIsOpenModalDelete,
    closeModal,
    openModal,
  } = useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [selectedFamilia, setSelectedFamilia] = useState("");
  const [selectedSubfamilia, setSelectedSubfamilia] = useState("");
  const [correlativo, setCorrelativo] = useState("");
  const [form, setForm] = useState({
    familia: null,
    subFamilia: null,
    nombre: null,
    precio: null,
  });
  const [subfamilias, setSubfamilias] = useState([]);
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/presupuesto/materiales", {
        nombre: form.nombre,
        precio: parseFloat(form.precio),
        familiaId: parseInt(form.familia),
        subFamiliaId: parseInt(form.subFamilia),
        empresaId: parseInt(empresaId),
        correlativo,
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
      familia: null,
      subFamilia: null,
      nombre: null,
      precio: null,
    });
	setCorrelativo("");
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Familia", accessor: "familia" },
      { Header: "SubFamilia", accessor: "subfamilia" },
      { Header: "Correlativo", accessor: "correlativo" },
      { Header: "Nombre", accessor: "nombre" },
      { Header: "Precio", accessor: "precio" },
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
  const { data: familiasResponse } = useQuery("getFamilias", getFamilias, {
    initialData: {
      data: [],
    },
  });
  const getSubfamilias = async (familiaId) => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/presupuesto/familias/subfamilias?familiaId=${familiaId}`
    );
    setSubfamilias(data?.data);

    return data;
  };
  const familias = useMemo(
    () => familiasResponse?.data,
    [familiasResponse?.data]
  );

  const getMateriales = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/presupuesto/materiales?empresaId=${empresaId}`
    );

    return data;
  };
  const { data, refetch } = useQuery("getMateriales", getMateriales, {
    initialData: {
      data: [],
    },
  });

  const materiales = useMemo(
    () =>
      data?.data.map(({ familia, subFamilia, ...info }) => ({
        ...info,
        familia: familia.codigo,
        subfamilia: subFamilia.codigo,
      })),
    [data?.data]
  );

  return (
    <>
      <TemplatePresupuesto>
        <Title text={"Lista Materiales"}>
          <div className="flex gap-4">
            <ButtonAdd
              text={"Nuevo material"}
              onClick={() => openModal(false)}
            />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={materiales}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplatePresupuesto>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar material" : "Nuevo material"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <GroupInputs>
            <Select
              label="Familia"
              onChange={(value) => {
                // @ts-ignore
                setSelectedFamilia(value.codigo);
                // @ts-ignore
                setCorrelativo(`${value.codigo}${selectedSubfamilia}`);
                // @ts-ignore
                getSubfamilias(value.id);
                // @ts-ignore
                setForm({ ...form, familia: value.id });
              }}
            >
              {familias?.map((item) => {
                return (
                  <Option key={item.id} value={item}>
                    {item?.descripcion}
                  </Option>
                );
              })}
            </Select>
            <Select
              label="SubFamilia"
              onChange={(value) => {
                // @ts-ignore
                setForm({ ...form, subFamilia: value.id });
                // @ts-ignore
                setSelectedSubfamilia(value.codigo);
                // @ts-ignore
                setCorrelativo(`${selectedFamilia}${value.codigo}`);
              }}
            >
              {subfamilias?.map((item) => {
                return (
                  <Option key={item.id} value={item}>
                    {item?.descripcion}
                  </Option>
                );
              })}
            </Select>
            <Input label="Correlativo" disabled value={correlativo} />
          </GroupInputs>
          <Input
            label="Nombre"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <Input
            label="Precio"
            type={"number"}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
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
        title={"Eliminar material"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
