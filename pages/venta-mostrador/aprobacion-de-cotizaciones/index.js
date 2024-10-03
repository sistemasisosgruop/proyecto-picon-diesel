import { useMemo, useContext, useState, useEffect } from "react";

import { ButtonAdd, ButtonCancel, ButtonSave } from "../../../app/components/elements/Buttons";
import { Input } from "@material-tailwind/react";
import { Container } from "../../../app/components/elements/Containers";
import { Title } from "../../../app/components/elements/Title";
import { ModalConfirmDelete, ModalLg } from "../../../app/components/modules/Modal";
import { useModal } from "../../../app/hooks/useModal";
import {
  Group,
  GroupInputs,
  GroupIntern,
  GroupInputsIntern,
} from "../../../app/components/elements/Form";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastAlert } from "../../../app/components/elements/ToastAlert";
import { errorProps, successProps } from "../../../app/utils/alert-config";
import * as yup from "yup";
import TableComplete from "../../../app/components/modules/TableComplete";
import { Search } from "../../../app/components/elements/Search";
import { Dropdown, DropdownItem } from "../../../app/components/elements/Dropdown";
import TableForSelections from "../../../app/components/modules/TableForSelections";
import TableMaterialesForm from "../../../app/components/modules/TableMaterialesForm";
import { Divider } from "../../../app/components/elements/Divider";
import { useLocalStorage } from "../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../app/utils/axios-request";
import { dateFormato } from "../../../app/utils/dateFormat";
import { useQuery } from "react-query";
import { FormContext } from "../../../contexts/form.context";
import { MaterialesContext } from "../../../contexts/materiales.context";
import { VentaMostradorContext } from "../../../contexts/venta-mostrador.context";

const schema = yup.object().shape({
  subtotal: yup.number().required(),
  descuento: yup.number().required(),
  subtotalValorNeto: yup.number().required(),
  igv: yup.number().required(),
  totalSoles: yup.number().required(),
  cotizaciones: yup.array().nullable(),
  moneda: yup.string().nullable(),
  maquina: yup.string().nullable(),
  materiales: yup.array().nullable(),
  clienteId: yup.number().required(),
  // empresa y sucursal
});

const updateSchema = yup.object().shape({
  subtotal: yup.number().required(),
  descuento: yup.number().required(),
  subtotalValorNeto: yup.number().required(),
  igv: yup.number().required(),
  totalSoles: yup.number().required(),
  cotizaciones: yup.array().nullable(),
  moneda: yup.string().nullable(),
  maquina: yup.string().nullable(),
  materiales: yup.array().nullable(),
  clienteId: yup.number().required(),
  // empresa y sucursal
});

const initialStateForm = {
  number: null,
  subtotal: null,
  descuento: null,
  subtotalValorNeto: null,
  igv: null,
  totalSoles: null,
  estadoDelDocumento: null,
  cotizaciones: null,
  moneda: null,
  maquina: null,
  materiales: null,
  clienteId: null,
};

