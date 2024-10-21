import { Input, Select, Option } from "@material-tailwind/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { ButtonAdd, ButtonCancel, ButtonSave } from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import { Modal, ModalConfirmDelete } from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateComercial from "../../../../app/components/templates/mantenimiento/TemplateComercial";
import { useModal } from "../../../../app/hooks/useModal";
import * as yup from "yup";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { FormContext } from "../../../../contexts/form.context";

const schemaContado = yup.object().shape({
  nombre: yup.string().required(),
});

const schemaCredito = yup.object().shape({
  nombre: yup.string().required(),
  numeroDeDias: yup.number().min(0).required(),
});

const schemaPago = yup.object().shape({         //! AGREGADO validar
  tipo: yup.string().required(),
  nombre: yup.string().required(),
  numeroDeDias: yup.number().min(0).required(),
});

export default function formContadoasDePago() {
  const { setIsOpenModalDelete, isOpenModalDelete } = useModal();
  const [empresaId] = useLocalStorage("empresaId");

  const columnsContado = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre", accessor: "nombre" },
    ],
    []
  );
  const columnsCredito = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre", accessor: "nombre" },
      { Header: "N° de días", accessor: "numeroDeDias" },
    ],
    []
  );

  const columnsPago = useMemo(      // ! AGREGADO
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Tipo", accessor: "tipo" },
      { Header: "Nombre", accessor: "nombre" },
      { Header: "N° de días", accessor: "numeroDeDias" },
    ],
    []
  );

  const getContado = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/forma-de-pago/contado?empresaId=${empresaId}`
    );

    return data;
  };
  const { data: contadoResponse, refetch: refetchContado } = useQuery("getContado", getContado, {
    initialData: {
      data: [],
    },
  });

  const getCredito = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/forma-de-pago/credito?empresaId=${empresaId}`
    );

    return data;
  };
  const { data: creditoResponse, refetch: refetchCredito } = useQuery("getCredito", getCredito, {
    initialData: {
      data: [],
    },
  });


  const dataContado = useMemo(() => contadoResponse?.data, [contadoResponse?.data]);
  const dataCredito = useMemo(() => creditoResponse?.data, [creditoResponse?.data]);

  const [isModalContado, setIsModalContado] = useState(false);
  const [isModalCredito, setIsModalCredito] = useState(false);

  const [isEditContado, setIsEditContado] = useState(false);
  const [isEditCredito, setIsEditCredito] = useState(false);




  const openModalContado = (isEdit) => {
    setIsModalContado(true);
    setIsEditContado(isEdit);
  };
  const openModalCredito = (isEdit) => {
    setIsModalCredito(true);
    setIsEditCredito(isEdit);
  };

  //! /////////////////////////////

  const getPago = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/forma-de-pago/?empresaId=${empresaId}`
    );

    return data;
  };
  const { data: pagoResponse, refetch: refetchPago } = useQuery("getPago", getPago, {
    initialData: {
      data: [],
    },
  });
  
 
  const dataPago = useMemo(() => pagoResponse?.data, [pagoResponse?.data]);
  
  const [isModalPago, setIsModalPago] = useState(false);
  const [isEditPago, setIsEditPago] = useState(false);

  const openModalPago = (isEdit) => {
    setIsModalPago(true);
    setIsEditPago(isEdit);
  };

  const [formPago, setformPago] = useState({
    tipo:null,
    nombre: null,
    numeroDeDias: null,
  });

//! /////////////////////////////


  const [formContado, setformContado] = useState({
    nombre: null,
  });
  const [formCredito, setformCredito] = useState({
    nombre: null,
    numeroDeDias: null,
  });
  const { updateForm, elementId, resetInfo, changeData, setChangeData, isCredito } =
    useContext(FormContext);

  useEffect(() => {
    setformContado(updateForm);
    setformCredito(updateForm);
    setformPago(updateForm);   //! agregado para tabla
  }, [updateForm]);

  useEffect(() => {
    setformContado({
      nombre: null,
    });
    setformCredito({
      nombre: null,
      numeroDeDias: null,
    });
    setformPago({          //! agregado para tabla
      tipo: null,
      nombre: null,
      numeroDeDias: null,
    });
  }, [resetInfo]);

  const createRegistroContado = async () => {
    await schemaContado.validate(formContado, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/forma-de-pago/contado", {
      ...formContado,
      empresaId: parseInt(empresaId),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistroContado = async () => {
    await schemaContado.validate(formContado, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/forma-de-pago/contado/${elementId}`, {
      ...formContado,
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };
  const deleteDataContado = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/forma-de-pago/contado/${elementId}`);
      toast.success(`🗑️ Registro eliminado exitosamente!`, successProps);
      setIsModalContado(false);
      setChangeData(!changeData);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const createRegistroCredito = async () => {
    await schemaCredito.validate(formCredito, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/forma-de-pago/credito", {
      ...formCredito,
      numeroDeDias: parseInt(formCredito.numeroDeDias),
      empresaId: parseInt(empresaId),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistroCredito = async () => {
    await schemaPago.validate(formPago, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/forma-de-pago/pago/${elementId}`, {
      ...formPago,
      numeroDeDias: parseInt(formPago.numeroDeDias),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };
  const deleteDataCredito = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/forma-de-pago/credito/${elementId}`);
      toast.success(`🗑️ Registro eliminado exitosamente!`, successProps);
      setChangeData(!changeData);
      setIsModalContado(false);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };


  //! //////////////////// AGREGAdo para modal nueva ////////////////////: 
  const createRegistroPago = async () => {
    await schemaPago.validate(formPago, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/forma-de-pago/", {      //! VALIDAR!!!!!!!!!!!!
      ...formPago,
      numeroDeDias: parseInt(formPago.numeroDeDias),
      empresaId: parseInt(empresaId),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistroPago = async () => {
    await schemaPago.validate(formPago, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/forma-de-pago/${elementId}`, {
      ...formPago,
      numeroDeDias: parseInt(formPago.numeroDeDias),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };
  const deleteDataPago = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/forma-de-pago/${elementId}`);
      toast.success(`🗑️ Registro eliminado exitosamente!`, successProps);
      setChangeData(!changeData);
      setIsModalPago(false);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const saveDataPago = async () => {
    try {
      if (isEditPago) {
        await updateRegistroPago();
      } else {
        await createRegistroPago();
      }
      setChangeData(!changeData);
      setIsModalPago(false);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  //! /////////////////////////////////////////
  
  
  const saveDataContado = async () => {
    try {
      if (isEditContado) {
        await updateRegistroContado();
      } else {
        await createRegistroContado();
      }
      setChangeData(!changeData);
      setIsModalContado(false);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const saveDataCredito = async () => {
    console.log('isEdit')
    try {
      if (isEditCredito) {
        await updateRegistroCredito();
      } else {
        await createRegistroCredito();
      }
      setChangeData(!changeData);
      setIsModalCredito(false);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  useEffect(() => {
    setformContado({
      nombre: null,
    });
    setformCredito({
      nombre: null,
      numeroDeDias: null,
    });
    setformPago({
      tipo:null,
      nombre: null,
      numeroDeDias: null,
    })
    refetchContado();
    refetchCredito();
    refetchPago();
  }, [changeData]);

  return (
    <>
      <TemplateComercial>
        <Title text={"Formas o condición de pago"} />
        <div className="flex gap-5">
          <div className="w-1/2 rounded shadow-md p-5">
            <Title text={"Contado"}>
              <ButtonAdd
                text={"Nueva forma de pago"}
                onClick={() => {
                  openModalContado(false);
                }}
              />
            </Title>
            {/* Table list */}
            <TableComplete
              columns={columnsContado}
              data={dataContado}
              openModal={openModalContado}
              setIsOpenModalDelete={setIsOpenModalDelete}
            />
          </div>
          <div className="w-1/2 rounded shadow-md p-5">
            <Title text={"Crédito"}>
              <ButtonAdd
                text={"Nueva forma de pago"}
                onClick={() => {
                  openModalCredito(false);
                }}
              />
            </Title>
            {/* Table list */}
            <TableComplete
              columns={columnsCredito}
              data={dataCredito}
              openModal={openModalCredito}
              setIsOpenModalDelete={setIsOpenModalDelete}
            />
          </div>
        </div>


        <Title text={""}>
              <ButtonAdd
                text={"Nueva forma de pago"}
                onClick={() => {
                  openModalPago(false);
                }}
              />
            </Title>
            {/* Table list */}
            <TableComplete
              columns={columnsPago}
              data={dataPago}
              openModal={openModalPago}
              setIsOpenModalDelete={setIsOpenModalDelete}
            />


      </TemplateComercial>
      {/* Modal agregar */}
      <Modal
        title={isEditContado ? "Editar forma de pago Contado" : "Nueva forma de pago Contado"}
        isOpen={isModalContado}
        closeModal={() => setIsModalContado(false)}
      >
        {/* formContado */}
        <form className="flex flex-col gap-5">
          <Input
            label="Nombre"
            onChange={(e) => setformContado({ ...formContado, nombre: e.target.value })}
            defaultValue={isEditContado ? updateForm?.nombre : undefined}
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={() => setIsModalContado(false)} />
            <ButtonSave onClick={saveDataContado} />
          </div>
        </form>
      </Modal>

      <Modal
        title={isEditCredito ? "Editar forma de pago Credito" : "Nueva forma de pago Credito"}
        isOpen={isModalCredito}
        closeModal={() => setIsModalCredito(false)}
      >
        {/* formCredito */}
        <form className="flex flex-col gap-5">
          <Input
            label="Nombre"
            onChange={(e) => setformCredito({ ...formCredito, nombre: e.target.value })}
            defaultValue={isEditCredito ? updateForm?.nombre : undefined}
          />
          <Input
            label="N° de días"
            type="number"
            onChange={(e) => setformCredito({ ...formCredito, numeroDeDias: e.target.value })}
            defaultValue={isEditCredito ? updateForm?.numeroDeDias : undefined}
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={() => setIsModalCredito(false)} />
            <ButtonSave onClick={saveDataCredito} />
          </div>
        </form>
      </Modal>


      <Modal
        title={isEditPago ? "Editar forma de pago" : "Nueva forma de pago"}
        isOpen={isModalPago}
        closeModal={() => setIsModalPago(false)}
      >
        {/* formPago */}
        <form className="flex flex-col gap-5">
          <Select label="tipo">
            <Option value="">No hay tipos disponibles</Option>
          </Select>
          <Input
            label="Nombre"
            onChange={(e) => setformPago({ ...formPago, nombre: e.target.value })}
            defaultValue={isEditPago ? updateForm?.nombre : undefined}
          />
          <Input
            label="N° de días"
            type="number"
            onChange={(e) => setformPago({ ...formPago, numeroDeDias: e.target.value })}
            defaultValue={isEditPago ? updateForm?.numeroDeDias : undefined}
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={() => setIsModalPago(false)} />
            <ButtonSave onClick={saveDataPago} />
          </div>
        </form>
      </Modal>


      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={() => {
          if (isCredito) {
            deleteDataCredito();
          } else {
            deleteDataContado();
          }
        }}
        title={"Eliminar forma de pago"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
