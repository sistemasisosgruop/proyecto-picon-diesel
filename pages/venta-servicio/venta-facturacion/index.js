import { useMemo, useEffect, useState, useContext } from "react";

import { FormContext } from "../../../contexts/form.context";
import { VentaServiciosContext } from "../../../contexts/venta-servicios.context";

import { ButtonAdd, ButtonSave, ButtonCancel } from "../../../app/components/elements/Buttons";
import { Container } from "../../../app/components/elements/Containers";
import { Title } from "../../../app/components/elements/Title";
import { Divider } from "../../../app/components/elements/Divider";
import { ModalConfirmDelete, ModalLg } from "../../../app/components/modules/Modal";
import { Group, GroupInputs } from "../../../app/components/elements/Form";
import { Input, Option, Select, Textarea, Checkbox } from "@material-tailwind/react";
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
import { dateFormato } from "../../../app/utils/dateFormat";

const schema = yup.object().shape({
  guiaRemisionId: yup.number().required(),
  nroFactura: yup.string().required(),
  tipoDeDocumentoId: yup.number().required(),
  serie: yup.string().required(),
  fechaFactura: yup.date().required(),
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
  referencia: yup.string().required(),
  nota: yup.string().required(),
  tipoFactura: yup.string().required(),
  materiales: yup.array().required(),
  subtotalMateriales: yup.number().required(),
  descuentoMateriales: yup.number().required(),
  subtotalValorNetoMateriales: yup.number().required(),
  igvMateriales: yup.number().required(),
  detraccionMaterialId: yup.number().required(),
  icbper: yup.boolean().required(),
  totalSolesMateriales: yup.number().required(),
  servicios: yup.array().required(),
  subtotalServicios: yup.number().required(),
  descuentoServicios: yup.number().required(),
  subtotalValorNetoServicios: yup.number().required(),
  igvServicios: yup.number().required(),
  totalSolesServicios: yup.number().required(),
  detraccionServiciosId: yup.number().required(),
});

const updateSchema = yup.object().shape({
  guiaRemisionId: yup.number().required(),
  nroFactura: yup.string().required(),
  tipoDeDocumentoId: yup.number().required(),
  serie: yup.string().required(),
  fechaFactura: yup.date().required(),
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
  referencia: yup.string().required(),
  nota: yup.string().required(),
  tipoFactura: yup.string().required(),
  materiales: yup.array().required(),
  subtotalMateriales: yup.number().required(),
  descuentoMateriales: yup.number().required(),
  subtotalValorNetoMateriales: yup.number().required(),
  igvMateriales: yup.number().required(),
  detraccionMaterialId: yup.number().required(),
  icbper: yup.boolean().required(),
  totalSolesMateriales: yup.number().required(),
  servicios: yup.array().required(),
  subtotalServicios: yup.number().required(),
  descuentoServicios: yup.number().required(),
  subtotalValorNetoServicios: yup.number().required(),
  igvServicios: yup.number().required(),
  totalSolesServicios: yup.number().required(),
  detraccionServiciosId: yup.number().required(),
});

const initialStateForm = {
  guiaRemisionId: null,
  nroFactura: null,
  tipoDeDocumentoId: null,
  serie: null,
  fechaFactura: null,
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
  referencia: null,
  nota: null,
  tipoFactura: null,
  materiales: null,
  subtotalMateriales: null,
  descuentoMateriales: null,
  subtotalValorNetoMateriales: null,
  igvMateriales: null,
  detraccionMaterialId: null,
  icbper: null,
  totalSolesMateriales: null,
  servicios: null,
  subtotalServicios: null,
  descuentoServicios: null,
  subtotalValorNetoServicios: null,
  igvServicios: null,
  totalSolesServicios: null,
  detraccionServiciosId: null,
};