export default function CotizacionesAprobadas() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const { changeData, elementId, updateForm } = useContext(FormContext);
  const { selectedMateriales, setSelectedMateriales } = useContext(MaterialesContext);
  const { arreglosVenta, setArreglosVenta } = useContext(VentaMostradorContext);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [empresaId] = useLocalStorage("empresaId");

  const [clientesSearch, setClientesSearch] = useState([]);
  const [isOpenSearchCliente, setIsOpenSearchCliente] = useState(false);

  const [descuentosLimites, setDescuentosLimites] = useState(null);
  const [igv, setIgv] = useState(null);

  const [form, setForm] = useState(initialStateForm);

  useEffect(() => {
    setForm(initialStateForm);
    setArreglosVenta({
      clientes: [],
      cotizaciones: [],
      codigos: [],
      materiales: [],
      cotizacionesAprobadas: [],
    });
    refetch();
  }, [changeData]);

  useEffect(() => {
    // setSelectedMateriales({materiales:[]});
    // setArreglosVenta({
    //   clientes: [],
    //   cotizaciones: [],
    //   codigos: [],
    //   materiales: [],
    //   cotizacionesAprobadas: []
    // });
    getDescuentoApi();
    getIgvApi();
  }, []);

  // updateForm

  useEffect(() => {
    const currentTemp = cotizacionesAprobadasResponse?.data.find(
      (item) => item.id === updateForm?.id
    );
    const current = { ...currentTemp };
    const updateSelectedMateriales = current?.materiales?.map((material) => {
      const rMaterial = material.material;
      rMaterial.cantidad = material.cantidad;
      return rMaterial;
    });

    if (isEdit) {
      // delete current.id;
      setSelectedCliente(current?.cliente);
      setForm({
        ...current,
      });
      setSelectedMateriales({ ...selectedMateriales, materiales: updateSelectedMateriales });
    }
  }, [updateForm]);

  // CRUD

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", `/api/venta-mostrador/aprobacion-cotizaciones`, {
      ...form,
      cotizaciones: arreglosVenta.cotizaciones,
      empresaId: parseInt(empresaId),
      cliente: undefined,
      Maquina: undefined,
      sucursalId: 1,
    });
    toast.success(`Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await updateSchema.validate(form, { abortEarly: false });
    try {
      await axiosRequest("put", `/api/venta-mostrador/aprobacion-cotizaciones/${elementId}`, {
        ...form,
        cliente: undefined,
        cotizaciones: arreglosVenta.cotizaciones,
        empresaId: parseInt(empresaId),
        sucursalId: 1,
      });
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const deleteRegistro = async () => {
    try {
      await axiosRequest("delete", `/api/venta-mostrador/aprobacion-cotizaciones/${elementId}`);
      toast.success(`🗑️ Registro eliminado exitosamente!`, successProps);
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
      setSelectedMateriales({ materiales: [] });
      setArreglosVenta({
        clientes: [],
        cotizaciones: [],
        codigos: [],
        materiales: [],
        cotizacionesAprobadas: [],
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
      { Header: "Fecha", accessor: "fecha" },
      { Header: "Codigo Cotización", accessor: "codigoCotizacion" },
      { Header: "Total", accessor: "totalSoles" },
      { Header: "Correo", accessor: "email" },
    ],
    []
  );

  const columnsClientes = useMemo(
    () => [
      { Header: "N°", accessor: "id" },
      { Header: "RUC/DNI", accessor: "razonSocial" },
      { Header: "Nombre Cliente", accessor: "nombreCliente" },
    ],
    []
  );

  const columnsCotizaciones = useMemo(
    () => [
      { Header: "N°", accessor: "id" },
      { Header: "Fecha de Creación", accessor: "fechaCreacion" },
      { Header: "Nombre Cliente", accessor: "nombreCliente" },
    ],
    []
  );

  const columnsCodigosCotizacion = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Codigo interno", accessor: "codigoInterno" },
      { Header: "Cod. Fabrica", accessor: "codigoDeFabrica" },
      { Header: "Nro Cotizacion", accessor: "nroCotizacion" },
      { Header: "Cantidad", accessor: "cantidad" },
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
              for (const material of selectedMateriales.materiales) {
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
                const currentMateriales = structuredClone(selectedMateriales.materiales);
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

                setSelectedMateriales((prev) => ({
                  ...prev,
                  materiales: nuevo,
                }));
              }}
            />
          );
        },
      },
      { Header: "Stock", accessor: "stock" },
      { Header: "Vta Unit.", accessor: "ventaUnidad" },
    ],
    [selectedMateriales]
  );

  // BODY

  const clientesShow = useMemo(() => {
    if (selectedCliente) {
      return [
        {
          id: selectedCliente.id,
          razonSocial: selectedCliente.numeroDocumento,
          nombreCliente: selectedCliente.nombre,
        },
      ];
    }
  }, [selectedCliente]);

  const cotizacionesShow = useMemo(
    () =>
      arreglosVenta.cotizaciones?.map(({ id, cliente, fechaCotizacion }) => {
        return {
          id,
          fechaCreacion: dateFormato(fechaCotizacion),
          nombreCliente: cliente.nombre,
        };
      }),
    [arreglosVenta]
  );

  const codigosShow = useMemo(
    () =>
      arreglosVenta.codigos?.map(({ cotizacionId, material, cantidadMateriales }) => {
        return {
          id: material.id,
          codigoInterno: material.codigo,
          codigoDeFabrica: material.codigoFabricante,
          nroCotizacion: cotizacionId,
          cantidad: cantidadMateriales,
        };
      }),
    [arreglosVenta]
  );

  const materialesShow = useMemo(
    () =>
      selectedMateriales.materiales?.map(
        ({ id, codigo, codigoFabricante, denominacion, familia, cantidad, ventaUnidad, stock }) => ({
          id,
          codigoInterno: codigo,
          codigoDeFabrica: codigoFabricante,
          familia: familia?.codigo,
          descripcion: denominacion,
          comentario: `comentario ${id}`,
          cantidad: !cantidad ? "0" : cantidad,
          stock,
          ventaUnidad: ventaUnidad || 50,
        })
      ),
    [selectedMateriales]
  );

  const handleSearchClientes = async ({ target }) => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/clientes?empresaId=${empresaId}&filterName=${target.value}`
    );
    setClientesSearch(data?.data);
  };

  const getCotizaciones = async (usuario) => {
    const { data } = await axiosRequest(
      "get",
      `/api/venta-mostrador/cotizaciones?empresaId=${empresaId}&userId=${usuario.id}`
    );

    setArreglosVenta({ ...arreglosVenta, cotizaciones: data?.data });
  };

  const getCotizacionesAprobadas = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/venta-mostrador/aprobacion-cotizaciones?empresaId=${empresaId}`
    );
    return data;
  };

  const { data: cotizacionesAprobadasResponse, refetch } = useQuery(
    "cotizacionesAprobadas",
    getCotizacionesAprobadas,
    {
      initialData: {
        data: [],
      },
    }
  );

  const cotizacionesAprobadasShow = useMemo(
    () =>
      cotizacionesAprobadasResponse?.data.map(
        ({ id, cliente, fechaAprobacion, number, totalSoles }) => ({
          id,
          razonSocial: cliente.numeroDocumento,
          nombreCliente: cliente.nombre,
          fecha: dateFormato(fechaAprobacion),
          codigoCotizacion: number,
          totalSoles,
          email: cliente.email,
        })
      ),
    [cotizacionesAprobadasResponse?.data]
  );

  const setMaterialesCodigos = (cotizacionClickeada) => {
    const cotizacionData = arreglosVenta.cotizaciones.find(
      (cotizacion) => cotizacion.id === cotizacionClickeada.id
    );
    setArreglosVenta({ ...arreglosVenta, codigos: cotizacionData.materiales }); // tiene un formato diferente al material normal, es un include
  };

  const verificarMaterialInSelectedMateriales = (idMaterial) => {
    const existMaterial = selectedMateriales?.materiales?.find(
      (material) => material.id === idMaterial
    );
    if (existMaterial) return true;
    return false;
  };

  const addMaterialToSelectedMateriales = async (material) => {
    if (!verificarMaterialInSelectedMateriales(material.id)) {
      const { data } = await axiosRequest(
        "get",
        `/api/mantenimiento/maestro-de-codigos/configuracion/materiales/${material.id}`
      );
      const cotMaterial = data.cotizacionToMaterial.find(
        (cotMat) => cotMat.cotizacionId === material.nroCotizacion
      );
      data.cantidad = cotMaterial.cantidadMateriales;
      const nuevoMateriales = structuredClone(selectedMateriales.materiales);
      nuevoMateriales.push(data);
      setSelectedMateriales({ ...selectedMateriales, materiales: nuevoMateriales });
    }
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
      // setDescuento(Number(e.target.value));
    } else if (Number(e.target.value) < Number(descuentosLimites?.de)) {
      setForm({ ...form, descuento: Number(descuentosLimites?.de) });
      // setDescuento(Number(descuentosLimites?.de));
    } else {
      setForm({ ...form, descuento: Number(descuentosLimites?.a) });
      // setDescuento(Number(descuentosLimites?.a));
    }
  };

  useEffect(() => {
    if (selectedMateriales.materiales?.length > 0) {
      let subtotalTemp = 0;
      const materialesTemp = [];
      for (const material of selectedMateriales.materiales) {
        const valorMaterial = Number(material.ventaUnidad) || 50;
        const cantidad = Number(material.cantidad);
        subtotalTemp += valorMaterial * cantidad;
        materialesTemp.push({ id: material.id, cantidadMateriales: material.cantidad });
      }
      const descuentoTemp = form.descuento || 0;
      const igvTemp = igv?.valor || 0;
      const subtotalNetoTemp = subtotalTemp - (subtotalTemp * descuentoTemp) / 100;
      const totalIgv = (subtotalNetoTemp * igvTemp) / 100;
      const totalSolesTemp = subtotalNetoTemp + subtotalNetoTemp + totalIgv;
      setForm({
        ...form,
        subtotal: subtotalTemp,
        subtotalValorNeto: subtotalNetoTemp,
        totalSoles: totalSolesTemp,
        materiales: materialesTemp,
        igv: totalIgv,
      });
    }
  }, [selectedMateriales, form.descuento]);

  const verificarTamanioSelectedMateriales = () => {
    return selectedMateriales?.materiales?.length > 0;
  };

  useEffect(() => {
    console.log(form);
  }, [form]);

  return (
    <>
      <Container whiteColor={true}>
        <Title text={"Cotizaciones Aprobadas"}>
          <ButtonAdd text={"Aprobar cotizacion"} onClick={() => openModal(false)} />
        </Title>
        {/* Table List */}
        <TableComplete
          columns={columns}
          data={cotizacionesAprobadasShow}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </Container>
      {/* Modal agregar */}
      <ModalLg
        title={isEdit ? "Editar Cotización Aprobada" : "Nueva Aprobación de Cotización"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* form  */}
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
          <GroupIntern title={""}>
            <GroupInputsIntern title={"Clientes"}>
              <Search
                onFocus={(e) => {
                  console.log(isOpenSearchCliente);
                }}
                // onBlur={() => setIsOpenSearchCliente(false)}
                onChange={(e) => handleSearchClientes(e)}
                isDisabled={verificarTamanioSelectedMateriales()}
              />
              <Dropdown isOpen={true} elements={clientesSearch.length}>
                {clientesSearch?.map((cliente) => {
                  return (
                    <DropdownItem
                      handleClick={() => {
                        setSelectedCliente(cliente);
                        setForm({ ...form, clienteId: cliente.id });
                        setIsOpenSearchCliente(false);
                      }}
                      key={cliente.id}
                      name={`Cliente: ${cliente.nombre} - ${cliente.tipoDocumento}: ${cliente.numeroDocumento} - ${cliente.codigo}`}
                    />
                  );
                })}
              </Dropdown>
              <TableForSelections
                columns={columnsClientes}
                data={clientesShow || []}
                customFunction={getCotizaciones}
              />
            </GroupInputsIntern>

            <GroupInputsIntern title={"Cotizaciones"}>
              <TableForSelections
                columns={columnsCotizaciones}
                data={cotizacionesShow || []}
                customFunction={setMaterialesCodigos}
              />
            </GroupInputsIntern>
          </GroupIntern>

          <Group title={"Códigos de la Cotización"}>
            <TableForSelections
              columns={columnsCodigosCotizacion}
              data={codigosShow || []}
              customFunction={addMaterialToSelectedMateriales}
            />
          </Group>

          <Group title={""}>
            <TableMaterialesForm
              columns={columnsMateriales}
              data={materialesShow || []}
              isSearching={false}
            />

            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">Subtotal valor venta soles</span>
                </div>
                <div>
                  <Input disabled value={form.subtotal} />
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
                    disabled={selectedMateriales.materiales?.length === 0}
                    onChange={(e) => handleDescuentoInput(e)}
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
                  <Input disabled value={form.subtotalValorNeto} />
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
                    value={form?.igv}
                    onChange={(e) => setForm({ ...form, igv: Number(e.target.value) })}
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
                  <Input disabled value={form.totalSoles} />
                </div>
              </div>
            </GroupInputs>
            <Divider />
          </Group>
        </form>

        <div className="w-full flex justify-end gap-5">
          <ButtonCancel onClick={closeModal} />
          <ButtonSave onClick={saveData} />
        </div>
      </ModalLg>

      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={deleteRegistro}
        title={"Eliminar Empresa"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
