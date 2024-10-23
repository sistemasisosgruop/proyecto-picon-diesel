import { useMemo, useEffect, useState, useContext } from "react";

// Visual
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
import TableMaterialesForm from "../../../app/components/modules/TableMaterialesForm";
import { useLocalStorage } from "../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../app/utils/axios-request";
import { useQuery } from "react-query";

import { FormContext } from "../../../contexts/form.context";
import { MaterialesContext } from "../../../contexts/materiales.context";
import { dateFormato, dateRefetchShow } from "../../../app/utils/dateFormat";
// import { DateTime } from "luxon";


const schema = yup.object().shape({
  number: yup.string().nullable(),
  fechaCotizacion: yup.date().required(),
  diasValidez: yup.number().required(),
  fechaValidez: yup.date().required(),
  moneda: yup.string().required(),
  formaPagoContadoId: yup.number().nullable(),
  formaPagoCreditoId: yup.number().nullable(),
  tipoDeCambioId: yup.number().required(),
  estadoDelDocumento: yup.string().required(),
  clienteId: yup.number().required(),
  maquinaId: yup.number().required(), // tiene q ir con required
  vendedorId: yup.number().nullable(),
  personalId: yup.number().nullable(),
  referencia: yup.string(),
  materiales: yup.array().nullable(),
  nota: yup.string(),
  subtotal: yup.number().required(),
  descuento: yup.number().required(),
  subtotalValorNeto: yup.number().required(),
  igv: yup.number().required(),
  totalSoles: yup.number().required()
});

const updateSchema = yup.object().shape({
  number: yup.string(),
  fechaCotizacion: yup.date().required(),
  diasValidez: yup.number().required(),
  fechaValidez: yup.date().required(),
  moneda: yup.string().required(),
  formaPagoContadoId: yup.number().nullable(),
  formaPagoCreditoId: yup.number().nullable(),
  tipoDeCambioId: yup.number().required(),
  estadoDelDocumento: yup.string().required(),
  clienteId: yup.number().required(),
  maquinaId: yup.number().required(), // tiene q ir con required
  vendedorId: yup.number().nullable(),
  personalId: yup.number().nullable(),
  referencia: yup.string(),
  materiales: yup.array().nullable(),
  nota: yup.string(),
  subtotal: yup.number().required(),
  descuento: yup.number().required(),
  subtotalValorNeto: yup.number().required(),
  igv: yup.number().required(),
  totalSoles: yup.number().required()
});



