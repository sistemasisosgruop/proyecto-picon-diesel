import { useMemo, useEffect, useState, useContext } from "react";

import { ButtonAdd, ButtonSave, ButtonCancel } from "../../../app/components/elements/Buttons";
import { Container } from "../../../app/components/elements/Containers";
import { Title } from "../../../app/components/elements/Title";
import { Divider } from "../../../app/components/elements/Divider";
import { ModalConfirmDelete, ModalLg } from "../../../app/components/modules/Modal";
import { useModal } from "../../../app/hooks/useModal";
import TableMaterialesForm from "../../../app/components/modules/TableMaterialesForm";
import TableComplete from "../../../app/components/modules/TableComplete";

import { Group, GroupInputs } from "../../../app/components/elements/Form";
import { Input, Option, Select, Textarea, Checkbox } from "@material-tailwind/react";
import * as yup from "yup";
import { toast } from "react-toastify";
import { ToastAlert } from "../../../app/components/elements/ToastAlert";
import { errorProps, successProps } from "../../../app/utils/alert-config";
import { Search } from "../../../app/components/elements/Search";
import { Dropdown, DropdownItem } from "../../../app/components/elements/Dropdown";
import { dateFormato } from "../../../app/utils/dateFormat";

import "react-toastify/dist/ReactToastify.css";
import { useLocalStorage } from "../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../app/utils/axios-request";
import { useQuery } from "react-query";
import { FormContext } from "../../../contexts/form.context";
import { MaterialesContext } from "../../../contexts/materiales.context";
import { VentaMostradorContext } from "../../../contexts/venta-mostrador.context";
import TableForSelections from "../../../app/components/modules/TableForSelections";

const schema = yup.object().shape({
  numeroDeFactura: yup.string().required(),
  tipoDeDocumentoId: yup.number().required(),
  serie: yup.string().required(),
  fechaDeFactura: yup.date().required(),
  fechaDeValidez: yup.date().required(),
  diasDeValidez: yup.number().required(),
  moneda: yup.string().required(),
  formaPagoContadoId: yup.number().nullable(),
  formaPagoCreditoId: yup.number().nullable(),
  tipoDeCambioId: yup.number().nullable(),
  estado: yup.string().required(),
  guiaDeRemisionId: yup.number().required(),
  clienteId: yup.number().required(),
  maquina: yup.string(),
  vendedorId: yup.number().nullable(),
  personalId: yup.number().nullable(),
  ordenDeCompra: yup.string().required(),
  referencia: yup.string(),
  nota: yup.string(),
  subtotal: yup.number().required(),
  descuento: yup.number().required(),
  subtotalValorNeto: yup.number().required(),
  igv: yup.number().required(),
  totalSoles: yup.number().required(),
  icbper: yup.number().required(),
  haveIcbper: yup.boolean().required(),
  detraccionId: yup.number().required(),
  observaciones: yup.string().nullable(),
});

const updateSchema = yup.object().shape({
  numeroDeFactura: yup.string().required(),
  tipoDeDocumentoId: yup.number().required(),
  serie: yup.string().required(),
  fechaDeFactura: yup.date().required(),
  fechaDeValidez: yup.date().required(),
  diasDeValidez: yup.number().required(),
  moneda: yup.string().required(),
  formaPagoContadoId: yup.number().nullable(),
  formaPagoCreditoId: yup.number().nullable(),
  tipoDeCambioId: yup.number().nullable(),
  estado: yup.string().required(),
  guiaDeRemisionId: yup.number().required(),
  clienteId: yup.number().required(),
  maquina: yup.string(),
  vendedorId: yup.number().nullable(),
  personalId: yup.number().nullable(),
  ordenDeCompra: yup.string().required(),
  referencia: yup.string(),
  nota: yup.string(),
  subtotal: yup.number().required(),
  descuento: yup.number().required(),
  subtotalValorNeto: yup.number().required(),
  igv: yup.number().required(),
  totalSoles: yup.number().required(),
  icbper: yup.number().required(),
  haveIcbper: yup.boolean().required(),
  detraccionId: yup.number().required(),
  observaciones: yup.string().nullable(),
});

