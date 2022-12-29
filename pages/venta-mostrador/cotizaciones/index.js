import { useMemo, useState } from "react";
import { Image as Logo, SearchNormal } from "iconsax-react";
import { Empresas } from "../../../data/empresas";
import { useTable, useGlobalFilter } from "react-table";
import { useModal } from "../../../app/hooks/useModal";
import { Container } from "../../../app/components/elements/Containers";
import { Title } from "../../../app/components/elements/Title";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonDelete,
  ButtonEdit,
  ButtonPDF,
  ButtonSave,
} from "../../../app/components/elements/Buttons";
import {
  Table,
  TableD,
  TableDOptions,
  TableH,
  TableRH,
} from "../../../app/components/elements/Table";
import Image from "next/image";
import {
  ModalConfirmDelete,
  ModalLg,
} from "../../../app/components/modules/Modal";
import { Group, GroupInputs } from "../../../app/components/elements/Form";
import { FileUploader } from "react-drag-drop-files";
import { Input } from "@material-tailwind/react";

const fileTypes = ["JPEG", "PNG"];

const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <div className="w-full pt-2 relative mx-auto text-gray-600">
      <input
        className="w-full bg-primary-50 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
        type="search"
        name="search"
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
        placeholder={`Buscar`}
      />
      <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
        <SearchNormal size={15} />
      </button>
    </div>
  );
};

export default function Cotizaciones() {
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

  const handleChange = (file) => {
    setFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // Datos de la empresa
  const columns = useMemo(
    () => [
      { Header: "N°", accessor: "id" },
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

  const data = useMemo(() => Empresas, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter);

  const { globalFilter } = state;


  const saveData = () => {
    //

    console.log('clic');
  };

  return (
    <>
      <Container whiteColor={true}>
        <Title text={"Cotizaciones"}>
          <ButtonAdd text={"Nueva cotizacion"} onClick={() => openModal(false)} />
        </Title>

        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

        {/* Table List */}
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
            {rows.map((row, index) => {
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
                                cell.value === ""
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
                    <ButtonDelete onClick={() => setIsOpenModalDelete(true)} />
					<ButtonPDF/>
                  </TableDOptions>
                </tr>
              );
            })}
          </tbody>
        </Table>
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
            <Input label="RUC" />
            <Input label="Nombre" />
          </GroupInputs>
          <GroupInputs>
            <Input label="Dirección" />
            <Input label="Teléfono" />
          </GroupInputs>
          <GroupInputs>
            <Input label="Correo" />
            <Input label="Página web" />
          </GroupInputs>
        </Group>
        <div className="w-full flex justify-end gap-5"> 
          <ButtonCancel onClick={closeModal} />
          <ButtonSave onClick={() => {console.log('clic')}}  />
        </div>
      </ModalLg>
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        title={"Eliminar Empresa"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
