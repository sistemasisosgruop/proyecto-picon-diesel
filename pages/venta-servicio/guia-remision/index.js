import { useMemo, useEffect, useState, useContext } from "react";

import { FormContext } from "../../../contexts/form.context";
import { VentaServiciosContext } from "../../../contexts/venta-servicios.context";

import { ButtonAdd, ButtonSave, ButtonCancel } from "../../../app/components/elements/Buttons";
import { Container } from "../../../app/components/elements/Containers";
import { Title } from "../../../app/components/elements/Title";
import { Divider } from "../../../app/components/elements/Divider";
import { ModalConfirmDelete, ModalLg } from "../../../app/components/modules/Modal";
import { Group, GroupInputs } from "../../../app/components/elements/Form";
import { Input, Option, Select, Textarea } from "@material-tailwind/react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastAlert } from "../../../app/components/elements/ToastAlert";
import { errorProps, successProps } from "../../../app/utils/alert-config";
import { Search } from "../../../app/components/elements/Search";
import { Dropdown, DropdownItem } from "../../../app/components/elements/Dropdown";

import { useModal } from "../../../app/hooks/useModal";
import * as yup from "yup";

import TableComplete from "../../../app/components/modules/TableComplete";
import TableForSelections from "../../../app/components/modules/TableForSelections";

import { useLocalStorage } from "../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../app/utils/axios-request";
import { useQuery } from "react-query";
import { dateFormato, dateRefetchShow } from "../../../app/utils/dateFormat";

const schema = yup.object().shape({
  ordenTrabajoId: yup.number().required(),
  tipoGuia: yup.string().required(),
  nroGuiaRemision: yup.string().required(),
  fechaGuia: yup.date().required(),
  diasValidez: yup.number().required(),
  fechaValidez: yup.date().required(),
  moneda: yup.string().required(),
  formaPagoContadoId: yup.number().nullable(),
  formaPagoCreditoId: yup.number().nullable(),
  tipoDeCambioId: yup.number().required(),
  estado: yup.string().required(),
  clienteId: yup.number().required(),
  vendedorId: yup.number().nullable(),
  personalId: yup.number().nullable(),
  maquinaId: yup.number().required(),
  nroOrdenCompra: yup.string().required(),
  puntoPartida: yup.string().required(),
  puntoLlegada: yup.string().required(),
  motivoTraslada: yup.number().required(),
  agenciaId: yup.number().required(),
  vehiculoId: yup.number().required(),
  choferId: yup.number().required(),
  referencia: yup.string().required(),
  nota: yup.string().required(),
  materiales: yup.array().required(),
  subtotal: yup.number().required(),
  descuento: yup.number().required(),
  subtotalValorNeto: yup.number().required(),
  igv: yup.number().required(),
  totalSoles: yup.number().required(),
});

const updateSchema = yup.object().shape({
  ordenTrabajoId: yup.number().required(),
  tipoGuia: yup.string().required(),
  nroGuiaRemision: yup.string().required(),
  fechaGuia: yup.date().required(),
  diasValidez: yup.number().required(),
  fechaValidez: yup.date().required(),
  moneda: yup.string().required(),
  formaPagoContadoId: yup.number().nullable(),
  formaPagoCreditoId: yup.number().nullable(),
  tipoDeCambioId: yup.number().required(),
  estado: yup.string().required(),
  clienteId: yup.number().required(),
  vendedorId: yup.number().nullable(),
  personalId: yup.number().nullable(),
  maquinaId: yup.number().required(),
  nroOrdenCompra: yup.string().required(),
  puntoPartida: yup.string().required(),
  puntoLlegada: yup.string().required(),
  motivoTraslada: yup.number().required(),
  agenciaId: yup.number().required(),
  vehiculoId: yup.number().required(),
  choferId: yup.number().required(),
  referencia: yup.string().required(),
  nota: yup.string().required(),
  materiales: yup.array().required(),
  subtotal: yup.number().required(),
  descuento: yup.number().required(),
  subtotalValorNeto: yup.number().required(),
  igv: yup.number().required(),
  totalSoles: yup.number().required(),
});

