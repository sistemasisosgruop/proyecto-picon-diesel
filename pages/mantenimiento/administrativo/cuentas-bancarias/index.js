import { Input, Option, Select } from "@material-tailwind/react";
import { useEffect, useMemo, useState } from "react";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonImportData,
  ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import { Modal, ModalConfirmDelete } from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateAdministrativo from "../../../../app/components/templates/mantenimiento/TemplateAdministrativo";
import { useModal } from "../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { useQuery } from "react-query";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { toast } from "react-toastify";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import * as yup from "yup";

const schema = yup.object().shape({
  banco: yup.number().required(),
  numeroCuenta: yup.string().required(),
  tipoCuenta: yup.string().required(),
  moneda: yup.string().required(),
});

export default function CuentasBancarias() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    banco: null,
    numeroCuenta: null,
    tipoCuenta: null,
    moneda: null,
  });
  const [changeData, setChangeData] = useState(false);

  const saveData = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/bancos/cuentas", {
        ...form,
        empresaId: parseInt(empresaId),
        bancoId: parseInt(form.banco),
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
      banco: null,
      numeroCuenta: null,
      tipoCuenta: null,
      moneda: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "N° de cuenta", accessor: "numeroCuenta" },
      { Header: "Tipo de cuenta", accessor: "tipoCuenta" },
      { Header: "Banco", accessor: "banco" },
      { Header: "Moneda", accessor: "moneda" },
      { Header: "Estado", accessor: "estado" },
    ],
    []
  );

  const getBancos = async () => {
    const { data } = await axiosRequest("get", `/api/mantenimiento/bancos?empresaId=${empresaId}`);

    return data;
  };
  const { data: bancosResponse } = useQuery("bancos", getBancos, {
    initialData: {
      data: [],
    },
  });
  const bancos = useMemo(() => bancosResponse?.data, [bancosResponse?.data]);

  const getCuentasBancarias = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/bancos/cuentas?empresaId=${empresaId}`
    );

    return data;
  };
  const { data, refetch } = useQuery("getCuentasBancarias", getCuentasBancarias, {
    initialData: {
      data: [],
    },
  });

  const cuentasBancarias = useMemo(
    () =>
      data?.data.map(({ banco, ...props }) => ({
        ...props,
        banco: banco?.nombre,
      })),
    [data?.data]
  );

  return (
    <>
      <TemplateAdministrativo>
        <Title text={"Lista Cuentas Bancarias"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd text={"Nueva cuenta"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={cuentasBancarias}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateAdministrativo>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Cuenta Bancaria" : "Nueva Cuenta Bancaria"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="N° de cuenta"
            onChange={(e) => setForm({ ...form, numeroCuenta: e.target.value })}
          />
          <Input label="Tipo" onChange={(e) => setForm({ ...form, tipoCuenta: e.target.value })} />
          <div className="flex gap-5">
            <Select label="Banco" onChange={(value) => setForm({ ...form, banco: value })}>
              {bancos?.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.nombre}
                  </Option>
                );
              })}
            </Select>
            <Input label="Moneda" onChange={(e) => setForm({ ...form, moneda: e.target.value })} />
          </div>
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        title={"Eliminar Cuenta Bancaria"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
