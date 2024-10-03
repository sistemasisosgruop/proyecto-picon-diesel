import { Checkbox, Input, Option, Select } from "@material-tailwind/react";
import { useContext, useMemo, useState, useEffect } from "react";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonImportData,
  ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Group, GroupInputs } from "../../../../app/components/elements/Form";
import { Title } from "../../../../app/components/elements/Title";
import {
  ModalConfirmDelete,
  ModalLg,
  ModalMaterialDetalle,
} from "../../../../app/components/modules/Modal";
import TableCodigos from "../../../../app/components/modules/TableCodigos";
import TableMateriales from "../../../../app/components/modules/TableMateriales";
import TemplateMaestroCodigos from "../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
import { useModal } from "../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { useQuery } from "react-query";
import { Search } from "../../../../app/components/elements/Search";
import { Dropdown, DropdownItem } from "../../../../app/components/elements/Dropdown";
import { MaterialesContext } from "../../../../contexts/materiales.context";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { toast } from "react-toastify";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import * as yup from "yup";
import { FormContext } from "../../../../contexts/form.context";
import TableCodigosDetalle from "../../../../app/components/modules/TableCodigosDetalle";

const schema = yup.object().shape({
  familiaId: yup.number(),
  subFamiliaId: yup.number(),
  denominacion: yup.string().required(),
  codigoFabricante: yup.string().required(),
  tipoFabricante: yup.string().required(),
  codigoMotorOriginal: yup.string().required(),
  codigoBombaInyeccion: yup.string().required(),
  caracteristicas: yup.array().nullable(),
  materialReemplazo: yup.array().nullable(),
  materialEquivalencia: yup.array().nullable(),
  materialSimilitud: yup.array().nullable(),
  aplicacionDeMaquina: yup.array().nullable(),
});

const updateSchema = yup.object().shape({
  familiaId: yup.number().nullable(),
  subFamiliaId: yup.number().nullable(),
  denominacion: yup.string().required(),
  codigoFabricante: yup.string().required(),
  tipoFabricante: yup.string().required(),
  codigoMotorOriginal: yup.string().required(),
  codigoBombaInyeccion: yup.string().required(),
  caracteristicas: yup.array().nullable(),
  materialReemplazo: yup.array().nullable(),
  materialEquivalencia: yup.array().nullable(),
  materialSimilitud: yup.array().nullable(),
  aplicacionDeMaquina: yup.array().nullable(),
});