const initialStateForm = {
  ordenTrabajoId: null,
  tipoGuia: null,
  nroGuiaRemision: null,
  fechaGuia: null,
  diasValidez: null,
  fechaValidez: null,
  moneda: null,
  formaPagoContadoId: null,
  formaPagoCreditoId: null,
  tipoDeCambioId: null,
  estado: null,
  clienteId: null,
  vendedorId: null,
  personalId: null,
  maquinaId: null,
  nroOrdenCompra: null,
  puntoPartida: null,
  puntoLlegada: null,
  motivoTraslada: null,
  agenciaId: null,
  vehiculoId: null,
  choferId: null,
  referencia: null,
  nota: null,
  materiales: null,
  subtotal: null,
  descuento: null,
  subtotalValorNeto: null,
  igv: null,
  totalSoles: null,
};

export default function GuiaRemisionServicios() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const { changeData, elementId, updateForm } = useContext(FormContext);
  const { arreglosVentaServicios, setArreglosVentaServicios } = useContext(VentaServiciosContext);

  const [empresaId] = useLocalStorage("empresaId");

  const [ordenesTrabajo, setOrdenesTrabajo] = useState([]);
  const [selectedOrdenTrabajo, setSelectedOrdenTrabajo] = useState(null);
  const [formaDePago, setFormaDePago] = useState("");
  const [formasDePago, setFormasDePago] = useState([]);
  const [tiposCambio, setTiposCambio] = useState([]);
  const [valorTipoCambio, setValorTipoCambio] = useState(Number(1));
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [maquinas, setMaquinas] = useState([]);
  const [selectedMaquina, setSelectedMaquina] = useState(null);
  const [tipoResponsable, setTipoResponsable] = useState("");
  const [responsables, setResponsables] = useState([]);
  const [agencias, setAgencias] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [motivos, setMotivos] = useState([]);

  const [descuentosLimites, setDescuentosLimites] = useState(null);
  const [igv, setIgv] = useState(null);

  const [form, setForm] = useState(initialStateForm);

  useEffect(() => {
    setForm(initialStateForm);
    refetch();
    setArreglosVentaServicios({
      servicios: [],
      repuestos: [],
      materiales: [],
      trabajosTerceros: [],
    });
  }, [changeData]);

  useEffect(() => {
    getAgencias();
    getChoferes();
    getVehiculos();
    getDescuentoApi();
    getIgvApi();
    getMotivos();
  }, []);

  // updateform
  useEffect(() => {
    console.log(guiasResponse?.data);
    const currentTemp = guiasResponse?.data.find((item) => item.id === updateForm?.id);
    const current = { ...currentTemp };
    const updateMateriales = current?.materiales?.map((material) => {
      const rMaterial = material.material;
      rMaterial.cantidad = material.cantidad;
      rMaterial.precio = material.precio;
      return rMaterial;
    });

    if (isEdit) {
      setSelectedOrdenTrabajo(current?.ordenTrabajo);
      setSelectedCliente(current?.cliente);
      setTipoResponsable(current?.personalId ? "personal" : "vendedores");
      setSelectedMaquina(current?.Maquina);
      setForm({
        ...current,
        fechaGuia: dateRefetchShow(current?.fechaGuia),
        fechaValidez: dateRefetchShow(current?.fechaValidez),
      });
      setArreglosVentaServicios({ ...arreglosVentaServicios, materiales: updateMateriales });
    }
  }, [updateForm]);

  // CRUD

  const createRegistro = async () => {
    await schema.validate(
      {
        ...form,
        materiales: arreglosVentaServicios.materiales,
      },
      { abortEarly: false }
    );
    await axiosRequest("post", `/api/venta-servicios/guia-remision`, {
      ...form,
      materiales: arreglosVentaServicios.materiales,
      empresaId: parseInt(empresaId),
      sucursalId: 1,
    });
    toast.success(`Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await updateSchema.validate(
      {
        ...form,
        materiales: arreglosVentaServicios.materiales,
      },
      { abortEarly: false }
    );
    try {
      await axiosRequest("put", `/api/venta-servicios/guia-remision/${elementId}`, {
        ...form,
        materiales: arreglosVentaServicios.materiales,
        empresaId: parseInt(empresaId),
        cliente: undefined,
        Maquina: undefined,
        ordenTrabajo: undefined,
        sucursalId: 1,
      });
      toast.success(`Registro actualizado exitosamente!`, successProps);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const deleteRegistro = async () => {
    try {
      await axiosRequest("delete", `/api/venta-servicios/guia-remision/${elementId}`);
      toast.success(`🗑️ Registro eliminado exitosamente!`, successProps);
      refetch();
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
      setForm(initialStateForm);
      setSelectedCliente(null);
      setSelectedOrdenTrabajo(null);
      setArreglosVentaServicios({
        ...arreglosVentaServicios,
        servicios: [],
        repuestos: [],
        materiales: [],
        trabajosTerceros: [],
      });
      refetch();
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  // Headers

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "N° Guia", accessor: "nroGuiaRemision"},
      { Header: "RUC / DNI", accessor: "razonSocial" },
      { Header: "Nombre Cliente", accessor: "nombreCliente" },
      { Header: "Correo", accessor: "email" },
      { Header: "Guia Remisión", accessor: "codigo" },
      { Header: "Fecha", accessor: "fechaGuia" },
      { Header: "Días validez", accessor: "diasValidez" },
      { Header: "Forma de Pago", accessor: "formaPago" },
    ],
    []
  );

  const columnsMateriales = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Material", accessor: "material" },
      { Header: "Cód.Fábrica", accessor: "codigoFabrica" },
      { Header: "Cantidad", accessor: "cantidad" },
      { Header: "Precio", accessor: "precio" },
    ],
    []
  );

  // BODY

  const getGuias = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/venta-servicios/guia-remision?empresaId=${empresaId}`
    );
    return data;
  };

  const { data: guiasResponse, refetch } = useQuery("guiasRemisionServicio", getGuias, {
    initialData: {
      data: [],
    },
  });

  const guiasRemisionShow = useMemo(
    () =>
      guiasResponse?.data.map(
        ({
          id,
          nroGuiaRemision,
          cliente,
          codigo,
          fechaGuia,
          diasValidez,
          formaPagoContadoId,
          formaPagoCreditoId,
        }) => ({
          id,
          nroGuiaRemision,
          razonSocial: cliente?.numeroDocumento,
          nombreCliente: cliente?.nombre,
          email: cliente?.email,
          codigo,
          fechaGuia: dateFormato(fechaGuia),
          diasValidez,
          formaPago: formaPagoContadoId ? "Contado" : formaPagoCreditoId ? "Crédito" : "No tiene",
        })
      ),
    [guiasResponse?.data]
  );

  const materialesShow = useMemo(
    () =>
      arreglosVentaServicios.materiales?.map(
        ({ id, codigo, codigoFabricante, precio, cantidad }) => ({
          id,
          material: codigo,
          codigoFabrica: codigoFabricante,
          precio,
          cantidad,
        })
      ),
    [arreglosVentaServicios]
  );

  // FUNCTIONS

  const handleSearchOrdenTrabajo = async ({ target }) => {
    const { data } = await axiosRequest(
      "get",
      `/api/venta-servicios/orden-trabajo?empresaId=${empresaId}&filterName=${target.value}`
    );
    setOrdenesTrabajo(data?.data);
  };

  const handleSelectedOrdenTrabajo = (orden) => {
    // console.log(orden);
    setSelectedOrdenTrabajo(orden);
    setSelectedCliente(orden?.cliente);
    const ordenMateriales = orden?.materiales?.map((material) => {
      const rMaterial = material.material;
      rMaterial.cantidad = material.cantidad;
      rMaterial.precio = material.precio;
      rMaterial.comentarios = material.comentarios;
      return rMaterial;
    });
    setArreglosVentaServicios({ ...arreglosVentaServicios, materiales: ordenMateriales });
    setForm({ ...form, ordenTrabajoId: orden.id, clienteId: orden.clienteId });
  };

  const handleTipoGuia = (e) =>
    setForm({ ...form, tipoGuia: e.target.value, nroGuiaRemision: "guia-" });

  const handleNroGuiaRemision = (e) => setForm({ ...form, nroGuiaRemision: e.target.value });

  const handleFechaGuia = (e) => {
    const fecha = new Date(e.target.value);
    const fechaFormat = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(fecha.getDate()).padStart(2, "0")}`;
    setForm({ ...form, fechaGuia: fechaFormat });
  };

  const handleDiasValidez = (e) => {
    if (!/^\d+$/.test(e.target.value) || e.target.value === "") return;
    if (form.fechaGuia) {
      const fecha = new Date(form.fechaGuia);
      fecha.setDate(fecha.getDate() + Number(e.target.value));
      const fechaFormat = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(fecha.getDate()).padStart(2, "0")}`;
      setForm({ ...form, fechaValidez: fechaFormat, diasValidez: Number(e.target.value) });
      return;
    }
    setForm({ ...form, diasValidez: e.target.value });
  };

  const handleMoneda = (e) => {
    setForm({ ...form, moneda: e });
    if (e !== "Soles") getTiposCambio(e);
    else {
      setTiposCambio([]);
    }
  };

  const getTiposCambio = async (moneda) => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/tipo-de-cambio?empresaId=${empresaId}&last=${moneda}`
    );
    console.log(data);
    setTiposCambio([data?.data]);
  };

  const handleTipoDeCambio = (e) => {
    // console.log(e);
    setValorTipoCambio(Number(e.valor));
    setForm({ ...form, tipoDeCambioId: e.id });
  };

  const getFormasDePago = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/forma-de-pago/${formaDePago}?empresaId=${empresaId}`
    );
    setFormasDePago(data?.data);
  };

  useEffect(() => {
    if (formaDePago.length > 0) getFormasDePago();
  }, [formaDePago]);

  const handleFormaDePago = (e) => {
    if (formaDePago === "contado") {
      setForm({ ...form, formaPagoContadoId: e, formaPagoCreditoId: null });
    } else {
      setForm({ ...form, formaPagoCreditoId: e, formaPagoContadoId: null });
    }
  };

  const handleEstadoDelDocumento = (e) => setForm({ ...form, estado: String(e.target.value) });

  const handleSearchMaquina = async ({ target }) => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/maquinas?empresaId=${empresaId}&filter=${target.value}`
    );

    setMaquinas(data?.data);
  };

  const handleSelectedMaquina = (aplicacionMaquina) => {
    setSelectedMaquina(aplicacionMaquina);
    setForm({ ...form, maquinaId: aplicacionMaquina.id });
    // setIsOpenCodigos({ ...isOpenCodigos, aplicacionMaquina: false });
  };

  const getResponsables = async () => {
    // console.log(tipoResponsable);
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/${tipoResponsable}?empresaId=${empresaId}`
    );
    setResponsables(data?.data);
  };

  useEffect(() => {
    if (tipoResponsable.length > 0) getResponsables();
  }, [tipoResponsable]);

  const handleResponsable = (e) => {
    if (tipoResponsable === "vendedores") {
      setForm({ ...form, vendedorId: e.id });
    } else {
      setForm({ ...form, personalId: e.id });
    }
  };

  const handleOrdenDeCompra = (e) => setForm({ ...form, nroOrdenCompra: e.target.value });

  const handlePuntoPartida = (e) => setForm({ ...form, puntoPartida: e.target.value });

  const handlePuntoLlegada = (e) => setForm({ ...form, puntoLlegada: e.target.value });

  const getMotivos = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/motivo-traslado-guia-de-remision?empresaId=${empresaId}`
    );
    setMotivos(data?.data);    
  }

  const handleMotivoTraslado = (e) => setForm({ ...form, motivoTraslada: e.id });

  const getAgencias = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/agencia-transporte?empresaId=${empresaId}`
    );
    setAgencias(data?.data);
  };

  const getChoferes = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/choferes?empresaId=${empresaId}`
    );
    setChoferes(data?.data);
  };

  const getVehiculos = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/vehiculos?empresaId=${empresaId}`
    );
    setVehiculos(data?.data);
  };

  const handleAgencia = (agenciaId) => {
    setForm({ ...form, agenciaId });
  };

  const handleChofer = (choferId) => {
    setForm({ ...form, choferId });
  };

  const handleVehiculo = (vehiculoId) => {
    setForm({ ...form, vehiculoId });
  };

  const handleReferencia = (e) => setForm({ ...form, referencia: e.target.value });

  const handleNota = (e) => setForm({ ...form, nota: e.target.value });

  const getDescuentoApi = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/parametro-descuento?empresaId=${empresaId}`
    );
    setDescuentosLimites(data?.data);
  };

  const getIgvApi = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/parametros?empresaId=${empresaId}`
    );
    for (const obj of data?.data) {
      if (obj.nombre === "IGV" || obj.nombre === "igv" || obj.nombre === "Igv") {
        setIgv(obj);
        return;
      }
    }
    const obj = { valor: 18 };
    setIgv(obj);
  };

  const handleDescuentoInput = (e) => {
    if (
      Number(e.target.value) >= Number(descuentosLimites?.de) &&
      Number(e.target.value) <= Number(descuentosLimites?.a)
    ) {
      setForm({ ...form, descuento: Number(e.target.value) });
      // setDescuento(Number(e.target.value));
    } else if (Number(e.target.value) < Number(descuentosLimites?.de)) {
      setForm({ ...form, descuento: Number(descuentosLimites?.de) });
      // setDescuento(Number(descuentosLimites?.de));
    } else {
      setForm({ ...form, descuento: Number(descuentosLimites?.a) });
      // setDescuento(Number(descuentosLimites?.a));
    }
  };

  useEffect(() => {
    if (arreglosVentaServicios.materiales?.length > 0 && valorTipoCambio > 0) {
      const descuentoTemp = form.descuento || 0;
      const igvTemp = igv?.valor || 0;
      let subtotalTemp = 0;
      for (const material of arreglosVentaServicios.materiales) {
        const valorMaterial = Number(material.precio);
        const cantidad = Number(material.cantidad);
        subtotalTemp += valorMaterial * cantidad;
      }
      const subtotalNetoTemp = subtotalTemp - (subtotalTemp * descuentoTemp) / 100;
      const totalIgv = (subtotalNetoTemp * igvTemp) / 100;
      const totalSolesTemp = subtotalNetoTemp + subtotalNetoTemp + totalIgv;
      setForm({
        ...form,
        subtotal: subtotalTemp,
        subtotalValorNeto: subtotalNetoTemp,
        totalSoles: totalSolesTemp,
        igv: totalIgv
      });
    }
  }, [arreglosVentaServicios.materiales, form.descuento]);

  useEffect(() => {
    console.log(form);
  }, [form]);

  return (
    <>
      <Container whiteColor={true}>
        <Title text={"Guias de Remision"}>
          <ButtonAdd text={"Nueva Guia de Remisión"} onClick={() => openModal(false)} />
        </Title>
        <TableComplete
          columns={columns}
          data={guiasRemisionShow}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </Container>

      <ModalLg
        title={isEdit ? "Editar Guia de Remisión" : "Nueva Guía de Remisión"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
          <Group title={""}>
            <Search
              // onFocus={() => }
              onChange={handleSearchOrdenTrabajo}
            />
            <Dropdown isOpen={true} elements={ordenesTrabajo.length}>
              {ordenesTrabajo?.map((orden) => {
                return (
                  <DropdownItem
                    handleClick={() => {
                      handleSelectedOrdenTrabajo(orden);
                    }}
                    key={orden.id}
                    name={`COD: ${orden?.codigo} - Cliente: ${orden?.cliente.nombre} - RUC/DNI: ${orden?.cliente.numeroDocumento}`}
                  />
                );
              })}
            </Dropdown>
            <Input
              label="Orden de Trabajo"
              disabled
              value={`COD: ${selectedOrdenTrabajo?.codigo} - Cliente: ${selectedOrdenTrabajo?.cliente.nombre} - RUC/DNI: ${selectedOrdenTrabajo?.cliente.numeroDocumento}`}
            />
          </Group>

          <Group title={"Información general"}>
            <GroupInputs>
              <Input
                label="Tipo de Guía"
                type="text"
                value={form.tipoGuia}
                onChange={(e) => handleTipoGuia(e)}
              />

              <Input
                label="Nro Guía de Remisión"
                type="text"
                value={form.nroGuiaRemision}
                onChange={(e) => handleNroGuiaRemision(e)}
                disabled
              />
            </GroupInputs>

            <GroupInputs>
              <Input
                label="Fecha guia de remisión"
                type="date"
                value={form.fechaGuia}
                onChange={(e) => handleFechaGuia(e)}
              />

              <Input
                label="Dias de validez"
                type="text"
                value={form.diasValidez}
                onChange={(e) => handleDiasValidez(e)}
                disabled={form.fechaGuia === null}
              />

              <Input label="Fecha de validez" type="date" disabled value={form?.fechaValidez} />
            </GroupInputs>
            <GroupInputs>
              <Select label="Moneda" onChange={(e) => handleMoneda(e)} value={form?.moneda}>
                <Option key={1} value={"Soles"}>
                  Soles
                </Option>
                <Option key={2} value={"Dolar"}>
                  Dolares
                </Option>
              </Select>
              {/* <Select
                label="Forma de pago"
                onChange={(e) => setFormaDePago(String(e))}
                value={form?.formaPagoContadoId ? "contado" : form?.formaPagoCreditoId && "credito"}
              >
                <Option value={"contado"}>contado</Option>
                <Option value={"credito"}>crédito</Option>
              </Select> */}
            </GroupInputs>

            {/* <GroupInputs>
              <Select
                label="Forma de Pago"
                onChange={(e) => handleFormaDePago(e)}
                disabled={formaDePago.length === 0}
              >
                {formasDePago?.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item?.nombre}
                    </Option>
                  );
                })}
              </Select>
            </GroupInputs> */}

            <GroupInputs>
              {/* <Select
                label="Tipo de Cambio"
                onChange={(e) => handleTipoDeCambio(e)}
                disabled={form.moneda === null || form.moneda === "Soles"}
              >
                {tiposCambio?.map((tipoCambio) => {
                  return (
                    <Option key={tipoCambio.id} value={tipoCambio}>
                      {`De ${tipoCambio.de} a ${tipoCambio.a}: ${tipoCambio.valor}`}
                    </Option>
                  );
                })}
              </Select> */}

              <Input
                label="Estado"
                value={form.estado}
                onChange={(e) => handleEstadoDelDocumento(e)}
              />
            </GroupInputs>
          </Group>
          <Group title={"Cliente"}>
            <GroupInputs>
              <Input label="RUC/DNI" value={selectedCliente?.numeroDocumento} disabled />
              <Input label="Nombre del cliente" value={selectedCliente?.nombre} disabled />
            </GroupInputs>

            <GroupInputs>
              <Input label="Teléfono" disabled value={selectedCliente?.telefono} />
              <Input label="Correo" disabled value={selectedCliente?.email} />
              <Input label="Dirección" disabled />
            </GroupInputs>
          </Group>

          <Group title={"Máquina"}>
            <Search
              // onFocus={() => setIsOpenCodigos({ ...isOpenCodigos, aplicacionMaquina: true })}
              onChange={handleSearchMaquina}
            />
            <Dropdown isOpen={true} elements={maquinas.length}>
              {maquinas?.map((aplicacionMaquina) => {
                return (
                  <DropdownItem
                    handleClick={() => {
                      handleSelectedMaquina(aplicacionMaquina);
                    }}
                    key={aplicacionMaquina.id}
                    name={`COD: ${aplicacionMaquina?.codigo} - COD. Fabrica: ${aplicacionMaquina?.fabricaMaquina.fabrica} - 
                                Modelo de maquina: ${aplicacionMaquina?.modeloMaquina.modelo} - COD. Motor: ${aplicacionMaquina?.codigoOriginal}`}
                  />
                );
              })}
            </Dropdown>
            <Input
              label="Aplicación de la máquina"
              disabled
              value={`COD: ${selectedMaquina?.codigo} - COD. Fabrica: ${selectedMaquina?.fabricaMaquina.fabrica} - 
                                Modelo de maquina: ${selectedMaquina?.modeloMaquina.modelo} - COD. Motor: ${selectedMaquina?.codigoOriginal}`}
            />
          </Group>

          <Group title={"Responsable"}>
            <GroupInputs>
              <Select label="Rol" onChange={(e) => setTipoResponsable(String(e))}>
                <Option value={"vendedores"}>Vendedor</Option>
                <Option value={"personal"}>Personal</Option>
              </Select>

              <Select
                label="Responsable"
                onChange={(e) => handleResponsable(e)}
                disabled={tipoResponsable.length === 0}
              >
                {responsables?.map((responsable) => {
                  return (
                    <Option key={responsable.id} value={responsable}>
                      {responsable.nombre}
                    </Option>
                  );
                })}
              </Select>
            </GroupInputs>
          </Group>

          <Group title={"Orden de compra"}>
            <GroupInputs>
              <Input
                label="N de O.C."
                type="text"
                value={form.nroOrdenCompra}
                onChange={(e) => handleOrdenDeCompra(e)}
              />
            </GroupInputs>
          </Group>

          <Group title={"Datos de envío"}>
            <GroupInputs>
              <Input
                label="Punto de partida"
                type="text"
                value={form.puntoPartida}
                onChange={(e) => handlePuntoPartida(e)}
              />
              <Input
                label="Punto de llegada"
                type="text"
                value={form.puntoLlegada}
                onChange={(e) => handlePuntoLlegada(e)}
              />
            </GroupInputs>
            <GroupInputs>
              <Select
                label="Motivo de traslado"
                onChange={(e) => handleMotivoTraslado(e)}
                // disabled={tipoResponsable.length === 0}
              >
                {motivos?.map((motivo) => {
                  return (
                    <Option key={motivo.id} value={motivo}>
                      {`${motivo.motivo} - ${motivo.descripcion}`}
                    </Option>
                  );
                })}
              </Select>
            </GroupInputs>
            <GroupInputs>
              <Select
                label="Agencia de transporte"
                onChange={(e) => handleAgencia(e)}
                value={form?.agenciaId}
              >
                {agencias?.map((agencia) => {
                  return (
                    <Option key={agencia.id} value={agencia.id}>
                      {agencia.nombre}
                    </Option>
                  );
                })}
              </Select>
              <Select label="Vehículo" onChange={(e) => handleVehiculo(e)} value={form?.vehiculoId}>
                {vehiculos?.map((vehiculo) => {
                  return (
                    <Option key={vehiculo.id} value={vehiculo.id}>
                      {`${vehiculo.placa} - ${vehiculo.modelo}`}
                    </Option>
                  );
                })}
              </Select>
              <Select label="Chofer" onChange={(e) => handleChofer(e)} value={form?.choferId}>
                {choferes?.map((chofer) => {
                  return (
                    <Option key={chofer.id} value={chofer.id}>
                      {chofer.nombre}
                    </Option>
                  );
                })}
              </Select>
            </GroupInputs>
          </Group>

          <Group title={"Otro"}>
            <Input
              label="Referencia"
              value={form?.referencia}
              onChange={(e) => handleReferencia(e)}
            ></Input>
            <Textarea label="Nota" value={form?.nota} onChange={(e) => handleNota(e)}></Textarea>
          </Group>

          <Group title={"Materiales"}>
            <TableForSelections columns={columnsMateriales} data={materialesShow || []} />

            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">Subtotal valor venta soles</span>
                </div>
                <div>
                  <Input disabled value={form.subtotal} />
                </div>
              </div>
            </GroupInputs>

            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex gap-2 justify-center items-center">
                  <span className="font-semibold">Descuento</span>
                  <span
                    className="px-3 py-1"
                    style={{ backgroundColor: "#f3f4f6", borderRadius: "4px" }}
                  >
                    {`${descuentosLimites?.de}%-${descuentosLimites?.a}%`}
                  </span>
                </div>
                <div>
                  <Input
                    label="descuento"
                    value={form.descuento}
                    disabled={arreglosVentaServicios.materiales?.length === 0}
                    onChange={(e) => handleDescuentoInput(e)}
                  />
                </div>
              </div>
            </GroupInputs>
            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">Subtotal valor venta neto soles</span>
                </div>
                <div>
                  <Input disabled value={form.subtotalValorNeto} />
                </div>
              </div>
            </GroupInputs>
            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex gap-2 justify-center items-center">
                  <span className="font-semibold">IGV</span>
                  <span
                    style={{ backgroundColor: "#f3f4f6", borderRadius: "4px" }}
                    className="px-3 py-1"
                  >
                    {`${igv?.valor}`}
                  </span>
                </div>
                <div>
                  <Input
                    label="IGV"
                    value={form?.igv}
                    onChange={(e) => setForm({ ...form, igv: Number(e.target.value) })}
                    disabled
                  />
                </div>
              </div>
            </GroupInputs>
            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">TOTAL DE COTIZACION SOLES</span>
                </div>
                <div>
                  <Input disabled value={form.totalSoles} />
                </div>
              </div>
            </GroupInputs>
            <Divider />
          </Group>
        </form>

        <div className="w-full flex justify-end gap-5">
          <ButtonCancel onClick={closeModal} />
          <ButtonSave onClick={saveData} />
        </div>
      </ModalLg>

      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={deleteRegistro}
        title={"Eliminar Empresa"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
