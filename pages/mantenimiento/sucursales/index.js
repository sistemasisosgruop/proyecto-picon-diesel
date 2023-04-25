import Image from "next/image";
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
import { Modal, ModalConfirmDelete } from "../../../app/components/modules/Modal";
import { Group, GroupInputs } from "../../../app/components/elements/Form";
import { Input } from "@material-tailwind/react";
import { useModal } from "../../../app/hooks/useModal";
import { useTable } from "react-table";
import { axiosRequest } from "../../../app/utils/axios-request";
import { useMemo, useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { ToastAlert } from "../../../app/components/elements/ToastAlert";
import { errorProps, successProps } from "../../../app/utils/alert-config";
import { FormContext } from "../../../contexts/form.context";
import { useLocalStorage } from "../../../app/hooks/useLocalStorage";

const schema = yup.object().shape({
  nombre: yup.string().required(),
  direccion: yup.string().required(),
  telefono: yup.string().required(),
  email: yup.string().nullable().email(),
});

export default function DatosEmpresa() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [sucursalForm, setsucursalForm] = useState({
    nombre: null,
    direccion: null,
    telefono: null,
    email: null,
  });
  const [empresaToUpdateId, setEmpresaToUpdateId] = useState(null);
  const { elementId, setElementId, changeData, setChangeData } = useContext(FormContext);
  const [empresaId] = useLocalStorage("empresaId");

  const getSucursales = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/sucursales?empresaId=${empresaId}`
    );

    return data;
  };

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre", accessor: "nombre" },
      { Header: "Direccion", accessor: "direccion" },
      { Header: "Telefono", accessor: "telefono" },
      { Header: "Email", accessor: "email" },
    ],
    []
  );

  useEffect(() => {
    setsucursalForm({
      nombre: null,
      direccion: null,
      telefono: null,
      email: null,
    });
    refetch();
  }, [changeData]);

  const { data, isLoading, refetch } = useQuery("sucursales", getSucursales, {
    initialData: {
      data: [],
    },
  });

  const sucursales = useMemo(() => data.data, [data.data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: sucursales,
  });

  const updateSucursal = async () => {
    await schema.validate(sucursalForm, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/sucursales/${empresaToUpdateId}`, {
      ...sucursalForm,
    });

    toast.success(`💾 Empresa actualizada exitosamente!`, successProps);
  };

  const createSucursal = async () => {
    await schema.validate(sucursalForm, { abortEarly: false });
    const { data } = await axiosRequest("post", "/api/mantenimiento/sucursales", {
      ...sucursalForm,
      empresaId: Number(empresaId),
    });

    toast.success(`💾 Sucursal ${data.nombre} registrada exitosamente!`, successProps);
  };

  const saveData = async () => {
    try {
      if (isEdit) {
        await updateSucursal();
      } else {
        await createSucursal();
      }
      setChangeData(!changeData);
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const deleteSucursal = async () => {
    try {
      const { data } = await axiosRequest("delete", `/api/mantenimiento/sucursales/${elementId}`);
      toast.success(`💾 Sucursal ${data.nombre} eliminada exitosamente!`, successProps);
      setChangeData(!changeData);
      setIsOpenModalDelete(false);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  return (
    <>
      <Container>
        <Title text={"Sucursales"}>
          <ButtonAdd text={"Nueva Sucursal"} onClick={() => openModal(false)} />
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
                                src={cell?.value === "" ? "/images/placeholder.jpg" : cell.value}
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
                      <ButtonEdit
                        onClick={async () => {
                          openModal(true);
                          const { id } = row.values;
                          const currentRow = sucursales.find((empresa) => empresa.id === id);
                          setEmpresaToUpdateId(id);
                          setsucursalForm({ ...currentRow });
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
      <Modal
        title={isEdit ? "Editar Sucursal" : "Nueva Sucursal"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        <Group title={"Datos de la sucursal"}>
          <Input
            label="Nombre"
            defaultValue={isEdit ? sucursalForm.nombre : undefined}
            onChange={(e) => {
              setsucursalForm({ ...sucursalForm, nombre: e.target.value });
            }}
          />
          <GroupInputs>
            <Input
              label="Dirección"
              defaultValue={isEdit ? sucursalForm.direccion : undefined}
              onChange={(e) => {
                setsucursalForm({ ...sucursalForm, direccion: e.target.value });
              }}
            />
            <Input
              label="Teléfono"
              defaultValue={isEdit ? sucursalForm.telefono : undefined}
              onChange={(e) => {
                setsucursalForm({ ...sucursalForm, telefono: e.target.value });
              }}
            />
          </GroupInputs>
          <GroupInputs>
            <Input
              label="Correo"
              defaultValue={isEdit ? sucursalForm.email : undefined}
              onChange={(e) => {
                setsucursalForm({ ...sucursalForm, email: e.target.value });
              }}
            />
          </GroupInputs>
        </Group>
        <div className="w-full flex justify-end gap-5">
          <ButtonCancel onClick={closeModal} />
          <ButtonSave onClick={saveData} />
        </div>
      </Modal>

      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={deleteSucursal}
        title={"Eliminar Empresa"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
