import { Input, Option, Select } from "@material-tailwind/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { ButtonAdd, ButtonCancel, ButtonSave } from "../../../../app/components/elements/Buttons";
import { GroupInputs } from "../../../../app/components/elements/Form";
import { Title } from "../../../../app/components/elements/Title";
import { Modal, ModalConfirmDelete } from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplatePresupuesto from "../../../../app/components/templates/mantenimiento/TemplatePresupuesto";
import { useModal } from "../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { useQuery } from "react-query";
import * as yup from "yup";
import { toast } from "react-toastify";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { MaterialesContext } from "../../../../contexts/materiales.context";
import { FormContext } from "../../../../contexts/form.context";

const schema = yup.object().shape({
  familiaId: yup.number().required(),
  subFamiliaId: yup.number().required(),
  nombre: yup.string().required(),
  precio: yup.number().required(),
});

const updateSchema = yup.object().shape({
  familiaId: yup.number().nullable(),
  subFamiliaId: yup.number().nullable(),
  nombre: yup.string().required(),
  precio: yup.number().required(),
});

export default function Materiales() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [selectedFamilia, setSelectedFamilia] = useState("");
  const [form, setForm] = useState({
    familiaId: null,
    subFamiliaId: null,
    nombre: null,
    precio: null,
  });
  const [subfamilias, setSubfamilias] = useState([]);
  const { correlativo, setCorrelativo } = useContext(MaterialesContext);
  const { changeData, setChangeData, updateForm, elementId } = useContext(FormContext);

  useEffect(() => {
    if (isEdit) {
      setForm({
        ...form,
        familiaId: updateForm?.familiaId,
        subFamiliaId: updateForm?.subFamiliaId,
        nombre: updateForm?.nombre,
        precio: updateForm?.precio,
      });
    }
  }, [updateForm]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/presupuesto/materiales", {
      nombre: form.nombre,
      precio: parseFloat(form.precio),
      familiaId: parseInt(form.familiaId),
      subFamiliaId: parseInt(form.subFamiliaId),
      empresaId: parseInt(empresaId),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await updateSchema.validate(form, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/presupuesto/materiales/${elementId}`, {
      nombre: form.nombre,
      precio: parseFloat(form.precio),
      familiaId: parseInt(form.familiaId),
      subFamiliaId: parseInt(form.subFamiliaId),
      empresaId: parseInt(empresaId),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const deleteData = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/presupuesto/materiales/${elementId}`);
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
      familiaId: null,
      subFamiliaId: null,
      nombre: null,
      precio: null,
    });
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
  };

  const familias = useMemo(() => familiasResponse?.data, [familiasResponse?.data]);

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
            <ButtonAdd text={"Nuevo material"} onClick={() => openModal(false)} />
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
                const currentFamilia = familias?.find((item) => item.id === Number(value));
                setSelectedFamilia(currentFamilia.codigo);
                setCorrelativo(`${currentFamilia.codigo} + `);
                getSubfamilias(currentFamilia.id);
                setForm({ ...form, familiaId: currentFamilia.id });
              }}
            >
              {familias?.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item?.descripcion}
                  </Option>
                );
              })}
            </Select>
            <Select
              label="SubFamilia"
              onChange={(value) => {
                const currentSubFamilia = subfamilias?.find((item) => item.id === Number(value));
                setForm({ ...form, subFamiliaId: value });
                setCorrelativo(`${selectedFamilia} + ${currentSubFamilia.codigo}`);
              }}
            >
              {subfamilias?.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item?.descripcion}
                  </Option>
                );
              })}
            </Select>
            <Input
              label="Correlativo"
              disabled
              value={correlativo}
              defaultValue={isEdit ? updateForm?.correlativo : undefined}
            />
          </GroupInputs>
          <Input
            label="Nombre"
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            defaultValue={isEdit ? updateForm?.nombre : undefined}
          />
          <Input
            label="Precio"
            type={"number"}
            defaultValue={isEdit ? updateForm?.precio : undefined}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
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
        title={"Eliminar material"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
