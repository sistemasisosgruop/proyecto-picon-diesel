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
import {
  ModalConfirmDelete,
  ModalLg,
} from "../../../app/components/modules/Modal";
import { Group, GroupInputs } from "../../../app/components/elements/Form";
import { Input } from "@material-tailwind/react";
import { FileUploader } from "react-drag-drop-files";
import { useModal } from "../../../app/hooks/useModal";
import { useTable } from "react-table";
import { axiosRequest } from "../../../app/utils/axios-request";
import { useAuthState } from "../../../contexts/auth.context";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { ToastAlert } from "../../../app/components/elements/ToastAlert";
import { errorProps, successProps } from "../../../app/utils/alert-config";

const fileTypes = ["JPEG", "PNG"];

const schema = yup.object().shape({
  ruc: yup.number().required(),
  nombre: yup.string().required(),
  direccion: yup.string().nullable(),
  telefono: yup.string().nullable(),
  email: yup.string().nullable().email(),
  web: yup.string().nullable(),
});

export default function DatosEmpresa() {
  const {
    isOpenModal,
    isOpenModalDelete,
    isEdit,
    setIsOpenModalDelete,
    closeModal,
    openModal,
  } = useModal();

  // Logo de la empresa
  const [file, setFile] = useState(null);
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
  const [changeData, setChangeData] = useState(false);
  const auth = useAuthState();

  const getEmpresas = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/empresas?adminId=${auth.id}`
    );

    return data;
  };

  const saveData = async () => {
    try {
      await schema.validate(empresaForm, { abortEarly: false });
      const { data } = await axiosRequest(
        "post",
        "/api/mantenimiento/empresas",
        {
          ...empresaForm,
          adminId: auth.id,
        }
      );

      toast.success(
        `🦄 Empresa ${data.nombre} registrada exitosamente!`,
        successProps
      );
      setChangeData(!changeData);
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error}/>, errorProps);
    }
  };

  const handleChange = (file) => {
    setFile(file);
    setLogoPreview(URL.createObjectURL(file));
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
    refetch();
  }, [changeData]);

  const { data, isLoading, refetch } = useQuery("empresas", getEmpresas, {
    initialData: {
      data: [],
    },
  });

  const empresas = useMemo(() => data.data, [data.data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: empresas });

  return (
    <>
      <Container>
        <Title text={"Empresas"}>
          <ButtonAdd text={"Nueva empresa"} onClick={() => openModal(false)} />
        </Title>

        {/* Table List */}
        {isLoading ? (
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
              {rows?.map((row, index) => {
                prepareRow(row);
                return (
                  <tr key={index} {...row.getRowProps()}>
                    {row.cells.map((cell, indexCell) => {
                      return (
                        <TableD key={indexCell} {...cell.getCellProps()}>
                          {cell.column.Header === "Logo" ? (
                            <div className="flex-shrink-0 w-10 h-10">
                              <Image
                                className="w-full h-full rounded-full"
                                src={
                                  cell?.value === ""
                                    ? "/images/placeholder.jpg"
                                    : cell.value
                                }
                                alt=""
                                width={40}
                                height={40}
                                objectFit="cover"
                              />
                            </div>
                          ) : (
                            <p>{cell.render("Cell")}</p>
                          )}
                        </TableD>
                      );
                    })}
                    <TableDOptions>
                      <ButtonEdit onClick={() => openModal(true)} />
                      <ButtonDelete
                        onClick={() => setIsOpenModalDelete(true)}
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
            types={fileTypes}
            accept={fileTypes}
          >
            <div className="flex justify-center items-center rounded-md border-2 border-dashed border-primary-200 py-10 bg-primary-50">
              <div className="space-y-1 text-center flex flex-col items-center">
                <Logo className="text-primary-200" />
                <div className="flex text-sm text-primary-600">
                  <p className="pl-1">
                    Arrastre y suelte su imagen aqui, o{" "}
                    <span className="cursor-pointer font-semibold">
                      Seleccione un archivo
                    </span>{" "}
                  </p>
                </div>
              </div>
            </div>
          </FileUploader>
          <p>
            {file ? (
              <div className=" w-full flex gap-2 text-xs items-center">
                <Image src={logoPreview} width={100} height={20} />{" "}
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
              onChange={(e) => {
                setEmpresaForm({ ...empresaForm, ruc: e.target.value });
              }}
            />
            <Input
              label="Nombre"
              onChange={(e) => {
                setEmpresaForm({ ...empresaForm, nombre: e.target.value });
              }}
            />
          </GroupInputs>
          <GroupInputs>
            <Input
              label="Dirección"
              onChange={(e) => {
                setEmpresaForm({ ...empresaForm, direccion: e.target.value });
              }}
            />
            <Input
              label="Teléfono"
              onChange={(e) => {
                setEmpresaForm({ ...empresaForm, telefono: e.target.value });
              }}
            />
          </GroupInputs>
          <GroupInputs>
            <Input
              label="Correo"
              onChange={(e) => {
                setEmpresaForm({ ...empresaForm, email: e.target.value });
              }}
            />
            <Input
              label="Página web"
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
      <ToastContainer />
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        title={"Eliminar Empresa"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}

// export async function getServerSideProps(context) {
//   const auth = useAuthState();
//   console.log('data..',auth)
//   const { data } = await axiosRequest(
//     "get",
//     `/api/mantenimiento/empresas?adminId=${auth.id}`
//   );

//   return { props: { data } };
// }
