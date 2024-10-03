import { useMemo, useEffect, useState, useContext } from "react";

import { FormContext } from "../../../contexts/form.context";
import { VentaServiciosContext } from "../../../contexts/venta-servicios.context";

import { ButtonAdd, ButtonSave, ButtonCancel } from "../../../app/components/elements/Buttons";
import { Container } from "../../../app/components/elements/Containers";
import { Title } from "../../../app/components/elements/Title";
import { Divider } from "../../../app/components/elements/Divider";
import { ModalConfirmDelete, ModalLg } from "../../../app/components/modules/Modal";
import { Group, GroupInputs, GroupInputsIntern, GroupIntern } from "../../../app/components/elements/Form";
import { Input } from "@material-tailwind/react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastAlert } from "../../../app/components/elements/ToastAlert";
import { errorProps, successProps } from "../../../app/utils/alert-config";
import { Search } from "../../../app/components/elements/Search";
import { Dropdown, DropdownItem } from "../../../app/components/elements/Dropdown";

import { useModal } from "../../../app/hooks/useModal";
import * as yup from "yup";

import TableComplete from '../../../app/components/modules/TableComplete';
import TableForSelections from "../../../app/components/modules/TableForSelections";

import { useLocalStorage } from "../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../app/utils/axios-request";
import { useQuery } from "react-query";

const schema = yup.object().shape({
    clienteId: yup.number().required(),
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
    trabajosTerceros: yup.array().required()
});

const updateSchema = yup.object().shape({
    clienteId: yup.number().required(),
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
    trabajosTerceros: yup.array().required()
})

const initialStateForm = {
    clienteId: null,
    subtotalValorServicio: null,
    subtotalRepuestos: null,
    subtotalMateriales: null,
    subtotalTrabajoTerceros: null,
    descuento: null,
    igv: null,
    totalPresupuesto: null,
    servicios: null,
    repuestos: null,
    materiales: null,
    trabajosTerceros: null
}

