import Image from "next/image";
import { Image as Logo } from "iconsax-react";
import {
  ButtonAdd,
  ButtonEdit,
  ButtonDelete,
  ButtonSave,
  ButtonCancel,
} from "../../../app/components/elements/Buttons";
import { Container } from "../../../app/components/elements/Containers";
import { Title } from "../../../app/components/elements/Title";
import {
  Table,
  TableD,
  TableDOptions,
  TableH,
  TableRH,
} from "../../../app/components/elements/Table";
import { ModalConfirmDelete, ModalLg } from "../../../app/components/modules/Modal";
import { Group, GroupInputs } from "../../../app/components/elements/Form";
import { Input } from "@material-tailwind/react";
import { FileUploader } from "react-drag-drop-files";
import { useModal } from "../../../app/hooks/useModal";
import { useTable } from "react-table";
import { axiosRequest } from "../../../app/utils/axios-request";
import { useAuthState } from "../../../contexts/auth.context";
import { useMemo, useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { ToastAlert } from "../../../app/components/elements/ToastAlert";
import { errorProps, successProps } from "../../../app/utils/alert-config";
import { FormContext } from "../../../contexts/form.context";


const schema = yup.object().shape({
  ruc: yup.number().required(),
  nombre: yup.string().required(),
  direccion: yup.string().required(),
  telefono: yup.string().required(),
  email: yup.string().nullable().email(),
  web: yup.string().nullable(),
});

export default function DatosEmpresa() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [file, setFile] = useState(null);
  const [logoEmpresa,setLogoEmpresa] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [empresaForm, setEmpresaForm] = useState({
    ruc: null,
    direccion: null,
    telefono: null,
    email: null,
    nombre: null,
    web: null,
    logo: null,
  });
  const auth = useAuthState();
  const [empresaToUpdateId, setEmpresaToUpdateId] = useState(null);
  const { elementId, setElementId, changeData, setChangeData } = useContext(FormContext);

  const getEmpresas = async () => {
    const { data } = await axiosRequest("get", `/api/mantenimiento/empresas?adminId=${auth.id}`);   //* Obtiene datos de la empresa

    return data;
  };

  const handleChange = (file) => {
    setFile(file);
    // console.log(file);
    setLogoPreview(URL.createObjectURL(file));

    const reader =new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>{
      setLogoEmpresa(reader.result);
      // console.log(reader.result)
      setEmpresaForm({ ...empresaForm, logo: reader.result });
    }
    
    
  };

  // Datos de la empresa
  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Logo", accessor: "logo" },
      { Header: "Nombre", accessor: "nombre" },
      { Header: "RUC", accessor: "ruc" },
      { Header: "Direccion", accessor: "direccion" },
      { Header: "Telefono", accessor: "telefono" },
      { Header: "Email", accessor: "email" },
    ],
    []
  );

  useEffect(() => {
    setEmpresaForm({
      ruc: null,
      direccion: null,
      telefono: null,
      email: null,
      nombre: null,
      web: null,
      logo: null,
    });
    refetch();
  }, [changeData]);

  //? "data": guarda datos de respuesta de la API, "isLoading":Booleano indica si está o no en proceso la consulta, "refetch": función a invocar para rehacer solicitud y actualizar data de tabla
  const { data, isLoading, refetch } = useQuery("empresas", getEmpresas, {                    
    initialData: {                //*Data inicial antes de recibir datos es una data vacía.
      data: [],
    },
  });

  //Memorización optimizada, se recalcula solo cuando hay actualizaciones de las dependencias
  //A menos que haya cambio en data.data, se devolverá empresas(guardado)
  const empresas = useMemo(() => data.data, [data.data]);
  // console.log('Empresas en el memo:', empresas);