export default function FacturaServicios() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const { changeData, elementId, updateForm } = useContext(FormContext);
  const { arreglosVentaServicios, setArreglosVentaServicios } = useContext(VentaServiciosContext);

  const [empresaId] = useLocalStorage("empresaId");

  const [guiasRemision, setGuiasRemision] = useState([]);
  const [selectedGuia, setSelectedGuia] = useState(null);
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [formaDePago, setFormaDePago] = useState("");
  const [formasDePago, setFormasDePago] = useState([]);
  const [tiposCambio, setTiposCambio] = useState([]);
  const [valorTipoCambio, setValorTipoCambio] = useState(Number(1));
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedMaquina, setSelectedMaquina] = useState(null);
  // const [tipoResponsable, setTipoResponsable] = useState("");
  // const [responsables, setResponsables] = useState([]);
  const [detracciones, setDetracciones] = useState([]);
  const [selectedDetraccionMateriales, setSelectedDetraccionMateriales] = useState(null);
  const [selectedDetraccionServicios, setSelectedDetraccionServicios] = useState(null);
  const [valorDetraccionMateriales, setValorDetraccionMateriales] = useState(0);
  const [valorDetraccionServicios, setValorDetraccionServicios] = useState(0);
  const [icbperObj, setIcbperObj] = useState(null);

  const [descuentosLimites, setDescuentosLimites] = useState(null);
  const [igv, setIgv] = useState(null);
  const [valorIcbper, setValorIcbper] = useState(0);

  const [form, setForm] = useState(initialStateForm);

  useEffect(() => {
    setForm(initialStateForm);
    // refetch();
    setArreglosVentaServicios({
      servicios: [],
      repuestos: [],
      materiales: [],
      trabajosTerceros: [],
    });
  }, [changeData]);

  useEffect(() => {
    getDescuentoApi();
    getParametrosGlobales();
    getDetracciones();
    getTiposDocumentos();
  }, []);

  // updateform

  useEffect(() => {
    console.log(isEdit);
  }, [updateForm]);  

  // CRUD

  const createRegistro = async () => {
    await schema.validate(
      {
        ...form,
        materiales: arreglosVentaServicios.materiales,
        servicios: arreglosVentaServicios.servicios,
      },
      { abortEarly: false }
    );
    await axiosRequest("post", `/api/venta-servicios/venta-facturacion`, {
      ...form,
      materiales: arreglosVentaServicios.materiales,
      servicios: arreglosVentaServicios.servicios,
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
        servicios: arreglosVentaServicios.servicios,
      },
      { abortEarly: false }
    );
    try {
      await axiosRequest("put", `/api/venta-servicios/venta-facturacion/${elementId}`, {
        ...form,
        materiales: arreglosVentaServicios.materiales,
        servicios: arreglosVentaServicios.servicios,
        empresaId: parseInt(empresaId),
        sucursalId: 1,
      });
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const deleteRegistro = async () => {
    try {
      await axiosRequest("delete", `/api/venta-servicios/venta-facturacion/${elementId}`);
      toast.success(`🗑️ Registro eliminado exitosamente!`, successProps);
      refetch();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  }

  const saveData = async () => {
    try {
      if (isEdit) {
        await updateRegistro();
      } else {
        await createRegistro();
      }
      setSelectedCliente(null);
      setArreglosVentaServicios({
        ...arreglosVentaServicios,
        servicios: [],
        repuestos: [],
        materiales: [],
        trabajosTerceros: [],
      });
      setForm(initialStateForm);
      refetch();
      closeModal();
    } catch (error) {}
  };

  // Headers

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "N° Factura", accessor: "nroFactura" },
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
    []
  );

  const columnsServicios = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Código", accessor: "codigo" },
      { Header: "Definición", accessor: "definicion" },
      { Header: "Precio", accessor: "precio" },
    ],
    []
  );

  // BODY

  const getFacturas = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/venta-servicios/venta-facturacion?empresaId=${empresaId}`
    );
    return data;
  };

  const { data: facturasResponse, refetch } = useQuery("facturasServicios", getFacturas, {
    initialData: {
      data: [],
    },
  });

  const facturasShow = useMemo(
    () =>
      facturasResponse?.data.map(
        ({
          id,
          cliente,
          nroFactura,
          fechaFactura,
          diasValidez,
          formaPagoContadoId,
          formaPagoCreditoId,
        }) => ({
          id,
          nroFactura,
          razonSocial: cliente.numeroDocumento,
          nombreCliente: cliente.nombre,
          fecha: dateFormato(fechaFactura),
          diasValidez,
          formaDePago: formaPagoContadoId ? "Contado" : formaPagoCreditoId ? "Crédito" : "No tiene",
          email: cliente.email,
        })
      ),
    [facturasResponse?.data]
  );

  const materialesShow = useMemo(
    () =>
      arreglosVentaServicios.materiales?.map(
        ({ id, codigo, codigoFabricante, denominacion, familia, cantidad, precio }) => ({
          id,
          codigoInterno: codigo,
          codigoDeFabrica: codigoFabricante,
          familia: familia?.codigo,
          descripcion: denominacion,
          comentario: `comentario ${id}`,
          cantidad: !cantidad ? "0" : cantidad,
          ventaUnidad: precio || 50,
        })
      ),
    [arreglosVentaServicios.materiales]
  );

  const serviciosShow = useMemo(
    () =>
      arreglosVentaServicios.servicios?.map(({ id, codigo, definicion, precio }) => ({
        id,
        codigo,
        definicion,
        precio,
      })),
    []
  );

  // FUNCTIONS

  const getTiposDocumentos = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/documentos-contables?empresaId=${empresaId}`
    );
    setTiposDocumentos(data?.data);
  };

  const handleSearchGuia = async ({ target }) => {
    const { data } = await axiosRequest(
      "get",
      `/api/venta-servicios/guia-remision?empresaId=${empresaId}&filterName=${target.value}`
    );
    setGuiasRemision(data?.data);
  };

  const handleSelectedGuiaRemision = (guia) => {
    // console.log(guia);
    setSelectedGuia(guia);
    setSelectedCliente(guia?.cliente);
    const ordenMateriales = guia?.materiales?.map((material) => {
      const rMaterial = material.material;
      rMaterial.cantidad = material.cantidad;
      rMaterial.precio = material.precio;
      rMaterial.comentarios = material.comentarios;
      return rMaterial;
    });

    const ordenServicios = guia?.ordenTrabajo?.servicios?.map((servicio) => {
      const rServicio = servicio.servicio;
      rServicio.precio = servicio.precio;
      return rServicio;
    });

    setArreglosVentaServicios({
      ...arreglosVentaServicios,
      materiales: ordenMateriales,
      servicios: ordenServicios,
    });
    setSelectedMaquina(guia?.Maquina);
    setForm({
      ...form,
      guiaRemisionId: guia.id,
      clienteId: guia.clienteId,
      maquinaId: guia.Maquina.id,
      referencia: guia.referencia,
      nota: guia.nota,
      nroOrdenCompra: guia.nroOrdenCompra,
      vendedorId: guia.vendedorId || null,
      personalId: guia.personalId || null
    });
  };

  // const handleNroFactura = (e) => setForm({ ...form, nroFactura: e.target.value });

  // const handleTipoFactura = (e) => setForm({ ...form, tipoDocumento: e.target.value });

  const handleTipoFactura = (e) => {
    setForm({
      ...form,
      tipoDeDocumentoId: e.id,
      serie: e.numeroDeSerie,
      nroFactura: e.numeroDeSerie,
      tipoFactura: e.abreviatura
    });
  };

  const handleSerie = (e) => setForm({ ...form, serie: e.target.value });

  const handleFechaFactura = (e) => {
    const fecha = new Date(e.target.value);
    const fechaFormat = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(fecha.getDate()).padStart(2, "0")}`;
    setForm({ ...form, fechaFactura: fechaFormat });
  };

  const handleDiasValidez = (e) => {
    if (!/^\d+$/.test(e.target.value) || e.target.value === "") return;
    if (form.fechaFactura) {
      const fecha = new Date(form.fechaFactura);
      fecha.setDate(fecha.getDate() + Number(e.target.value));
      const fechaFormat = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(fecha.getDate()).padStart(2, "0")}`;
      setForm({ ...form, fechaValidez: fechaFormat, diasValidez: Number(e.target.value) });
      return;
    }
    setForm({ ...form, diasValidez: Number(e.target.value) });
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

  const handleDescuentoInputMateriales = (e) => {
    if (
      Number(e.target.value) >= Number(descuentosLimites?.de) &&
      Number(e.target.value) <= Number(descuentosLimites?.a)
    ) {
      setForm({ ...form, descuentoMateriales: Number(e.target.value) });
      // setDescuento(Number(e.target.value));
    } else if (Number(e.target.value) < Number(descuentosLimites?.de)) {
      setForm({ ...form, descuentoMateriales: Number(descuentosLimites?.de) });
      // setDescuento(Number(descuentosLimites?.de));
    } else {
      setForm({ ...form, descuentoMateriales: Number(descuentosLimites?.a) });
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

  const handleDetraccionesMateriales = (e) => {
    setSelectedDetraccionMateriales(e);
    setForm({ ...form, detraccionMaterialId: e.id });
  };

  const handleIcbper = (e) => {
    // console.log(e.target.checked);
    setForm({ ...form, icbper: e.target.checked });
  };

  const handleDescuentoInputServicios = (e) => {
    if (
      Number(e.target.value) >= Number(descuentosLimites?.de) &&
      Number(e.target.value) <= Number(descuentosLimites?.a)
    ) {
      setForm({ ...form, descuentoServicios: Number(e.target.value) });
    } else if (Number(e.target.value) < Number(descuentosLimites?.de)) {
      setForm({ ...form, descuentoServicios: Number(descuentosLimites?.de) });
    } else {
      setForm({ ...form, descuentoServicios: Number(descuentosLimites?.a) });
    }
  };

  const handleDetraccionesServicios = (e) => {
    setSelectedDetraccionServicios(e);
    setForm({ ...form, detraccionServiciosId: e.id });
  };

  useEffect(() => {
    if (arreglosVentaServicios.materiales?.length > 0 && valorTipoCambio > 0) {
      let subtotalTemp = 0;
      const materialesTemp = [];
      let totalCant = 0;
      for (const material of arreglosVentaServicios.materiales) {
        const valorMaterial = Number(material.precio) || 50;
        const cantidad = Number(material.cantidad);
        subtotalTemp += valorMaterial * cantidad;
        materialesTemp.push({ id: material.id, cantidadMateriales: material.cantidad });
        totalCant += cantidad;
      }
      const descuentoTemp = Number(form.descuentoMateriales) || 0;
      const detraccionPorcentaje = Number(selectedDetraccionMateriales?.porcentaje) || 0;
      const icbperValue = form.icbper ? Number(icbperObj?.valor) || 0 : 0;

      const subtotalNetoTemp = subtotalTemp - (subtotalTemp * descuentoTemp) / 100;
      const totalIgv = (subtotalNetoTemp * Number(igv?.valor)) / 100;
      const totalDetraccion = (subtotalNetoTemp * Number(detraccionPorcentaje)) / 100;
      const totalConIcbper = icbperValue * totalCant;
      const totalSolesTemp = totalIgv + totalDetraccion + totalConIcbper + subtotalNetoTemp;
      setForm({
        ...form,
        subtotalMateriales: subtotalTemp,
        subtotalValorNetoMateriales: subtotalNetoTemp,
        totalSolesMateriales: totalSolesTemp,
        igvMateriales: Number(totalIgv),
      });
      setValorIcbper(totalConIcbper);
      setValorDetraccionMateriales(totalDetraccion);
    }
  }, [
    arreglosVentaServicios.materiales,
    form.descuentoMateriales,
    form.icbper,
    form.detraccionMaterialId,
    selectedDetraccionMateriales,
  ]);

  useEffect(() => {
    if (arreglosVentaServicios.servicios.length > 0 && valorTipoCambio > 0) {
      let subtotalTemp = 0;
      for (const servicio of arreglosVentaServicios.servicios) {
        const valorServicio = Number(servicio.precio) || 50;
        subtotalTemp += valorServicio;
      }
      const descuentoTemp = Number(form.descuentoServicios) || 0;
      const detraccionPorcentaje = Number(selectedDetraccionServicios?.porcentaje) || 0;

      const subtotalNetoTemp = subtotalTemp - (subtotalTemp * descuentoTemp) / 100;
      const totalIgv = (subtotalNetoTemp * Number(igv?.valor)) / 100;
      const totalDetraccion = (subtotalNetoTemp * Number(detraccionPorcentaje)) / 100;
      const totalSolesTemp = totalIgv + totalDetraccion + subtotalNetoTemp;
      setForm({
        ...form,
        subtotalServicios: subtotalTemp,
        subtotalValorNetoServicios: subtotalNetoTemp,
        totalSolesServicios: totalSolesTemp,
        igvServicios: Number(totalIgv),
      });
      setValorDetraccionServicios(totalDetraccion);
    }
  }, [
    arreglosVentaServicios.servicios,
    form.descuentoServicios,
    form.detraccionServiciosId,
    selectedDetraccionServicios,
  ]);

  useEffect(() => {
    console.log(form);
  }, [form]);

  return (
    <>
      <Container whiteColor={true}>
        <Title text={"Facturas"}>
          <ButtonAdd text={"Nueva Factura"} onClick={() => openModal(false)} />
        </Title>
        <TableComplete
          columns={columns}
          data={facturasShow}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </Container>

      <ModalLg
        title={isEdit ? "Editar Factura" : "Nueva Factura"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
          <Group title={"Información general"}>
            <GroupInputs>
              {/* <Input
                label="Nro de Factura"
                type="text"
                value={form.nroFactura}
                onChange={(e) => handleNroFactura(e)}
              /> */}

              {/* <Input
                label="Tipo de Factura"
                type="text"
                value={form.tipoDocumento}
                onChange={(e) => handleTipoFactura(e)}
              /> */}
              <Select label="Tipo de Documento" onChange={(e) => handleTipoFactura(e)}>
                {tiposDocumentos?.map((tipoDoc) => {
                  return (
                    <Option key={tipoDoc.id} value={tipoDoc}>
                      {`${tipoDoc?.nombre}`}
                    </Option>
                  );
                })}
              </Select>

              <Input
                label="Serie"
                type="text"
                value={form.serie}
                onChange={(e) => handleSerie(e)}
                disabled
              />
            </GroupInputs>

            <GroupInputs>
              <Input
                label="Fecha guia de remisión"
                type="date"
                value={form.fechaGuia}
                onChange={(e) => handleFechaFactura(e)}
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
              <Select
                label="Forma de pago"
                onChange={(e) => setFormaDePago(String(e))}
                value={form?.formaPagoContadoId ? "contado" : form?.formaPagoCreditoId && "credito"}
              >
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
                value={form.estado}
                onChange={(e) => handleEstadoDelDocumento(e)}
              />
            </GroupInputs>
          </Group>

          <Group title={"Guía de Remisión"}>
            <Search
              // onFocus={() => }
              onChange={handleSearchGuia}
            />
            <Dropdown isOpen={true} elements={guiasRemision.length}>
              {guiasRemision?.map((guia) => {
                return (
                  <DropdownItem
                    handleClick={() => {
                      handleSelectedGuiaRemision(guia);
                    }}
                    key={guia.id}
                    name={`COD: ${guia?.codigo} - Cliente: ${guia?.cliente.nombre} - RUC/DNI: ${guia?.cliente.numeroDocumento}`}
                  />
                );
              })}
            </Dropdown>
            <Input
              label="Código de guía de remisión"
              disabled
              value={`COD: ${selectedGuia?.codigo} - Cliente: ${selectedGuia?.cliente.nombre} - RUC/DNI: ${selectedGuia?.cliente.numeroDocumento}`}
            />
            <Input label="Orden de Trabajo" value={selectedGuia?.ordenTrabajo?.codigo} disabled />
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
            <Input
              label="Aplicación de la máquina"
              disabled
              value={`COD: ${selectedMaquina?.codigo} - COD. Fabrica: ${selectedMaquina?.fabricaMaquina.fabrica} - 
                                Modelo de maquina: ${selectedMaquina?.modeloMaquina.modelo} - COD. Motor: ${selectedMaquina?.codigoOriginal}`}
            />
          </Group>

          <Group title={"Responsable"}>
            <Input
              label="Responsable"
              value={
                form?.personalId
                  ? selectedGuia?.personal.nombre
                  : form?.vendedorId
                  ? selectedGuia?.vendedor.nombre
                  : undefined
              }
              disabled
            />
          </Group>

          <Group title={"Orden de Compra"}>
            <Input label="Nro de O.C." value={selectedGuia?.nroOrdenCompra} disabled />
          </Group>

          <Group title={"Otro"}>
            <Input label="Referencia" value={form?.referencia}></Input>
            <Textarea label="Nota" value={form?.nota}></Textarea>
          </Group>

          <Divider />
          <GroupInputs>
            <div className="flex gap-5">
              <div className="flex justify-center items-center">
                <Checkbox />
                <p className="text-base font-semibold">Factura Unificada</p>
              </div>
              <div className="flex justify-center items-center">
                <Checkbox />
                <p className="text-base font-semibold">Factura Dividida (Materiales / Servicios)</p>
              </div>
            </div>
          </GroupInputs>
          <Divider />

          <Group title={"Materiales"}>
            <TableForSelections columns={columnsMateriales} data={materialesShow || []} />
            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">Subtotal valor venta soles</span>
                </div>
                <div>
                  <Input disabled value={form?.subtotalMateriales} />
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
                    value={form?.descuentoMateriales}
                    disabled={arreglosVentaServicios.materiales?.length === 0}
                    onChange={(e) => handleDescuentoInputMateriales(e)}
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
                  <Input disabled value={form?.subtotalValorNetoMateriales} />
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
                  <Input label="IGV" value={form?.igvMateriales} />
                </div>
              </div>
            </GroupInputs>

            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold mr-2">Detracciones</span>
                  <Select label="Detracciones" onChange={(e) => handleDetraccionesMateriales(e)}>
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
                  <Input disabled value={valorDetraccionMateriales} />
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
                  <Input disabled value={valorIcbper} />
                </div>
              </div>
            </GroupInputs>

            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">TOTAL DE COTIZACION SOLES</span>
                </div>
                <div>
                  <Input disabled value={form?.totalSolesMateriales} />
                </div>
              </div>
            </GroupInputs>
            <Divider />
          </Group>

          <Group title={"Servicios"}>
            <TableForSelections columns={columnsServicios} data={serviciosShow || []} />
            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">Subtotal valor venta soles</span>
                </div>
                <div>
                  <Input disabled value={form?.subtotalServicios} />
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
                    value={form?.descuentoServicios}
                    disabled={arreglosVentaServicios.servicios?.length === 0}
                    onChange={(e) => handleDescuentoInputServicios(e)}
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
                  <Input disabled value={form?.subtotalValorNetoServicios} />
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
                  <Input label="IGV" value={form?.igvServicios} />
                </div>
              </div>
            </GroupInputs>

            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold mr-2">Detracciones</span>
                  <Select label="Detracciones" onChange={(e) => handleDetraccionesServicios(e)}>
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
                  <Input disabled value={valorDetraccionServicios} />
                </div>
              </div>
            </GroupInputs>

            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">TOTAL DE COTIZACION SOLES</span>
                </div>
                <div>
                  <Input disabled value={form?.totalSolesServicios} />
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
