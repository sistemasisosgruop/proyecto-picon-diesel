"use client";
import { Input, Option, Select,Textarea,Checkbox } from "@material-tailwind/react";
import { useContext, useEffect, useMemo, useState, Fragment} from "react";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonImportData,
  ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import { Modal,ModalLg, ModalConfirmDelete } from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateAdministrativo from "../../../../app/components/templates/mantenimiento/TemplateAdministrativo";
import { useModal } from "../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { useQuery } from "react-query";
import * as yup from "yup";
import { toast } from "react-toastify";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { FormContext } from "../../../../contexts/form.context";
import { Group, GroupInputs } from "app/components/elements/Form";
import {Edit,TrushSquare} from "iconsax-react";

const schema = yup.object().shape({
  nombre: yup.string().required(),
  tipoDocumento: yup.string().required(),
  numeroDocumento: yup.number().required(),
  email: yup.string().email().required(),
  telefono: yup.string().required(),
  tipoClienteId: yup.number().required(),
});

export default function Clientes() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const[paises,setPaises]=useState([]);
  const[isOpenSubModal,setIsOpenSubModal]=useState(false);
  const [isEditTrabajador,setIsEditTrabajador] = useState(false);
  const [trabajadorEditId,setTrabajadorEditId] = useState(null);

  const openSubModal =()=>{
    setIsOpenSubModal(true)
  }

  const cleanTrabajadorForm=()=>{
    setTrabajadorForm({
      nombreTrabajador: null,
      cargo: null,
      dni: null,
      correo: null,
      telefono: null,
      nroLicencia: null,
      placa:null,
      envioCorreo:false,
      transportista:false,
    })
  }

  const closeSubModal =()=>{
    setIsOpenSubModal(false)
    setIsEditTrabajador(false)
    setTrabajadorEditId(null)
    // cleanTrabajadorForm()       //LIMPIANDO EL TRABAJADOR FORM

  }


  const [trabajadorForm, setTrabajadorForm] = useState({
    nombreTrabajador: null,
    cargo: null,
    dni: null,
    correo: null,
    telefono: null,
    nroLicencia: null,
    placa:null,
    envioCorreo:false,
    transportista:false,

  });
  
  const [form, setForm] = useState({
    nombre: null,
    email: null,
    tipoDocumento: null,
    telefono: null,
    tipoClienteId: null,
    numeroDocumento: null,
    estado:null,
    direccion:null,
    paisId:null,
    formaPago:null,
    notas:null,
    trabajadores:[]
  });
  const [changeData, setChangeData] = useState(false);
  const { updateForm, setUpdateForm,elementId, resetInfo, setGetPath, setNeedRefetch } = useContext(FormContext);

  useEffect(() => {
    setForm(updateForm);
    console.log('el updateform es:',{updateForm});
  }, [updateForm]);

  useEffect(() => {
    setForm({
      nombre: null,
      email: null,
      tipoDocumento: null,
      telefono: null,
      tipoClienteId: null,
      numeroDocumento: null,
      estado:null,
      direccion:null,
      paisId:null,
      formaPago:null,
      notas:null,
      trabajadores:[]
    });
  }, [resetInfo]);

  useEffect(() => {
    setGetPath("/api/mantenimiento/clientes");
    setNeedRefetch(true);

    return () => {
      setNeedRefetch(false);
      setGetPath(null);
    };
  }, []);

  // -------------------- CRUD -----------------------------------
  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/clientes", {
      ...form,
      empresaId: parseInt(empresaId),
      tipoClienteId: parseInt(form.tipoClienteId),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/clientes/${elementId}`, {
      ...form,
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const deleteData = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/clientes/${elementId}`);
      toast.success(`🗑️ Registro eliminado exitosamente!`, successProps);
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };
  // -------------------- CRUD end-----------------------------------

  const saveData = async () => {
    try {
      if (isEdit) {
        await updateRegistro();
      } else {
        await createRegistro();
      }
      setChangeData(!changeData);
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  useEffect(() => {
    setForm({
      nombre: null,
      email: null,
      tipoDocumento: null,
      telefono: null,
      tipoClienteId: null,
      numeroDocumento: null,
      estado:null,
      direccion:null,
      paisId:null,
      formaPago:null,
      notas:null,
      trabajadores:[]
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      // { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre/Razón Social", accessor: "nombre" },
      { Header: "Tipo Documento", accessor: "tipoDocumento" },
      { Header: "N° de Documento", accessor: "numeroDocumento" },
      { Header: "Tipo", accessor: "tipo" },
      { Header: "Teléfono", accessor: "telefono" },
      { Header: "Correo", accessor: "email" },
      { Header: "Estado", accessor: "estado" },
    ],
    []
  );

  const getTipoClientes = async () => {
    const { data } = await axiosRequest( "get",`/api/mantenimiento/clientes/tipos?empresaId=${empresaId}`);
    return data;
  };
  const { data: tipoClientes } = useQuery("tipoClientes", getTipoClientes, {
    initialData: {
      data: [],
    },
  });

  const getClientes = async () => {
    const { data } = await axiosRequest( "get",`/api/mantenimiento/clientes?empresaId=${empresaId}`);
    return data;
  };
  const { data, refetch } = useQuery("clientes", getClientes, {
    initialData: {
      data: [],
    },
  });

  const clientes = useMemo(
    () =>
      data?.data.map(({ tipoCliente, ...props }) => ({
        ...props,
        tipo: tipoCliente?.tipo,
      })),
    [data?.data]
  );

 //* OBTENER MARCAS:
 const getPaises = async () => {
  try {
    const { data } = await axiosRequest(
      'get',
      `/api/mantenimiento/paises?empresaId=${1}`
    );
    console.log('Paises obtenidos:', data); 
    setPaises(data.data); 
  } catch (error) {
    console.error('Error fetching marcas:', error);
  }
};
useEffect(() => {

    getPaises(); 


}, []); 



const handleEditTrabajador = (arrayPosition,event)=>{
  event.preventDefault();
  setIsEditTrabajador(true);
  setTrabajadorEditId(arrayPosition)  //id del trabajador a editar

  const trabajadorToEdit = form.trabajadores[arrayPosition];  //Del trabajador seleccionado llenar el form temporal de trabajador
  setTrabajadorForm({
    nombreTrabajador: trabajadorToEdit.nombreTrabajador,
    cargo: trabajadorToEdit.cargo,
    dni: trabajadorToEdit.dni,
    correo: trabajadorToEdit.correo,
    telefono: trabajadorToEdit.telefono,
    nroLicencia: trabajadorToEdit.nroLicencia,
    placa: trabajadorToEdit.placa,
    envioCorreo: trabajadorToEdit.envioCorreo,
    transportista: trabajadorToEdit.transportista,
    });

  console.log({trabajadorToEdit});
  openSubModal();
}

const handleDeleteTrabajador = (index,event) => {
  event.preventDefault();
  const updatedTrabajadores = form.trabajadores.filter((_, i) => i !== index);
  // console.log('Eliminando',{index},{updatedTrabajadores});
  setUpdateForm({ ...updateForm, trabajadores: updatedTrabajadores }); // ACTUALIZAR EN EL UPDATEFORM
  setForm({ ...form, trabajadores: updatedTrabajadores }); // Crea un nuevo array sin el trabajador eliminado
  
};

const saveTrabajador = ()=>{
  if (isEditTrabajador) {    // Se está editando un trabajador existente
    const updatedTrabajadores = [...form.trabajadores]; // Clonamos el array de trabajadores
    updatedTrabajadores[trabajadorEditId] = trabajadorForm; // Reemplazamos el trabajador en la posición del índice por trabajadorForm
    setForm({ ...form, trabajadores: updatedTrabajadores }); // Actualizamos el estado con los trabajadores modificados
    setUpdateForm({ ...updateForm, trabajadores: updatedTrabajadores });
  } else {// Se está añadiendo un nuevo trabajador
    setForm({ ...form, trabajadores: [...form.trabajadores, trabajadorForm] });
    setUpdateForm({ ...updateForm, trabajadores: [...updateForm.trabajadores, trabajadorForm] });
  }
  closeSubModal();  //Cerrar la submodal trabajador
}


useEffect(() => {
    console.log({trabajadorForm})
}, [trabajadorForm]); 
useEffect(() => {
  console.log({form})
  
}, [form]); 

  return (
    <>
      <TemplateAdministrativo>
        <Title text={"Lista Clientes / Proveedores"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd text={"Nuevo cliente / proveedor"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={clientes}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateAdministrativo>
      {/* Modal agregar */}
      
      {!isOpenSubModal && (
      <ModalLg
        title={isEdit ? "Editar Cliente" : "Nuevo Cliente"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
        <Group title={"Datos del personal"}>
          
          <GroupInputs>

          <Select
            label="Tipo de Cliente"
            onChange={(value) => {setForm({ ...form, tipoClienteId: value }); setUpdateForm(form);}}
            value={isEdit ? updateForm?.tipoClienteId : form.tipoClienteId}
          >
            {tipoClientes?.data?.map((item) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.tipo}
                </Option>
              );
            })}
          </Select>

              <Select
                label="Tipo de documento"
                value={isEdit ? updateForm?.tipoDocumento?.toLowerCase() : form.tipoDocumento}
                onChange={(value) =>
                  {setForm({
                    ...form,
                    tipoDocumento: value.toString().toUpperCase(),
                  });
                  setUpdateForm(form);
                }
                }
              >
                <Option value="dni">DNI</Option>
                <Option value="ruc">RUC</Option>
              </Select>
              <Input
                label="N° de documento"
                type="number"
                onChange={(e) => setForm({ ...form, numeroDocumento: e.target.value })}
                defaultValue={isEdit ? updateForm?.numeroDocumento : form.numeroDocumento}
              />
        

          </GroupInputs>
          <GroupInputs>
            <Input
                label="Nombre o Razon Social"
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                defaultValue={isEdit ? updateForm?.nombre : form.nombre}
              />
            <Select
                label="Estado"
                value={isEdit ? updateForm?.estado : form.estado}
                onChange={(value) =>
                  setForm({
                    ...form,
                    estado: value.toString(),
                  })
                }
              >
                <Option value="Activo">Activo</Option>
                <Option value="Inactivo">Inactivo</Option>
              </Select>
          </GroupInputs>
          <GroupInputs>
              <Input
                    label="Direccion"
                    onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                    defaultValue={isEdit ? updateForm?.direccion : form.direccion}
                  />
              <Input
                  label="Teléfono"
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  defaultValue={isEdit ? updateForm?.telefono : form.telefono}
                />
          </GroupInputs>

          <GroupInputs>
              
                <Select
                  label={"País"}
                  value={isEdit ? updateForm?.paisId : form.paisId}
                  onChange={(value) => setForm({ ...form, paisId: value })}
                  
                >
                  {paises?.map(({ id, nombre }) => (
                    <Option key={id} value={id}>
                      {nombre}
                    </Option>
                  ))}
                </Select>
                <Input
                  label="Correo"
                  type="email"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  defaultValue={isEdit ? updateForm?.email : form.email}
                />
                 <Input
                  label="Forma de Pago"            
                  onChange={(e) => setForm({ ...form, formaPago: e.target.value })}
                  defaultValue={isEdit ? updateForm?.formaPago : form.formaPago}
                />
         
            </GroupInputs>
            <GroupInputs>
              <Textarea
                label="Notas"
                onChange={(e) => setForm({ ...form, notas: e.target.value })}
                defaultValue={isEdit ? updateForm?.notas : form.notas}
              />
              
              <ButtonSave onClick={openSubModal} label="Añadir trabajadores"/>
            </GroupInputs>
            </Group>
            
            <Group title={'Trabajadores'}>
              {/* Tabla de trabajadores */}
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2" }}>
                    <th style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>Nombre</th>
                    <th style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>Cargo</th>
                    <th style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>DNI</th>
                    <th style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>Correo</th>
                    <th style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>Teléfono</th>
                    <th style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>Nro. Licencia</th>
                    <th style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>Placa</th>
                    <th style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>Envío Correo</th>
                    <th style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>Transportista</th>
                    <th style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {(isEdit ? updateForm?.trabajadores : form.trabajadores)?.length > 0 ? (
                    (isEdit ? updateForm.trabajadores : form.trabajadores).map((trabajador, index) => (
                      <tr key={index}>
                        <td style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>{trabajador.nombreTrabajador}</td>
                        <td style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>{trabajador.cargo}</td>
                        <td style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>{trabajador.dni}</td>
                        <td style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>{trabajador.correo}</td>
                        <td style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>{trabajador.telefono}</td>
                        <td style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>{trabajador.nroLicencia}</td>
                        <td style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>{trabajador.placa}</td>
                        <td style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>{trabajador.envioCorreo ? "Sí" : "No"}</td>
                        <td style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>{trabajador.transportista ? "Sí" : "No"}</td>
                        <td style={{ padding: "8px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd", display:"flex", justifyContent:"space-between" }}>
                          <button 
                          onClick={() => handleEditTrabajador(index,event)}
                          >
                            <Edit />
                            </button>

                          <button 
                          onClick={() => handleDeleteTrabajador(index,event)}
                          ><TrushSquare /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" style={{ textAlign: "center", padding: "8px", border: "1px solid #ddd" }}>
                        No hay trabajadores registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Group>
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </ModalLg>
      )}
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={deleteData}
        title={"Eliminar Cliente"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />


     {isOpenSubModal && (
        <Fragment>
          <div style={{ position: "fixed", top: 0, left: 0,width: "100vw",height: "100vh",backgroundColor: "rgba(0, 0, 0, 0.25)",zIndex: 99998, pointerEvents: "auto"}}
            onClick={closeSubModal}
          />
          <div style={{position: "fixed",top: 0, left: 0, width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999, pointerEvents: "auto" }} >
            <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "20px",  width: "45%",boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", transform: isOpenSubModal ? "scale(1)" : "scale(0.95)", transition: "all 0.3s ease-out", pointerEvents: "auto" }}
              onClick={(e) => e.stopPropagation()}>

              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", }} >
                <h3 style={{ margin: 0, fontSize: "18px" }}>{isEdit ? "Editar Trabajador" : "Nuevo Trabajador"}</h3>
              </div>

              <div
                style={{
                  marginBottom: "15px",
                  lineHeight: "1.6",
                }}
              >
                <Group title={'Contacto'}>
                  <Input
                    label="Nombre del Trabajador"            
                    onChange={(e) => setTrabajadorForm({ ...trabajadorForm, nombreTrabajador: e.target.value })}
                    defaultValue={isEditTrabajador ? trabajadorForm?.nombreTrabajador : undefined}
                  />
                  <GroupInputs>
                  <Input
                    label="Cargo"            
                    onChange={(e) => setTrabajadorForm({ ...trabajadorForm, cargo: e.target.value })}
                    defaultValue={isEditTrabajador ? trabajadorForm?.cargo : undefined}
                  />
                  <Input
                    label="DNI"            
                    onChange={(e) => setTrabajadorForm({ ...trabajadorForm, dni: e.target.value })}
                    defaultValue={isEditTrabajador ? trabajadorForm?.dni : undefined}
                  />
                  </GroupInputs>
                  <GroupInputs>
                      <Input
                        label="Correo"            
                        type="email"
                        onChange={(e) => setTrabajadorForm({ ...trabajadorForm, correo: e.target.value })}
                        defaultValue={isEditTrabajador ? trabajadorForm?.correo : undefined}
                      />
                      <Input
                        label="Telefono"            
                        onChange={(e) => setTrabajadorForm({ ...trabajadorForm, telefono: e.target.value })}
                        defaultValue={isEditTrabajador ? trabajadorForm?.telefono : undefined}
                      />
                  </GroupInputs>
                  <GroupInputs>
                      <Input
                        label="N° Licencia"            
                        onChange={(e) => setTrabajadorForm({ ...trabajadorForm, nroLicencia: e.target.value })}
                        defaultValue={isEditTrabajador ? trabajadorForm?.nroLicencia : undefined}
                      />
                      <Input
                        label="Placa"            
                        onChange={(e) => setTrabajadorForm({ ...trabajadorForm, placa: e.target.value })}
                        defaultValue={isEditTrabajador ? trabajadorForm?.placa : undefined}
                      />
                  </GroupInputs>

                         <Checkbox label='Envío de Correo' 
                         defaultChecked={!!isEditTrabajador ? trabajadorForm.envioCorreo:false}
                         onChange={(e)=>{
                            
                            setTrabajadorForm({...trabajadorForm, envioCorreo: e.target.checked})
                        }}/>

                          <Checkbox label='Transportista' 
                            defaultChecked={!!isEditTrabajador ? trabajadorForm.transportista:false}
                            onChange={(e)=>{
                            setTrabajadorForm({...trabajadorForm, transportista: e.target.checked})
                        }}/>


                </Group>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <button
                  onClick={closeSubModal}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#FF0033",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    zIndex: 99999
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={saveTrabajador}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#2196F3 ",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    zIndex: 99999
                  }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </>
  );
}