//? "getTableProps": se encarga de generar propiedades en HTML para <table>
//? "getTableBodyProps": propiedades para el <tbody> de la tabla
//? "headerGroups": info necesaria para renderizar los headers, se mapea para renderizar headers.
//? "rows": Contiene datos para renderizar cada fila de la tabla, se mapea cada <tr> y luego se mapea los <td> dentro de esta
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,    //! Aquí se define estructura y contenido de las columnas de la tabla
    data: empresas, //! Data a mostrar en la tabla, empresas tiene la data traída de la API
  });




  // Actualizar data de empresa con PUT
  const updateEmpresa = async () => {
    await schema.validate(empresaForm, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/empresas/${empresaToUpdateId}`, {
      ...empresaForm,
    });

    toast.success(`💾 Empresa actualizada exitosamente!`, successProps);
  };

  // Registrar una nueva data de empresa con POST
  const createEmpresa = async () => {
    console.log('Empresa a registrar:',empresaForm)
    await schema.validate(empresaForm, { abortEarly: false });
    const { data } = await axiosRequest("post", "/api/mantenimiento/empresas", {
      ...empresaForm,
      adminId: auth.id,
    });

    toast.success(`💾 Empresa ${data.nombre} registrada exitosamente!`, successProps);
    window.location.reload();
    
  };
  
  // Se ejecuta al apretar botón save del modal 
  const saveData = async () => {
    try {
      if (isEdit) {
        await updateEmpresa();
      } else {
        await createEmpresa();
      }
      setChangeData(!changeData);
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };
// Eliminar empresa
  const deleteEmpresa = async () => {
    try {
      const { data } = await axiosRequest("delete", `/api/mantenimiento/empresas/${elementId}`);
      toast.success(`💾 Empresa ${data.nombre} eliminada exitosamente!`, successProps);
      setChangeData(!changeData);
      setIsOpenModalDelete(false);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  return (
    <>
      <Container>
        <Title text={"Empresas"}>
          <ButtonAdd text={"Nueva empresa"} onClick={() => openModal(false)} />
        </Title>

        {/* Table de empresas */}
        {isLoading ? (          //! Espera a que lleguen los datos del useQuery desde el API
          <span>Loading...</span>
        ) : (
          <Table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <TableRH key={index} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, indexCol) => (
                    <TableH key={indexCol} {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </TableH>
                  ))}
                </TableRH>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows?.map((row, index) => {  //! Mapea el array que contiene todas las rows
                prepareRow(row);            //! Prepara cada fila para renderizar(ajusta props y características)
                return (
                  <tr key={index} {...row.getRowProps()}> 
                    {row.cells.map((cell, indexCell) => { //! Mapea cada celda como un <TableD> (td) y aplica propiedades de celda 
                      return (
                        <TableD key={indexCell} {...cell.getCellProps()}>
                          {cell.column.Header === "Logo" ? (  //* Si es logo, se renderiza <Image/>
                            <div className="flex-shrink-0 w-10 h-10">
                              <Image
                                className="w-full h-full rounded-full"
                                src={cell?.value === "" ? "/images/placeholder.jpg" : cell.value}
                                alt=""
                                width={40}
                                height={40}
                                objectFit="cover"
                              />
                            </div>
                          ) : (     //* Si no es logo, se rendereiza <p/>
                            <p>{cell.render("Cell")}</p>
                          )}
                        </TableD>
                      );
                    })}
                    <TableDOptions>
                      <ButtonEdit
                        onClick={async () => {
                          openModal(true);                        //* Abre el modal de edición 
                          const { id } = row.values;              //* Extrae el id de la fila actual por destructuring
                          const currentRow = empresas.find((empresa) => empresa.id === id);   //*Busca la empresa con el id coincidente en el array empresas
                          setEmpresaToUpdateId(id);               //* Guarda el id de la empresa a editar
                          setEmpresaForm({ ...currentRow });      //* Variable EmpresaForm se carga con los datos de la empresa con el id seleccionado.
                        }}
                      />
                      <ButtonDelete
                        onClick={() => {
                          setElementId(row.values.id);
                          setIsOpenModalDelete(true);
                        }}
                      />
                    </TableDOptions>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Container>


      {/* Modal agregar */}
      
      <ModalLg
        title={isEdit ? "Editar Empresa" : "Nueva Empresa"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        <Group title={"Logo de la empresa"}>
          <FileUploader
            multiple={false}
            handleChange={handleChange}
            name="file"
            type={['jpeg', 'png']}
  
          >
            <div className="flex justify-center items-center rounded-md border-2 border-dashed border-primary-200 py-10 bg-primary-50">
              <div className="space-y-1 text-center flex flex-col items-center">
                <Logo className="text-primary-200" />
                <div className="flex text-sm text-primary-600">
                  <p className="pl-1">
                    Arrastre y suelte su imagen aqui, o{" "}
                    <span className="cursor-pointer font-semibold">Seleccione un archivo</span>{" "}
                  </p>
                </div>
              </div>
            </div>
          </FileUploader>
          <p>
            {file ? (
              <div className=" w-full flex gap-2 text-xs items-center">
                <Image alt="logo" src={logoPreview} width={100} height={20} />{" "}
                {`Nombre del archivo: ${file.name}`}
              </div>
            ) : (
              ""
            )}
          </p>
        </Group>
        <Group title={"Datos de la empresa"}>
          <GroupInputs>
            <Input
              label="RUC"
              defaultValue={isEdit ? empresaForm.ruc : undefined}
              onChange={(e) => {
                setEmpresaForm({ ...empresaForm, ruc: e.target.value });
              }}
            />
            <Input
              label="Nombre"
              title="hola mundo"
              defaultValue={isEdit ? empresaForm.nombre : undefined}
              onChange={(e) => {
                setEmpresaForm({ ...empresaForm, nombre: e.target.value });
              }}
            />
          </GroupInputs>
          <GroupInputs>
            <Input
              label="Dirección"
              defaultValue={isEdit ? empresaForm.direccion : undefined}
              onChange={(e) => {
                setEmpresaForm({ ...empresaForm, direccion: e.target.value });
              }}
            />
            <Input
              label="Teléfono"
              defaultValue={isEdit ? empresaForm.telefono : undefined}
              onChange={(e) => {
                setEmpresaForm({ ...empresaForm, telefono: e.target.value });
              }}
            />
          </GroupInputs>
          <GroupInputs>
            <Input
              label="Correo"
              defaultValue={isEdit ? empresaForm.email : undefined}
              onChange={(e) => {
                setEmpresaForm({ ...empresaForm, email: e.target.value });
              }}
            />
            <Input
              label="Página web"
              defaultValue={isEdit ? empresaForm.web : undefined}
              onChange={(e) => {
                setEmpresaForm({ ...empresaForm, web: e.target.value });
              }}
            />
          </GroupInputs>
        </Group>
        <div className="w-full flex justify-end gap-5">
          <ButtonCancel onClick={closeModal} />
          <ButtonSave onClick={saveData} />
        </div>
      </ModalLg>


      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={deleteEmpresa}
        title={"Eliminar Empresa"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