export default function OrdenTrabajo() {
    const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
    const { changeData, elementId, updateForm } = useContext(FormContext);
    const { arreglosVentaServicios, setArreglosVentaServicios, codigosVentaServicios,
        setCodigosVentaServicios, arreglosRel, setArreglosRel } = useContext(VentaServiciosContext);

    const [empresaId] = useLocalStorage("empresaId");

    const [selectedCliente, setSelectedCliente] = useState(null);
    const [selectedPresupuesto, setSelectedPresupuesto] = useState(null);
    const [clientesSearch, setClientesSearch] = useState([]);
    const [isOpenSearchCliente, setIsOpenSearchCliente] = useState(false);

    const [descuentosLimites, setDescuentosLimites] = useState(null);
    const [igv, setIgv] = useState(null);

    const [stateModal, setStateModal] = useState("Servicio");

    const [form, setForm] = useState(initialStateForm);

    useEffect(() => {
        setForm(initialStateForm);
        refetch();
        setArreglosVentaServicios({
            servicios:[],
            repuestos: [],
            materiales: [],
            trabajosTerceros: []
        });
        setCodigosVentaServicios({
            servicios:[],
            repuestos: [],
            materiales: [],
            trabajosTerceros: []
        });

    }, [changeData]);

    useEffect(() => {
        getDescuentoApi();
        getIgvApi();
    }, [])

    useEffect(() => {
        // console.log(ordenesResponse?.data);
        const currentTemp = ordenesResponse?.data.find((item) => item.id === updateForm?.id);
        const current = {...currentTemp};
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
        })
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

        if(isEdit){
            setSelectedCliente(current?.cliente);
            setForm({...current});
            setArreglosVentaServicios({
                ...arreglosVentaServicios,
                servicios: updateServicios,
                repuestos: updateRepuestos,
                materiales: updateMateriales,
                trabajosTerceros: updateTrabajos
            });
        }

    }, [updateForm])
    


    // CRUD

    const createRegistro = async () => {
        await schema.validate({
            ...form,
            servicios: arreglosVentaServicios.servicios,
            repuestos: arreglosVentaServicios.repuestos,
            materiales: arreglosVentaServicios.materiales,
            trabajosTerceros: arreglosVentaServicios.trabajosTerceros
        }, {abortEarly: false});
        await axiosRequest(
            "post",
            `/api/venta-servicios/orden-trabajo`,
            {
                ...form,
                servicios: arreglosVentaServicios.servicios,
                repuestos: arreglosVentaServicios.repuestos,
                materiales: arreglosVentaServicios.materiales,
                trabajosTerceros: arreglosVentaServicios.trabajosTerceros,
                empresaId: parseInt(empresaId),
                sucursalId: 1
            }
        );
        toast.success(`Registro guardado exitosamente!`, successProps);
    }

    const updateRegistro = async () => {
        await updateSchema.validate({
            ...form,
            servicios: arreglosVentaServicios.servicios,
            repuestos: arreglosVentaServicios.repuestos,
            materiales: arreglosVentaServicios.materiales,
            trabajosTerceros: arreglosVentaServicios.trabajosTerceros
        }, {abortEarly: false});
        try {
            await axiosRequest(
                "put",
                `/api/venta-servicios/orden-trabajo/${elementId}`,
                {
                    ...form,
                    servicios: arreglosVentaServicios.servicios,
                    repuestos: arreglosVentaServicios.repuestos,
                    materiales: arreglosVentaServicios.materiales,
                    trabajosTerceros: arreglosVentaServicios.trabajosTerceros,
                    cliente: undefined,
                    empresaId: parseInt(empresaId),
                    sucursalId: 1
                }
            );
            toast.success(`Registro actualizado exitosamente!`, successProps);
        } catch (error) {
            toast.error(<ToastAlert error={error} />, errorProps);  
        }
    };

    const deleteRegistro = async () => {
        try {
          await axiosRequest(
            "delete",
            `/api/venta-servicios/orden-trabajo/${elementId}`
          );
          toast.success(`🗑️ Registro eliminado exitosamente!`, successProps);
          refetch();
        } catch (error) {
          toast.error(<ToastAlert error={error} />, errorProps);
        }
    }


    const saveData = async () => {
        try {
            if(isEdit){
                await updateRegistro();
            } else {
                await createRegistro();
            }
            setForm(initialStateForm);
            setSelectedCliente(null);
            setSelectedPresupuesto(null);
            setArreglosVentaServicios({...arreglosVentaServicios, 
                servicios:[],
                repuestos: [],
                materiales: [],
                trabajosTerceros: []
            });
            setCodigosVentaServicios({
                ...codigosVentaServicios,
                servicios:[],
                repuestos: [],
                materiales: [],
                trabajosTerceros: []
            })
            refetch();
            closeModal();
        } catch (error) {
            toast.error(<ToastAlert error={error}/>, errorProps);     
        }
    }

    // HEADERS

    const columns = useMemo(
        () => [
            { Header: "N°", accessor: "id" },
            { Header: "RUC / DNI", accessor: "razonSocial" },
            { Header: "Nombre Cliente", accessor: "nombreCliente" },
            { Header: "Correo", accessor: "email" },
            { Header: "Orden de Trabajo", accessor: "codigo" },
            { Header: "Presupuesto Total", accessor: "totalPresupuesto" },
        ],
        []
    );

    const columnsClientes = useMemo(
        () => [
          { Header: "N°", accessor: "id"},
          { Header: "RUC/DNI" , accessor: "razonSocial"},
          { Header: "Nombre Cliente", accessor: "nombreCliente"}
        ],
        []
    );

    const columnsPresupuestos = useMemo(
        () => [
            { Header: "N°", accessor: "id"},
            { Header: "Código", accessor: "codigo"},
            { Header: "Cliente", accessor: "nombreCliente"}
        ],
        []
    );

    const columnsCodigosServicios = useMemo(
        () => [
            { Header: "N°", accessor: "id"},
            { Header: "Servicio", accessor: "codigo"},
            { Header: "Diagnóstico", accessor: "diagnostico"},
            { Header: "Precio", accessor: "precio"},
            { Header: "Comentarios", accessor: "comentarios"}
        ],
        []
    );

    const columnsCodigosRepuestos = useMemo(() => [
        { Header: "N°", accessor: "id"},
        { Header: "Repuesto", accessor: "codigo"},
        { Header: "Diagnóstico", accessor: "diagnostico"},
        { Header: "Cantidad", accessor: "cantidad"},
        { Header: "Precio", accessor: "precio"},
        { Header: "Comentarios", accessor: "comentarios"}

    ], []);

    const columnsCodigosMateriales = useMemo(() => [
        { Header: "N°", accessor: "id"},
        { Header: "Repuesto", accessor: "codigo"},
        { Header: "Cantidad", accessor: "cantidad"},
        { Header: "Precio", accessor: "precio"},
        { Header: "Comentarios", accessor: "comentarios"}

    ], []);

    const columnsCodigosTrabajos = useMemo(() => [
        { Header: "N°", accessor: "id"},
        { Header: "Repuesto", accessor: "codigo"},
        { Header: "Precio", accessor: "precio"},
        { Header: "Comentarios", accessor: "comentarios"}

    ], []);

    const columnsServicios = useMemo(
        () => [
            { Header: "N°", accessor: "id"},
            { Header: "Servicio", accessor: "codigo"},
            { Header: "Diagnóstico", accessor: "diagnostico", Cell: (row, original) => {

                const [diagnosticoEdit, setDiagnosticoEdit] = useState(!row.cell.value ? "" : row.cell.value);

                const handleDiagnosticoEdit = (e) => setDiagnosticoEdit(e.target.value);
        
                return (
                  <input
                    className="w-36 border-2 border-gray-200"
                    type="text"
                    key={row.row.values.id}
                    value={diagnosticoEdit}
                    onChange={e => handleDiagnosticoEdit(e) }
                    onBlur={(e)=>{
                        const currentServicios = structuredClone(arreglosVentaServicios.servicios);
                        const nuevo = currentServicios.map((servicio) => {
                            if(servicio.id === row.cell.row.original.id) {
                                servicio.diagnostico = e.target.value;
                            }
                            return servicio;
                        });
                        setArreglosVentaServicios(prev => ({
                            ...prev,
                            servicios: nuevo
                        }));
                    }}
                  />
                )
              }},
            { Header: "Precio", accessor: "precio"},
            { Header: "Comentarios", accessor: "comentarios", Cell: (row, original) => {

                const [comentariosEdit, setComentariosEdit] = useState(!row.cell.value ? "" : row.cell.value);

                const handleComentariosEdit = (e) => setComentariosEdit(e.target.value);
        
                return (
                  <input
                    className="w-36 border-2 border-gray-200"
                    type="text"
                    key={row.row.values.id}
                    value={comentariosEdit}
                    onChange={e => handleComentariosEdit(e) }
                    onBlur={(e)=>{
                        const currentServicios = structuredClone(arreglosVentaServicios.servicios);
                        const nuevo = currentServicios.map((servicio) => {
                            if(servicio.id === row.cell.row.original.id) {
                                servicio.comentarios = e.target.value;
                            }
                            return servicio;
                        });
                        setArreglosVentaServicios(prev => ({
                            ...prev,
                            servicios: nuevo
                        }));
                    }}
                  />
                )
              }}
        ],
        [arreglosVentaServicios]
    );

    const columnsRepuestos = useMemo(() => [
        { Header: "N°", accessor: "id"},
        { Header: "Repuesto", accessor: "codigo"},
        { Header: "Diagnóstico", accessor: "diagnostico", Cell: (row, original) => {

            const [diagnosticoEdit, setDiagnosticoEdit] = useState(!row.cell.value ? "" : row.cell.value);

            const handleDiagnosticoEdit = (e) => setDiagnosticoEdit(e.target.value);
    
            return (
              <input
                className="w-36 border-2 border-gray-200"
                type="text"
                key={row.row.values.id}
                value={diagnosticoEdit}
                onChange={e => handleDiagnosticoEdit(e) }
                onBlur={(e)=>{
                    const currentRepuestos = structuredClone(arreglosVentaServicios.repuestos);
                    const nuevo = currentRepuestos.map((repuesto) => {
                        if(repuesto.id === row.cell.row.original.id) {
                            repuesto.diagnostico = e.target.value;
                        }
                        return repuesto;
                    });
                    setArreglosVentaServicios(prev => ({
                        ...prev,
                        repuestos: nuevo
                    }));
                }}
              />
            )
        }},
        { Header: "Cantidad", accessor: "cantidad", Cell: (row, original) => {

            const [cantidadTempEdit, setCantidadTempEdit] = useState(!row.cell.value ? "0" : row.cell.value);

            const handleCantidadEdit = (e) => {
                const newValue = e.target.value;
                if (/^\d+$/.test(newValue) || newValue === "") {
                  for(const repuesto of arreglosVentaServicios.repuestos){
                    if(row.row.values.id === repuesto.id){
                      Number(newValue) > Number(repuesto.stock) ? setCantidadTempEdit(repuesto.stock) : setCantidadTempEdit(newValue);
                      // material.cantidad =  ? Number(material.stock) : Number(e.target.value);
                    }
                  }
                }  
            }
            return (
                <input
                  className="w-[3rem] border-2 border-gray-200"
                  type="text"
                  key={row.row.values.id}
                  value={cantidadTempEdit}
                  onChange={e => handleCantidadEdit(e) }
                  onBlur={(e)=>{
                    const currentRepuestos = structuredClone(arreglosVentaServicios.repuestos);
                    const nuevo = currentRepuestos.map((repuesto) => {
                      if(repuesto.id === row.cell.row.original.id){
                        if(e.target.value === "" ){
                            repuesto.cantidad = Number(0);
                        } else{
                          repuesto.cantidad = e.target.value > repuesto.stock ? Number(repuesto.stock) : Number(e.target.value);
                        }
                      }
                      return repuesto;
                    });
      
                    setArreglosVentaServicios(prev => ({
                      ...prev,
                      repuestos: nuevo
                    }))
                  }}
                />
            )
        }},
        { Header: "Precio", accessor: "precio"},
        { Header: "Comentarios", accessor: "comentarios", Cell: (row, original) => {

            const [comentariosEdit, setComentariosEdit] = useState(!row.cell.value ? "" : row.cell.value);

            const handleComentariosEdit = (e) => setComentariosEdit(e.target.value);
    
            return (
              <input
                className="w-36 border-2 border-gray-200"
                type="text"
                key={row.row.values.id}
                value={comentariosEdit}
                onChange={e => handleComentariosEdit(e) }
                onBlur={(e)=>{
                    const currentRepuestos = structuredClone(arreglosVentaServicios.repuestos);
                    const nuevo = currentRepuestos.map((repuesto) => {
                        if(repuesto.id === row.cell.row.original.id) {
                            repuesto.comentarios = e.target.value;
                        }
                        return repuesto;
                    });
                    setArreglosVentaServicios(prev => ({
                        ...prev,
                        repuestos: nuevo
                    }));
                }}
              />
            )
        }}

    ], [arreglosVentaServicios]);

    const columnsMateriales = useMemo(() => [
        { Header: "N°", accessor: "id"},
        { Header: "Material", accessor: "codigo"},
        { Header: "Cantidad", accessor: "cantidad", Cell: (row, original) => {

            const [cantidadTempEdit, setCantidadTempEdit] = useState(!row.cell.value ? "0" : row.cell.value);

            const handleCantidadEdit = (e) => {
                const newValue = e.target.value;
                if (/^\d+$/.test(newValue) || newValue === "") {
                  for(const material of arreglosVentaServicios.materiales){
                    if(row.row.values.id === material.id){
                      Number(newValue) > Number(material.stock) ? setCantidadTempEdit(material.stock) : setCantidadTempEdit(newValue);
                      // material.cantidad =  ? Number(material.stock) : Number(e.target.value);
                    }
                  }
                }  
            }
            return (
                <input
                  className="w-[3rem] border-2 border-gray-200"
                  type="text"
                  key={row.row.values.id}
                  value={cantidadTempEdit}
                  onChange={e => handleCantidadEdit(e) }
                  onBlur={(e)=>{
                    const currentMateriales = structuredClone(arreglosVentaServicios.materiales);
                    const nuevo = currentMateriales.map((material) => {
                      if(material.id === row.cell.row.original.id){
                        if(e.target.value === "" ){
                            material.cantidad = Number(0);
                        } else{
                          material.cantidad = e.target.value > material.stock ? Number(material.stock) : Number(e.target.value);
                        }
                      }
                      return material;
                    });
      
                    setArreglosVentaServicios(prev => ({
                      ...prev,
                      materiales: nuevo
                    }))
                  }}
                />
            )
        }},
        { Header: "Precio", accessor: "precio"},
        { Header: "Comentarios", accessor: "comentarios", Cell: (row, original) => {

            const [comentariosEdit, setComentariosEdit] = useState(!row.cell.value ? "" : row.cell.value);

            const handleComentariosEdit = (e) => setComentariosEdit(e.target.value);
    
            return (
              <input
                className="w-36 border-2 border-gray-200"
                type="text"
                key={row.row.values.id}
                value={comentariosEdit}
                onChange={e => handleComentariosEdit(e) }
                onBlur={(e)=>{
                    const currentMateriales = structuredClone(arreglosVentaServicios.materiales);
                    const nuevo = currentMateriales.map((material) => {
                        if(material.id === row.cell.row.original.id) {
                            material.comentarios = e.target.value;
                        }
                        return material;
                    });
                    setArreglosVentaServicios(prev => ({
                        ...prev,
                        materiales: nuevo
                    }));
                }}
              />
            )
        }}

    ], [arreglosVentaServicios]);

    const columnsTrabajos = useMemo(() => [
        { Header: "N°", accessor: "id"},
        { Header: "Repuesto", accessor: "codigo"},
        { Header: "Precio", accessor: "precio"},
        { Header: "Comentarios", accessor: "comentarios", Cell: (row, original) => {

            const [comentariosEdit, setComentariosEdit] = useState(!row.cell.value ? "" : row.cell.value);

            const handleComentariosEdit = (e) => setComentariosEdit(e.target.value);
    
            return (
              <input
                className="w-36 border-2 border-gray-200"
                type="text"
                key={row.row.values.id}
                value={comentariosEdit}
                onChange={e => handleComentariosEdit(e) }
                onBlur={(e)=>{
                    const currentTrabajosTerceros = structuredClone(arreglosVentaServicios.trabajosTerceros);
                    const nuevo = currentTrabajosTerceros.map((trabajo) => {
                        if(trabajo.id === row.cell.row.original.id) {
                            trabajo.comentarios = e.target.value;
                        }
                        return trabajo;
                    });
                    setArreglosVentaServicios(prev => ({
                        ...prev,
                        trabajosTerceros: nuevo
                    }));
                }}
              />
            )
        }}

    ], [arreglosVentaServicios]);

    // BODY

    const getOrdenes = async () => {
        const { data } = await axiosRequest(
            "get",
            `/api/venta-servicios/orden-trabajo?empresaId=${empresaId}`
        );
        return data;
    };

    const { data: ordenesResponse, refetch } = useQuery("ordenesTrabajo", getOrdenes, {
        initialData: {
            data: []
        }
    });

    // id
    // razonSocial
    // nombreCliente
    // email
    // codigo
    // totalPresupuesto

    const ordenesShow = useMemo(
        () => ordenesResponse?.data.map(({id, codigo, cliente, totalPresupuesto}) => ({
            id,
            razonSocial: cliente?.numeroDocumento,
            nombreCliente: cliente?.nombre,
            email: cliente?.email,
            codigo,
            totalPresupuesto
        })),
        [ordenesResponse?.data]
    );

    const clientesShow = useMemo(
        () => {
            if(selectedCliente){
                return [{
                    id: selectedCliente.id,
                    razonSocial: selectedCliente.numeroDocumento,
                    nombreCliente: selectedCliente.nombre
                }]
            }
        },
        [selectedCliente]
    )

    const presupuestosShow = useMemo(() => arreglosRel?.presupuestos?.map(( {id, codigo, cliente}) => {
        return {
            id,
            codigo,
            nombreCliente: cliente.nombre
        }
    }), [arreglosRel])

    const setCodigos = (presupuestoClickeado) => {
        const presupuestoData = arreglosRel.presupuestos.find((presupuesto) => presupuesto.id === presupuestoClickeado.id);

        setCodigosVentaServicios({...codigosVentaServicios,
            servicios: presupuestoData.servicios,
            repuestos: presupuestoData.repuestos,
            materiales: presupuestoData.materiales,
            trabajosTerceros: presupuestoData.trabajosTerceros
        });
        setSelectedPresupuesto(presupuestoData);
    };

    const codigosServiciosShow = useMemo(
        () => codigosVentaServicios?.servicios?.map(({id, servicio, diagnostico, precio, comentarios}) => {
            return {
                id: servicio.id,
                codigo: servicio.codigo,
                diagnostico,
                precio,
                comentarios
            }
        }),
        [codigosVentaServicios]
    );

    const codigosRepuestosShow = useMemo(
        () => codigosVentaServicios?.repuestos?.map(({id, repuesto, diagnostico, precio, comentarios, cantidad}) => {
            return {
                id: repuesto.id,
                codigo: repuesto.codigo,
                diagnostico,
                cantidad,
                precio,
                comentarios
            }
        }),
        [codigosVentaServicios]
    );

    const codigosMaterialessShow = useMemo(
        () => codigosVentaServicios?.materiales?.map(({id, material, cantidad, precio, comentarios}) => {
            return {
                id: material.id,
                codigo: material.codigo,
                cantidad,
                precio,
                comentarios
            }
        }),
        [codigosVentaServicios]
    );

    const codigosTrabajosShow = useMemo(
        () => codigosVentaServicios?.trabajosTerceros?.map(({id, trabajoTercero, precio, comentarios}) => {
            return {
                id: trabajoTercero.id,
                codigo: trabajoTercero.codigo,
                precio,
                comentarios
            }
        }),
        [codigosVentaServicios]
    );

    const setServicios = (servicioClickeado) => {
        const verificar = (idServicio) => {
            const existServicio = arreglosVentaServicios?.servicios?.find((servicio) => servicio.id === idServicio);
            if(existServicio)return true;
            return false;
        }

        if(!verificar(servicioClickeado.id)){
            const servicioData = selectedPresupuesto.servicios?.find((servicio) => servicio.servicio.id === servicioClickeado.id);
            const copyServicios = structuredClone(arreglosVentaServicios.servicios);
            servicioData.servicio.diagnostico = servicioData.diagnostico;
            servicioData.servicio.precio = servicioData.precio;
            servicioData.servicio.comentarios = servicioData.comentarios;
            copyServicios.push(servicioData.servicio);

            setArreglosVentaServicios({...arreglosVentaServicios, servicios: copyServicios});
        }
    }

    const ServiciosShow = useMemo(
        () => arreglosVentaServicios?.servicios?.map(({id, codigo, diagnostico, precio, comentarios}) => {
            return {
                id,
                codigo,
                diagnostico,
                precio,
                comentarios
            }
        }),
        [arreglosVentaServicios]
    );

    const setRepuestos = (repuestoClickeado) => {
        const verificar = (idRepuesto) => {
            const existRepuesto = arreglosVentaServicios?.repuestos?.find((repuesto) => repuesto.id === idRepuesto);
            if(existRepuesto)return true;
            return false;
        }

        if(!verificar(repuestoClickeado.id)){
            const repuestoData = selectedPresupuesto.repuestos?.find((repuesto) => repuesto.repuesto.id === repuestoClickeado.id);
            repuestoData.repuesto.diagnostico = repuestoData.diagnostico;
            repuestoData.repuesto.cantidad = repuestoData.cantidad;
            repuestoData.repuesto.precio = repuestoData.precio;
            repuestoData.repuesto.comentarios = repuestoData.comentarios;
            const copy = structuredClone(arreglosVentaServicios.repuestos);
            copy.push(repuestoData.repuesto);

            setArreglosVentaServicios({...arreglosVentaServicios, repuestos: copy});
        }
    }

    const RepuestosShow = useMemo(
        () => arreglosVentaServicios?.repuestos?.map(({id, codigo, diagnostico, precio, comentarios, cantidad}) => {
            return {
                id,
                codigo,
                diagnostico,
                cantidad,
                precio,
                comentarios
            }
        }),
        [arreglosVentaServicios]
    );

    const setMateriales = (materialClickeado) => {
        const verificar = (idMaterial) => {
            const existMaterial = arreglosVentaServicios?.materiales?.find((material) => material.id === idMaterial);
            if(existMaterial)return true;
            return false;
        }

        if(!verificar(materialClickeado.id)){
            const materialData = selectedPresupuesto.materiales?.find((material) => material.material.id === materialClickeado.id);
            materialData.material.cantidad = materialData.cantidad;
            materialData.material.precio = materialData.precio;
            materialData.material.comentarios = materialData.comentarios;
            const copy = structuredClone(arreglosVentaServicios.materiales);
            copy.push(materialData.material);

            setArreglosVentaServicios({...arreglosVentaServicios, materiales: copy});
        }
    }

    const MaterialesShow = useMemo(
        () => arreglosVentaServicios?.materiales?.map(({id, codigo, cantidad, precio, comentarios}) => {
            return {
                id,
                codigo,
                cantidad,
                precio,
                comentarios
            }
        }),
        [arreglosVentaServicios]
    );

    const setTrabajos = (trabajoClickeado) => {
        const verificar = (idTrabajo) => {
            const existTrabajo = arreglosVentaServicios?.trabajosTerceros?.find((trabajo) => trabajo.id === idTrabajo);
            if(existTrabajo)return true;
            return false;
        }

        if(!verificar(trabajoClickeado.id)){
            const trabajoData = selectedPresupuesto.trabajosTerceros?.find((trabajo) => trabajo.trabajoTercero.id === trabajoClickeado.id);
            trabajoData.trabajoTercero.precio = trabajoData.precio;
            trabajoData.trabajoTercero.comentarios = trabajoData.comentarios;
            const copy = structuredClone(arreglosVentaServicios.trabajosTerceros);
            copy.push(trabajoData.trabajoTercero);

            setArreglosVentaServicios({...arreglosVentaServicios, trabajosTerceros: copy});
        }
    }

    const TrabajosShow = useMemo(
        () => arreglosVentaServicios?.trabajosTerceros?.map(({id, codigo, precio, comentarios}) => {
            return {
                id,
                codigo,
                precio,
                comentarios
            }
        }),
        [arreglosVentaServicios]
    );

    // FUNCTIONS

    const handleSearchClientes = async ({target}) => {
        const {data}  = await axiosRequest(
          "get",
          `/api/mantenimiento/clientes?empresaId=${empresaId}&filterName=${target.value}`
        );
        setClientesSearch(data?.data);
    }

    const getPresupuestos = async (usuario) => {
        const { data } = await axiosRequest(
            "get",
            `/api/venta-servicios/presupuesto?empresaId=${empresaId}&userId=${usuario.id}`
          );
          
          setArreglosRel({...arreglosRel, presupuestos: data?.data});
    }

    const deleteService = (original) => {
        const {id: idServicio} = original;
        const newServicios = arreglosVentaServicios.servicios.filter((servicio) => servicio.id !== idServicio);
        setArreglosVentaServicios({...arreglosVentaServicios, servicios: newServicios});
    }
    const deleteRepuesto = (original) => {
        const {id: idRepuesto} = original;
        const newRepuestos = arreglosVentaServicios.repuestos.filter((repuesto) => repuesto.id !== idRepuesto);
        setArreglosVentaServicios({...arreglosVentaServicios, repuestos: newRepuestos});
    }

    const deleteMaterial = (original) => {
        const {id: idMaterial} = original;
        const newMateriales = arreglosVentaServicios.materiales.filter((material) => material.id !== idMaterial);
        setArreglosVentaServicios({...arreglosVentaServicios, materiales: newMateriales});
    }

    const deleteTrabajoTerceros = (original) => {
        const {id: idTrabajo} = original;
        const newTrabajos = arreglosVentaServicios.trabajosTerceros.filter((trabajo) => trabajo.id !== idTrabajo);
        setArreglosVentaServicios({...arreglosVentaServicios, trabajosTerceros: newTrabajos});
    }

    const getDescuentoApi = async () => {
        const {data} = await axiosRequest(
          "get",
          `/api/mantenimiento/parametro-descuento?empresaId=${empresaId}`
        );
        setDescuentosLimites(data?.data);
    }
    
    const getIgvApi = async () => {
        const { data } = await axiosRequest(
            "get",
            `/api/mantenimiento/parametros?empresaId=${empresaId}`
        );
        for(const obj of data?.data){
            if(obj.nombre === "IGV" || obj.nombre === "igv" || obj.nombre === "Igv"){
            setIgv(obj)
            return;
            }
        }
        const obj = {valor:18};
        setIgv(obj);
    }

    const handleDescuentoInput = (e) => {
        if( (Number(e.target.value)) >= Number(descuentosLimites?.de) &&  (Number(e.target.value)) <= Number(descuentosLimites?.a)){
          setForm({...form, descuento: Number(e.target.value)});
        } else if ( (Number(e.target.value)) < Number(descuentosLimites?.de) ) {
          setForm({...form, descuento: Number(descuentosLimites?.de)});
        } else {
          setForm({...form, descuento: Number(descuentosLimites?.a)});
        }
    }

    useEffect(() => {
        if(arreglosVentaServicios.servicios?.length > 0){
            let subtotalServiciosTemp = 0;
            for(const servicio of arreglosVentaServicios.servicios){
                const valor = Number(servicio.precio);
                subtotalServiciosTemp += valor;
            }
            setForm({...form, subtotalValorServicio: subtotalServiciosTemp});
        }
    }, [arreglosVentaServicios.servicios])

    useEffect(() => {
        if(arreglosVentaServicios.repuestos?.length > 0){
            let subtotalRepuestosTemp = 0;
            for(const repuesto of arreglosVentaServicios.repuestos){
                const valor = Number(repuesto.precio);
                const cantidad = Number(repuesto.cantidad);
                subtotalRepuestosTemp += valor * cantidad;
            }
            setForm({...form, subtotalRepuestos: subtotalRepuestosTemp});
        }
    }, [arreglosVentaServicios.repuestos])
    
    useEffect(() => {
        if(arreglosVentaServicios.materiales?.length > 0){
            let subtotalTemp = 0;
            for(const material of arreglosVentaServicios.materiales){
                const valor = Number(material.precio);
                const cantidad = Number(material.cantidad);
                subtotalTemp += valor * cantidad;
            }
            setForm({...form, subtotalMateriales: subtotalTemp});
        }
    }, [arreglosVentaServicios.materiales])

    useEffect(() => {
        if(arreglosVentaServicios.trabajosTerceros?.length > 0){
            let subtotalTemp = 0;
            for(const trabajo of arreglosVentaServicios.trabajosTerceros){
                const valor = Number(trabajo.precio);
                subtotalTemp += valor;
            }
            setForm({...form, subtotalTrabajoTerceros: subtotalTemp});
        }
    }, [arreglosVentaServicios.trabajosTerceros])
    
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
    // }, [form.descuento, form.igv])

    useEffect(() => {
        if(form.descuento >= 0){
          const subtotalServiciosTemp = Number(form.subtotalServiciosTemp) || 0;
          const subtotalRepuestosTemp = Number(form.subtotalRepuestos) || 0;
          const subtotalMaterialesTemp = Number(form.subtotalMateriales) || 0;
          const subtotalTrabajosTemp = Number(form.subtotalTrabajoTerceros) || 0;
          const descuentoTemp = Number(form.descuento) || 0;
          const igvTemp = igv?.valor || 0;
          let totalPresupuesto = subtotalServiciosTemp + subtotalRepuestosTemp + subtotalMaterialesTemp + subtotalTrabajosTemp;
          totalPresupuesto -= (totalPresupuesto * descuentoTemp)/100;
          const totalIgv = (totalPresupuesto * igvTemp) / 100;
          totalPresupuesto += totalPresupuesto + totalIgv;
          setForm({...form, igv:totalIgv, totalPresupuesto});
        }
      }, [form.descuento])

    useEffect(() => {
      console.log(form);
    }, [form])

    // useEffect(() => {
    //   console.log(arreglosVentaServicios.servicios);
    //   console.log(arreglosVentaServicios.repuestos);
    //   console.log(arreglosVentaServicios.materiales);
    //   console.log(arreglosVentaServicios.trabajosTerceros);
    // }, [arreglosVentaServicios]);
    
    
    return (
        <>
            <Container whiteColor={true}>
                <Title text={"Orden de Trabajo"}>
                    <ButtonAdd text={"Nueva Orden de Trabajo"} onClick={() => openModal(false)}/>
                </Title>
                <TableComplete
                    columns={columns}
                    data={ordenesShow}
                    openModal={openModal}
                    setIsOpenModalDelete={setIsOpenModalDelete}
                />
            </Container>

            <ModalLg
                title={isEdit ? "Editar Orden de Trabajo" : "Nueva Orden de Trabajo"}
                isOpen={isOpenModal}
                closeModal={closeModal}
            >
                <form onSubmit={(e)=>e.preventDefault()} className="flex flex-col gap-5">
                    <GroupIntern title={""}>
                        <GroupInputsIntern title={"Clientes"}>
                            <Search
                                // onFocus={() => setIsOpenSearchCliente(true)}
                                onChange={e => handleSearchClientes(e)}
                            />
                            <Dropdown isOpen={true} elements={clientesSearch.length}>
                                {clientesSearch?.map((cliente) => {
                                return (
                                    <DropdownItem
                                    handleClick={() => {
                                        console.log(isOpenSearchCliente);
                                        setSelectedCliente(cliente);
                                        setForm({...form, clienteId: cliente.id});
                                        setIsOpenSearchCliente(false);
                                    }}
                                    key={cliente.id}
                                    name={`Cliente: ${cliente.nombre} - ${cliente.tipoDocumento}: ${cliente.numeroDocumento} - ${cliente.codigo}`}
                                    />
                                )
                                })}
                            </Dropdown>
                            <TableForSelections columns={columnsClientes} data={ clientesShow ||[]} customFunction={getPresupuestos}/>
                        </GroupInputsIntern>

                        <GroupInputsIntern title={"Presupuestos"}>
                            <TableForSelections columns={columnsPresupuestos} data={presupuestosShow || []} customFunction={setCodigos}/>
                        </GroupInputsIntern>
                    </GroupIntern>

                    <Group title={"Códigos del presupuesto"}>
                        <div className="flex w-full overflow-y-auto sticky -top-8 h-auto py-4 z-30 bg-white gap-3">
                            <div className='cursor-pointer w-1/4 items-center p-2 text-base font-normal shadow-md rounded-t-lg text-primary border text-center bg-primary-200'
                                onClick={() => setStateModal("Servicio")}
                            >
                                Detalle Servicio
                            </div>
                            <div className='cursor-pointer w-1/4 items-center p-2 text-base font-normal shadow-md rounded-t-lg text-primary border text-center bg-primary-200'
                                onClick={() => setStateModal("Repuesto")}
                            >
                                Detalle Repuesto
                            </div>
                            <div className='cursor-pointer w-1/4 items-center p-2 text-base font-normal shadow-md rounded-t-lg text-primary border text-center bg-primary-200'
                                onClick={() => setStateModal("Materiales")}
                            >
                                Materiales
                            </div>
                            <div className='cursor-pointer w-1/4 items-center p-2 text-base font-normal shadow-md rounded-t-lg text-primary border text-center bg-primary-200'
                                onClick={() => setStateModal("Terceros")}
                            >
                                Trabajos Terceros
                            </div>                            
                        </div>

                        {stateModal === "Servicio" && <>
                            <TableForSelections columns={columnsCodigosServicios} data={codigosServiciosShow || []} customFunction={setServicios} />
                        </>}

                        {stateModal === "Repuesto" && <>
                            <TableForSelections columns={columnsCodigosRepuestos} data={codigosRepuestosShow || []} customFunction={setRepuestos} />
                        </>}

                        {stateModal === "Materiales" && <>
                            <TableForSelections columns={columnsCodigosMateriales} data={codigosMaterialessShow || []} customFunction={setMateriales} />
                        </>}

                        {stateModal === "Terceros" && <>
                            <TableForSelections columns={columnsCodigosTrabajos} data={codigosTrabajosShow || []} customFunction={setTrabajos} />
                        </>}
                    </Group>

                    <Group title={""}>
                        <Group title={"Servicios"}>
                            <TableForSelections columns={columnsServicios} data={ServiciosShow || []} canDelete={true} functionDelete={deleteService}/>
                        </Group>
                        <Group title={"Repuestos"}>
                            <TableForSelections columns={columnsRepuestos} data={RepuestosShow || []} canDelete={true} functionDelete={deleteRepuesto}/>
                        </Group>
                        <Group title={"Materiales"}>
                            <TableForSelections columns={columnsMateriales} data={MaterialesShow || []} canDelete={true} functionDelete={deleteMaterial}/>
                        </Group>
                        <Group title={"Trabajos Terceros"}>
                            <TableForSelections columns={columnsTrabajos} data={TrabajosShow || []} canDelete={true} functionDelete={deleteTrabajoTerceros}/>
                        </Group>
                    </Group>

                    <Group title={""}>
                        <Divider/>
                        <GroupInputs>
                            <div className="flex flex-row justify-end items-center w-full gap-2">
                                <div className="flex justify-center items-center">
                                    <span className="font-semibold">Subtotal valor servicios soles</span>
                                </div>
                                <div>
                                    <Input disabled value={form.subtotalValorServicio}/>
                                </div>
                            </div>
                        </GroupInputs>
                        <GroupInputs>
                            <div className="flex flex-row justify-end items-center w-full gap-2">
                                <div className="flex justify-center items-center">
                                    <span className="font-semibold">Subtotal valor repuestos soles</span>
                                </div>
                                <div>
                                    <Input disabled value={form.subtotalRepuestos}/>
                                </div>
                            </div>
                        </GroupInputs>
                        <GroupInputs>
                            <div className="flex flex-row justify-end items-center w-full gap-2">
                                <div className="flex justify-center items-center">
                                    <span className="font-semibold">Subtotal valor materiales soles</span>
                                </div>
                                <div>
                                    <Input disabled value={form.subtotalMateriales}/>
                                </div>
                            </div>
                        </GroupInputs>
                        <GroupInputs>
                            <div className="flex flex-row justify-end items-center w-full gap-2">
                                <div className="flex justify-center items-center">
                                    <span className="font-semibold">Subtotal valor trabajo terceros soles</span>
                                </div>
                                <div>
                                    <Input disabled value={form.subtotalTrabajoTerceros}/>
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
                                <Input label="descuento" value={form.descuento}
                                    disabled = {arreglosVentaServicios.servicios?.length === 0}
                                    onChange = {e => handleDescuentoInput(e) }
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
                                <Input label="IGV" 
                                    value={form.igv}
                                    onChange={e=>setForm({...form, igv: Number(e.target.value)})}
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
                                    <Input disabled value={form.totalPresupuesto}/>
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
                title={"Eliminar Orden de Trabajo"}
                isOpen={isOpenModalDelete}
                closeModal={() => setIsOpenModalDelete(false)}
            />
        </>
    )

}