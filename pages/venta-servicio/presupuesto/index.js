import { useMemo, useEffect, useState, useContext } from "react";

import { FormContext } from "../../../contexts/form.context";
import { VentaServiciosContext } from "../../../contexts/venta-servicios.context";

import { ButtonAdd, ButtonSave, ButtonCancel } from "../../../app/components/elements/Buttons";
import { Container } from "../../../app/components/elements/Containers";
import { Title } from "../../../app/components/elements/Title";
import { Divider } from "../../../app/components/elements/Divider";
import { ModalConfirmDelete, ModalLg } from "../../../app/components/modules/Modal";
import {
  Group,
  GroupInputs,
  GroupInputsIntern,
  GroupIntern,
} from "../../../app/components/elements/Form";
import { Input, Option, Select } from "@material-tailwind/react";
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
import { dateFormato, dateRefetchShow, hoursFormat } from "../../../app/utils/dateFormat";

const schema = yup.object().shape({
  hojaRecepcionId: yup.number().required(),
  denominacion: yup.string().required(),
  tipoReparacion: yup.string().required(),
  clienteId: yup.number().required(),
  fabricaMaquinaId: yup.number().required(),
  modeloMaquinaId: yup.number().required(),
  nombreMaquinaId: yup.number().required(),
  paisId: yup.number().required(),
  codigoMotorOriginal: yup.string().required(),
  serieMotor: yup.string().required(),
  serieChasis: yup.string().required(),
  vendedorId: yup.number().nullable(),
  personalId: yup.number().nullable(),
  codigoBombaInyeccionOriginal: yup.string().required(),
  codigoBombaInyeccionFabricante: yup.string().required(),
  tipoBombaInyeccionFabricante: yup.string().required(),
  marcaFabricaSistemaInyeccionId: yup.number().required(),
  codigoOriginalBombaInyeccion: yup.string().required(),
  nombreBombaInyeccion: yup.string().required(),
  serieBombaInyeccion: yup.string().required(),
  codigoInyectorOriginal: yup.string().required(),
  codigoInyectorFabricante: yup.string().required(),
  tipoFabricanteInyector: yup.string().required(),
  codigoOriginalInyector: yup.string().required(),
  codigoInyectorOriginalOrden1: yup.string().required(),
  codigoInyectorOriginalOrden2: yup.string().required(),
  codigoInyectorOriginalOrden3: yup.string().required(),
  fechaIngreso: yup.date().required(),
  horaIngreso: yup.string().required(),
  fechaSalida: yup.date().required(),
  horaSalida: yup.string().required(),
  estadoOrdenTrabajo: yup.string(),
  subtotalValorServicio: yup.number().required(),
  subtotalRepuestos: yup.number().required(),
  subtotalMateriales: yup.number().required(),
  subtotalTrabajoTerceros: yup.number().required(),
  descuento: yup.number().required(),
  igv: yup.number().required(),
  totalPresupuesto: yup.number().required(),
  servicios: yup.array().required(),
  repuestos: yup.array().required(),
  materiales: yup.array().required(),
  trabajosTerceros: yup.array().required(),
});

const updateSchema = yup.object().shape({
  hojaRecepcionId: yup.number().required(),
  denominacion: yup.string().required(),
  tipoReparacion: yup.string().required(),
  clienteId: yup.number().required(),
  fabricaMaquinaId: yup.number().required(),
  modeloMaquinaId: yup.number().required(),
  nombreMaquinaId: yup.number().required(),
  paisId: yup.number().required(),
  codigoMotorOriginal: yup.string().required(),
  serieMotor: yup.string().required(),
  serieChasis: yup.string().required(),
  vendedorId: yup.number().nullable(),
  personalId: yup.number().nullable(),
  codigoBombaInyeccionOriginal: yup.string().required(),
  codigoBombaInyeccionFabricante: yup.string().required(),
  tipoBombaInyeccionFabricante: yup.string().required(),
  marcaFabricaSistemaInyeccionId: yup.number().required(),
  codigoOriginalBombaInyeccion: yup.string().required(),
  nombreBombaInyeccion: yup.string().required(),
  serieBombaInyeccion: yup.string().required(),
  codigoInyectorOriginal: yup.string().required(),
  codigoInyectorFabricante: yup.string().required(),
  tipoFabricanteInyector: yup.string().required(),
  codigoOriginalInyector: yup.string().required(),
  codigoInyectorOriginalOrden1: yup.string().required(),
  codigoInyectorOriginalOrden2: yup.string().required(),
  codigoInyectorOriginalOrden3: yup.string().required(),
  fechaIngreso: yup.date().required(),
  horaIngreso: yup.string().required(),
  fechaSalida: yup.date().required(),
  horaSalida: yup.string().required(),
  estadoOrdenTrabajo: yup.string(),
  subtotalValorServicio: yup.number().required(),
  subtotalRepuestos: yup.number().required(),
  subtotalMateriales: yup.number().required(),
  subtotalTrabajoTerceros: yup.number().required(),
  descuento: yup.number().required(),
  igv: yup.number().required(),
  totalPresupuesto: yup.number().required(),
  servicios: yup.array().required(),
  repuestos: yup.array().required(),
  materiales: yup.array().required(),
  trabajosTerceros: yup.array().required(),
});

const initialStateForm = {
  hojaRecepcionId: null,
  denominacion: null,
  tipoReparacion: null,
  clienteId: null,
  fabricaMaquinaId: null,
  modeloMaquinaId: null,
  nombreMaquinaId: null,
  paisId: null,
  codigoMotorOriginal: null,
  serieMotor: null,
  serieChasis: null,
  vendedorId: null,
  personalId: null,
  codigoBombaInyeccionOriginal: null,
  codigoBombaInyeccionFabricante: null,
  tipoBombaInyeccionFabricante: null,
  marcaFabricaSistemaInyeccionId: null,
  codigoOriginalBombaInyeccion: null,
  nombreBombaInyeccion: null,
  serieBombaInyeccion: null,
  codigoInyectorOriginal: null,
  codigoInyectorFabricante: null,
  tipoFabricanteInyector: null,
  codigoOriginalInyector: null,
  codigoInyectorOriginalOrden1: null,
  codigoInyectorOriginalOrden2: null,
  codigoInyectorOriginalOrden3: null,
  fechaIngreso: null,
  horaIngreso: null,
  fechaSalida: null,
  horaSalida: null,
  estadoOrdenTrabajo: null,
  subtotalValorServicio: null,
  subtotalRepuestos: null,
  subtotalMateriales: null,
  subtotalTrabajoTerceros: null,
  descuento: null,
  igv: null,
  totalPresupuesto: null,
};

