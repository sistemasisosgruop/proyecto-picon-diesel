import { Checkbox, Input, Option, Select } from "@material-tailwind/react";
import { useContext, useEffect, useMemo, useState } from "react";
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
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { useQuery } from "react-query";
import * as yup from "yup";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { toast } from "react-toastify";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { FormContext } from "../../../../contexts/form.context";
import { Group, GroupInputs } from "app/components/elements/Form";
import { TrushSquare } from "iconsax-react";

const schema = yup.object().shape({
//   nombre: yup.string().required(),
//   referencia: yup.string().required(),
});

export default function Puesto() {
    const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
    const [empresaId] = useLocalStorage("empresaId");
    const [form, setForm] = useState({
        nombre: null,
        // modulo: null,
        // submodulo:null,
        permisos:[]
    });
    const [modulosList, setModulosList] = useState([])
    const [subModulosList, setsubModulosList] = useState([])
    const [allSubModulosList, setAllSubModulosList] = useState([])
    const [permisoNew,setPermisoNew] = useState({
        moduloId:null,
        submoduloId: null,
        crear:  false,
        leer: false,
        actualizar: false,
        eliminar: false
    })

    const { updateForm, elementId, resetInfo, changeData, setChangeData, setCsvPath } =
    useContext(FormContext);

    useEffect(() => {
        setForm(updateForm);
    }, [updateForm]);

    useEffect(() => {
        setForm({
        nombre: null,
        // modulo: null,
        // submodulo:null,
        permisos:[]
        });
    }, [resetInfo]);


    const createRegistro = async () => {
        await schema.validate(form, { abortEarly: false });
        await axiosRequest("post", "/api/mantenimiento/puesto", {
          ...form,
        //   empresaId: parseInt(empresaId),
        });
        toast.success(`💾 Registro guardado exitosamente!`, successProps);
      };
    
      const updateRegistro = async () => {
        await schema.validate(form, { abortEarly: false });
        await axiosRequest("put", `/api/mantenimiento/puesto/${elementId}`, {
          ...form,
        });
    
        toast.success(`💾 Registro guardado exitosamente!`, successProps);
      };
      const deleteData = async () => {
        try {
          await axiosRequest("delete", `/api/mantenimiento/puesto/${elementId}`);
          toast.success(`🗑️ Registro eliminado exitosamente!`, successProps);
          closeModal();
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
    
          setChangeData(!changeData);
          closeModal();
        } catch (error) {
          toast.error(<ToastAlert error={error} />, errorProps);
        }
      };
    
      useEffect(() => {
        setForm({
          nombre: null,
        //   modulo: null,
        //   submodulo:null,
          permisos:[]
        });
        refetch();   
      }, [changeData]);
    
      const columns = useMemo(
        () => [
          { Header: "#", accessor: "id" },
          { Header: "Nombre", accessor: "nombre" },
        ],
        []
      );
    

      const getPuestos = async () => {
        const { data } = await axiosRequest(
          "get",
          `/api/mantenimiento/puesto`
        );
          // console.log('Puestos:',{data})
        return data;
      };
      const { data, refetch } = useQuery("puestos", getPuestos, {
        initialData: {
          data: [],
        },
      });
    
      const puestos = useMemo(() => data?.data, [data?.data]);


    //* OBTENCION DE MODULOS
      const getModulos = async () => {
        try {
          const { data } = await axiosRequest("get", `/api/mantenimiento/modulo`);
          
          const modulosList = data.data;
          setModulosList(modulosList);
          // console.log('Modulos:', modulosList);

          const allSubModulosArray = [];
          for (const modulo of modulosList) {
            try {
              const {data} = await getSubModulos(modulo.id);
              allSubModulosArray.push(...data.data);         
            } catch (error) {
              console.error(`Error fetching submodulos for modulo ${modulo.id}:`, error);
            }
          }
          // Actualizar el estado con la lista de todos los submódulos
          setAllSubModulosList(allSubModulosArray);
          // console.log({allSubModulosArray})
        } catch (error) {
          console.error('Error fetching modulos:', error);
        }
      };
    //* OBTENCION DE SUBMODULOS
      const getSubModulos = async (id) => {
        const { data } = await axiosRequest(
          "get",
          `/api/mantenimiento/submodulo?moduloId=${id}`
        );
        // console.log('SUBMODULOS PARA MODULO:',{id}, data.data)
            setsubModulosList(data.data)
          return {data}
      };
      
  
        useEffect(() => {
        if (isOpenModal) {
            getModulos(); // Llamamos a la función para obtener las marcas cuando se abre el modal
            console.log({modulosList})
            console.log({allSubModulosList})
        }
    }, [isOpenModal]); // El useEffect se ejecuta cuando el modal se abre

    const addPermiso = () => {
        console.log('añadiendo', { permisoNew });
      
        setForm((prevForm) => {
          const permisosActualizados = prevForm.permisos.map((permiso) =>
            permiso.submoduloId === permisoNew.submoduloId
              ? { ...permisoNew } // Sobrescribir si ya existe el mismo submoduloId
              : permiso
          );
      
          // Verificar si el permiso ya existe
          const permisoExiste = prevForm.permisos.some(
            (permiso) => permiso.submoduloId === permisoNew.submoduloId
          );
      
          return {
            ...prevForm,
            permisos: permisoExiste
              ? permisosActualizados // Si existe, usar la lista actualizada
              : [...prevForm.permisos, permisoNew], // Si no existe, añadirlo al array
          };
        });
      };

          
    
    useEffect(() => {
        // console.log('Form actualizado:', {form})
      }, [form]);

    return(
        <>
         <TemplateAdministrativo>
        <Title text={"Puestos"}>
          <div className="flex gap-4">
            <ButtonImportData
            //   handleClick={() =>
            //     // setCsvPath(`/api/mantenimiento/centro-costos/upload?empresaId=${empresaId}`)
            //   }
            />
            <ButtonAdd text={"Nuevo puesto"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
            columns={columns}
            data={puestos}
            openModal={openModal}
            setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateAdministrativo>
        

        {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Puesto" : "Nuevo puesto"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">

            <Input
              label="Nombre del puesto"
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              defaultValue={isEdit ? updateForm?.nombre : undefined}
            />
            <Group title={"Selección de modulos permitidos"}>

                <GroupInputs>
                    <Select label={"Modulo"}
                    onChange={(value) => {
                        const currentModulo = modulosList?.find((item) => item.id === Number(value));
                        getSubModulos(currentModulo.id);
                        // setForm({ ...form, modulo: value })
                        setPermisoNew({...permisoNew, moduloId: value})
                        
                    }}
                    >
                    {modulosList && modulosList.length > 0 ? (
                        modulosList.map((item) => (
                        <Option key={item.id} value={item.id}>
                            {item.nombre}
                        </Option>
                        ))
                    ) : (
                        <Option value="">No hay marcas disponibles</Option>
                    )}
                    </Select>

                    <Select label="Submodulo"
                    onChange={(value) => {
                        // setForm({ ...form, submodulo: value } );
                        setPermisoNew({...permisoNew, submoduloId: value})
                    }}
                    >
                    {subModulosList && subModulosList.length > 0 ? (
                    subModulosList?.map((item) => {
                        return (
                        <Option key={item.id} value={item.id}>
                            {item?.nombre}
                        </Option>
                        );
                    })
                    ) : (
                        <Option value="">No hay marcas disponibles</Option>
                    )}
                    </Select>
                </GroupInputs>
                <Group title={"Selección de permisos"}>
                    <GroupInputs>
                        <Checkbox label='Lectura' onChange={(e)=>{
                            setPermisoNew({...permisoNew, leer: e.target.checked})
                        }}/>

                        <Checkbox label='Crear'onChange={(e)=>{
                            setPermisoNew({...permisoNew, crear: e.target.checked})
                        }}/>
                        <Checkbox label='Editar'onChange={(e)=>{
                            setPermisoNew({...permisoNew, actualizar: e.target.checked})
                        }}/>
                        <Checkbox label='Eliminar'onChange={(e)=>{
                            setPermisoNew({...permisoNew, eliminar: e.target.checked})
                        }}/>

                        <ButtonSave label='Agregar permiso' onClick={addPermiso}> </ButtonSave>
                    </GroupInputs>
                </Group>
                <table>
                    <thead>
                      <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <th style={{ fontWeight: 'bold' }}>#</th>
                        <th style={{ fontWeight: 'bold' }}>Módulo</th>
                        <th style={{ fontWeight: 'bold' }}>Submódulo</th>
                        <th style={{ fontWeight: 'bold' }}>Permisos</th>
                        <th style={{ fontWeight: 'bold' }}>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                      {form.permisos.map((permiso, index) => {
                        console.log('Fila de permisos modal:',{form})
                        // Encuentra el módulo correspondiente al permiso
                        let modulo = modulosList.find(mod => mod.id === permiso.moduloId);
                        if(!modulo){
                          modulo = modulosList.find(mod => mod.id === permiso.submodulo.moduloId);
                        }
                        // Encuentra el submódulo correspondiente al permiso
                        const submodulo = allSubModulosList.find(sub => sub.id === permiso.submoduloId);

                        return (
                          <tr key={index} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                            <td>{index + 1}</td>
                            <td>{modulo ? modulo.nombre : 'Módulo no encontrado'}</td> {/* Muestra el nombre del módulo */}
                            <td>{submodulo ? submodulo.nombre : 'Submódulo no encontrado'}</td> {/* Muestra el nombre del submódulo */}
                            <td>
                              {permiso.leer && <span>Leer </span>}
                              {permiso.crear && <span>Crear </span>}
                              {permiso.actualizar && <span>Editar </span>}
                              {permiso.eliminar && <span>Eliminar </span>}
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  const updatedPermisos = [...form.permisos];
                                  updatedPermisos.splice(index, 1); // Eliminar permiso
                                  setForm({ ...form, permisos: updatedPermisos });
                                }}
                              >
                                <TrushSquare />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    </table>
                </Group>
 
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>

        {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={deleteData}
        title={"Eliminar Centro de Costos"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />


        </>
    )
}