export default function Materiales() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [selectedFamilia, setSelectedFamilia] = useState("");
  const [subfamilias, setSubfamilias] = useState([]);
  const [reemplazos, setReemplazos] = useState([]);
  const [similitudes, setSimilitudes] = useState([]);
  const [equivalencias, setEquivalencias] = useState([]);
  const [aplicacionMaquinas, setAplicacionMaquinas] = useState([]);
  const [isOpenCodigos, setIsOpenCodigos] = useState({
    reemplazo: false,
    similitud: false,
    equivalencia: false,
    aplicacionMaquina: false,
  });
  const [form, setForm] = useState({
    familiaId: null,
    subFamiliaId: null,
    denominacion: null,
    codigoFabricante: null,
    tipoFabricante: null,
    codigoMotorOriginal: null,
    codigoBombaInyeccion: null,
    caracteristicas: null,
    materialReemplazo: null,
    materialEquivalencia: null,
    materialSimilitud: null,
    aplicacionDeMaquina: null,
  });

  const { changeData, updateForm, elementId } = useContext(FormContext);
  const {
    codigos,
    setCodigos,
    correlativo,
    setCorrelativo,
    materialInfo,
    caracteristicasForm,
    setCaracteristicasForm,
  } = useContext(MaterialesContext);

  useEffect(() => {
    setForm({
      familiaId: null,
      subFamiliaId: null,
      denominacion: null,
      codigoFabricante: null,
      tipoFabricante: null,
      codigoMotorOriginal: null,
      codigoBombaInyeccion: null,
      caracteristicas: null,
      materialReemplazo: null,
      materialEquivalencia: null,
      materialSimilitud: null,
      aplicacionDeMaquina: null,
    });
    refetch();
    setCaracteristicasForm([]);
  }, [changeData]);

  useEffect(() => {
    setCodigos({
      reemplazo: [],
      similitud: [],
      equivalencia: [],
      aplicacionMaquina: [],
    });
  }, []);

  useEffect(() => {
    if (isEdit) {
      setForm({
        ...form,
        caracteristicas: caracteristicasForm,
        materialReemplazo: codigos.reemplazo,
        materialEquivalencia: codigos.equivalencia,
        materialSimilitud: codigos.similitud,
        aplicacionDeMaquina: codigos.aplicacionMaquina,
        denominacion: updateForm?.denominacion,
        codigoFabricante: updateForm?.codigoFabricante,
        tipoFabricante: updateForm?.tipoFabricante,
        codigoMotorOriginal: updateForm?.codigoMotorOriginal,
        codigoBombaInyeccion: updateForm?.codigoBombaInyeccion,
      });
    }
  }, [codigos, caracteristicasForm, updateForm]);

  const createRegistro = async () => {
    console.log(form);
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/maestro-de-codigos/configuracion/materiales", {
      ...form,
      empresaId: parseInt(empresaId),
      familiaId: parseInt(form.familiaId),
      subFamiliaId: parseInt(form.subFamiliaId),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    console.log(form);
    await updateSchema.validate(form, { abortEarly: false });
    await axiosRequest(
      "put",
      `/api/mantenimiento/maestro-de-codigos/configuracion/materiales/${elementId}`,
      {
        ...form,
        empresaId: parseInt(empresaId),
        familiaId: parseInt(form.familiaId),
        subFamiliaId: parseInt(form.subFamiliaId),
      }
    );

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };
  const deleteData = async () => {
    try {
      await axiosRequest(
        "delete",
        `/api/mantenimiento/maestro-de-codigos/configuracion/materiales/${elementId}`
      );
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
      setForm({
        familiaId: null,
        subFamiliaId: null,
        denominacion: null,
        codigoFabricante: null,
        tipoFabricante: null,
        codigoMotorOriginal: null,
        codigoBombaInyeccion: null,
        caracteristicas: null,
        materialReemplazo: null,
        materialEquivalencia: null,
        materialSimilitud: null,
        aplicacionDeMaquina: null,
      });
      setCaracteristicasForm([]);
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Código", accessor: "codigo" },
      { Header: "Familia", accessor: "familia" },
      { Header: "SubFamilia", accessor: "subFamilia" },
      { Header: "Correlativo", accessor: "correlativo" },
      { Header: "Denominación", accessor: "denominacion" },
      { Header: "Stock", accessor: "stock" },
      { Header: "Código de Fabricante", accessor: "codigoFabricante" },
      { Header: "Tipo de Fabricante", accessor: "tipoFabricante" },
      {
        Header: "Código de Motor Original",
        accessor: "codigoMotorOriginal",
      },
      {
        Header: "Código de Bomba de Inyección",
        accessor: "codigoBombaInyeccion",
      },
    ],
    []
  );

  const maquinasColums = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Fábrica Máquina", accessor: "fabricaMaquina" },
      { Header: "Modelo Máquina", accessor: "modeloMaquina" },
      { Header: "Nombre Máquina", accessor: "nombreMaquina" },
      { Header: "Procedencia Máquina", accessor: "procedencia" },
      {
        Header: "Código Original del Motor",
        accessor: "codigoOriginalMotor",
      },
      { Header: "Modelo del Motor", accessor: "modeloMotor" },
      { Header: "Marca del Motor", accessor: "marcaMotor" },
      { Header: "Procedencia del Motor", accessor: "procedenciaMotor" },
      { Header: "N° de cilindros", accessor: "numeroCilindros" },
      {
        Header: "Código fábrica Bomba de Inyeccion",
        accessor: "codigoFabricaBombaInyeccion",
      },
      {
        Header: "Tipo de Bomba de Inyeccion",
        accessor: "tipoBombaInyeccion",
      },
      {
        Header: "Marca fábrica de Sistema deInyeccion",
        accessor: "marcaFabricaSistemaInyeccion",
      },
      {
        Header: "Descripción de Bomba de Inyeccion",
        accessor: "descripcionBombasInyeccion",
      },
      {
        Header: "Procedencia Bomba de Inyeccion",
        accessor: "procedenciaBombaInyeccion",
      },
      {
        Header: "Código Original de Bomba de Inyección",
        accessor: "codigoOriginalBombaInyeccion",
      },
      {
        Header: "Código fábrica de Inyector",
        accessor: "codigoFabricaInyector",
      },
      {
        Header: "Tipo fábrica de Inyector",
        accessor: "tipoFabricaInyector",
      },
      {
        Header: "Marca fábrica de Inyector",
        accessor: "marcaFabricaInyector",
      },
      { Header: "Descripción Inyector", accessor: "descripcionInyector" },
      {
        Header: "Código Original de Inyector",
        accessor: "codigoOriginalInyector",
      },
      { Header: "Código Tobera", accessor: "codigoTobera" },
      { Header: "Tipo Tobera", accessor: "tipoTobera" },
    ],
    []
  );

  const getMateriales = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/materiales?empresaId=${empresaId}`
    );

    return data;
  };

  const { data: materialesResponse, refetch } = useQuery("materiales", getMateriales, {
    initialData: {
      data: [],
    },
  });

  const handleSearch = async ({ target }, searchType) => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/materiales?empresaId=${empresaId}&filter=${target.value}`
    );

    switch (searchType) {
      case "reemplazo":
        setReemplazos(data?.data);
        break;
      case "similitud":
        setSimilitudes(data?.data);
        break;
      case "equivalencia":
        setEquivalencias(data?.data);
        break;
      case "aplicacionMaquina":
        setAplicacionMaquinas(data?.data);
        break;
    }
  };

  const handleSearchMaquina = async ({ target }) => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/maquinas?empresaId=${empresaId}&filter=${target.value}`
    );

    setAplicacionMaquinas(data?.data);
  };

  const materiales = useMemo(
    () =>
      materialesResponse?.data.map(({ familia, subfamilia, ...info }) => ({
        ...info,
        familia: familia.codigo,
        subFamilia: subfamilia.codigo,
      })),
    [materialesResponse?.data]
  );

  const getFormInfo = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/empresas/info-material/${empresaId}`
    );

    return data;
  };
  const { data: formInfo } = useQuery("formInfo", getFormInfo, {
    initialData: {
      data: {},
    },
  });

  const getSubfamilias = async (familiaId) => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/familias/subfamilias?familiaId=${familiaId}`
    );

    setSubfamilias(data?.data);
  };

  const caracteristicas = useMemo(() => formInfo?.data?.caracteristica ?? [], [formInfo?.data]);
  const familias = useMemo(() => formInfo?.data.familia, [formInfo?.data]);

  const codigosReemplazo = useMemo(
    () =>
      codigos?.reemplazo.map(({ familia, subfamilia, ...info }) => ({
        ...info,
        familia: familia.codigo,
        subFamilia: subfamilia.codigo,
      })),

    [codigos]
  );
  const codigosSimilitud = useMemo(
    () =>
      codigos?.similitud.map(({ familia, subfamilia, ...info }) => ({
        ...info,
        familia: familia.codigo,
        subFamilia: subfamilia.codigo,
      })),

    [codigos]
  );
  const codigosEquivalencia = useMemo(
    () =>
      codigos?.equivalencia.map(({ familia, subfamilia, ...info }) => ({
        ...info,
        familia: familia.codigo,
        subFamilia: subfamilia.codigo,
      })),

    [codigos]
  );
  const codigosAplicacionMaquina = useMemo(
    () =>
      codigos?.aplicacionMaquina.map((maquina) => {
        return {
          id: maquina.id,
          codigo: maquina.codigo,
          fabricaMaquina: maquina.fabricaMaquina.fabrica,
          modeloMaquina: maquina.modeloMaquina.modelo,
          nombreMaquina: maquina.nombreMaquina.nombre,
          procedencia: maquina.procedencia.nombre,

          modeloMotor: maquina.modeloMotor,
          marcaMotor: maquina.marcaMotor.marca,
          procedenciaMotor: maquina.procedenciaMotor.nombre,
          numeroCilindros: maquina.numeroCilindros,
          codigoOriginalMotor: maquina.codigoOriginal,

          codigoFabricaBombaInyeccion: maquina.codigoFabricaBombaInyeccion,
          tipoBombaInyeccion: maquina.tipoBombaInyeccion,
          marcaFabricaSistemaInyeccion: maquina.marcaFabricaSistemaInyeccion.marca,
          descripcionBombasInyeccion: maquina.descripcionBombaInyeccion.descripcion,
          procedenciaBombaInyeccion: maquina.procedenciaBombaInyeccion.nombre,
          codigoOriginalBombaInyeccion: maquina.codigoOriginalBombaInyeccion,

          codigoFabricaInyector: maquina.codigoFabricaInyector,
          tipoFabricaInyector: maquina.tipoFabricaInyector,
          marcaFabricaInyector: maquina.marcaFabricaInyector.marca,
          codigoOriginalInyector: maquina.codigoOriginalInyector,
          descripcionInyector: maquina.descripcionInyector.descripcion,

          codigoTobera: maquina.codigoTobera,
          tipoTobera: maquina.tipoTobera,
        };
      }),

    [codigos]
  );

  //  DETALLE DEL MATERIAL

  const detalleAplicacionMaquina = useMemo(
    () =>
      materialInfo?.aplicacionDeMaquina?.map((maquina) => {
        return {
          id: maquina.id,
          codigo: maquina.codigo,
          fabricaMaquina: maquina.fabricaMaquina.fabrica,
          modeloMaquina: maquina.modeloMaquina.modelo,
          nombreMaquina: maquina.nombreMaquina.nombre,
          procedencia: maquina.procedencia.nombre,

          modeloMotor: maquina.modeloMotor,
          marcaMotor: maquina.marcaMotor.marca,
          procedenciaMotor: maquina.procedenciaMotor.nombre,
          numeroCilindros: maquina.numeroCilindros,
          codigoOriginalMotor: maquina.codigoOriginal,

          codigoFabricaBombaInyeccion: maquina.codigoFabricaBombaInyeccion,
          tipoBombaInyeccion: maquina.tipoBombaInyeccion,
          marcaFabricaSistemaInyeccion: maquina.marcaFabricaSistemaInyeccion.marca,
          descripcionBombasInyeccion: maquina.descripcionBombaInyeccion.descripcion,
          procedenciaBombaInyeccion: maquina.procedenciaBombaInyeccion.nombre,
          codigoOriginalBombaInyeccion: maquina.codigoOriginalBombaInyeccion,

          codigoFabricaInyector: maquina.codigoFabricaInyector,
          tipoFabricaInyector: maquina.tipoFabricaInyector,
          marcaFabricaInyector: maquina.marcaFabricaInyector.marca,
          codigoOriginalInyector: maquina.codigoOriginalInyector,
          descripcionInyector: maquina.descripcionInyector.descripcion,

          codigoTobera: maquina.codigoTobera,
          tipoTobera: maquina.tipoTobera,
        };
      }) ?? [],
    [materialInfo]
  );
  const detalleMaterialEquivalencia = useMemo(
    () =>
      materialInfo?.materialEquivalencia?.map(({ familia, subfamilia, ...info }) => ({
        ...info,
        familia: familia.codigo,
        subFamilia: subfamilia.codigo,
      })) ?? [],
    [materialInfo]
  );
  const detalleMaterialReemplazo = useMemo(
    () =>
      materialInfo?.materialReemplazo?.map(({ familia, subfamilia, ...info }) => ({
        ...info,
        familia: familia.codigo,
        subFamilia: subfamilia.codigo,
      })) ?? [],
    [materialInfo]
  );
  const detalleMaterialSimilitud = useMemo(
    () =>
      materialInfo?.materialSimilitud?.map(({ familia, subfamilia, ...info }) => ({
        ...info,
        familia: familia.codigo,
        subFamilia: subfamilia.codigo,
      })) ?? [],
    [materialInfo]
  );

  const caracteristicaToMaterialData = useMemo(
    () =>
      materialInfo?.caracteristicaToMaterial?.map(({ caracteristica, valor }) => ({
        id: caracteristica.id,
        nombre: caracteristica.descripcion,
        valor,
      })) ?? [],
    [materialInfo]
  );

  // EDITAR MATERIAL

  const caracteristicaToMaterialDataUpdate = useMemo(
    () =>
      updateForm?.caracteristicaToMaterial?.map(({ caracteristica, valor, isChecked }) => ({
        id: caracteristica.id,
        nombre: caracteristica.descripcion,
        isChecked,
        valor,
      })) ?? [],
    [updateForm]
  );

  // MERGE caracteristicas and caracteristicaToMaterialDataUpdate

  const caracteristicasMerged = useMemo(
    () =>
      [...caracteristicas, ...caracteristicaToMaterialDataUpdate].reduce((acc, cur) => {
        const existing = acc.find((item) => item.id === cur.id);
        if (existing) {
          return acc.map((item) => (item.id === cur.id ? { ...item, ...cur } : item));
        }
        return [...acc, cur];
      }, []),
    [caracteristicaToMaterialDataUpdate]
  );

  const currentCaracteristicas = () => {
    if (isEdit) {
      return [...caracteristicasMerged];
    }
    return [...caracteristicas];
  };

  return (
    <>
      <TemplateMaestroCodigos>
        <Title text={"Lista Materiales"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd text={"Nuevo material"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableMateriales
          columns={columns}
          data={materiales}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateMaestroCodigos>
      {/* Modal agregar */}
      <ModalLg
        title={isEdit ? "Editar Material" : "Nuevo Material"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-2 gap-5">
          
          <Group title={"Datos del Material"}>
            <GroupInputs>
              <Select
                label="Familia"
                onChange={(value) => {
                  const currentFamilia = familias?.find((item) => item.id === Number(value));
                  setSelectedFamilia(currentFamilia.codigo);
                  getSubfamilias(currentFamilia.id);
                  setCorrelativo(`${currentFamilia.codigo} + `);
                  setForm({ ...form, familiaId: currentFamilia.id });
                }}
              >
                {familias?.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item?.descripcion}
                    </Option>
                  );
                })}
              </Select>
              <Select
                label="SubFamilia"
                onChange={(value) => {
                  const currentSubFamilia = subfamilias?.find((item) => item.id === Number(value));
                  setForm({ ...form, subFamiliaId: value });
                  setCorrelativo(`${selectedFamilia} + ${currentSubFamilia.codigo} + COD.`);
                }}
              >
                {subfamilias?.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item?.descripcion}
                    </Option>
                  );
                })}
              </Select>
              <Input
                label="Correlativo"
                disabled
                value={correlativo}
                defaultValue={isEdit ? updateForm?.correlativo : undefined}
              />
            </GroupInputs>
            <Input
              label={"Denominación"}
              defaultValue={isEdit ? updateForm?.denominacion : undefined}
              onChange={(e) =>
                setForm({
                  ...form,
                  denominacion: e.target.value,
                })
              }
            />
            <GroupInputs>
              <Input
                label={"Código fabricante"}
                defaultValue={isEdit ? updateForm?.codigoFabricante : undefined}
                onChange={(e) =>
                  setForm({
                    ...form,
                    codigoFabricante: e.target.value,
                  })
                }
              />
              <Input
                label={"Tipo fabricante"}
                defaultValue={isEdit ? updateForm?.tipoFabricante : undefined}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tipoFabricante: e.target.value,
                  })
                }
              />
            </GroupInputs>
            <GroupInputs>
              <Input
                label={"Código de motor original"}
                defaultValue={isEdit ? updateForm?.codigoMotorOriginal : undefined}
                onChange={(e) =>
                  setForm({
                    ...form,
                    codigoMotorOriginal: e.target.value,
                  })
                }
              />
              <Input
                label={"Código de bomba de inyección"}
                defaultValue={isEdit ? updateForm?.codigoBombaInyeccion : undefined}
                onChange={(e) =>
                  setForm({
                    ...form,
                    codigoBombaInyeccion: e.target.value,
                  })
                }
              />
            </GroupInputs>
          </Group>
          
          {/* Codigos de reemplazo */}
          <Group title={"Codigos de reemplazo"}>
            <Search
              onFocus={() => setIsOpenCodigos({ ...isOpenCodigos, reemplazo: true })}
              onChange={(event) => {
                handleSearch(event, "reemplazo");
              }}
            />
            <Dropdown isOpen={isOpenCodigos.reemplazo} elements={reemplazos.length}>
              {reemplazos?.map((reemplazo) => {
                return (
                  <DropdownItem
                    handleClick={() => {
                      const currentCodigos = codigos.reemplazo;
                      const findCodigo = currentCodigos.some(
                        (material) => material.id === reemplazo.id
                      );
                      if (!findCodigo) {
                        currentCodigos.push({ ...reemplazo, tipoCodigo: "reemplazo" });
                      }

                      setCodigos({ ...codigos, reemplazo: currentCodigos });
                      setIsOpenCodigos({ ...isOpenCodigos, reemplazo: false });
                    }}
                    key={reemplazo.id}
                    name={`COD: ${reemplazo?.codigo} - COD Fabricante: ${reemplazo?.codigoFabricante} - 
                    Tipo de fabricante: ${reemplazo?.tipoFabricante} - Correlativo: ${reemplazo?.correlativo}`}
                  />
                );
              })}
            </Dropdown>
            <TableCodigos columns={columns} data={codigosReemplazo} />
          </Group>
          {/* Codigos similitud */}
          <Group title={"Codigos de similitud"}>
            <Search
              onFocus={() => setIsOpenCodigos({ ...isOpenCodigos, similitud: true })}
              onChange={(event) => {
                handleSearch(event, "similitud");
              }}
            />
            <Dropdown isOpen={isOpenCodigos.similitud} elements={similitudes.length}>
              {similitudes?.map((similitud) => {
                return (
                  <DropdownItem
                    handleClick={() => {
                      const currentCodigos = codigos.similitud;
                      const findCodigo = currentCodigos.some(
                        (material) => material.id === similitud.id
                      );
                      if (!findCodigo) {
                        currentCodigos.push({ ...similitud, tipoCodigo: "similitud" });
                      }

                      setCodigos({ ...codigos, similitud: currentCodigos });
                      setIsOpenCodigos({ ...isOpenCodigos, similitud: false });
                    }}
                    key={similitud.id}
                    name={`COD: ${similitud?.codigo} - COD Fabricante: ${similitud?.codigoFabricante} - 
                    Tipo de fabricante: ${similitud?.tipoFabricante} - Correlativo: ${similitud?.correlativo}`}
                  />
                );
              })}
            </Dropdown>
            <TableCodigos columns={columns} data={codigosSimilitud} />
          </Group>
          {/* Codigos equivalencia */}
          <Group title={"Codigos de equivalencia"}>
            <Search
              onFocus={() => setIsOpenCodigos({ ...isOpenCodigos, equivalencia: true })}
              onChange={(event) => {
                handleSearch(event, "equivalencia");
              }}
            />
            <Dropdown isOpen={isOpenCodigos.equivalencia} elements={equivalencias.length}>
              {equivalencias?.map((equivalencia) => {
                return (
                  <DropdownItem
                    handleClick={() => {
                      const currentCodigos = codigos.equivalencia;
                      const findCodigo = currentCodigos.some(
                        (material) => material.id === equivalencia.id
                      );
                      if (!findCodigo) {
                        currentCodigos.push({ ...equivalencia, tipoCodigo: "equivalencia" });
                      }

                      setCodigos({ ...codigos, equivalencia: currentCodigos });
                      setIsOpenCodigos({ ...isOpenCodigos, equivalencia: false });
                    }}
                    key={equivalencia.id}
                    name={`COD: ${equivalencia?.codigo} - COD Fabricante: ${equivalencia?.codigoFabricante} - 
                    Tipo de fabricante: ${equivalencia?.tipoFabricante} - Correlativo: ${equivalencia?.correlativo}`}
                  />
                );
              })}
            </Dropdown>
            <TableCodigos columns={columns} data={codigosEquivalencia} />
          </Group>
          {/* Caracteristicas */}
          <Group title={"Seleccionar caracteristicas"}>
            {currentCaracteristicas()?.map((caracteristica) => (
              <div
                key={caracteristica.id}
                className="flex flex-row gap-5 items-center justify-between"
              >
                <Checkbox
                  onChange={(e) => {
                    const newCaracteristicas = caracteristicasForm;
                    const caracteristicaIndex = newCaracteristicas.findIndex(
                      (item) => item.caracteristicaId === caracteristica.id
                    );
                    if (caracteristicaIndex !== -1) {
                      newCaracteristicas[caracteristicaIndex] = {
                        ...caracteristicasForm[caracteristicaIndex],
                        isChecked: e.target.checked,
                      };
                    } else {
                      newCaracteristicas.push({
                        caracteristicaId: caracteristica.id,
                        isChecked: e.target.checked,
                      });
                    }
                    setCaracteristicasForm(newCaracteristicas);
                  }}
                  id={caracteristica.id.toString()}
                  label={caracteristica.descripcion}
                  defaultChecked={!!caracteristica?.isChecked}
                />
                <div className="w-72">
                  <Input
                    onChange={(e) => {
                      const newCaracteristicas = caracteristicasForm;
                      const caracteristicaIndex = newCaracteristicas.findIndex(
                        (item) => item.caracteristicaId === caracteristica.id
                      );
                      if (caracteristicaIndex !== -1) {
                        newCaracteristicas[caracteristicaIndex] = {
                          ...caracteristicasForm[caracteristicaIndex],
                          valor: e.target.value,
                        };
                      } else {
                        newCaracteristicas.push({
                          caracteristicaId: caracteristica.id,
                          valor: e.target.value,
                        });
                      }
                      setCaracteristicasForm(newCaracteristicas);
                    }}
                    label={"Valor"}
                    defaultValue={caracteristica?.valor ?? undefined}
                  />
                </div>
              </div>
            ))}
          </Group>
          {/* Aplicación de la maquina */}
          <Group title={"Aplicación de la máquina"}>
            <Search
              onFocus={() => setIsOpenCodigos({ ...isOpenCodigos, aplicacionMaquina: true })}
              onChange={handleSearchMaquina}
            />
            <Dropdown isOpen={isOpenCodigos.aplicacionMaquina} elements={aplicacionMaquinas.length}>
              {aplicacionMaquinas?.map((aplicacionMaquina) => {
                return (
                  <DropdownItem
                    handleClick={() => {
                      const currentCodigos = codigos.aplicacionMaquina;
                      const findCodigo = currentCodigos.some(
                        (material) => material.id === aplicacionMaquina.id
                      );
                      if (!findCodigo) {
                        currentCodigos.push({
                          ...aplicacionMaquina,
                          tipoCodigo: "aplicacionMaquina",
                        });
                      }

                      setCodigos({ ...codigos, aplicacionMaquina: currentCodigos });
                      setIsOpenCodigos({ ...isOpenCodigos, aplicacionMaquina: false });
                    }}
                    key={aplicacionMaquina.id}
                    name={`COD: ${aplicacionMaquina?.codigo} - COD. Fabrica: ${aplicacionMaquina?.fabricaMaquina.fabrica} - 
                    Modelo de maquina: ${aplicacionMaquina?.modeloMaquina.modelo} - COD. Motor: ${aplicacionMaquina?.codigoOriginal}`}
                  />
                );
              })}
            </Dropdown>
            <TableCodigos columns={maquinasColums} data={codigosAplicacionMaquina} />
          </Group>
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </ModalLg>
      {/* Modal Material Detalle */}
      <ModalMaterialDetalle title={"Material Detalle"}>
        <div className="flex flex-row gap-4">
          <div>
            <Group title={"Datos del Material"}>
              <Input label={materialInfo?.familia} disabled />
              <Input label={materialInfo?.subFamilia} disabled />
              <Input label={materialInfo?.correlativo} disabled />
              <Input label={materialInfo?.denominacion} disabled />
              <GroupInputs>
                <Input label={materialInfo?.codigoFabricante} disabled />
                <Input label={materialInfo?.tipoFabricante} disabled />
              </GroupInputs>
            </Group>
            <br />
            <Group title={"Caracteristicas"}>
              <table className="min-w-full text-center">
                <thead className="text-left border-b">
                  <tr className="text-left">
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-2">
                      ID
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-2">
                      Caracteristica
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {caracteristicaToMaterialData?.map(({ id, valor, nombre }) => {
                    return (
                      <tr key={id}>
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {id}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-2 whitespace-nowrap">
                          <GroupInputs>
                            <div className="flex flex-row justify-end items-end w-full gap-2">
                              <div className="flex justify-center items-center">
                                <span>
                                  {nombre.length >= 15 ? `${nombre.slice(0, 14)}...` : nombre}
                                </span>
                              </div>
                              <div>
                                <Input label={valor} disabled />
                              </div>
                            </div>
                          </GroupInputs>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Group>
          </div>
          <div className="overflow-x-auto">
            <br />
            <Group title={"Codigos de reemplazo"}>
              <TableCodigosDetalle columns={columns} data={detalleMaterialReemplazo} />
            </Group>
            <br />
            <Group title={"Codigos de similitud"}>
              <TableCodigosDetalle columns={columns} data={detalleMaterialSimilitud} />
            </Group>
            <br />
            <Group title={"Codigos de equivalencia"}>
              <TableCodigosDetalle columns={columns} data={detalleMaterialEquivalencia} />
            </Group>
          </div>
        </div>
        <Group title={"Aplicacion de la maquina"}>
          <TableCodigosDetalle columns={maquinasColums} data={detalleAplicacionMaquina} />
        </Group>
      </ModalMaterialDetalle>

      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={deleteData}
        title={"Eliminar Máquina"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