export default function Presupuesto() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const { changeData, elementId, updateForm } = useContext(FormContext);
  const { arreglosVentaServicios, setArreglosVentaServicios, isOpenArreglos, setIsOpenArreglos } =
    useContext(VentaServiciosContext);

  const [empresaId] = useLocalStorage("empresaId");

  const [codigosRecepcion, setCodigosRecepcion] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [fabricasMaquinas, setFabricasMaquinas] = useState([]);
  const [modelosMaquinas, setModelosMaquinas] = useState([]);
  const [nombresMaquinas, setNombresMaquinas] = useState([]);
  const [paises, setPaises] = useState([]);
  const [marcasFabricas, setMarcasFabricas] = useState([]);
  const [tipoResponsable, setTipoResponsable] = useState("");
  const [responsables, setResponsables] = useState([]);

  const [serviciosSearch, setServiciosSearch] = useState([]);
  const [repuestosSearch, setRepuestosSearch] = useState([]);
  const [materialesSearch, setMaterialesSearch] = useState([]);
  const [trabajosTercerosSearch, setTrabajosTercerosSearch] = useState([]);

  const [descuentosLimites, setDescuentosLimites] = useState(null);
  const [igv, setIgv] = useState(null);

  const [stateModal, setStateModal] = useState("Servicio");

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
    getCodigosRecepcion();
    getFabricasMaquinas();
    getModelosMaquinas();
    getNombresMaquinas();
    getPaises();
    getMarcasFabricaSistemasInyeccion();
    getDescuentoApi();
    getIgvApi();
  }, []);

  // updateform
  useEffect(() => {
    // console.log(presupuestosResponse?.data);
    const currentTemp = presupuestosResponse?.data.find((item) => item.id === updateForm?.id);
    const current = { ...currentTemp };
    const updateServicios = current?.servicios?.map((servicio) => {
      const rServicio = servicio.servicio;
      rServicio.diagnostico = servicio.diagnostico;
      rServicio.precio = servicio.precio;
      rServicio.comentarios = servicio.comentarios;
      return rServicio;
    });
    const updateRepuestos = current?.repuestos?.map((repuesto) => {
      const rRepuesto = repuesto.repuesto;
      rRepuesto.diagnostico = repuesto.diagnostico;
      rRepuesto.precio = repuesto.precio;
      rRepuesto.cantidad = repuesto.cantidad;
      rRepuesto.comentarios = repuesto.comentarios;
      return rRepuesto;
    });
    const updateMateriales = current?.materiales?.map((material) => {
      const rMaterial = material.material;
      rMaterial.cantidad = material.cantidad;
      rMaterial.precio = material.precio;
      rMaterial.comentarios = material.comentarios;
      return rMaterial;
    });
    const updateTrabajos = current?.trabajosTerceros?.map((trabajo) => {
      const rTrabajo = trabajo.trabajoTercero;
      rTrabajo.precio = trabajo.precio;
      rTrabajo.comentarios = trabajo.comentarios;
      return rTrabajo;
    });

    if (isEdit) {
      setSelectedCliente(current?.cliente);
      setTipoResponsable(current?.personalId ? "personal" : "vendedores");
      setForm({
        ...current,
        horaIngreso: hoursFormat(current?.horaIngreso),
        fechaIngreso: dateRefetchShow(current?.fechaIngreso),
        fechaSalida: dateRefetchShow(current?.fechaSalida),
      });
      setArreglosVentaServicios({
        ...arreglosVentaServicios,
        servicios: updateServicios,
        repuestos: updateRepuestos,
        materiales: updateMateriales,
        trabajosTerceros: updateTrabajos,
      });
    }
  }, [updateForm]);

  // CRUD

  const createRegistro = async () => {
    await schema.validate(
      {
        ...form,
        servicios: arreglosVentaServicios.servicios,
        repuestos: arreglosVentaServicios.repuestos,
        materiales: arreglosVentaServicios.materiales,
        trabajosTerceros: arreglosVentaServicios.trabajosTerceros,
      },
      { abortEarly: false }
    );
    await axiosRequest("post", `/api/venta-servicios/presupuesto`, {
      ...form,
      servicios: arreglosVentaServicios.servicios,
      repuestos: arreglosVentaServicios.repuestos,
      materiales: arreglosVentaServicios.materiales,
      trabajosTerceros: arreglosVentaServicios.trabajosTerceros,
      empresaId: parseInt(empresaId),
      sucursalId: 1,
    });
    toast.success(`Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await updateSchema.validate(
      {
        ...form,
        servicios: arreglosVentaServicios.servicios,
        repuestos: arreglosVentaServicios.repuestos,
        materiales: arreglosVentaServicios.materiales,
        trabajosTerceros: arreglosVentaServicios.trabajosTerceros,
      },
      { abortEarly: false }
    );
    try {
      await axiosRequest("put", `/api/venta-servicios/presupuesto/${elementId}`, {
        ...form,
        servicios: arreglosVentaServicios.servicios,
        repuestos: arreglosVentaServicios.repuestos,
        materiales: arreglosVentaServicios.materiales,
        trabajosTerceros: arreglosVentaServicios.trabajosTerceros,
        cliente: undefined,
        empresaId: parseInt(empresaId),
        sucursalId: 1,
      });
      toast.success(`Registro actualizado exitosamente!`, successProps);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const deleteRegistro = async () => {
    try {
      await axiosRequest("delete", `/api/venta-servicios/presupuesto/${elementId}`);
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

  // HEADERS

  const columns = useMemo(
    () => [
      { Header: "N°", accessor: "id" },
      { Header: "RUC / DNI", accessor: "razonSocial" },
      { Header: "Nombre Cliente", accessor: "nombreCliente" },
      { Header: "Correo", accessor: "email" },
      { Header: "Presupuesto", accessor: "codigo" },
      { Header: "Fecha Ingreso", accessor: "fechaIngreso" },
      { Header: "Fecha Salida", accessor: "fechaSalida" },
    ],
    []
  );

  const columnsServicios = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Servicio", accessor: "codigo" },
      {
        Header: "Diagnóstico",
        accessor: "diagnostico",
        Cell: (row, original) => {
          const [diagnosticoEdit, setDiagnosticoEdit] = useState(
            !row.cell.value ? "" : row.cell.value
          );

          const handleDiagnosticoEdit = (e) => setDiagnosticoEdit(e.target.value);

          return (
            <input
              className="w-36 border-2 border-gray-200"
              type="text"
              key={row.row.values.id}
              value={diagnosticoEdit}
              onChange={(e) => handleDiagnosticoEdit(e)}
              onBlur={(e) => {
                const currentServicios = structuredClone(arreglosVentaServicios.servicios);
                const nuevo = currentServicios.map((servicio) => {
                  if (servicio.id === row.cell.row.original.id) {
                    servicio.diagnostico = e.target.value;
                  }
                  return servicio;
                });
                setArreglosVentaServicios((prev) => ({
                  ...prev,
                  servicios: nuevo,
                }));
              }}
            />
          );
        },
      },
      { Header: "Precio", accessor: "precio" },
      {
        Header: "Comentarios",
        accessor: "comentarios",
        Cell: (row, original) => {
          const [comentariosEdit, setComentariosEdit] = useState(
            !row.cell.value ? "" : row.cell.value
          );

          const handleComentariosEdit = (e) => setComentariosEdit(e.target.value);

          return (
            <input
              className="w-36 border-2 border-gray-200"
              type="text"
              key={row.row.values.id}
              value={comentariosEdit}
              onChange={(e) => handleComentariosEdit(e)}
              onBlur={(e) => {
                const currentServicios = structuredClone(arreglosVentaServicios.servicios);
                const nuevo = currentServicios.map((servicio) => {
                  if (servicio.id === row.cell.row.original.id) {
                    servicio.comentarios = e.target.value;
                  }
                  return servicio;
                });
                setArreglosVentaServicios((prev) => ({
                  ...prev,
                  servicios: nuevo,
                }));
              }}
            />
          );
        },
      },
    ],
    [arreglosVentaServicios]
  );

  const columnsRepuestos = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { header: "Repuesto", accessor: "repuesto" },
      {
        Header: "Diagnóstico",
        accessor: "diagnostico",
        Cell: (row, original) => {
          const [diagnosticoEdit, setDiagnosticoEdit] = useState(
            !row.cell.value ? "" : row.cell.value
          );

          const handleDiagnosticoEdit = (e) => setDiagnosticoEdit(e.target.value);

          return (
            <input
              className="w-36 border-2 border-gray-200"
              type="text"
              key={row.row.values.id}
              value={diagnosticoEdit}
              onChange={(e) => handleDiagnosticoEdit(e)}
              onBlur={(e) => {
                const currentRepuestos = structuredClone(arreglosVentaServicios.repuestos);
                const nuevo = currentRepuestos.map((repuesto) => {
                  if (repuesto.id === row.cell.row.original.id) {
                    repuesto.diagnostico = e.target.value;
                  }
                  return repuesto;
                });
                setArreglosVentaServicios((prev) => ({
                  ...prev,
                  repuestos: nuevo,
                }));
              }}
            />
          );
        },
      },
      { Header: "Precio", accessor: "precio" },
      {
        Header: "Cantidad",
        accessor: "cantidad",
        Cell: (row, original) => {
          const [cantidadTempEdit, setCantidadTempEdit] = useState(
            !row.cell.value ? "0" : row.cell.value
          );

          const handleCantidadEdit = (e) => {
            const newValue = e.target.value;
            if (/^\d+$/.test(newValue) || newValue === "") {
              for (const repuesto of arreglosVentaServicios.repuestos) {
                if (row.row.values.id === repuesto.id) {
                  Number(newValue) > Number(repuesto.stock)
                    ? setCantidadTempEdit(repuesto.stock)
                    : setCantidadTempEdit(newValue);
                  // material.cantidad =  ? Number(material.stock) : Number(e.target.value);
                }
              }
            }
          };
          return (
            <input
              className="w-[3rem] border-2 border-gray-200"
              type="text"
              key={row.row.values.id}
              value={cantidadTempEdit}
              onChange={(e) => handleCantidadEdit(e)}
              onBlur={(e) => {
                const currentRepuestos = structuredClone(arreglosVentaServicios.repuestos);
                const nuevo = currentRepuestos.map((repuesto) => {
                  if (repuesto.id === row.cell.row.original.id) {
                    if (e.target.value === "") {
                      repuesto.cantidad = Number(0);
                    } else {
                      repuesto.cantidad =
                        e.target.value > repuesto.stock
                          ? Number(repuesto.stock)
                          : Number(e.target.value);
                    }
                  }
                  return repuesto;
                });

                setArreglosVentaServicios((prev) => ({
                  ...prev,
                  repuestos: nuevo,
                }));
              }}
            />
          );
        },
      },
      {
        Header: "Comentarios",
        accessor: "comentarios",
        Cell: (row, original) => {
          const [comentariosEdit, setComentariosEdit] = useState(
            !row.cell.value ? "" : row.cell.value
          );

          const handleComentariosEdit = (e) => setComentariosEdit(e.target.value);

          return (
            <input
              className="w-36 border-2 border-gray-200"
              type="text"
              key={row.row.values.id}
              value={comentariosEdit}
              onChange={(e) => handleComentariosEdit(e)}
              onBlur={(e) => {
                const currentRepuestos = structuredClone(arreglosVentaServicios.repuestos);
                const nuevo = currentRepuestos.map((repuesto) => {
                  if (repuesto.id === row.cell.row.original.id) {
                    repuesto.comentarios = e.target.value;
                  }
                  return repuesto;
                });
                setArreglosVentaServicios((prev) => ({
                  ...prev,
                  repuestos: nuevo,
                }));
              }}
            />
          );
        },
      },
    ],
    [arreglosVentaServicios]
  );

  const columnsMateriales = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Material", accessor: "material" },
      { Header: "Precio", accessor: "precio" },
      {
        Header: "Cantidad",
        accessor: "cantidad",
        Cell: (row, original) => {
          const [cantidadTempEdit, setCantidadTempEdit] = useState(
            !row.cell.value ? "0" : row.cell.value
          );

          const handleCantidadEdit = (e) => {
            const newValue = e.target.value;
            if (/^\d+$/.test(newValue) || newValue === "") {
              for (const material of arreglosVentaServicios.materiales) {
                if (row.row.values.id === material.id) {
                  Number(newValue) > Number(material.stock)
                    ? setCantidadTempEdit(material.stock)
                    : setCantidadTempEdit(newValue);
                  // material.cantidad =  ? Number(material.stock) : Number(e.target.value);
                }
              }
            }
          };
          return (
            <input
              className="w-[3rem] border-2 border-gray-200"
              type="text"
              key={row.row.values.id}
              value={cantidadTempEdit}
              onChange={(e) => handleCantidadEdit(e)}
              onBlur={(e) => {
                const currentMateriales = structuredClone(arreglosVentaServicios.materiales);
                const nuevo = currentMateriales.map((material) => {
                  if (material.id === row.cell.row.original.id) {
                    if (e.target.value === "") {
                      material.cantidad = Number(0);
                    } else {
                      material.cantidad =
                        e.target.value > material.stock
                          ? Number(material.stock)
                          : Number(e.target.value);
                    }
                  }
                  return material;
                });

                setArreglosVentaServicios((prev) => ({
                  ...prev,
                  materiales: nuevo,
                }));
              }}
            />
          );
        },
      },
      {
        Header: "Comentarios",
        accessor: "comentarios",
        Cell: (row, original) => {
          const [comentariosEdit, setComentariosEdit] = useState(
            !row.cell.value ? "" : row.cell.value
          );

          const handleComentariosEdit = (e) => setComentariosEdit(e.target.value);

          return (
            <input
              className="w-36 border-2 border-gray-200"
              type="text"
              key={row.row.values.id}
              value={comentariosEdit}
              onChange={(e) => handleComentariosEdit(e)}
              onBlur={(e) => {
                const currentMateriales = structuredClone(arreglosVentaServicios.materiales);
                const nuevo = currentMateriales.map((material) => {
                  if (material.id === row.cell.row.original.id) {
                    material.comentarios = e.target.value;
                  }
                  return material;
                });
                setArreglosVentaServicios((prev) => ({
                  ...prev,
                  materiales: nuevo,
                }));
              }}
            />
          );
        },
      },
    ],
    [arreglosVentaServicios]
  );

  const columnsTerceros = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Trabajos", accessor: "trabajo" },
      { Header: "Precio", accessor: "precio" },
      {
        Header: "Comentarios",
        accessor: "comentarios",
        Cell: (row, original) => {
          const [comentariosEdit, setComentariosEdit] = useState(
            !row.cell.value ? "" : row.cell.value
          );

          const handleComentariosEdit = (e) => setComentariosEdit(e.target.value);

          return (
            <input
              className="w-36 border-2 border-gray-200"
              type="text"
              key={row.row.values.id}
              value={comentariosEdit}
              onChange={(e) => handleComentariosEdit(e)}
              onBlur={(e) => {
                const currentTrabajosTerceros = structuredClone(
                  arreglosVentaServicios.trabajosTerceros
                );
                const nuevo = currentTrabajosTerceros.map((trabajo) => {
                  if (trabajo.id === row.cell.row.original.id) {
                    trabajo.comentarios = e.target.value;
                  }
                  return trabajo;
                });
                setArreglosVentaServicios((prev) => ({
                  ...prev,
                  trabajosTerceros: nuevo,
                }));
              }}
            />
          );
        },
      },
    ],
    [arreglosVentaServicios]
  );

  // BODY

  const getPresupuestos = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/venta-servicios/presupuesto?empresaId=${empresaId}`
    );
    return data;
  };

  const { data: presupuestosResponse, refetch } = useQuery("presupuestos", getPresupuestos, {
    initialData: {
      data: [],
    },
  });

  const presupuestosShow = useMemo(
    () =>
      presupuestosResponse?.data.map(({ id, cliente, codigo, fechaIngreso, fechaSalida }) => ({
        id,
        razonSocial: cliente?.numeroDocumento,
        nombreCliente: cliente?.nombre,
        email: cliente?.email,
        codigo,
        fechaIngreso: dateFormato(fechaIngreso),
        fechaSalida: dateFormato(fechaSalida),
      })),
    [presupuestosResponse?.data]
  );

  const serviciosShow = useMemo(
    () =>
      arreglosVentaServicios.servicios?.map(
        ({ id, definicion, diagnostico, precio, comentarios }) => ({
          id,
          codigo: definicion,
          diagnostico,
          precio,
          comentarios,
        })
      ),
    [arreglosVentaServicios]
  );

  const repuestosShow = useMemo(
    () =>
      arreglosVentaServicios.repuestos?.map(
        ({ id, codigo, diagnostico, precio, cantidad, comentarios }) => ({
          id,
          repuesto: codigo,
          diagnostico,
          precio,
          cantidad,
          comentarios,
        })
      ),
    [arreglosVentaServicios]
  );

  const materialesShow = useMemo(
    () =>
      arreglosVentaServicios.materiales?.map(({ id, codigo, precio, cantidad, comentarios }) => ({
        id,
        material: codigo,
        precio,
        cantidad,
        comentarios,
      })),
    [arreglosVentaServicios]
  );

  const trabajosTercerosShow = useMemo(
    () =>
      arreglosVentaServicios.trabajosTerceros?.map(({ id, codigo, precio, comentarios }) => ({
        id,
        trabajo: codigo,
        precio,
        comentarios,
      })),
    [arreglosVentaServicios]
  );

  // FUNCTIONS

  const getCodigosRecepcion = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/venta-servicios/hoja-recepcion?empresaId=${empresaId}`
    );
    setCodigosRecepcion(data?.data);
  };

  const handleHojaRecepcion = (e) => {
    setSelectedCliente(e.cliente);
    setForm({
      ...form,
      hojaRecepcionId: e.id,
      denominacion: e.denominacion,
      tipoReparacion: e.tipoReparacion,
      clienteId: e.clienteId,
      fabricaMaquinaId: e.fabricaMaquinaId,
      modeloMaquinaId: e.modeloMaquinaId,
      nombreMaquinaId: e.nombreMaquinaId,
      paisId: e.paisId,
      codigoMotorOriginal: e.codigoMotorOriginal,
      serieMotor: e.serieMotor,
      serieChasis: e.serieChasis,
      vendedorId: e.vendedorId,
      personalId: e.personalId,
      codigoBombaInyeccionOriginal: e.codigoBombaInyeccionOriginal,
      codigoBombaInyeccionFabricante: e.codigoBombaInyeccionFabricante,
      tipoBombaInyeccionFabricante: e.tipoBombaInyeccionFabricante,
      marcaFabricaSistemaInyeccionId: e.marcaFabricaSistemaInyeccionId,
      codigoOriginalBombaInyeccion: e.codigoOriginalBombaInyeccion,
      nombreBombaInyeccion: e.nombreBombaInyeccion,
      serieBombaInyeccion: e.serieBombaInyeccion,
      codigoInyectorOriginal: e.codigoInyectorOriginal,
      codigoInyectorFabricante: e.codigoInyectorFabricante,
      tipoFabricanteInyector: e.tipoFabricanteInyector,
      codigoOriginalInyector: e.codigoOriginalInyector,
    });
    // servicio, diagnostico, precio, comentarios
    const serviciosHoja = e.servicios.map((servicio) => {
      const rServicio = servicio.servicio;
      rServicio.diagnostico = "";
      rServicio.comentarios = "";
      return rServicio;
    });
    setArreglosVentaServicios({
      materiales: [],
      servicios: serviciosHoja,
      repuestos: [],
      trabajosTerceros: [],
    });
  };

  const handleDenominacion = (e) => setForm({ ...form, denominacion: e.target.value });

  const handleTipoReparacion = (e) => setForm({ ...form, tipoReparacion: e.target.value });

  // const handleSearchClientes = async ({target}) => {
  //     const {data}  = await axiosRequest(
  //       "get",
  //       `/api/mantenimiento/clientes?empresaId=${empresaId}&filterName=${target.value}`
  //     );
  //     setClientesSearch(data?.data);
  // }

  const getFabricasMaquinas = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/fabrica?empresaId=${empresaId}`
    );
    setFabricasMaquinas(data?.data);
  };

  const getModelosMaquinas = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/modelo?empresaId=${empresaId}`
    );
    setModelosMaquinas(data?.data);
  };

  const getNombresMaquinas = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/nombre?empresaId=${empresaId}`
    );
    setNombresMaquinas(data?.data);
  };
  const getPaises = async () => {
    const { data } = await axiosRequest("get", `/api/mantenimiento/paises?empresaId=${empresaId}`);
    setPaises(data?.data);
  };

  const getMarcasFabricaSistemasInyeccion = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/marca-fabrica-sistema-inyeccion?empresaId=${empresaId}`
    );
    setMarcasFabricas(data?.data);
  };

  const handleFabricaMaquina = (e) => {
    setForm({ ...form, fabricaMaquinaId: e.id });
  };

  const handleModeloMaquina = (e) => {
    setForm({ ...form, modeloMaquinaId: e.id });
  };

  const handleNombreMaquina = (e) => {
    setForm({ ...form, nombreMaquinaId: e.id });
  };

  const handlePais = (e) => {
    setForm({ ...form, paisId: e.id });
  };

  const handleCodigoMotorOriginal = (e) =>
    setForm({ ...form, codigoMotorOriginal: e.target.value });

  const handleSerieMotor = (e) => setForm({ ...form, serieMotor: e.target.value });

  const handleSerieChasis = (e) => setForm({ ...form, serieChasis: e.target.value });

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
      setForm({ ...form, vendedorId: e.id, personalId: null });
    } else {
      setForm({ ...form, personalId: e.id, vendedorId: null });
    }
  };

  const handleCodigoBombaInyeccionOriginal = (e) =>
    setForm({ ...form, codigoBombaInyeccionOriginal: e.target.value });

  const handleCodigoBombaInyeccionFabricante = (e) =>
    setForm({ ...form, codigoBombaInyeccionFabricante: e.target.value });

  const handleTipoBombaInyeccionFabricante = (e) =>
    setForm({ ...form, tipoBombaInyeccionFabricante: e.target.value });

  const handleMarcaFabricanteSistemaInyeccion = (e) => {
    setForm({ ...form, marcaFabricaSistemaInyeccionId: e.id });
  };

  const handleCodigoOriginalBombaInyeccion = (e) =>
    setForm({ ...form, codigoOriginalBombaInyeccion: e.target.value });

  const handleNombreBombaInyeccion = (e) =>
    setForm({ ...form, nombreBombaInyeccion: e.target.value });

  const handleSerieBombaInyeccion = (e) =>
    setForm({ ...form, serieBombaInyeccion: e.target.value });

  const handleCodigoInyectorOriginal = (e) =>
    setForm({ ...form, codigoInyectorOriginal: e.target.value });

  const handleCodigoInyectorFabricante = (e) =>
    setForm({ ...form, codigoInyectorFabricante: e.target.value });

  const handleTipoFabricaInyector = (e) =>
    setForm({ ...form, tipoFabricanteInyector: e.target.value });

  const handleCodigoOriginalInyector = (e) =>
    setForm({ ...form, codigoOriginalInyector: e.target.value });

  const handleCodigoInyectorOriginalOrden1 = (e) =>
    setForm({ ...form, codigoInyectorOriginalOrden1: e.target.value });

  const handleCodigoInyectorOriginalOrden2 = (e) =>
    setForm({ ...form, codigoInyectorOriginalOrden2: e.target.value });

  const handleCodigoInyectorOriginalOrden3 = (e) =>
    setForm({ ...form, codigoInyectorOriginalOrden3: e.target.value });

  const handleFechaIngreso = (e) => {
    const fecha = new Date(e.target.value);
    const fechaFormat = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(fecha.getDate()).padStart(2, "0")}`;
    setForm({ ...form, fechaIngreso: fechaFormat });
  };

  const handleHoraIngreso = (e) => {
    setForm({ ...form, horaIngreso: String(e.target.value) });
  };

  const handleFechaSalida = (e) => {
    const fecha = new Date(e.target.value);
    const fechaFormat = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(fecha.getDate()).padStart(2, "0")}`;
    setForm({ ...form, fechaSalida: fechaFormat });
  };

  const handleHoraSalida = (e) => {
    setForm({ ...form, horaSalida: String(e.target.value) });
  }

  // const handleHoraSalida = (e) => {
  //     console.log(e.target.value);
  // }

  const handleEstadoOrden = (e) => setForm({ ...form, estadoOrdenTrabajo: e.target.value });

  const handleSearchServicio = async ({ target }) => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/presupuesto/servicios?empresaId=${empresaId}&filterName=${target.value}`
    );
    setServiciosSearch(data?.data);
  };

  const deleteService = (original) => {
    const { id: idServicio } = original;
    const newServicios = arreglosVentaServicios.servicios.filter(
      (servicio) => servicio.id !== idServicio
    );
    setArreglosVentaServicios({ ...arreglosVentaServicios, servicios: newServicios });
  };

  const handleSearchMaterialesRepuesto = async ({ target }, opcion) => {
    const { data } = await axiosRequest(
      "get",
      `/api//mantenimiento/maestro-de-codigos/configuracion/materiales?empresaId=${empresaId}&filterName=${target.value}`
    );
    if (opcion === "Materiales") {
      setMaterialesSearch(data?.data);
    } else {
      setRepuestosSearch(data?.data);
    }
  };

  const handleSearchTrabajoTerceros = async ({ target }) => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/presupuesto/trabajo-terceros?empresaId=${empresaId}&filterName=${target.value}`
    );
    setTrabajosTercerosSearch(data?.data);
  };

  const deleteRepuesto = (original) => {
    const { id: idRepuesto } = original;
    const newRepuestos = arreglosVentaServicios.repuestos.filter(
      (repuesto) => repuesto.id !== idRepuesto
    );
    setArreglosVentaServicios({ ...arreglosVentaServicios, repuestos: newRepuestos });
  };

  const deleteMaterial = (original) => {
    const { id: idMaterial } = original;
    const newMateriales = arreglosVentaServicios.materiales.filter(
      (material) => material.id !== idMaterial
    );
    setArreglosVentaServicios({ ...arreglosVentaServicios, materiales: newMateriales });
  };

  const deleteTrabajoTerceros = (original) => {
    const { id: idTrabajo } = original;
    const newTrabajos = arreglosVentaServicios.trabajosTerceros.filter(
      (trabajo) => trabajo.id !== idTrabajo
    );
    setArreglosVentaServicios({ ...arreglosVentaServicios, trabajosTerceros: newTrabajos });
  };

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
    } else if (Number(e.target.value) < Number(descuentosLimites?.de)) {
      setForm({ ...form, descuento: Number(descuentosLimites?.de) });
    } else {
      setForm({ ...form, descuento: Number(descuentosLimites?.a) });
    }
  };

  useEffect(() => {
    if (arreglosVentaServicios.servicios?.length > 0) {
      let subtotalServiciosTemp = 0;
      for (const servicio of arreglosVentaServicios.servicios) {
        const valor = Number(servicio.precio);
        subtotalServiciosTemp += valor;
      }
      setForm({ ...form, subtotalValorServicio: subtotalServiciosTemp });
    }
  }, [arreglosVentaServicios.servicios]);

  useEffect(() => {
    if (arreglosVentaServicios.repuestos?.length > 0) {
      let subtotalRepuestosTemp = 0;
      for (const repuesto of arreglosVentaServicios.repuestos) {
        const valor = Number(repuesto.precio);
        const cantidad = Number(repuesto.cantidad);
        subtotalRepuestosTemp += valor * cantidad;
      }
      setForm({ ...form, subtotalRepuestos: subtotalRepuestosTemp });
    }
  }, [arreglosVentaServicios.repuestos]);

  useEffect(() => {
    if (arreglosVentaServicios.materiales?.length > 0) {
      let subtotalTemp = 0;
      for (const material of arreglosVentaServicios.materiales) {
        const valor = Number(material.precio);
        const cantidad = Number(material.cantidad);
        subtotalTemp += valor * cantidad;
      }
      setForm({ ...form, subtotalMateriales: subtotalTemp });
    }
  }, [arreglosVentaServicios.materiales]);

  useEffect(() => {
    if (arreglosVentaServicios.trabajosTerceros?.length > 0) {
      let subtotalTemp = 0;
      for (const trabajo of arreglosVentaServicios.trabajosTerceros) {
        const valor = Number(trabajo.precio);
        subtotalTemp += valor;
      }
      setForm({ ...form, subtotalTrabajoTerceros: subtotalTemp });
    }
  }, [arreglosVentaServicios.trabajosTerceros]);

  // useEffect(() => {
  //   if(form.descuento >= 0 && form.igv){
  //     const subtotalServiciosTemp = Number(form.subtotalServiciosTemp) || 0;
  //     const subtotalRepuestosTemp = Number(form.subtotalRepuestos) || 0;
  //     const subtotalMaterialesTemp = Number(form.subtotalMateriales) || 0;
  //     const subtotalTrabajosTemp = Number(form.subtotalTrabajoTerceros) || 0;
  //     const descuentoTemp = Number(form.descuento) || 0;
  //     const igvTemp = Number(form.igv) || Number(igv) || 0;
  //     let totalPresupuesto = subtotalServiciosTemp + subtotalRepuestosTemp + subtotalMaterialesTemp + subtotalTrabajosTemp;
  //     totalPresupuesto -= (totalPresupuesto * descuentoTemp)/100;
  //     totalPresupuesto += (totalPresupuesto * igvTemp)/100;
  //     setForm({...form, totalPresupuesto});
  //   }
  // }, [form.descuento, form.igv]);

  useEffect(() => {
    if (form.descuento >= 0) {
      const subtotalServiciosTemp = Number(form.subtotalServiciosTemp) || 0;
      const subtotalRepuestosTemp = Number(form.subtotalRepuestos) || 0;
      const subtotalMaterialesTemp = Number(form.subtotalMateriales) || 0;
      const subtotalTrabajosTemp = Number(form.subtotalTrabajoTerceros) || 0;
      const descuentoTemp = Number(form.descuento) || 0;
      const igvTemp = igv?.valor || 0;
      let totalPresupuesto =
        subtotalServiciosTemp +
        subtotalRepuestosTemp +
        subtotalMaterialesTemp +
        subtotalTrabajosTemp;
      totalPresupuesto -= (totalPresupuesto * descuentoTemp) / 100;
      const totalIgv = (totalPresupuesto * igvTemp) / 100;
      totalPresupuesto += totalPresupuesto + totalIgv;
      setForm({ ...form, igv: totalIgv, totalPresupuesto });
    }
  }, [form.descuento]);

  useEffect(() => {
    console.log(form);
  }, [form]);

  // useEffect(() => {
  //   console.log(arreglosVentaServicios.servicios);
  //   console.log(arreglosVentaServicios.repuestos);
  //   console.log(arreglosVentaServicios.materiales);
  //   console.log(arreglosVentaServicios.trabajosTerceros);

  // }, [arreglosVentaServicios]);

  return (
    <>
      <Container whiteColor={true}>
        <Title text={"Presupuestos"}>
          <ButtonAdd text={"Nuevo Presupuesto"} onClick={() => openModal(false)} />
        </Title>
        <TableComplete
          columns={columns}
          data={presupuestosShow}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </Container>

      <ModalLg
        title={isEdit ? "Editar Presupuesto" : "Nuevo Presupuesto"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
          <Group title={"Información General y Recepción"}>
            <GroupInputs>
              <Select
                label="Códgio recepción"
                value={isEdit ? form?.hojaRecepcionId : undefined}
                onChange={(e) => handleHojaRecepcion(e)}
              >
                {codigosRecepcion?.map((hoja) => {
                  return (
                    <Option key={hoja.id} value={hoja}>
                      {`Código: ${hoja.codigo} - ${hoja.cliente.nombre}`}
                    </Option>
                  );
                })}
              </Select>

              <Input
                label={"Tipo de reparación"}
                value={form?.tipoReparacion}
                onChange={(e) => handleTipoReparacion(e)}
              />
            </GroupInputs>
            <GroupInputs>
              <Input
                label={"Denominación"}
                value={form?.denominacion}
                onChange={(e) => handleDenominacion(e)}
              />
            </GroupInputs>
          </Group>

          <GroupIntern title={""}>
            <GroupInputsIntern title={"Clientes"}>
              {/* <Search
                                onFocus={() => setIsOpenSearchCliente(true)}
                                onChange={e => handleSearchClientes(e)}
                            />
                            <Dropdown isOpen={isOpenSearchCliente} elements={clientesSearch.length}>
                                {clientesSearch?.map((cliente) => {
                                return (
                                    <DropdownItem
                                    handleClick={() => {
                                        setSelectedCliente(cliente);
                                        setForm({...form, clienteId: cliente.id});
                                        setIsOpenSearchCliente(false);
                                    }}
                                    key={cliente.id}
                                    name={`Cliente: ${cliente.nombre} - ${cliente.tipoDocumento}: ${cliente.numeroDocumento} - ${cliente.codigo}`}
                                    />
                                )
                                })}
                            </Dropdown> */}

              <Input label={"Nombre"} value={selectedCliente?.nombre} disabled />
              <Input label={"Teléfono"} value={selectedCliente?.telefono} disabled />
              <Input label={"Correo"} value={selectedCliente?.email} disabled />
              <Input label={"Dirección"} disabled />
            </GroupInputsIntern>

            <GroupInputsIntern title={"Máquina"}>
              <Select
                label="Modelo máquina"
                value={isEdit ? form?.modeloMaquinaId : undefined}
                onChange={(e) => handleModeloMaquina(e)}
              >
                {modelosMaquinas?.map((modelo) => {
                  return (
                    <Option key={modelo.id} value={modelo}>
                      {`Código: ${modelo.codigo} - Modelo: ${modelo.modelo}`}
                    </Option>
                  );
                })}
              </Select>

              <Select
                label="Fábrica máquina"
                value={isEdit ? form?.fabricaMaquinaId : undefined}
                onChange={(e) => handleFabricaMaquina(e)}
              >
                {fabricasMaquinas?.map((fabrica) => {
                  return (
                    <Option key={fabrica.id} value={fabrica}>
                      {`Código: ${fabrica.codigo} - Modelo: ${fabrica.fabrica}`}
                    </Option>
                  );
                })}
              </Select>

              <Select
                label="Nombre máquina"
                value={isEdit ? form?.nombreMaquinaId : undefined}
                onChange={(e) => handleNombreMaquina(e)}
              >
                {nombresMaquinas?.map((nombre) => {
                  return (
                    <Option key={nombre.id} value={nombre}>
                      {`Código: ${nombre.codigo} - Modelo: ${nombre.nombre}`}
                    </Option>
                  );
                })}
              </Select>

              <Select
                label="Procedencia"
                value={isEdit ? form?.paisId : undefined}
                onChange={(e) => handlePais(e)}
              >
                {paises?.map((pais) => {
                  return (
                    <Option key={pais.id} value={pais}>
                      {`Código: ${pais.codigo} - Modelo: ${pais.nombre}`}
                    </Option>
                  );
                })}
              </Select>

              <Input
                label="Código motor original"
                value={form?.codigoMotorOriginal}
                onChange={(e) => handleCodigoMotorOriginal(e)}
              />
              <Input
                label="Serie motor"
                value={form?.serieMotor}
                onChange={(e) => handleSerieMotor(e)}
              />
              <Input
                label="Serie chasis"
                value={form?.serieChasis}
                onChange={(e) => handleSerieChasis(e)}
              />
            </GroupInputsIntern>
          </GroupIntern>

          <GroupIntern title={""}>
            <GroupInputsIntern title={"Responsable"}>
              <Select
                label="Tipo Responsable"
                value={isEdit ? (form?.personalId ? "personal" : "vendedores") : undefined}
                onChange={(e) => setTipoResponsable(String(e))}
              >
                <Option value={"vendedores"}>Vendedor</Option>
                <Option value={"personal"}>Personal</Option>
              </Select>

              <Select
                label="Vendedor/Personal"
                onChange={(e) => handleResponsable(e)}
                value={isEdit ? form?.personalId || form?.vendedorId : undefined}
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
            </GroupInputsIntern>

            <GroupInputsIntern title={"Bomba inyección"}>
              <Input
                label="Código bomba inyección original"
                value={form?.codigoBombaInyeccionOriginal}
                onChange={(e) => handleCodigoBombaInyeccionOriginal(e)}
              />
              <Input
                label="Código bomba inyección fabricante"
                className="text-clip overflow-hidden ..."
                value={form?.codigoBombaInyeccionFabricante}
                onChange={(e) => handleCodigoBombaInyeccionFabricante(e)}
              />
              <Input
                label="Tipo bomba inyección fabricante"
                value={form?.tipoBombaInyeccionFabricante}
                onChange={(e) => handleTipoBombaInyeccionFabricante(e)}
              />

              <Select
                label="Marca fabricante"
                value={isEdit ? form?.marcaFabricaSistemaInyeccionId : undefined}
                onChange={(e) => handleMarcaFabricanteSistemaInyeccion(e)}
              >
                {marcasFabricas?.map((marca) => {
                  return (
                    <Option key={marca.id} value={marca}>
                      {`Código: ${marca.codigo} - Modelo: ${marca.marca}`}
                    </Option>
                  );
                })}
              </Select>

              <Input
                label="Código original bomba de inyección"
                value={form?.codigoOriginalBombaInyeccion}
                onChange={(e) => handleCodigoOriginalBombaInyeccion(e)}
              />
              <Input
                label="Nombre de bomba inyección"
                value={form?.nombreBombaInyeccion}
                onChange={(e) => handleNombreBombaInyeccion(e)}
              />
              <Input
                label="Serie de bomba de inyección"
                value={form?.serieBombaInyeccion}
                onChange={(e) => handleSerieBombaInyeccion(e)}
              />
            </GroupInputsIntern>
          </GroupIntern>

          <GroupInputsIntern title={"Código Equivalente"}>
            <Input
              label="Código inyector original"
              value={form?.codigoInyectorOriginal}
              onChange={(e) => handleCodigoInyectorOriginal(e)}
            />
            <Input
              label="Código inyector fabricante"
              value={form?.codigoInyectorFabricante}
              onChange={(e) => handleCodigoInyectorFabricante(e)}
            />
            <Input
              label="Tipo fábrica inyector"
              value={form?.tipoFabricanteInyector}
              onChange={(e) => handleTipoFabricaInyector(e)}
            />
            <Input
              label="Código original inyector"
              value={form?.codigoOriginalInyector}
              onChange={(e) => handleCodigoOriginalInyector(e)}
            />
          </GroupInputsIntern>

          <Group title={"Detalle Orden de Trabajo"}>
            <GroupInputs>
              <Input
                label="Código Inyector Original"
                value={form?.codigoInyectorOriginalOrden1}
                onChange={(e) => handleCodigoInyectorOriginalOrden1(e)}
              />
              <Input
                label="Código Inyector Original"
                value={form?.codigoInyectorOriginalOrden2}
                onChange={(e) => handleCodigoInyectorOriginalOrden2(e)}
              />
              <Input
                label="Código Inyector Original"
                value={form?.codigoInyectorOriginalOrden3}
                onChange={(e) => handleCodigoInyectorOriginalOrden3(e)}
              />
            </GroupInputs>
            <GroupInputs>
              <Input
                label={"Fecha Ingreso"}
                type={"date"}
                value={form.fechaIngreso}
                onChange={(e) => handleFechaIngreso(e)}
              />
              <Input
                label={"Hora Ingreso"}
                type={"time"}
                value={form.horaIngreso}
                onChange={(e) => handleHoraIngreso(e)}
              />
              <Input
                label={"Fecha Salida"}
                type={"date"}
                value={form.fechaSalida}
                onChange={(e) => handleFechaSalida(e)}
              />
              <Input
                label={"Hora Salida"}
                type={"time"}
                value = {form.horaSalida}
                onChange = { (e) => handleHoraSalida(e)}
              />
            </GroupInputs>
            <GroupInputs>
              <Input
                label="Estado O.T."
                value={form?.estadoOrdenTrabajo}
                onChange={(e) => handleEstadoOrden(e)}
              />
            </GroupInputs>
          </Group>

          <div className="flex w-full overflow-y-auto sticky -top-8 h-auto py-4 z-30 bg-white gap-3">
            <div
              className="cursor-pointer w-[10rem] items-center p-2 text-base font-normal shadow-md rounded-t-lg text-primary border text-center bg-primary-200"
              onClick={() => setStateModal("Servicio")}
            >
              Detalle Servicio
            </div>
            <div
              className="cursor-pointer w-[10rem] items-center p-2 text-base font-normal shadow-md rounded-t-lg text-primary border text-center bg-primary-200"
              onClick={() => setStateModal("Repuesto")}
            >
              Detalle Repuesto
            </div>
            <div
              className="cursor-pointer w-[10rem] items-center p-2 text-base font-normal shadow-md rounded-t-lg text-primary border text-center bg-primary-200"
              onClick={() => setStateModal("Materiales")}
            >
              Materiales
            </div>
            <div
              className="cursor-pointer w-[10rem] items-center p-2 text-base font-normal shadow-md rounded-t-lg text-primary border text-center bg-primary-200"
              onClick={() => setStateModal("Terceros")}
            >
              Trabajos Terceros
            </div>
            <div
              className="cursor-pointer w-[10rem] items-center p-2 text-base font-normal shadow-md rounded-t-lg text-primary border text-center bg-primary-200"
              onClick={() => setStateModal("Historial")}
            >
              Historial
            </div>
          </div>

          {stateModal === "Servicio" && (
            <>
              <Search
                onFocus={() => setIsOpenArreglos({ ...isOpenArreglos, servicios: true })}
                placeHolderText={"Buscar servicio"}
                onChange={(e) => handleSearchServicio(e)}
              />
              <Dropdown isOpen={isOpenArreglos.servicios} elements={serviciosSearch.length}>
                {serviciosSearch?.map((servicio) => {
                  return (
                    <DropdownItem
                      key={servicio.id}
                      name={`Servicio ${servicio.codigo} - ${servicio.definicion}`}
                      handleClick={() => {
                        const currentServicios = structuredClone(arreglosVentaServicios.servicios);
                        const copyServicio = structuredClone(servicio);

                        copyServicio.diagnostico = "";
                        copyServicio.comentarios = "";
                        currentServicios.push(copyServicio);

                        setArreglosVentaServicios({
                          ...arreglosVentaServicios,
                          servicios: currentServicios,
                        });
                        setIsOpenArreglos({ ...isOpenArreglos, servicios: false });
                      }}
                    />
                  );
                })}
              </Dropdown>
              <TableForSelections
                columns={columnsServicios}
                data={serviciosShow || []}
                canDelete={true}
                functionDelete={deleteService}
              />
            </>
          )}

          {stateModal === "Repuesto" && (
            <>
              <Search
                onFocus={() => setIsOpenArreglos({ ...isOpenArreglos, repuestos: true })}
                placeHolderText={"Buscar repuesto"}
                onChange={(e) => handleSearchMaterialesRepuesto(e, "Repuesto")}
              />
              <Dropdown isOpen={isOpenArreglos.repuestos} elements={repuestosSearch.length}>
                {repuestosSearch?.map((repuesto) => {
                  return (
                    <DropdownItem
                      key={repuesto.id}
                      name={`Repuesto Código${repuesto.codigo} - Correlativo: ${repuesto.correlativo}`}
                      handleClick={() => {
                        const currentRepuestos = structuredClone(arreglosVentaServicios.repuestos);
                        const copyRepuesto = structuredClone(repuesto);

                        copyRepuesto.diagnostico = "";
                        copyRepuesto.cantidad = 0;
                        copyRepuesto.precio = repuesto.ventaUnidad;
                        copyRepuesto.comentarios = "";
                        currentRepuestos.push(copyRepuesto);

                        setArreglosVentaServicios({
                          ...arreglosVentaServicios,
                          repuestos: currentRepuestos,
                        });
                        setIsOpenArreglos({ ...isOpenArreglos, repuestos: false });
                      }}
                    />
                  );
                })}
              </Dropdown>
              <TableForSelections
                columns={columnsRepuestos}
                data={repuestosShow || []}
                canDelete={true}
                functionDelete={deleteRepuesto}
              />
            </>
          )}

          {stateModal === "Materiales" && (
            <>
              <Search
                onFocus={() => setIsOpenArreglos({ ...isOpenArreglos, materiales: true })}
                placeHolderText={"Buscar material"}
                onChange={(e) => handleSearchMaterialesRepuesto(e, "Materiales")}
              />
              <Dropdown isOpen={isOpenArreglos.materiales} elements={materialesSearch.length}>
                {materialesSearch?.map((material) => {
                  return (
                    <DropdownItem
                      key={material.id}
                      name={`Material Código${material.codigo} - Correlativo: ${material.correlativo}`}
                      handleClick={() => {
                        const currentMateriales = structuredClone(
                          arreglosVentaServicios.materiales
                        );
                        const copyMaterial = structuredClone(material);

                        copyMaterial.cantidad = 0;
                        copyMaterial.precio = material.ventaUnidad;
                        copyMaterial.comentarios = "";
                        currentMateriales.push(copyMaterial);

                        setArreglosVentaServicios({
                          ...arreglosVentaServicios,
                          materiales: currentMateriales,
                        });
                        setIsOpenArreglos({ ...isOpenArreglos, materiales: false });
                      }}
                    />
                  );
                })}
              </Dropdown>
              <TableForSelections
                columns={columnsMateriales}
                data={materialesShow || []}
                canDelete={true}
                functionDelete={deleteMaterial}
              />
            </>
          )}

          {stateModal === "Terceros" && (
            <>
              <Search
                onFocus={() => setIsOpenArreglos({ ...isOpenArreglos, trabajosTerceros: true })}
                placeHolderText={"Buscar Trabajo de Terceros"}
                onChange={(e) => handleSearchTrabajoTerceros(e)}
              />
              <Dropdown
                isOpen={isOpenArreglos.trabajosTerceros}
                elements={trabajosTercerosSearch.length}
              >
                {trabajosTercerosSearch?.map((trabajo) => {
                  return (
                    <DropdownItem
                      key={trabajo.id}
                      name={`Trabajo Código${trabajo.codigo} - Def: ${trabajo.definicion}`}
                      handleClick={() => {
                        const currentTrabajos = structuredClone(
                          arreglosVentaServicios.trabajosTerceros
                        );
                        const copyTrabajo = structuredClone(trabajo);

                        copyTrabajo.comentarios = "";
                        currentTrabajos.push(copyTrabajo);

                        setArreglosVentaServicios({
                          ...arreglosVentaServicios,
                          trabajosTerceros: currentTrabajos,
                        });
                        setIsOpenArreglos({ ...isOpenArreglos, trabajosTerceros: false });
                      }}
                    />
                  );
                })}
              </Dropdown>
              <TableForSelections
                columns={columnsTerceros}
                data={trabajosTercerosShow || []}
                canDelete={true}
                functionDelete={deleteTrabajoTerceros}
              />
            </>
          )}

          {stateModal === "Historial" && <></>}

          <Group title={""}>
            <Divider />
            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">Subtotal valor servicios soles</span>
                </div>
                <div>
                  <Input disabled value={form.subtotalValorServicio} />
                </div>
              </div>
            </GroupInputs>
            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">Subtotal valor repuestos soles</span>
                </div>
                <div>
                  <Input disabled value={form.subtotalRepuestos} />
                </div>
              </div>
            </GroupInputs>
            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">Subtotal valor materiales soles</span>
                </div>
                <div>
                  <Input disabled value={form.subtotalMateriales} />
                </div>
              </div>
            </GroupInputs>
            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">Subtotal valor trabajo terceros soles</span>
                </div>
                <div>
                  <Input disabled value={form.subtotalTrabajoTerceros} />
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
                    disabled={arreglosVentaServicios.servicios?.length === 0}
                    onChange={(e) => handleDescuentoInput(e)}
                  />
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
                  <span className="font-semibold">TOTAL PRESUPUESTO</span>
                </div>
                <div>
                  <Input disabled value={form.totalPresupuesto} />
                </div>
              </div>
            </GroupInputs>
          </Group>

          <div className="w-full flex justify-center gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave label={"Guardar y enviar"} onClick={saveData} />
          </div>
        </form>
      </ModalLg>

      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={deleteRegistro}
        title={"Eliminar Presupuesto"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
