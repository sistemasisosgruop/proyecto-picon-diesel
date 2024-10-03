import { useMemo, useEffect, useState, useContext } from "react";

import { FormContext } from "../../../contexts/form.context";
import { MaterialesContext } from "../../../contexts/materiales.context";
import { VentaServiciosContext } from "../../../contexts/venta-servicios.context";

import { ButtonAdd, ButtonSave, ButtonCancel } from "../../../app/components/elements/Buttons";
import { Container } from "../../../app/components/elements/Containers";
import { Title } from "../../../app/components/elements/Title";
import { Divider } from "../../../app/components/elements/Divider";
import { ModalConfirmDelete, ModalLg } from "../../../app/components/modules/Modal";
import { Group, GroupInputs, GroupInputsIntern, GroupIntern } from "../../../app/components/elements/Form";
import { Input, Option, Select, Textarea } from "@material-tailwind/react";
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
import TableMaterialesForm from "../../../app/components/modules/TableMaterialesForm";

import { useLocalStorage } from "../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../app/utils/axios-request";
import { useQuery } from "react-query";
import { BombaInyeccionInputs } from "../../../app/components/modules/BombaInyeccionInputs";
import { InyectorElectronicoInputs } from "../../../app/components/modules/InyectorElectronicoInputs";
import { InyectorConvencional } from "../../../app/components/modules/InyectorConvencional";


const schema = yup.object().shape({
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
    informacionCliente: yup.string().required(),
    conclusiones: yup.string().required(),
    materiales: yup.array().nullable(),
    servicios: yup.array().nullable()
})

const updateSchema = yup.object().shape({
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
    informacionCliente: yup.string().required(),
    conclusiones: yup.string().required(),
    materiales: yup.array().nullable(),
    servicios: yup.array().nullable()
})

const initialStateForm = {
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
    informacionCliente: null,
    conclusiones: null,
    materiales: null,
    servicios: null
}

const initialStateBombaInyeccionInputs = {
    minimoRpm: {
        rpmTabla: "",
        rangoTabla: "",
        evalInicial: "",
        resFinal: ""
    },
    cArranque: {
        rpmTabla: "",
        rangoTabla: "",
        evalInicial: "",
        resFinal: ""
    },
    caudalMaximoCon: {
        rpmTabla: "",
        rangoTabla: {
            rangoTabla1: "",
            rangoTabla2: "",
            rangoTabla3: "",
        },
        evalInicial: {
            evalInicial1: "",
            evalInicial2: "",
            evalInicial3: "",
        },
        resFinal: {
            resFinal1: "",
            resFinal2: "",
            resFinal3: ""
        }
    },
    caudalMaximoSin: {
        rpmTabla: "",
        rangoTabla: {
            rangoTabla1: "",
            rangoTabla2: "",
            rangoTabla3: "",
        },
        evalInicial: {
            evalInicial1: "",
            evalInicial2: "",
            evalInicial3: "",
        },
        resFinal: {
            resFinal1: "",
            resFinal2: "",
            resFinal3: ""
        }
    },
    presionBomba: {
        rpmTabla: "",
        rangoTabla: {
            rangoTabla1: "",
            rangoTabla2: "",
            rangoTabla3: "",
        },
        evalInicial: {
            evalInicial1: "",
            evalInicial2: "",
            evalInicial3: "",
        },
        resFinal: {
            resFinal1: "",
            resFinal2: "",
            resFinal3: ""
        }
    },
    RecorridoVariador: {
        rpmTabla: "",
        rangoTabla: {
            rangoTabla1: "",
            rangoTabla2: "",
            rangoTabla3: "",
        },
        evalInicial: {
            evalInicial1: "",
            evalInicial2: "",
            evalInicial3: "",
        },
        resFinal: {
            resFinal1: "",
            resFinal2: "",
            resFinal3: ""
        }
    },
    corteMin: {
        rpmTabla: "",
        rangoTabla: "",
        evalInicial: "",
        resFinal: ""
    },
    corteMax: {
        rpmTabla: "",
        rangoTabla: "",
        evalInicial: "",
        resFinal: ""
    }
}

