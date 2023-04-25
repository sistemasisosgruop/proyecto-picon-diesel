import { useMemo, useEffect, useState, useContext } from "react";
import { ButtonAdd, ButtonSave, ButtonCancel } from "../../../app/components/elements/Buttons";
import { Container } from "../../../app/components/elements/Containers";
import { Title } from "../../../app/components/elements/Title";
import { Divider } from "../../../app/components/elements/Divider";
import { ModalConfirmDelete, ModalLg } from "../../../app/components/modules/Modal";
import { useModal } from "../../../app/hooks/useModal";

import { Group, GroupInputs } from "../../../app/components/elements/Form";
import { Input, Option, Select, Textarea } from "@material-tailwind/react";
import * as yup from "yup";
import { toast } from "react-toastify";
import { ToastAlert } from "../../../app/components/elements/ToastAlert";
import { errorProps, successProps } from "../../../app/utils/alert-config";
import { Search } from "../../../app/components/elements/Search";
import { Dropdown, DropdownItem } from "../../../app/components/elements/Dropdown";
import { dateFormato, dateRefetchShow } from "../../../app/utils/dateFormat";

import "react-toastify/dist/ReactToastify.css";
import TableMaterialesForm from "../../../app/components/modules/TableMaterialesForm";
import TableComplete from "../../../app/components/modules/TableComplete";
import { useLocalStorage } from "../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../app/utils/axios-request";
import { useQuery } from "react-query";
import { FormContext } from "../../../contexts/form.context";
import { MaterialesContext } from "../../../contexts/materiales.context";
import { VentaMostradorContext } from "../../../contexts/venta-mostrador.context";

const schema = yup.object().shape({
  aprovacionPedidoId: yup.number().required(),
  tipoDeGuia: yup.string().required(),
  NumeroGuiaDeRemision: yup.string().required(),
  serie: yup.string().required(),
  fechaDeCotizacion: yup.date().required(),
  diasDeValidez: yup.number().required(),
  fechaDeValidez: yup.date().required(),
  moneda: yup.string().required(),
  formaPagoContadoId: yup.number().nullable(),
  formaPagoCreditoId: yup.number().nullable(),
  tipoDeCambioId: yup.number().nullable(),
  estado: yup.string().required(),
  clienteId: yup.number().required(),
  maquina: yup.string(),
  vendedorId: yup.number().nullable(),
  personalId: yup.number().nullable(),
  numeroDeOrden: yup.string().required(),
  puntoDePartida: yup.string().required(),
  puntoDeLlegada: yup.string().required(),
  motivoDeTraslado: yup.number().required(),
  referencia: yup.string().required(),
  nota: yup.string().required(),
  agenciaId: yup.number().required(),
  vehiculoId: yup.number().required(),
  choferId: yup.number().required(),
  subtotal: yup.number().required(),
  descuento: yup.number().required(),
  subtotalValorNeto: yup.number().required(),
  igv: yup.number().required(),
  totalSoles: yup.number().required(),
});

const updateSchema = yup.object().shape({
  aprovacionPedidoId: yup.number().required(),
  tipoDeGuia: yup.string().required(),
  NumeroGuiaDeRemision: yup.string().required(),
  serie: yup.string().required(),
  fechaDeCotizacion: yup.date().required(),
  diasDeValidez: yup.number().required(),
  fechaDeValidez: yup.date().required(),
  moneda: yup.string().required(),
  formaPagoContadoId: yup.number().nullable(),
  formaPagoCreditoId: yup.number().nullable(),
  tipoDeCambioId: yup.number().nullable(),
  estado: yup.string().required(),
  clienteId: yup.number().required(),
  maquina: yup.string(),
  vendedorId: yup.number().nullable(),
  personalId: yup.number().nullable(),
  numeroDeOrden: yup.string().required(),
  puntoDePartida: yup.string().required(),
  puntoDeLlegada: yup.string().required(),
  motivoDeTraslado: yup.number().required(),
  referencia: yup.string().required(),
  nota: yup.string().required(),
  agenciaId: yup.number().required(),
  vehiculoId: yup.number().required(),
  choferId: yup.number().required(),
  subtotal: yup.number().required(),
  descuento: yup.number().required(),
  subtotalValorNeto: yup.number().required(),
  igv: yup.number().required(),
  totalSoles: yup.number().required(),
});