const initialStateForm = {
  numeroDeFactura: null,
  tipoDeDocumentoId: null,
  serie: null,
  fechaDeFactura: null,
  fechaDeValidez: null,
  diasDeValidez: null,
  moneda: null,
  formaPagoContadoId: null,
  formaPagoCreditoId: null,
  tipoDeCambioId: null,
  estado: null,
  guiaDeRemisionId: null,
  clienteId: null,
  maquina: null,
  vendedorId: null,
  personalId: null,
  ordenDeCompra: null,
  referencia: null,
  nota: null,
  subtotal: null,
  descuento: null,
  subtotalValorNeto: null,
  igv: null,
  totalSoles: null,
  icbper: null,
  haveIcbper: null,
  detraccionId: null,
  observaciones: null,
};

export default function Factura() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();

  const [empresaId] = useLocalStorage("empresaId");
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  // const [selectedTipoDocumento, setSelectedTipoDocumento] = useState(null);
  const [formaDePago, setFormaDePago] = useState("");
  const [formasDePago, setFormasDePago] = useState([]);
  const [tiposCambio, setTiposCambio] = useState([]);
  const [valorTipoCambio, setValorTipoCambio] = useState(Number(1));
  const [tipoResponsable, setTipoResponsable] = useState("");
  const [responsables, setResponsables] = useState([]);
  const [descuentosLimites, setDescuentosLimites] = useState(null);
  const [igv, setIgv] = useState(null);
  const [guiasRemisionRes, setGuiasRemisionRes] = useState([]);
  const [selectedGuiaRemision, setselectedGuiaRemision] = useState(null);
  const [clienteGuia, setClienteGuia] = useState(null);
  const [aplicacionMaquinas, setAplicacionMaquinas] = useState([]);
  const [detracciones, setDetracciones] = useState([]);
  const [selectedDetraccion, setSelectedDetraccion] = useState(null);
  const [valorDetraccion, setValorDetraccion] = useState(0);
  const [icbperObj, setIcbperObj] = useState(null);
  // const [isICBPER, setIsICBPER] = useState(false);
  // const [valorIcbperTotal, setValorIcbperTotal] = useState(0);
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

  const { setArreglosVenta } = useContext(VentaMostradorContext); // arreglosVenta

  const [form, setForm] = useState(initialStateForm);

  useEffect(() => {
    setForm(initialStateForm);
    refetch();
    setSelectedMateriales({ materiales: [] });
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
    getParametrosGlobales();
    getDetracciones();
    getTiposDocumentos();
  }, []);

  // updateform

  useEffect(() => {
    console.log(facturasResponse?.data);
  }, [updateForm]);

  // CRUD

  const createRegistro = async () => {
    await schema.validate(
      {
        ...form,
      },
      { abortEarly: false }
    );
    await axiosRequest("post", `/api/venta-mostrador/facturas`, {
      ...form,
      empresaId: parseInt(empresaId),
      sucursalId: 1
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
      await axiosRequest("put", `/api/venta-mostrador/facturas/${elementId}`, {
        ...form,
        empresaId: parseInt(empresaId),
        sucursalId: 1
      });
      toast.success(`Registro actualizado exitosamente!`, successProps);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const deleteRegistro = async () => {
    try {
      await axiosRequest("delete", `/api/venta-mostrador/facturas/${elementId}`);
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
      setClienteGuia(null);
      refetch();
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const getDescuentoApi = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/parametro-descuento?empresaId=${empresaId}`
    );
    setDescuentosLimites(data?.data);
  };

  const getParametrosGlobales = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/parametros?empresaId=${empresaId}`
    );
    const arrParams = data?.data;
    for (const param of arrParams) {
      if (param.nombre === "IGV" || param.nombre === "igv" || param.nombre === "Igv") {
        setIgv(param);
        break;
      }
    }
    for (const param of arrParams) {
      if (param.nombre.toLowerCase() === "icbper") {
        setIcbperObj(param);
        break;
      }
    }
    const obj = { valor: 18 };
    setIgv(obj);
  };

  // HEADERS

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "N° Factura", accessor: "numeroDeFactura"},
      { Header: "RUC / DNI", accessor: "razonSocial" },
      { Header: "Nombre Cliente", accessor: "nombreCliente" },
      { Header: "Fecha", accessor: "fecha" },
      { Header: "Dias validez", accessor: "diasValidez" },
      { Header: "Forma de pago", accessor: "formaDePago" },
      { Header: "Correo", accessor: "email" },
      // { Header: "Factura PDF", accessor: "factura" },
      // { Header: "Nota de credito", accessor: "notaCredito" },
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

  const columnsGuiaModal = useMemo(
    () => [
      { Header: "Nro", accessor: "id" },
      { Header: "RUC/DNI", accessor: "razonSocial" },
      { Header: "Nombre Cliente", accessor: "nombreCliente" },
      { Header: "Fecha", accessor: "fecha" },
      { Header: "Dias validez", accessor: "diasValidez" },
      { Header: "Forma de pago", accessor: "formaPago" },
      { Header: "Correo", accessor: "correo" },
    ],
    []
  );

  // BODY

  const getFacturas = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/venta-mostrador/facturas?empresaId=${empresaId}`
    );
    return data;
  };

  const { data: facturasResponse, refetch } = useQuery("facturas", getFacturas, {
    initialData: {
      data: [],
    },
  });

  const facturasShow = useMemo(
    () =>
      facturasResponse?.data.map(
        ({
          id,
          numeroDeFactura,
          cliente,
          fechaDeFactura,
          diasDeValidez,
          formaPagoContadoId,
          formaPagoCreditoId,
        }) => ({
          id,
          numeroDeFactura,
          razonSocial: cliente.numeroDocumento,
          nombreCliente: cliente.nombre,
          fecha: dateFormato(fechaDeFactura),
          diasValidez: diasDeValidez,
          formaDePago: formaPagoContadoId ? "Contado" : formaPagoCreditoId ? "Crédito" : "No tiene",
          email: cliente.email,
        })
      ),
    [facturasResponse?.data]
  );

  useEffect(() => {
    if (selectedMateriales.materiales?.length > 0 && valorTipoCambio > 0) {
      let subtotalTemp = 0;
      const materialesTemp = [];
      let totalCant = 0;
      for (const material of selectedMateriales.materiales) {
        const valorMaterial = Number(material.ventaUnidad) || 50;
        const cantidad = Number(material.cantidad);
        subtotalTemp += valorMaterial * cantidad;
        materialesTemp.push({ id: material.id, cantidadMateriales: material.cantidad });
        totalCant += cantidad;
      }
      const descuentoTemp = form.descuento || 0;
      const igvTemp = igv?.valor || 0;
      const detraccionPorcentaje = selectedDetraccion?.porcentaje || 0;
      const icbperValue = form.haveIcbper ? Number(icbperObj?.valor) || 0 : 0;
      console.log(icbperObj?.valor);

      const subtotalNetoTemp = subtotalTemp - (subtotalTemp * descuentoTemp) / 100;
      const totalIgv = (subtotalNetoTemp * igvTemp) / 100;
      const totalDetraccion = (subtotalNetoTemp * detraccionPorcentaje) / 100;
      const totalConIcbper = icbperValue * totalCant;
      const totalSolesTemp = totalIgv + totalDetraccion + totalConIcbper + subtotalNetoTemp;
      setForm({
        ...form,
        subtotal: subtotalTemp,
        subtotalValorNeto: subtotalNetoTemp,
        totalSoles: totalSolesTemp,
        icbper: totalConIcbper,
        igv: Number(totalIgv)
      });
      setValorDetraccion(totalDetraccion);
    }
  }, [selectedMateriales, form.descuento, form.igv, selectedDetraccion, form.haveIcbper]);

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

  // useEffect(() => {
  //   console.log(selectedMateriales.materiales);
  // }, [selectedMateriales])

  const dataGuiaModal = useMemo(
    () => [
      {
        id: selectedGuiaRemision?.id,
        razonSocial: selectedGuiaRemision?.cliente.numeroDocumento,
        nombreCliente: selectedGuiaRemision?.cliente.nombre,
        fecha: selectedGuiaRemision?.fechaDeCotizacion,
        diasValidez: selectedGuiaRemision?.diasDeValidez,
        formaPago: selectedGuiaRemision?.formaPagoContadoId
          ? "Contado"
          : selectedGuiaRemision?.formaPagoCreditoId
          ? "Crédito"
          : "No tiene",
        correo: selectedGuiaRemision?.cliente.email,
      },
    ],
    [selectedGuiaRemision]
  );

  // FUNCTIONS

  const getTiposDocumentos = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/documentos-contables?empresaId=${empresaId}`
    );
    setTiposDocumentos(data?.data);
  };

  // const handleTipoDocumento = (e) => {
  //   setSelectedTipoDocumento(e);
  // }

  const destructureMaterials = (materiales) => {
    console.log(materiales);
    return materiales.map((material) => {
      return {
        ...material.material,
        cantidad: material.cantidad,
      };
    });
  };

  // const handleNroFactura = (e) => setForm({ ...form, numeroDeFactura: e.target.value });

  // enum tipoDeDocumento
  const handleTipoDocumento = (e) => {
    // setSelectedTipoDocumento(e);
    setForm({
      ...form,
      tipoDeDocumentoId: e.id,
      serie: e.numeroDeSerie,
      numeroDeFactura: e.numeroDeSerie,
    });
  };

  const handleSerie = (e) => setForm({ ...form, serie: e.target.value });

  const handleFechaFactura = (e) => {
    const fecha = new Date(e.target.value);
    const fechaFormat = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(fecha.getDate()).padStart(2, "0")}`;
    setForm({ ...form, fechaDeFactura: fechaFormat });
  };

  const handleDiasValidez = (e) => {
    if (!/^\d+$/.test(e.target.value) || e.target.value === "") return;
    if (form.fechaDeFactura) {
      const fecha = new Date(form.fechaDeFactura);
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

  const handleSearchGuiaRemision = async ({ target }) => {
    const { data } = await axiosRequest(
      "get",
      `/api/venta-mostrador/guia-remision?empresaId=${empresaId}&filterName=${target.value}`
    );
    console.log(data?.data);
    setGuiasRemisionRes(data?.data);
  };

  const handleSelectedGuia = (guia) => {
    setselectedGuiaRemision(guia);
    setClienteGuia(guia.cliente);
    setSelectedMateriales({
      ...selectedMateriales,
      materiales: destructureMaterials(guia.aprovacionPedido.materiales),
    });
    setForm({ ...form, guiaDeRemisionId: guia.id, clienteId: guia.clienteId });
  };

  const handleObservaciones = (e) => setForm({ ...form, observaciones: e.target.value });

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
    // console.log(tipoResponsable);
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/${tipoResponsable}?empresaId=${empresaId}`
    );
    // console.log(data);
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

  const handleOrdenDeCompra = (e) => setForm({ ...form, ordenDeCompra: e.target.value });

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

  const getDetracciones = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/detracciones?empresaId=${empresaId}`
    );
    setDetracciones(data?.data);
  };

  const handleDetracciones = (e) => {
    setSelectedDetraccion(e);
    setForm({ ...form, detraccionId: e.id });
  };

  const handleIcbper = (e) => {
    // console.log(e.target.checked);
    setForm({ ...form, haveIcbper: e.target.checked });
  };

  useEffect(() => {
    console.log(form);
  }, [form]);

  return (
    <>
      <Container whiteColor={true}>
        <Title text={"Facturas"}>
          <ButtonAdd text={"Nueva factura"} onClick={() => openModal(false)} />
        </Title>
        {/* Table List */}
        <TableComplete
          columns={columns}
          data={facturasShow}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </Container>
      {/* Modal agregar */}
      <ModalLg
        title={isEdit ? "Editar Factura" : "Nueva Factura"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
          <Group title={"Información general"}>
            <GroupInputs>
              <Select label="Tipo de Documento" onChange={(e) => handleTipoDocumento(e)}>
                {tiposDocumentos?.map((tipoDoc) => {
                  return (
                    <Option key={tipoDoc.id} value={tipoDoc}>
                      {`${tipoDoc?.nombre}`}
                    </Option>
                  );
                })}
              </Select>
              {/* <Input label="Tipo de Documento" type="text" value={form?.tipoDeDocumento} onChange={e => handleTipoDocumento(e)}/>  */}
              {/* select */}

              <Input
                label="Serie"
                type="text"
                value={form?.serie}
                onChange={(e) => handleSerie(e)}
                disabled
              />

              {/* <Input label="Nro de factura" type="text" value={form?.numeroDeFactura} onChange={e => handleNroFactura(e)}/> */}
            </GroupInputs>

            <GroupInputs>
              <Input
                label="Fecha de factura"
                type="date"
                value={form?.fechaDeFactura}
                onChange={(e) => handleFechaFactura(e)}
              />

              <Input
                label="Dias de validez"
                type="text"
                value={form?.diasDeValidez}
                onChange={(e) => handleDiasValidez(e)}
                disabled={form.fechaDeFactura === null}
              />

              <Input label="Fecha de validez" type="date" disabled value={form?.fechaDeValidez} />
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
              <Select label="Forma de pago" onChange={(e) => setFormaDePago(String(e))}>
                <Option value={"contado"}>contado</Option>
                <Option value={"credito"}>crédito</Option>
              </Select>
            </GroupInputs>
            <GroupInputs>
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
            </GroupInputs>

            <GroupInputs>
              <Select
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
                {/* <Option value={"sol-dolar"}>3.81</Option> */}
              </Select>

              <Input
                label="Estado"
                value={form?.estado}
                onChange={(e) => handleEstadoDelDocumento(e)}
              />
            </GroupInputs>
          </Group>

          <Group title={"Guía de Remisión"}>
            <Search
              // onFocus={() => setIsOpenCodigos({ ...isOpenCodigos, aplicacionMaquina: true })}
              onChange={handleSearchGuiaRemision}
            />
            <Dropdown isOpen={true} elements={guiasRemisionRes.length}>
              {guiasRemisionRes?.map((guia) => {
                return (
                  <DropdownItem
                    handleClick={() => {
                      handleSelectedGuia(guia);
                    }}
                    key={guia.id}
                    name={`COD: ${guia?.NumeroGuiaDeRemision} - Cliente: ${guia?.cliente.nombre} - RUC/DNI: ${guia?.cliente.numeroDocumento}`}
                  />
                );
              })}
            </Dropdown>
            <TableForSelections columns={columnsGuiaModal} data={dataGuiaModal || []} />
            <Divider />
            <Textarea
              label="Observaciones"
              value={form?.observaciones}
              onChange={(e) => handleObservaciones(e)}
            />
          </Group>

          <Group title={"Cliente"}>
            <GroupInputs>
              <Input label="RUC/DNI" value={clienteGuia?.numeroDocumento} disabled />
              <Input label="Nombre del cliente" value={clienteGuia?.nombre} disabled />
            </GroupInputs>

            <GroupInputs>
              <Input label="Teléfono" disabled value={clienteGuia?.telefono} />
              <Input label="Correo" disabled value={clienteGuia?.email} />
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
                value={form?.ordenDeCompra}
                onChange={(e) => handleOrdenDeCompra(e)}
              />
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
                  <Input disabled value={form?.subtotal} />
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
                    value={form?.descuento}
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
                  <Input disabled value={form?.subtotalValorNeto} />
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
                  <span className="font-semibold mr-2">Detracciones</span>
                  <Select label="Detracciones" onChange={(e) => handleDetracciones(e)}>
                    {detracciones?.map((detraccion) => {
                      return (
                        <Option key={detraccion.id} value={detraccion}>
                          {`${detraccion?.codigo} - ${detraccion?.definicion} - ${detraccion?.porcentaje}%`}
                        </Option>
                      );
                    })}
                  </Select>
                </div>

                <div>
                  <Input disabled value={valorDetraccion} />
                </div>
              </div>
            </GroupInputs>

            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <Checkbox
                  onChange={(e) => handleIcbper(e)}
                  // defaultChecked={!!caracteristica?.isChecked}
                />
                <div className="flex justify-center items-center">
                  <span className="font-semibold">ICBPER</span>
                </div>
                <div>
                  <Input disabled value={form?.icbper} />
                </div>
              </div>
            </GroupInputs>

            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">TOTAL DE COTIZACION SOLES</span>
                </div>
                <div>
                  <Input disabled value={form?.totalSoles} />
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
        title={"Eliminar Factura"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