const initialStateInyectorElectronicoInputs = {
    backflow: {
        inyector1: "",
        inyector2: "",
        inyector3: "",
        inyector4: "",
        inyector5: "",
        inyector6: ""
    },
    backflow2: {
        inyector1: "",
        inyector2: "",
        inyector3: "",
        inyector4: "",
        inyector5: "",
        inyector6: ""
    },
    maximumValue: {
        inyector1: "",
        inyector2: "",
        inyector3: "",
        inyector4: "",
        inyector5: "",
        inyector6: ""
    },
    mediumValue: {
        inyector1: "",
        inyector2: "",
        inyector3: "",
        inyector4: "",
        inyector5: "",
        inyector6: ""
    },
    lowspeed: {
        inyector1: "",
        inyector2: "",
        inyector3: "",
        inyector4: "",
        inyector5: "",
        inyector6: ""
    },
    preinjection: {
        inyector1: "",
        inyector2: "",
        inyector3: "",
        inyector4: "",
        inyector5: "",
        inyector6: ""
    }
}

const initialStateInyectorConvencional = {
    backflow: {
        eval: {
            inyector1: "",
            inyector2: "",
            inyector3: "",
            inyector4: "",
            inyector5: "",
            inyector6: ""
        },
        res: {
            inyector1: "",
            inyector2: "",
            inyector3: "",
            inyector4: "",
            inyector5: "",
            inyector6: ""
        }            
    },
    pulverizado: {
        eval: {
            inyector1: "",
            inyector2: "",
            inyector3: "",
            inyector4: "",
            inyector5: "",
            inyector6: ""
        },
        res: {
            inyector1: "",
            inyector2: "",
            inyector3: "",
            inyector4: "",
            inyector5: "",
            inyector6: ""
        }
    },
    goteo: {
        eval: {
            inyector1: "",
            inyector2: "",
            inyector3: "",
            inyector4: "",
            inyector5: "",
            inyector6: ""
        },
        res: {
            inyector1: "",
            inyector2: "",
            inyector3: "",
            inyector4: "",
            inyector5: "",
            inyector6: ""
        }         
    },
    caida: {
        eval: {
            inyector1: "",
            inyector2: "",
            inyector3: "",
            inyector4: "",
            inyector5: "",
            inyector6: ""
        },
        res: {
            inyector1: "",
            inyector2: "",
            inyector3: "",
            inyector4: "",
            inyector5: "",
            inyector6: ""
        }
    }
}