const initialStateForm = {
  aprovacionPedidoId: null,
  tipoDeGuia: null,
  NumeroGuiaDeRemision: null,
  serie: null,
  fechaDeCotizacion: null,
  diasDeValidez: null,
  fechaDeValidez: null,
  moneda: null,
  formaPagoContadoId: null,
  formaPagoCreditoId: null,
  tipoDeCambioId: null,
  estado: null,
  clienteId: null,
  maquina: null,
  vendedorId: null,
  personalId: null,
  numeroDeOrden: null,
  puntoDePartida: null,
  puntoDeLlegada: null,
  motivoDeTraslado: null,
  referencia: null,
  nota: null,
  agenciaId: null,
  vehiculoId: null,
  choferId: null,
  subtotal: null,
  descuento: null,
  subtotalValorNeto: null,
  igv: null,
  totalSoles: null,
};

export default function GuiaRemision() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();

  const [empresaId] = useLocalStorage("empresaId");
  const [formaDePago, setFormaDePago] = useState("");
  const [formasDePago, setFormasDePago] = useState([]);
  const [tiposCambio, setTiposCambio] = useState([]);
  const [valorTipoCambio, setValorTipoCambio] = useState(Number(1));
  const [tipoResponsable, setTipoResponsable] = useState("");
  const [responsables, setResponsables] = useState([]);
  const [descuentosLimites, setDescuentosLimites] = useState(null);
  const [igv, setIgv] = useState(null);
  const [pedidosAprobadosRes, setPedidosAprobadosRes] = useState([]);
  const [selectedPedidoAprobado, setSelectedPedidoAprobado] = useState(null);
  const [clientePedido, setClientePedido] = useState(null);
  const [aplicacionMaquinas, setAplicacionMaquinas] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [agencias, setAgencias] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [isOpenCodigos, setIsOpenCodigos] = useState({
    aplicacionMaquina: false,
    materiales: false,
  });

  const { changeData, elementId, updateForm } = useContext(FormContext);

  const {
    setCodigos,
    selectedMaquina,
    setSelectedMaquina,
    selectedMateriales,
    setSelectedMateriales,
  } = useContext(MaterialesContext);

  const { arreglosVenta, setArreglosVenta } = useContext(VentaMostradorContext);

  const [form, setForm] = useState({
    aprovacionPedidoId: null,
    tipoDeGuia: null,
    NumeroGuiaDeRemision: null,
    serie: null,
    fechaDeCotizacion: null,
    diasDeValidez: null,
    fechaDeValidez: null,
    moneda: null,
    formaPagoContadoId: null,
    formaPagoCreditoId: null,
    tipoDeCambioId: null,
    estado: null,
    clienteId: null,
    maquina: null,
    vendedorId: null,
    personalId: null,
    numeroDeOrden: null,
    puntoDePartida: null,
    puntoDeLlegada: null,
    motivoDeTraslado: null,
    referencia: null,
    nota: null,
    agenciaId: null,
    vehiculoId: null,
    choferId: null,
    subtotal: null,
    descuento: null,
    subtotalValorNeto: null,
    igv: null,
    totalSoles: null,
  });

  useEffect(() => {
    setForm(initialStateForm);
    refetch();
    setSelectedMateriales({ materiales: [] });
    setSelectedMaquina(null);
    setClientePedido(null);
  }, [changeData]);

  useEffect(() => {
    setArreglosVenta({
      clientes: [],
      cotizaciones: [],
      codigos: [],
      materiales: [],
      cotizacionesAprobadas: [],
    });
    setCodigos({
      reemplazo: [],
      similitud: [],
      equivalencia: [],
      aplicacionMaquina: [],
    });
    setSelectedMateriales({ materiales: [] });
    getDescuentoApi();
    getIgvApi();
    getAgencias();
    getChoferes();
    getVehiculos();
    getMotivos();
  }, []);

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

  // Updateform

  useEffect(() => {
    console.log(guiasResponse?.data);
    const currentTemp = guiasResponse?.data.find((item) => item.id === updateForm?.id);
    const current = { ...currentTemp };
    // materiales esta dentro de current.aprovacionPedido
    if (isEdit) {
      setSelectedPedidoAprobado(current?.aprovacionPedido);
      setClientePedido(current?.cliente);
      setTipoResponsable(current?.personalId ? "personal" : "vendedores");
      setForm({
        ...current,
        fechaDeCotizacion: dateRefetchShow(current?.fechaDeCotizacion),
        fechaDeValidez: dateRefetchShow(current?.fechaDeValidez),
      });
      setSelectedMateriales({
        ...selectedMateriales,
        materiales: destructureMaterials(current?.aprovacionPedido?.materiales),
      });
    }
  }, [updateForm]);

  // CRUD

  const createRegistro = async () => {
    await schema.validate(
      {
        ...form,
      },
      { abortEarly: false }
    );
    await axiosRequest("post", `/api/venta-mostrador/guia-remision`, {
      ...form,
      empresaId: parseInt(empresaId),
      sucursalId: 1,
    });
    toast.success(`Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await updateSchema.validate(
      {
        ...form,
      },
      { abortEarly: false }
    );
    try {
      await axiosRequest("put", `/api/venta-mostrador/guia-remision/${elementId}`, {
        ...form,
        empresaId: parseInt(empresaId),
        cliente: undefined,
        aprovacionPedido: undefined,
        sucursalId: 1,
      });
      toast.success(`Registro actualizado exitosamente!`, successProps);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const deleteRegistro = async () => {
    try {
      await axiosRequest("delete", `/api/venta-mostrador/guia-remision/${elementId}`);
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
      setClientePedido(null);
      setSelectedPedidoAprobado(null);
      setArreglosVenta({
        ...arreglosVenta,
        clientes: [],
        cotizaciones: [],
        codigos: [],
        materiales: [],
        cotizacionesAprobadas: [],
      });
      setSelectedMaquina(null);
      refetch();
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  // HEADERS
  const columns = useMemo(
    () => [
      { Header: "N°", accessor: "id" },
      { Header: "Nro Guia", accessor: "NumeroGuiaDeRemision"},
      { Header: "RUC / DNI", accessor: "razonSocial" },
      { Header: "Nombre Cliente", accessor: "nombreCliente" },
      { Header: "Fecha", accessor: "fecha" },
      { Header: "Dias validez", accessor: "diasValidez" },
      { Header: "Forma de pago", accessor: "formaDePago" },
      { Header: "Correo", accessor: "email" },
    ],
    []
  );

  const columnsMateriales = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Codigo interno", accessor: "codigoInterno" },
      { Header: "Cod. Fabrica", accessor: "codigoDeFabrica" },
      { Header: "Familia", accessor: "familia" },
      { Header: "Descripcion", accessor: "descripcion" },
      { Header: "Comentario", accessor: "comentario" },
      { Header: "Cantidad", accessor: "cantidad" },
      { Header: "Vta Unit.", accessor: "ventaUnidad" },
    ],
    [selectedMateriales]
  );

  // BODY

  const getGuias = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/venta-mostrador/guia-remision?empresaId=${empresaId}`
    );
    return data;
  };

  const { data: guiasResponse, refetch } = useQuery("guias", getGuias, {
    initialData: {
      data: [],
    },
  });

  const guiasShow = useMemo(
    () =>
      guiasResponse?.data.map(
        ({
          id,
          NumeroGuiaDeRemision,
          fechaDeCotizacion,
          cliente,
          diasDeValidez,
          formaPagoContadoId,
          formaPagoCreditoId,
        }) => ({
          id,
          NumeroGuiaDeRemision,
          razonSocial: cliente.numeroDocumento,
          nombreCliente: cliente.nombre,
          fecha: dateFormato(fechaDeCotizacion),
          diasValidez: diasDeValidez,
          formaDePago: formaPagoContadoId ? "Contado" : formaPagoCreditoId ? "Crédito" : "No tiene",
          email: cliente.email,
        })
      ),
    [guiasResponse?.data]
  );

  useEffect(() => {
    if (selectedMateriales.materiales?.length > 0 && valorTipoCambio > 0) {
      let subtotalTemp = 0;
      const materialesTemp = [];
      for (const material of selectedMateriales.materiales) {
        const valorMaterial = Number(material.ventaUnidad) || 50;
        const cantidad = Number(material.cantidad);
        subtotalTemp += valorMaterial * cantidad;
        materialesTemp.push({ id: material.id, cantidadMateriales: material.cantidad });
      }
      const descuentoTemp = form.descuento || 0;
      const igvTemp = igv?.valor || 0;
      const subtotalNetoTemp = subtotalTemp - (subtotalTemp * descuentoTemp) / 100;
      const totalIgv = (subtotalNetoTemp * igvTemp) / 100;
      const totalSolesTemp = subtotalNetoTemp + subtotalNetoTemp + totalIgv;
      setForm({
        ...form,
        subtotal: subtotalTemp,
        subtotalValorNeto: subtotalNetoTemp,
        totalSoles: totalSolesTemp,
        igv: totalIgv,
      });
    }
  }, [selectedMateriales, form.descuento]);

  const materialesShow = useMemo(
    () =>
      selectedMateriales.materiales?.map(
        ({ id, codigo, codigoFabricante, denominacion, familia, cantidad, ventaUnidad }) => ({
          id,
          codigoInterno: codigo,
          codigoDeFabrica: codigoFabricante,
          familia: familia?.codigo,
          descripcion: denominacion,
          comentario: `comentario ${id}`,
          cantidad: !cantidad ? "0" : cantidad,
          ventaUnidad: ventaUnidad || 50,
        })
      ),
    [selectedMateriales]
  );

  // FUNCTIONS

  const destructureMaterials = (materiales) => {
    return materiales?.map((material) => {
      return {
        ...material.material,
        cantidad: material.cantidad,
      };
    });
  };

  const handleSearchPedidoAprobado = async ({ target }) => {
    const { data } = await axiosRequest(
      "get",
      `/api/venta-mostrador/aprobacion-pedidos?empresaId=${empresaId}&filterName=${target.value}`
    );
    setPedidosAprobadosRes(data?.data);
  };

  const handleSelectedPedidoAprobado = (pedido) => {
    setSelectedPedidoAprobado(pedido);
    setClientePedido(pedido.cliente);
    setSelectedMateriales({
      ...selectedMateriales,
      materiales: destructureMaterials(pedido.materiales),
    });
    setForm({ ...form, aprovacionPedidoId: pedido.id, clienteId: pedido.clienteId });
  };

  const handleTipoGuia = (e) =>
    setForm({ ...form, tipoDeGuia: e.target.value, NumeroGuiaDeRemision: "guia-" });

  const handleNroGuiaRemision = (e) => setForm({ ...form, NumeroGuiaDeRemision: e.target.value });

  const handleSerie = (e) => setForm({ ...form, serie: e.target.value });

  const handleFechaCotizacion = (e) => {
    const fecha = new Date(e.target.value);
    const fechaFormat = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(fecha.getDate()).padStart(2, "0")}`;
    setForm({ ...form, fechaDeCotizacion: fechaFormat });
  };

  const handleDiasValidez = (e) => {
    if (!/^\d+$/.test(e.target.value) || e.target.value === "") return;
    if (form.fechaDeCotizacion) {
      const fecha = new Date(form.fechaDeCotizacion);
      fecha.setDate(fecha.getDate() + Number(e.target.value));
      const fechaFormat = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(fecha.getDate()).padStart(2, "0")}`;
      setForm({ ...form, fechaDeValidez: fechaFormat, diasDeValidez: Number(e.target.value) });
      return;
    }
    setForm({ ...form, diasDeValidez: e.target.value });
  };

  const getTiposCambio = async (moneda) => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/tipo-de-cambio?empresaId=${empresaId}&last=${moneda}`
    );
    console.log(data);
    setTiposCambio([data?.data]);
  };

  const handleMoneda = (e) => {
    setForm({ ...form, moneda: e });
    if (e !== "Soles") getTiposCambio(e);
    else {
      setTiposCambio([]);
    }
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

    setAplicacionMaquinas(data?.data);
  };

  const handleSelectedMaquina = (aplicacionMaquina) => {
    setSelectedMaquina(aplicacionMaquina);
    setForm({ ...form, maquina: aplicacionMaquina.codigo });
    setIsOpenCodigos({ ...isOpenCodigos, aplicacionMaquina: false });
  };

  const getResponsables = async () => {
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

  const handleOrdenDeCompra = (e) => setForm({ ...form, numeroDeOrden: e.target.value });

  const handlePuntoPartida = (e) => setForm({ ...form, puntoDePartida: e.target.value });

  const handlePuntoLlegada = (e) => setForm({ ...form, puntoDeLlegada: e.target.value });

  const getMotivos = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/motivo-traslado-guia-de-remision?empresaId=${empresaId}`
    );
    setMotivos(data?.data);    
  }

  const handleMotivoTraslado = (e) => setForm({ ...form, motivoDeTraslado: e.id });

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

  const handleAgencia = (agencia) => {
    setForm({ ...form, agenciaId: agencia.id });
  };

  const handleChofer = (chofer) => {
    setForm({ ...form, choferId: chofer.id });
  };

  const handleVehiculo = (vehiculo) => {
    setForm({ ...form, vehiculoId: vehiculo.id });
  };

  const handleReferencia = (e) => setForm({ ...form, referencia: e.target.value });
  const handleNota = (e) => setForm({ ...form, nota: e.target.value });

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
    console.log(form);
  }, [form]);

  return (
    <>
      <Container whiteColor={true}>
        <Title text={"Guías de remision"}>
          <ButtonAdd text={"Nueva Guía"} onClick={() => openModal(false)} />
        </Title>
        {/* Table List */}
        <TableComplete
          columns={columns}
          data={guiasShow}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </Container>
      {/* Modal agregar */}
      <ModalLg
        title={isEdit ? "Editar Guia de Remisión" : "Nueva Guia de Remisión"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
          <Group title={""}>
            <Search
              // onFocus={() => setIsOpenCodigos({ ...isOpenCodigos, aplicacionMaquina: true })}
              onChange={handleSearchPedidoAprobado}
            />
            <Dropdown isOpen={true} elements={pedidosAprobadosRes.length}>
              {pedidosAprobadosRes?.map((pedido) => {
                return (
                  <DropdownItem
                    handleClick={() => {
                      handleSelectedPedidoAprobado(pedido);
                    }}
                    key={pedido.id}
                    name={`COD: ${pedido?.number} - Cliente: ${pedido?.cliente.nombre} - RUC/DNI: ${pedido?.cliente.numeroDocumento}`}
                  />
                );
              })}
            </Dropdown>
            <Input
              label="Pedido Aprobado"
              disabled
              value={`COD: ${selectedPedidoAprobado?.number} - Cliente: ${selectedPedidoAprobado?.cliente.nombre} - RUC/DNI: ${selectedPedidoAprobado?.cliente.numeroDocumento}`}
            />
          </Group>

          <Group title={"Información general"}>
            <GroupInputs>
              <Input
                label="Tipo de Guía"
                type="text"
                value={form.tipoDeGuia}
                onChange={(e) => handleTipoGuia(e)}
              />

              <Input
                label="Nro Guía de Remisión"
                type="text"
                value={form.NumeroGuiaDeRemision}
                onChange={(e) => handleNroGuiaRemision(e)}
                disabled
              />

              <Input
                label="Serie"
                type="text"
                value={form.serie}
                onChange={(e) => handleSerie(e)}
              />
            </GroupInputs>

            <GroupInputs>
              <Input
                label="Fecha de Cotización"
                type="date"
                value={form.fechaDeCotizacion}
                onChange={(e) => handleFechaCotizacion(e)}
              />

              <Input
                label="Dias de validez"
                type="text"
                value={form.diasDeValidez}
                onChange={(e) => handleDiasValidez(e)}
                disabled={form.fechaDeCotizacion === null}
              />

              <Input label="Fecha de validez" type="date" disabled value={form.fechaDeValidez} />
            </GroupInputs>
            <GroupInputs>
              <Select label="Moneda" onChange={(e) => handleMoneda(e)}>
                <Option key={1} value={"Soles"}>
                  Soles
                </Option>
                <Option key={2} value={"Dolar"}>
                  Dolares
                </Option>
              </Select>
              {/* <Select label="Forma de pago" onChange={(e) => setFormaDePago(String(e))}>
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
              <Input label="RUC/DNI" value={clientePedido?.numeroDocumento} disabled />
              <Input label="Nombre del cliente" value={clientePedido?.nombre} disabled />
            </GroupInputs>

            <GroupInputs>
              <Input label="Teléfono" disabled value={clientePedido?.telefono} />
              <Input label="Correo" disabled value={clientePedido?.email} />
              <Input label="Dirección" disabled />
            </GroupInputs>
          </Group>

          <Group title={"Máquina"}>
            <Search
              onFocus={() => setIsOpenCodigos({ ...isOpenCodigos, aplicacionMaquina: true })}
              onChange={handleSearchMaquina}
            />
            <Dropdown isOpen={isOpenCodigos.aplicacionMaquina} elements={aplicacionMaquinas.length}>
              {aplicacionMaquinas?.map((aplicacionMaquina) => {
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
              value={
                selectedMaquina
                  ? `COD: ${selectedMaquina?.codigo} - COD. Fabrica: ${selectedMaquina?.fabricaMaquina.fabrica} - 
                      Modelo de maquina: ${selectedMaquina?.modeloMaquina.modelo} - COD. Motor: ${selectedMaquina?.codigoOriginal}`
                  : `Máquina: ${form?.maquina}`
              }
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
                value={form.numeroDeOrden}
                onChange={(e) => handleOrdenDeCompra(e)}
              />
            </GroupInputs>
          </Group>

          <Group title={"Datos de envío"}>
            <GroupInputs>
              <Input
                label="Punto de partida"
                type="text"
                value={form.puntoDePartida}
                onChange={(e) => handlePuntoPartida(e)}
              />
              <Input
                label="Punto de llegada"
                type="text"
                value={form.puntoDeLlegada}
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
              {/* <Input
                label="Motivo de traslado"
                type="text"
                value={form.motivoDeTraslado}
                onChange={(e) => handleMotivoTraslado(e)}
              /> */}
            </GroupInputs>
            <GroupInputs>
              <Select label="Agencia de transporte" onChange={(e) => handleAgencia(e)}>
                {agencias?.map((agencia) => {
                  return (
                    <Option key={agencia.id} value={agencia}>
                      {agencia.nombre}
                    </Option>
                  );
                })}
              </Select>
              <Select label="Vehículo" onChange={(e) => handleVehiculo(e)}>
                {vehiculos?.map((vehiculo) => {
                  return (
                    <Option key={vehiculo.id} value={vehiculo}>
                      {`${vehiculo.placa} - ${vehiculo.modelo}`}
                    </Option>
                  );
                })}
              </Select>
              <Select label="Chofer" onChange={(e) => handleChofer(e)}>
                {choferes?.map((chofer) => {
                  return (
                    <Option key={chofer.id} value={chofer}>
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

          <Group title={""}>
            <TableMaterialesForm
              columns={columnsMateriales}
              data={materialesShow || []}
              isSearching={false}
              canDelete={false}
            />

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
                    disabled={selectedMateriales.materiales?.length === 0}
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
                    value={form.igv}
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