export default function Cotizaciones() {

  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();

  const [empresaId] = useLocalStorage("empresaId");
  const [formaDePago, setFormaDePago] = useState("");
  const [formasDePago, setFormasDePago] = useState([])
  const [tiposCambio, setTiposCambio] = useState([]);
  const [valorTipoCambio, setValorTipoCambio] = useState(Number(1));
  const [clientes, setClientes] = useState([])
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [aplicacionMaquinas, setAplicacionMaquinas] = useState([]);
  const [isOpenCodigos, setIsOpenCodigos] = useState({
    aplicacionMaquina: false,
    materiales: false
  });
  const [tipoResponsable, setTipoResponsable] = useState("");
  const [responsables, setResponsables] = useState([]);

  const [descuentosLimites, setDescuentosLimites] = useState(null);
  const [igv, setIgv] = useState(null);

  const { changeData, elementId, updateForm } = useContext(FormContext);
  const { setCodigos, selectedMaquina, setSelectedMaquina, selectedMateriales, setSelectedMateriales} = useContext(MaterialesContext);

  const [form, setForm] = useState({
    number: null,
    fechaCotizacion: null,
    diasValidez: null,
    fechaValidez: null,
    moneda: null,
    formaPagoContadoId: null,
    formaPagoCreditoId: null,
    tipoDeCambioId: null,
    estadoDelDocumento: null,
    clienteId: null,
    maquinaId: null,
    vendedorId: null,
    personalId: null,
    referencia: null,
    materiales: null,
    nota: null,
    subtotal: null,
    descuento: null,
    subtotalValorNeto: null,
    igv: null,
    totalSoles: null
  })

  useEffect(() => {
    setForm({
      number: null,
      fechaCotizacion: null,
      diasValidez: null,
      fechaValidez: null,
      moneda: null,
      formaPagoContadoId: null,
      formaPagoCreditoId: null,
      tipoDeCambioId: null,
      estadoDelDocumento: null,
      clienteId: null,
      maquinaId: null,
      vendedorId: null,
      personalId: null,
      referencia: null,
      materiales: null,
      nota: null,
      subtotal: null,
      descuento: null,
      subtotalValorNeto: null,
      igv: null,
      totalSoles: null
    });

    refetch();
    setSelectedMateriales({materiales:[]});

  }, [changeData])

  useEffect(() => {
    setCodigos({
      reemplazo: [],
      similitud: [],
      equivalencia: [],
      aplicacionMaquina: [],
    });
    setSelectedMateriales({materiales:[]});
    getDescuentoApi();
    getIgvApi();
  }, []);

  // const getCotizacionApi = (idCotizacion) => {

  // }

  useEffect(() => {

    const currentTemp = cotizacionesResponse?.data.find((item) => item.id === updateForm?.id);
    const current = {...currentTemp};
    // console.log("Current:", current);
    const updateSelectedMateriales = current?.materiales?.map( (material) => {
      const rMaterial = material.material;
      rMaterial.cantidad = material.cantidadMateriales;
      return rMaterial;
    });
    // console.log(updateSelectedMateriales);
    if(isEdit){
      // console.log(current);
      const formaPagoValue = current?.formaPagoContadoId ? "contado" : "credito";
      setFormaDePago(formaPagoValue);
      setSelectedCliente(current?.cliente);
      setSelectedMaquina(current?.Maquina);
      setTipoResponsable(current?.personalId ? "personal" : "vendedores");
      setForm({
        ...current,
        fechaCotizacion: dateRefetchShow(current?.fechaCotizacion),
        fechaValidez: dateRefetchShow(current?.fechaValidez)
      });
      setSelectedMateriales({...selectedMateriales, materiales: updateSelectedMateriales});
    }
  }, [updateForm])
  

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

  // CRUD 
  const createRegistro = async () => {
    await schema.validate(form, {abortEarly: false});
    await axiosRequest(
      "post",
      "/api/venta-mostrador/cotizaciones",
      {
        ...form,
        empresaId: parseInt(empresaId),
        sucursalId: 1,
        Maquina: undefined,
        cliente: undefined
        // materiales: materialesSend
      }
    )
    toast.success(`Registro guardado exitosamente!`, successProps);
  }

  const updateRegistro = async () => {
    await updateSchema.validate(form, { abortEarly: false });
    try {
      await axiosRequest(
        "put",
        `/api/venta-mostrador/cotizaciones/${elementId}`,
        {
          ...form,
          empresaId: parseInt(empresaId),
          sucursalId: 1,
          Maquina: undefined,
          cliente: undefined
          // materiales: materialesSend
        }
      );
      toast.success(`Registro actualizado exitosamente!`, successProps);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  }

  const deleteRegistro = async () => {
    try {
      await axiosRequest(
        "delete",
        `/api/venta-mostrador/cotizaciones/${elementId}`
      );
      toast.success(`🗑️ Registro eliminado exitosamente!`, successProps);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  }

  const saveData = async () => {
    try {
      if (isEdit){
        await updateRegistro();
      } else {
        await createRegistro();
      }
      setForm({
        number: null,
        fechaCotizacion: null,
        diasValidez: null,
        fechaValidez: null,
        moneda: null,
        formaPagoContadoId: null,
        formaPagoCreditoId: null,
        tipoDeCambioId: null,
        estadoDelDocumento: null,
        clienteId: null,
        maquinaId: null,
        vendedorId: null,
        personalId: null,
        referencia: null,
        materiales: null,
        nota: null,
        subtotal: null,
        descuento: null,
        subtotalValorNeto: null,
        igv: null,
        totalSoles: null
      })
      setSelectedMateriales({materiales:[]});
      setSelectedCliente(null);
      setSelectedMaquina(null);
      refetch();
      closeModal()
    } catch (error) {
      toast.error(<ToastAlert error={error}/>, errorProps);
    }
  }

  const columns = useMemo(
    () => [
      { Header: "N°", accessor: "id" },
      { Header: "Cotizacion", accessor: "cotizacionNro"},
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
      { Header: "Cantidad", accessor: "cantidad", Cell: (row, original) => {

        const [cantidadTempEdit, setCantidadTempEdit] = useState(!row.cell.value ? "0" : row.cell.value);
        // console.log(cantidadTempEdit)
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
              // console.log(row.cell.row.original);
              const currentMateriales = structuredClone(selectedMateriales.materiales);
              const nuevo = currentMateriales.map((material) => {
                if(material.id === row.cell.row.original.id){
                  if(e.target.value === "" ){
                    material.cantidad = Number(0);
                  } else{
                    material.cantidad = e.target.value > material.stock ? Number(material.stock) : Number(e.target.value);
                  }

                  
                  
                  // material.cantidad = e.target.value;
                }
                return material;
              });

              setSelectedMateriales(prev => ({
                ...prev,
                materiales: nuevo
              }))
              // setSelectedMateriales({...selectedMateriales, materiales: nuevo })
            }}
          />
        )
      } },
      { Header: "Stock", accessor: "stock" },
      { Header: "Vta Unit.", accessor: "ventaUnidad" },
    ],
    [selectedMateriales]
  );

  const getCotizaciones = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/venta-mostrador/cotizaciones?empresaId=${empresaId}`
    );
    return data;
  }

  const { data: cotizacionesResponse, refetch } = useQuery("cotizaciones", getCotizaciones, {
    initialData: {
      data: []
    }
  })


  const cotizaciones = useMemo(
    () => cotizacionesResponse?.data.map( ({id, cliente, fechaCotizacion, diasValidez, formaPagoContadoId, formaPagoCreditoId, number }) => ({
      id,
      cotizacionNro: number,
      razonSocial: cliente.numeroDocumento,
      nombreCliente: cliente.nombre,
      fecha: dateFormato(fechaCotizacion),
      diasValidez,
      formaDePago: formaPagoContadoId ? 'Contado' : (formaPagoCreditoId ? "Crédito" : "No tiene" ),
      email: cliente.email
    })),
    [cotizacionesResponse?.data]
  )

  useEffect(() => {
   
    if(selectedMateriales.materiales?.length > 0 && valorTipoCambio > 0){
      let subtotalTemp = 0;
      const materialesTemp = [];
      for(const material of selectedMateriales.materiales){
        const valorMaterial = Number(material.ventaUnidad) || 50;
        const cantidad = Number(material.cantidad);
        subtotalTemp += valorMaterial * cantidad;
        materialesTemp.push({id: material.id, cantidadMateriales: material.cantidad});
      }
      const igvTemp = igv?.valor || 0;
      const subtotalNetoTemp = subtotalTemp - ((subtotalTemp * form.descuento)/100);
      const totalIgv = (subtotalNetoTemp * igvTemp) / 100;
      const totalSolesTemp = subtotalNetoTemp + subtotalNetoTemp + totalIgv;
      setForm({...form, subtotal: subtotalTemp , subtotalValorNeto: subtotalNetoTemp, totalSoles: totalSolesTemp, materiales: materialesTemp, igv: totalIgv});
    }
  }, [selectedMateriales, form.descuento])


  const materialesShow = useMemo(
    () => selectedMateriales.materiales?.map( ({ id, codigo, codigoFabricante, denominacion, familia, cantidad, ventaUnidad, stock })=> ({
        id,
        codigoInterno: codigo,
        codigoDeFabrica: codigoFabricante,
        familia: familia?.codigo,
        descripcion: denominacion,
        comentario: `comentario ${id}`,
        cantidad: !cantidad ? "0" : cantidad,
        stock,
        ventaUnidad: ventaUnidad || 50
      })),
    [selectedMateriales]
  )


  // cambios state form

  const handleNroCotizacion = (e) => setForm({...form, number: e.target.value })

  const handleFechaCotizacion = (e) => {
    const [year, month, day] = e.target.value.split('-');
    const fecha = new Date(year, month - 1, day);
    const fechaFormat = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
    setForm({...form, fechaCotizacion: fechaFormat })
  }

  const handleDiasValidez = (e) => {
    if ( !(/^\d+$/.test(e.target.value)) || e.target.value === "") return;
    if(form.fechaCotizacion){
      const fecha = new Date(form.fechaCotizacion);
      fecha.setDate(fecha.getDate() + Number(e.target.value) )
      const fechaFormat = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
      setForm({...form, fechaValidez: fechaFormat, diasValidez: Number(e.target.value)})
      return;
    }
    setForm({...form, diasValidez: e.target.value })
  }

  const getTiposCambio = async (moneda) => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/tipo-de-cambio?empresaId=${empresaId}&last=${moneda}`
    );
    // console.log(data);
    setTiposCambio([data?.data]);
  }

  const handleMoneda = (e) => {
    setForm({...form, moneda: e})
    if(e !== "Soles") getTiposCambio(e);
    else{
      setTiposCambio([])
    }
  };

  const handleTipoDeCambio = (e) => {
    // console.log(e);
    setValorTipoCambio(Number(e.valor));
    setForm({...form, tipoDeCambioId: e.id})
  }

  const getFormasDePago = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/forma-de-pago/${formaDePago}?empresaId=${empresaId}`
    );
    setFormasDePago(data?.data);
  };

  useEffect(() => {
    if(formaDePago.length > 0)getFormasDePago();
  }, [formaDePago])

  const handleFormaDePago = (e) => {
    if(formaDePago === "contado"){
      setForm({...form, formaPagoContadoId: e, formaPagoCreditoId: null})
    } else {
      setForm({...form, formaPagoCreditoId: e, formaPagoContadoId: null})
    }
  }  

  const handleEstadoDelDocumento = (e)  => setForm({...form, estadoDelDocumento: String(e.target.value)})


  const getClientes = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/clientes?empresaId=${empresaId}`      
    )
    setClientes(data?.data);
  }

  // llamar clientes
  useEffect(() => {
    if(isOpenModal)getClientes();
  }, [isOpenModal])

  const handleSelectedCliente = (e) => {
    setSelectedCliente(e);
    setForm({...form, clienteId: e.id})
  }

  // llamar máquinas
  const handleSearchMaquina = async ({ target }) => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/maquinas?empresaId=${empresaId}&filter=${target.value}`
    );

    setAplicacionMaquinas(data?.data);
  };

  const handleSelectedMaquina = (aplicacionMaquina) => {
    setSelectedMaquina(aplicacionMaquina);
    setForm({...form, maquinaId: aplicacionMaquina.id});
    setIsOpenCodigos({ ...isOpenCodigos, aplicacionMaquina: false });
  }

  const getResponsables = async () => {
    // console.log(tipoResponsable);
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/${tipoResponsable}?empresaId=${empresaId}`
    )
    // console.log(data);
    setResponsables(data?.data);
  }
  
  useEffect(() => {
    if(tipoResponsable.length > 0) getResponsables();
  }, [tipoResponsable])
  

  const handleResponsable = (e) => {
    if(tipoResponsable === "vendedores"){
      setForm({...form, vendedorId: e.id })
    } else{
      setForm({...form, personalId: e.id })
    }
  }

  const handleReferencia = (e) => setForm({...form, referencia: e.target.value})
  const handleNota = (e) => setForm({...form, nota: e.target.value})
  
  const handleDescuentoInput = (e) => {
    if( (Number(e.target.value)) >= Number(descuentosLimites?.de) &&  (Number(e.target.value)) <= Number(descuentosLimites?.a)){
      setForm({...form, descuento: Number(e.target.value)});
      // setDescuento(Number(e.target.value));
    } else if ( (Number(e.target.value)) < Number(descuentosLimites?.de) ) {
      setForm({...form, descuento: Number(descuentosLimites?.de)});
      // setDescuento(Number(descuentosLimites?.de));
    } else {
      setForm({...form, descuento: Number(descuentosLimites?.a)});
      // setDescuento(Number(descuentosLimites?.a));
    }
  }
  
  
  useEffect(() => {
    console.log(form);
  }, [form])
  

  return (
    <>
      <Container whiteColor={true}>
        <Title text={"Cotizaciones"}>
          <ButtonAdd text={"Nueva cotizacion"} onClick={() => openModal(false)} />
        </Title>
        {/* Table List */}
        <TableComplete
          columns={columns}
          data={cotizaciones}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </Container>
      {/* Modal agregar */}
      <ModalLg
        title={isEdit ? "Editar cotizacion" : "Nueva cotizacion"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
        <div style={{ display: 'flex', gap: '3px', justifyContent: 'space-between', maxWidth:'100%',width:'100%',marginLeft:'0',backgroundColor:'red' }}>
          <Group title={"Informacion General"} >
            <GroupInputs>
              <Input  style={{  width: '70%', margin:'0' }} label={"N° de cotizacion"}
                value = {form.number}
                onChange = { (e) => handleNroCotizacion(e)}
                disabled
              />
              <Input label={"Fecha de cotizacion"} type={"date"}
              style={{  width: '70%', margin:'0' }}
                value = {form.fechaCotizacion}
                onChange = { (e) => handleFechaCotizacion(e)}
                // disabled = {form.number === null}
              />
              <Input label={"Dias de validez"}
              style={{  width: '70%', margin:'0' }}
                value = {form.diasValidez}
                onChange = { (e) => handleDiasValidez(e)}
                disabled = {form.fechaCotizacion === null}
              />
              <Input label={"Fecha de validez"} type={"date"}
              style={{  width: '70%', margin:'0' }}
                value = {form.fechaValidez}
                disabled
               />
            </GroupInputs>
            <GroupInputs>
              <Select label="Moneda"
                onChange={(e) => handleMoneda(e)}
                value={isEdit ? form?.moneda : undefined}
              >
                <Option key={1} value={"Soles"}>Soles</Option>
                <Option key={2} value={"Dolar"}>Dolares</Option>
              </Select>
              <Select label="Moneda de cambio"
                onChange={(e) => handleMoneda(e)}
                value={isEdit ? form?.moneda : undefined}
              >
                <Option key={1} value={"Soles"}>Soles</Option>
                <Option key={2} value={"Dolar"}>Dolares</Option>
              </Select>
             

              <Select label="Tipo de Cambio" 
                onChange={ (e) => handleTipoDeCambio(e) }
                value = {isEdit ? form?.tipoDeCambioId : undefined}
                // disabled={form.moneda === null || form.moneda === "Soles"}
              >
                {tiposCambio?.map( (tipoCambio) => {
                  return (
                    <Option key={tipoCambio.id} value={tipoCambio}>
                      {`De ${tipoCambio.de} a ${tipoCambio.a}: ${tipoCambio.valor}`}
                    </Option>
                  )
                })}
                {/* <Option value={"sol-dolar"}>3.81</Option> */}
              </Select>

              <Input label={"Fecha de validez"} 
                value = {"valor"}
                disabled
               />
            </GroupInputs>
            {/* <Select label="Forma de pago"
              onChange={ (e)=>handleFormaDePago(e) }
              value={isEdit ?  (form.formaPagoCreditoId || form.formaPagoContadoId ) : undefined }
              disabled = {formaDePago.length === 0}
            >
              {formasDePago?.map((item)=> {
                return (
                  <Option key={item.id} value={item.id}>
                    {item?.nombre}
                  </Option>
                );
              })}
              
            </Select> */}
            <GroupInputs>
            <Select label="Forma de pago"
                onChange={(e) => setFormaDePago(String(e))}
                value={isEdit ? (form.formaPagoContadoId !== null ? "contado" : "credito"): undefined}
              >
                <Option value={"contado"}>contado</Option>
                <Option value={"credito"}>crédito</Option>
              </Select>
              <Input label="Nommbre Vendedor" disabled value={selectedCliente?.telefono}/>
              <Input label="Correo Vendedor" disabled value={selectedCliente?.telefono}/>


            </GroupInputs>
          </Group>
          <Group title={"Cliente"}>
            <GroupInputs>
              <Select label="RUC / DNI"
                onChange={ (e) => handleSelectedCliente(e) }
                // value = { isEdit ? selectedCliente?.numeroDocumento : undefined }
              >
                {clientes?.map( (cliente)=>{
                  return (
                    <Option key={cliente.id} value={cliente}>
                      {`${cliente?.numeroDocumento} - ${cliente?.nombre}`}
                    </Option>
                  )
                })}
              </Select>
              <Input label="Nombre del cliente" disabled value={selectedCliente?.nombre}/>
            </GroupInputs>
            <GroupInputs>
              <Input label="Telefono" disabled value={selectedCliente?.telefono}/>
              <Input label="Correo" disabled value={selectedCliente?.email}/>
              <Input label="Direccion" disabled />
            </GroupInputs>

          </Group>

          <Group title={"Maquina"}>  {/* cambiar por select para idmaquina */}
            {/* <Select label="Aplicación de la máquina"
                onChange={ (e) => handleSelectedCliente(e) }
              >
                {clientes?.map( (cliente)=>{
                  return (
                    <Option key={cliente.id} value={cliente}>
                      {cliente?.numeroDocumento}
                    </Option>
                  )
                })}
              </Select> */}
              <Search
                onFocus={() => setIsOpenCodigos({ ...isOpenCodigos, aplicacionMaquina: true })}
                onChange={handleSearchMaquina}
              />
              <Dropdown isOpen={isOpenCodigos.aplicacionMaquina} elements={aplicacionMaquinas.length}>
                {aplicacionMaquinas?.map((aplicacionMaquina) => {
                  return (
                    <DropdownItem
                      handleClick={() => { handleSelectedMaquina(aplicacionMaquina) }}
                      key={aplicacionMaquina.id}
                      name={`COD: ${aplicacionMaquina?.codigo} - COD. Fabrica: ${aplicacionMaquina?.fabricaMaquina.fabrica} - 
                      Modelo de maquina: ${aplicacionMaquina?.modeloMaquina.modelo} - COD. Motor: ${aplicacionMaquina?.codigoOriginal}`}
                    />
                  );
                })}
              </Dropdown>
              <Input label="Aplicación de la máquina" disabled value={`COD: ${selectedMaquina?.codigo} - COD. Fabrica: ${selectedMaquina?.fabricaMaquina.fabrica} - 
                      Modelo de maquina: ${selectedMaquina?.modeloMaquina.modelo} - COD. Motor: ${selectedMaquina?.codigoOriginal}`}/>
          
          <Input label="Estado del documento" 
                value={form.estadoDelDocumento}
                onChange={ (e)=> handleEstadoDelDocumento(e) }
              /> {/* onchage directo objeto */}
          
          </Group>

          </div>


          {/* <Group title={"Responsable"}>
            <GroupInputs>
              <Select label="Rol"
                onChange={ (e) => setTipoResponsable(String(e)) }
                value={isEdit ? (form?.personalId ? "personal" : "vendedores"): undefined}
              >
                <Option value={"vendedores"}>Vendedor</Option>
                <Option value={"personal"}>Personal</Option>
              </Select>
              <Select label="Responsable"
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
            </GroupInputs>
          </Group> */}
          <Group title={"Otro"}>
            <Input label="Referencia"
            value={form.referencia}
              onChange={ (e) => handleReferencia(e)}
            ></Input>
            <Textarea label="Nota"
              value={form.nota}
              onChange={ (e) => handleNota(e)}
            ></Textarea>
          </Group>
          <Group title={"Materiales"}>
            <TableMaterialesForm columns={columnsMateriales} data={materialesShow || []} />{/* materialesShow */} 
            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">Subtotal valor venta soles</span>
                </div>
                <div>
                  <Input disabled value={form.subtotal}/>
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
                    disabled = {selectedMateriales.materiales?.length === 0}
                    onChange = {e => handleDescuentoInput(e) }
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
                  <Input disabled value={form.subtotalValorNeto}/>
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
                  <span className="font-semibold">TOTAL DE COTIZACION SOLES</span>
                </div>
                <div>
                  <Input disabled value={form.totalSoles}/>
                </div>
              </div>
            </GroupInputs>
            <Divider />
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
        title={"Eliminar Cotizacion"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