export default function RecepcionEvaluacion() {

    const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
    const { changeData, elementId, updateForm } = useContext(FormContext);
    const { selectedMateriales, setSelectedMateriales} = useContext(MaterialesContext);
    const { arreglosVentaServicios, setArreglosVentaServicios } = useContext(VentaServiciosContext);

    const [empresaId] = useLocalStorage("empresaId");

    const [clientesSearch, setClientesSearch] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [fabricasMaquinas, setFabricasMaquinas] = useState([]);
    const [modelosMaquinas, setModelosMaquinas] = useState([]);
    const [nombresMaquinas, setNombresMaquinas] = useState([]);
    const [paises, setPaises] = useState([]);
    const [marcasFabricas, setMarcasFabricas] = useState([]);
    const [tipoResponsable, setTipoResponsable] = useState("");
    const [responsables, setResponsables] = useState([]);
    const [serviciosSearch, setServiciosSearch] = useState([]);

    const [stateModal, setStateModal] = useState("Recepcion")
    const [isOpenSearchCliente, setIsOpenSearchCliente] = useState(false);
    const [isOpenSearchServicios, setIsOpenSearchServicios] = useState(false);

    const [bombaInyeccionInputs, setBombaInyeccionInputs] = useState(initialStateBombaInyeccionInputs);

    const [inyectorElectronicoInputs, setInyectorElectronicoInputs] = useState(initialStateInyectorElectronicoInputs);

    const [inyectorConvencional, setInyectorConvencional] = useState(initialStateInyectorConvencional);    

    const [form, setForm] = useState(initialStateForm)

    useEffect(() => {
      setForm(initialStateForm);
      // set otros
      refetch();
      setSelectedMateriales({materiales:[]});
      setArreglosVentaServicios({
        servicios:[],
        repuestos: [],
        trabajosTerceros: []
      })
      setBombaInyeccionInputs(initialStateBombaInyeccionInputs);
      setInyectorElectronicoInputs(initialStateInyectorElectronicoInputs);
      setInyectorConvencional(initialStateInyectorConvencional);
      
    }, [changeData])

    useEffect(() => {
        setSelectedMateriales({materiales:[]});
        getFabricasMaquinas();
        getModelosMaquinas();
        getNombresMaquinas();
        getPaises();
        getMarcasFabricaSistemasInyeccion();
    }, [])
    
    
    // updateform

    useEffect(() => {
        // console.log(hojasResponse);
        const currentTemp = hojasResponse?.data.find((item) => item.id === updateForm?.id);
        const current = {...currentTemp};
        const updateSelectedMateriales = current?.materiales?.map( (material) => {
            const rMaterial = material.material;
            rMaterial.cantidad = material.cantidad;
            rMaterial.diagnostico = material.diagnostico;
            rMaterial.observaciones = material.observaciones;
            return rMaterial;
        });
        const updateServicios = current?.servicios?.map((servicio) => {
            const rServicio = servicio.servicio;
            return rServicio;
        });

        if(isEdit){
            setSelectedCliente(current?.cliente);
            setTipoResponsable(current?.personalId ? "personal" : "vendedores");
            setBombaInyeccionInputs(current?.bombaInyeccionJSON);
            setInyectorElectronicoInputs(current?.inyectorElectronicoJSON);
            setInyectorConvencional(current?.inyectorConvencionalJSON);
            setForm({
                ...current
            })
            setSelectedMateriales({...selectedMateriales, materiales: updateSelectedMateriales});
            setArreglosVentaServicios({...arreglosVentaServicios, servicios: updateServicios});
        }

    }, [updateForm])
    

    // CRUD

    const createRegistro = async () => {
        await schema.validate({
            ...form,
            materiales: selectedMateriales,
            servicios: arreglosVentaServicios.servicios
        }, {abortEarly: false});
        await axiosRequest(
            "post",
            `/api/venta-servicios/hoja-recepcion`,
            {
                ...form,
                materiales: selectedMateriales.materiales,
                servicios: arreglosVentaServicios.servicios,
                bombaInyeccionJSON: bombaInyeccionInputs,
                inyectorElectronicoJSON: inyectorElectronicoInputs,
                inyectorConvencionalJSON: inyectorConvencional,
                empresaId: parseInt(empresaId),
                sucursalId: 1
            }
        )
        toast.success(`Registro guardado exitosamente!`, successProps);
    }

    const updateRegistro = async () => {
        await updateSchema.validate({
            ...form,
            materiales: selectedMateriales,
            servicios: arreglosVentaServicios.servicios
        }, {abortEarly: false});
        try {
            await axiosRequest(
                "put",
                `/api/venta-servicios/hoja-recepcion/${elementId}`,
                {
                    ...form,
                    materiales: selectedMateriales.materiales,
                    servicios: arreglosVentaServicios.servicios,
                    bombaInyeccionJSON: bombaInyeccionInputs,
                    inyectorElectronicoJSON: inyectorElectronicoInputs,
                    inyectorConvencionalJSON: inyectorConvencional,
                    cliente: undefined,
                    empresaId: parseInt(empresaId),
                    sucursalId: 1
                }
            )
            toast.success(`Registro actualizado exitosamente!`, successProps);            
        } catch (error) {
            toast.error(<ToastAlert error={error} />, errorProps);            
        }
    }

    const deleteRegistro = async () => {
        try {
          await axiosRequest(
            "delete",
            `/api/venta-servicios/hoja-recepcion/${elementId}`
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
            setSelectedMateriales({materiales:[]});
            setSelectedCliente(null);
            setArreglosVentaServicios({...arreglosVentaServicios, servicios:[]});
            refetch() 
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
          { Header: "Hoja Recepción", accessor: "hojaRecepcion" },
          { Header: "Denominación", accessor: "denominacion" },
          { Header: "Tipo de Reparación", accessor: "tipoReparacion" },
          { Header: "Correo", accessor: "email" },
        ],
        []
      );


    const columnsComponentesRecepcion = useMemo(
        () => [
            { Header: "#", accessor: "id"},
            { Header: "Componente", accessor:"material" },
            { Header: "Cantidad", accessor: "cantidad", Cell: (row, original) => {

                const [cantidadTempEdit, setCantidadTempEdit] = useState(!row.cell.value ? "0" : row.cell.value);
                const handleCantidadEdit = (e) => {
                  const newValue = e.target.value;
                  if (/^\d+$/.test(newValue) || newValue === "") {
                    for(const material of selectedMateriales.materiales){
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
                      const currentMateriales = structuredClone(selectedMateriales.materiales);
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
        
                      setSelectedMateriales(prev => ({
                        ...prev,
                        materiales: nuevo
                      }))
                    }}
                  />
                )
            }},
            { Header: "Observaciones", accessor: "observaciones", Cell: (row, original) => {

                const [observacionesEdit, setObservacionesEdit] = useState(!row.cell.value ? "" : row.cell.value);

                const handleObservacionesEdit = (e) => setObservacionesEdit(e.target.value);
        
                return (
                  <input
                    className="w-36 border-2 border-gray-200"
                    type="text"
                    key={row.row.values.id}
                    value={observacionesEdit}
                    onChange={e => handleObservacionesEdit(e) }
                    onBlur={(e)=>{
                      const currentMateriales = structuredClone(selectedMateriales.materiales);
                      const nuevo = currentMateriales.map((material) => {
                        if(material.id === row.cell.row.original.id){
                            material.observaciones = e.target.value;
                        }
                        return material;
                      });
        
                      setSelectedMateriales(prev => ({
                        ...prev,
                        materiales: nuevo
                      }))
                    }}
                  />
                )
              }}
        ],
        [selectedMateriales]
    );

    const columnsServiciosRecepcion = useMemo(
        () => [
            { Header: "#", accessor: "id"},
            { Header: "Descripción", accessor: "descripcion"}
        ],
        []
    );

    const columnsRepuestosEvaluacion = useMemo(
        () => [
            { Header: "#", accessor: "id"},
            { Header: "Componente", accessor:"material" },
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
                      const currentMateriales = structuredClone(selectedMateriales.materiales);
                      const nuevo = currentMateriales.map((material) => {
                        if(material.id === row.cell.row.original.id){
                            material.diagnostico = e.target.value;
                        }
                        return material;
                      });
        
                      setSelectedMateriales(prev => ({
                        ...prev,
                        materiales: nuevo
                      }))
                    }}
                  />
                )
              }},
            { Header: "Observaciones", accessor: "observaciones", Cell: (row, original) => {

                const [observacionesEdit, setObservacionesEdit] = useState(!row.cell.value ? "" : row.cell.value);

                const handleObservacionesEdit = (e) => setObservacionesEdit(e.target.value);
        
                return (
                  <input
                    className="w-36 border-2 border-gray-200"
                    type="text"
                    key={row.row.values.id}
                    value={observacionesEdit}
                    onChange={e => handleObservacionesEdit(e) }
                    onBlur={(e)=>{
                      const currentMateriales = structuredClone(selectedMateriales.materiales);
                      const nuevo = currentMateriales.map((material) => {
                        if(material.id === row.cell.row.original.id){
                            material.observaciones = e.target.value;
                        }
                        return material;
                      });
        
                      setSelectedMateriales(prev => ({
                        ...prev,
                        materiales: nuevo
                      }))
                    }}
                  />
                )
            }}
        ],
        [selectedMateriales]
    );

    // Body

    const getHojasRecepcion = async () => {
        const { data } = await axiosRequest(
            "get",
            `/api/venta-servicios/hoja-recepcion?empresaId=${empresaId}`
        );
        return data;
    }

    const { data: hojasResponse, refetch } = useQuery("hojasRecepcion", getHojasRecepcion, {
        initialData: {
            data: []
        }
    })
    
    const hojasRecepcionShow = useMemo(
        () => hojasResponse?.data.map(({id, cliente, codigo, denominacion, tipoReparacion}) => ({
            id,
            razonSocial: cliente?.numeroDocumento,
            nombreCliente: cliente?.nombre,
            hojaRecepcion: codigo,
            denominacion,
            tipoReparacion,
            email: cliente?.email
        })),
        [hojasResponse?.data]
    )

    const componentesShow = useMemo(
        () => selectedMateriales.materiales?.map(({id, codigo, cantidad, observaciones}) => ({
            id,
            material: codigo,
            cantidad: !cantidad ? "0" : cantidad,
            observaciones: !observaciones ? "": observaciones
        })),
        [selectedMateriales]
    )

    const serviciosShow = useMemo(
        () => arreglosVentaServicios.servicios?.map(({id, definicion}) => ({
            id,
            descripcion: definicion
        })),
        [arreglosVentaServicios]
    )

    const repuestosShow = useMemo(
        () => selectedMateriales.materiales?.map(({id, codigo, diagnostico = undefined, observaciones}) => ({
            id,
            material: codigo,
            diagnostico: diagnostico === undefined ? "" : diagnostico,
            observaciones
        })),
        [selectedMateriales]
    )

    // useEffect(() => {
    //     console.log(selectedMateriales?.materiales);
    // }, [selectedMateriales])
    

    // Functions
    
    const handleDenominacion = (e) => setForm({...form, denominacion: e.target.value});

    const handleTipoReparacion = (e) => setForm({...form, tipoReparacion: e.target.value});

    const handleSearchClientes = async ({target}) => {
        const {data}  = await axiosRequest(
          "get",
          `/api/mantenimiento/clientes?empresaId=${empresaId}&filterName=${target.value}`
        );
        setClientesSearch(data?.data);
    }

    const getFabricasMaquinas = async () => {
        const { data } = await axiosRequest(
            "get",
            `/api/mantenimiento/maestro-de-codigos/configuracion/fabrica?empresaId=${empresaId}`
        );
        setFabricasMaquinas(data?.data);
    }

    const getModelosMaquinas = async () => {
        const { data } = await axiosRequest(
            "get",
            `/api/mantenimiento/maestro-de-codigos/configuracion/modelo?empresaId=${empresaId}`
        );
        setModelosMaquinas(data?.data);
    }

    const getNombresMaquinas = async () => {
        const { data } = await axiosRequest(
            "get",
            `/api/mantenimiento/maestro-de-codigos/configuracion/nombre?empresaId=${empresaId}`
        );
        setNombresMaquinas(data?.data);
    }
    const getPaises = async () => {
        const { data } = await axiosRequest(
            "get",
            `/api/mantenimiento/paises?empresaId=${empresaId}`
        );
        setPaises(data?.data);
    }

    const getMarcasFabricaSistemasInyeccion = async () => {
        const { data } = await axiosRequest(
            "get",
            `/api/mantenimiento/maestro-de-codigos/configuracion/marca-fabrica-sistema-inyeccion?empresaId=${empresaId}`
        );
        setMarcasFabricas(data?.data);
    }

    const handleFabricaMaquina = (e) => {
        setForm({...form, fabricaMaquinaId: e.id})
    }

    const handleModeloMaquina = (e) => {
        setForm({...form, modeloMaquinaId: e.id});
    }

    const handleNombreMaquina = (e) => {
        setForm({...form, nombreMaquinaId: e.id})
    }

    const handlePais = (e) => {
        setForm({...form, paisId: e.id})
    }

    const handleCodigoMotorOriginal = (e) => setForm({...form, codigoMotorOriginal: e.target.value})

    const handleSerieMotor = (e) => setForm({...form, serieMotor: e.target.value});

    const handleSerieChasis = (e) => setForm({...form, serieChasis: e.target.value});

    const getResponsables = async () => {
        const { data } = await axiosRequest(
          "get",
          `/api/mantenimiento/${tipoResponsable}?empresaId=${empresaId}`
        )
        setResponsables(data?.data);
    }
      
    useEffect(() => {
    if(tipoResponsable.length > 0) getResponsables();
    }, [tipoResponsable])

    const handleResponsable = (e) => {
        if(tipoResponsable === "vendedores"){
          setForm({...form, vendedorId: e.id, personalId:null })
        } else{
          setForm({...form, personalId: e.id, vendedorId: null })
        }
    }

    const handleCodigoBombaInyeccionOriginal = (e) => setForm({...form, codigoBombaInyeccionOriginal: e.target.value}) ;

    const handleCodigoBombaInyeccionFabricante = (e) => setForm({...form, codigoBombaInyeccionFabricante: e.target.value});

    const handleTipoBombaInyeccionFabricante = (e) => setForm({...form, tipoBombaInyeccionFabricante: e.target.value});

    const handleMarcaFabricanteSistemaInyeccion = (e) => {
        setForm({...form, marcaFabricaSistemaInyeccionId: e.id});
    }

    const handleCodigoOriginalBombaInyeccion = (e) => setForm({...form, codigoOriginalBombaInyeccion: e.target.value});

    const handleNombreBombaInyeccion = (e) => setForm({...form, nombreBombaInyeccion: e.target.value});

    const handleSerieBombaInyeccion = (e) => setForm({...form, serieBombaInyeccion: e.target.value});

    const handleCodigoInyectorOriginal = (e) => setForm({...form, codigoInyectorOriginal: e.target.value});

    const handleCodigoInyectorFabricante = (e) => setForm({...form, codigoInyectorFabricante: e.target.value});

    const handleTipoFabricaInyector = (e) => setForm({...form, tipoFabricanteInyector: e.target.value});

    const handleCodigoOriginalInyector = (e) => setForm({...form, codigoOriginalInyector: e.target.value});

    const handleSearchServicio = async ({target}) => {
        const {data} = await axiosRequest(
            "get",
            `/api//mantenimiento/presupuesto/servicios?empresaId=${empresaId}&filterName=${target.value}`
        );
        setServiciosSearch(data?.data);
    }

    const deleteService = (original) => {
        const {id: idServicio} = original;
        const newServicios = arreglosVentaServicios.servicios.filter((servicio) => servicio.id !== idServicio);
        setArreglosVentaServicios({...arreglosVentaServicios, servicios: newServicios});
    }

    // useEffect(() => {
    //   console.log(form);
    // }, [form])

    // useEffect(() => {
    //   console.log(selectedMateriales);
    //   console.log(arreglosVentaServicios.servicios);
    // }, [selectedMateriales, arreglosVentaServicios])
    
    


    return (
        <>
            <Container whiteColor={true}>
                <Title text={"Hojas de Recepción"}>
                    <ButtonAdd text={"Nueva Hoja de Recepción"} onClick={() => openModal(false)}/>
                </Title>
                <TableComplete
                    columns={columns}
                    data={hojasRecepcionShow}
                    openModal={openModal}
                    setIsOpenModalDelete={setIsOpenModalDelete}
                />
            </Container>

            <ModalLg
                title={isEdit ? "Editar Hoja de Recepción" : "Nueva Hoja de Recepción"}
                isOpen={isOpenModal}
                closeModal={closeModal}
            >
                <form onSubmit={(e)=>e.preventDefault()} className="flex flex-col gap-5">
                    <Group title={"Información General"}>
                        <GroupInputs>
                            <Input
                                label={"Denominación"}
                                value={form?.denominacion}
                                onChange={(e)=>handleDenominacion(e)}
                            />
                            <Input
                                label={"Tipo de reparación"}
                                value={form?.tipoReparacion }
                                onChange={(e)=>handleTipoReparacion (e)}
                            />
                        </GroupInputs>
                    </Group>

                    <GroupIntern title={""}>
                        <GroupInputsIntern title={"Clientes"}>
                            <Search
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
                            </Dropdown>

                            <Input
                                label={"Nombre"}
                                value={selectedCliente?.nombre}
                                disabled
                            />
                            <Input
                                label={"Teléfono"}
                                value={selectedCliente?.telefono}
                                disabled
                            />
                            <Input
                                label={"Correo"}
                                value={selectedCliente?.email}
                                disabled
                            />
                            <Input
                                label={"Dirección"}
                                disabled
                            />
                        </GroupInputsIntern>

                        <GroupInputsIntern title={"Máquina"}>
                            <Select 
                                label="Modelo máquina"
                                value = {isEdit ? form?.modeloMaquinaId : undefined}
                                onChange = { (e) => handleModeloMaquina(e)}
                            >
                                {modelosMaquinas?.map( (modelo) => {
                                    return (
                                        <Option key={modelo.id} value={modelo}>
                                            {`Código: ${modelo.codigo} - Modelo: ${modelo.modelo}`}
                                        </Option>
                                    )
                                })}
                            </Select>

                            <Select 
                                label="Fábrica máquina"
                                value = {isEdit ? form?.fabricaMaquinaId : undefined}
                                onChange = { (e) => handleFabricaMaquina(e)}
                            >
                                {fabricasMaquinas?.map( (fabrica) => {
                                    return (
                                        <Option key={fabrica.id} value={fabrica}>
                                            {`Código: ${fabrica.codigo} - Modelo: ${fabrica.fabrica}`}
                                        </Option>
                                    )
                                })}
                            </Select>

                            <Select 
                                label="Nombre máquina"
                                value = {isEdit ? form?.nombreMaquinaId : undefined}
                                onChange = { (e) => handleNombreMaquina(e)}
                            >
                                {nombresMaquinas?.map( (nombre) => {
                                    return (
                                        <Option key={nombre.id} value={nombre}>
                                            {`Código: ${nombre.codigo} - Modelo: ${nombre.nombre}`}
                                        </Option>
                                    )
                                })}
                            </Select>

                            <Select 
                                label="Procedencia"
                                value = {isEdit ? form?.paisId : undefined}
                                onChange = { (e) => handlePais(e)}
                            >
                                {paises?.map( (pais) => {
                                    return (
                                        <Option key={pais.id} value={pais}>
                                            {`Código: ${pais.codigo} - Modelo: ${pais.nombre}`}
                                        </Option>
                                    )
                                })}
                            </Select>

                            <Input
                                label="Código motor original"
                                value={form?.codigoMotorOriginal}
                                onChange={e=>handleCodigoMotorOriginal(e)}
                            />
                            <Input
                                label="Serie motor"
                                value={form?.serieMotor}
                                onChange={e=>handleSerieMotor(e)}
                            />
                            <Input
                                label="Serie chasis"
                                value={form?.serieChasis}
                                onChange={e=>handleSerieChasis(e)}
                            />
                        </GroupInputsIntern>
                    </GroupIntern>

                    <GroupIntern title={""}>
                        <GroupInputsIntern title={"Responsable"}>
                            <Select 
                                label="Tipo Responsable"
                                value={isEdit ? (form?.personalId ? "personal" : "vendedores"): undefined}
                                onChange={(e) => setTipoResponsable(String(e))}
                            >
                                <Option value={"vendedores"}>Vendedor</Option>
                                <Option value={"personal"}>Personal</Option>
                            </Select>

                            <Select 
                                label="Vendedor/Personal"
                                onChange={ (e) => handleResponsable(e) }
                                value={isEdit ? (form?.personalId || form?.vendedorId) : undefined}
                                disabled = {tipoResponsable.length === 0}
                            >
                                {responsables?.map( (responsable) => {
                                    return (
                                        <Option key={responsable.id} value={responsable}>
                                        {responsable.nombre}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </GroupInputsIntern>

                        <GroupInputsIntern title={"Bomba inyección"}>
                            <Input
                                label="Código bomba inyección original"
                                value={form?.codigoBombaInyeccionOriginal}
                                onChange={e=>handleCodigoBombaInyeccionOriginal(e)}
                                
                            />
                            <Input
                                label="Código bomba inyección fabricante"
                                className='text-clip overflow-hidden ...'
                                value={form?.codigoBombaInyeccionFabricante}
                                onChange={e=>handleCodigoBombaInyeccionFabricante(e)}
                            />
                            <Input
                                label="Tipo bomba inyección fabricante"
                                value={form?.tipoBombaInyeccionFabricante}
                                onChange={e=>handleTipoBombaInyeccionFabricante(e)}
                            />

                            <Select 
                                label="Marca fabricante"
                                value = {isEdit ? form?.marcaFabricaSistemaInyeccionId : undefined}
                                onChange = { (e) => handleMarcaFabricanteSistemaInyeccion(e)}
                            >
                                {marcasFabricas?.map( (marca) => {
                                    return (
                                        <Option key={marca.id} value={marca}>
                                            {`Código: ${marca.codigo} - Modelo: ${marca.marca}`}
                                        </Option>
                                    )
                                })}
                            </Select>

                            <Input
                                label="Código original bomba de inyección"
                                value={form?.codigoOriginalBombaInyeccion}
                                onChange={e=>handleCodigoOriginalBombaInyeccion(e)}
                            />
                            <Input
                                label="Nombre de bomba inyección"
                                value={form?.nombreBombaInyeccion}
                                onChange={e=>handleNombreBombaInyeccion(e)}
                            />
                            <Input
                                label="Serie de bomba de inyección"
                                value={form?.serieBombaInyeccion}
                                onChange={e=>handleSerieBombaInyeccion(e)}
                            />
                        </GroupInputsIntern>

                    </GroupIntern>
                    
                    <GroupInputsIntern title={"Código Equivalente"}>
                        <Input
                            label="Código inyector original"
                            value={form?.codigoInyectorOriginal}
                            onChange={e=>handleCodigoInyectorOriginal(e)}
                        />
                        <Input
                            label="Código inyector fabricante"
                            value={form?.codigoInyectorFabricante}
                            onChange={e=>handleCodigoInyectorFabricante(e)}
                        />
                        <Input
                            label="Tipo fábrica inyector"
                            value={form?.tipoFabricanteInyector}
                            onChange={e=>handleTipoFabricaInyector(e)}
                        />
                        <Input
                            label="Código original inyector"
                            value={form?.codigoOriginalInyector}
                            onChange={e=>handleCodigoOriginalInyector(e)}
                        />
                    </GroupInputsIntern>

                    <div className="flex w-full overflow-y-auto sticky -top-8 h-auto py-4 z-30 bg-white gap-3">
                        <div className='cursor-pointer w-[10rem] items-center p-2 text-base font-normal shadow-md rounded-t-lg text-primary border text-center bg-primary-200'
                            onClick={() => setStateModal("Recepcion")}
                        >
                            Recepción
                        </div>
                        <div className='cursor-pointer w-[10rem] items-center p-2 text-base font-normal shadow-md rounded-t-lg text-primary border text-center bg-primary-200'
                            onClick={() => setStateModal("Evaluacion")}
                        >
                            Evaluación
                        </div>
                        <div className='cursor-pointer w-[10rem] items-center p-2 text-base font-normal shadow-md rounded-t-lg text-primary border text-center bg-primary-200'
                            onClick={() => setStateModal("Historial")}
                        >
                            Historial
                        </div>
                    </div>

                    {/* RECEPCION */}
                    {stateModal === "Recepcion" && <>
                        <Group title={"Componentes"}>
                            <TableMaterialesForm columns={columnsComponentesRecepcion} data={componentesShow || []}/>

                        </Group>
                        <Group title={"Información del Cliente"}>
                            <Textarea 
                                label='Información del Cliente'
                                value={isEdit ? form?.informacionCliente : undefined}
                                onChange={e => setForm({...form, informacionCliente: e.target.value})}
                            />
                        </Group>

                        <Group title={"Trabajos a realizar"}>
                            <Search
                                onFocus={ () => setIsOpenSearchServicios(true)}
                                placeHolderText={"Buscar servicio"}
                                onChange = { e => handleSearchServicio(e)}
                            />
                            <Dropdown isOpen={isOpenSearchServicios} elements={serviciosSearch.length}>
                                {serviciosSearch?.map((servicio) => {
                                    return (
                                        <DropdownItem
                                            key={servicio.id}
                                            name={`Servicio ${servicio.codigo} - ${servicio.definicion}`}
                                            handleClick={() => {
                                                const currentServicios = structuredClone(arreglosVentaServicios.servicios);
                                                currentServicios.push(servicio);

                                                setArreglosVentaServicios({...arreglosVentaServicios, servicios: currentServicios })
                                                setIsOpenSearchServicios(false);
                                            }}
                                        />
                                    )
                                })}
                            </Dropdown>
                            <TableForSelections columns={columnsServiciosRecepcion} data={serviciosShow || []} canDelete={true} functionDelete={deleteService}/>
                            <Divider />
                        </Group>
                    </>}

                    {/* EVALUACION  */}

                    {stateModal === "Evaluacion" && <>
                        <div className="flex w-full overflow-y-auto sticky -top-8 h-auto py-4 z-30 bg-white gap-3">
                            <div className='cursor-pointer w-[13rem] items-center p-2 text-sm font-normal shadow-md rounded-lg text-primary border text-center bg-primary-200'
                                onClick={() => setStateModal("Evaluacion")}
                            >
                                Evaluación Componentes
                            </div>
                            <div className='cursor-pointer w-[13rem] items-center p-2 text-sm font-normal shadow-md rounded-lg text-primary border text-center bg-primary-200'
                                onClick={() => setStateModal("Evaluacion Funcionamiento")}
                            >
                                Evaluación Funcionamiento
                            </div>
                        </div>

                        {/* table materiales */}
                        <Group title={"Repuestos"}>
                            <TableForSelections columns={columnsRepuestosEvaluacion} data={repuestosShow || []}/>
                        </Group>
                        <Group title={"Conclusiones"}>
                            <GroupInputs>
                                <Textarea 
                                    label="Conclusiones"
                                    value={form?.conclusiones}
                                    onChange={(e)=>setForm({...form, conclusiones: e.target.value})}
                                />
                            </GroupInputs>
                        </Group>
                        
                    </>}
                    
                    {stateModal === "Evaluacion Funcionamiento" && <>
                        <Group title={"Bomba Inyección"}>
                            <BombaInyeccionInputs bombaInyeccionInputs={bombaInyeccionInputs} setBombaInyeccionInputs={setBombaInyeccionInputs}/>
                        </Group>
                        <Group title={"Inyector electrónico"}>
                            <InyectorElectronicoInputs inyectorElectronicoInputs={inyectorElectronicoInputs}setInyectorElectronicoInputs={setInyectorElectronicoInputs}/>
                        </Group>
                        <Group title={"Inyector convencional"}>
                            <InyectorConvencional inyectorConvencional={inyectorConvencional} setInyectorConvencional={setInyectorConvencional}/>
                        </Group>
                    </>}
                    
                   
                </form>

                <div className="w-full flex justify-end gap-5">
                    <ButtonCancel onClick={closeModal} />
                    <ButtonSave onClick={saveData} />
                </div>

            </ModalLg>

            {/* Modal Eliminar */}
            <ModalConfirmDelete
                onClick={deleteRegistro}
                title={"Eliminar Hoja Recepción"}
                isOpen={isOpenModalDelete}
                closeModal={() => setIsOpenModalDelete(false)}
            />
        </>
    )
}
