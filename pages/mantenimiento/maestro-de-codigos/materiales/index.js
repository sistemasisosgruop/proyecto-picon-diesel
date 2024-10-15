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
import { ArrowDown, ArrowLeft2, ArrowRight2, ArrowUp, SearchNormal1, FilterSearch } from "iconsax-react";
import { Table as Tabla, TableD, TableDOptions, TableHOptions, TableRH } from "../../../../app/components/elements/Table";
import { ButtonCodigos, ButtonDelete, ButtonEdit, ButtonInspect } from "../../../../app/components/elements/Buttons";

const schema = yup.object().shape({
  familiaId: yup.number(),
  subFamiliaId: yup.number(),
  denominacion: yup.string().required(),
  codigoFabricante: yup.string().required(),
  // tipoFabricante: yup.string().required(),      //! REMOVER
  // codigoMotorOriginal: yup.string().required(), //! REMOVER
  // codigoBombaInyeccion: yup.string().required(), //! REMOVER
  caracteristicaToMaterial: yup.array().nullable(),
  materialReemplazo: yup.array().nullable(),
  materialEquivalencia: yup.array().nullable(),
  materialSimilitud: yup.array().nullable(),
  aplicacionDeMaquina: yup.array().nullable(),
  // marca: yup.string().nullable(), //Nuevos
  marcaID:yup.number(),
  nombreInterno: yup.string().nullable(), //Nuevos
  nombreComercial: yup.string().nullable(), //Nuevos
});

const updateSchema = yup.object().shape({
  familiaId: yup.number().nullable(),
  subFamiliaId: yup.number().nullable(),
  denominacion: yup.string().required(),
  codigoFabricante: yup.string().required(),
  // tipoFabricante: yup.string().required(),          //! REMOVER
  // codigoMotorOriginal: yup.string().required(),     //! REMOVER
  // codigoBombaInyeccion: yup.string().required(),    //! REMOVER
  caracteristicaToMaterial: yup.array().nullable(),
  materialReemplazo: yup.array().nullable(),
  materialEquivalencia: yup.array().nullable(),
  materialSimilitud: yup.array().nullable(),
  aplicacionDeMaquina: yup.array().nullable(),
  // marca: yup.string().nullable(), //Nuevos
  marcaID:yup.number(),
  nombreInterno: yup.string().nullable(), //Nuevos
  nombreComercial: yup.string().nullable(), //Nuevos

});

export default function Materiales() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [selectedFamilia, setSelectedFamilia] = useState("");
  const [subfamilias, setSubfamilias] = useState([]);
  const [marcas, setMarcas] = useState([]);
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
    // tipoFabricante: null,         //! REMOVER
    // codigoMotorOriginal: null,    //! REMOVER
    // codigoBombaInyeccion: null,   //! REMOVER
    caracteristicaToMaterial: null,
    materialReemplazo: null,
    materialEquivalencia: null,
    materialSimilitud: null,
    aplicacionDeMaquina: null,
    marca: null,            //nuevos
    marcaId:null,
    nombreInterno: null,    //nuevos
    nombreComercial: null,  //nuevos
  });

const [subsUpdate,setSubsUpdate]= useState(0);

  const { changeData, updateForm, elementId } = useContext(FormContext);
  const {
    codigos,
    setCodigos,
    openInfoModal,
    setMaterialInfo,
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
      // tipoFabricante: null,           //! REMOVER
      // codigoMotorOriginal: null,      //! REMOVER
      // codigoBombaInyeccion: null,     //! REMOVER
      caracteristicaToMaterial: null,
      materialReemplazo: null,
      materialEquivalencia: null,
      materialSimilitud: null,
      aplicacionDeMaquina: null,
      marca: null,            //nuevos
      marcaId:null,
      nombreInterno: null,    //nuevos
      nombreComercial: null,  //nuevos
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

  //! Si es un edit de Materiles
  useEffect(() => {
    if (isEdit) {
      setForm((prevForm) => ({
        ...prevForm,
        caracteristicaToMaterial: caracteristicasForm,
        materialReemplazo: codigos.reemplazo,
        materialEquivalencia: codigos.equivalencia,
        materialSimilitud: codigos.similitud,
        aplicacionDeMaquina: codigos.aplicacionMaquina,
        denominacion: updateForm?.denominacion,
        codigoFabricante: updateForm?.codigoFabricante,
        marca: updateForm?.marca,
        marcaId: updateForm?.marcaId,                              
        nombreComercial: updateForm?.nombreComercial,
        // Si el nombreInterno ya está siendo calculado dinámicamente, no lo sobrescribas aquí
        nombreInterno: prevForm.nombreInterno || updateForm?.nombreInterno,
      }));
    }
  }, [codigos, caracteristicasForm, updateForm]);
  

  const createRegistro = async () => {
    // console.log('Form a enviar materiales:',form);
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
    // console.log('updateando material:',form);
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
        // tipoFabricante: null, //! REMOVER
        // codigoMotorOriginal: null,  //! REMOVER
        // codigoBombaInyeccion: null, //! REMOVER
        caracteristicaToMaterial: null,
        materialReemplazo: null,
        materialEquivalencia: null,
        materialSimilitud: null,
        aplicacionDeMaquina: null,
        marca:null,
        marcaId:null,
        nombreInterno:null,
        nombreComercial:null
      });
      setCaracteristicasForm([]);
      closeModal();
      setPage(0);
      await handleSearchMaterials();
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
      { Header: "Marca", accessor: "marcaId", },
      { Header: "Nombre Interno", accessor: "nombreInterno", },
      { Header: "Nombre Comercial", accessor: "nombreComercial", }
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
      { Header: "Código fábrica Bomba de Inyeccion",
        accessor: "codigoFabricaBombaInyeccion",
      },
      { Header: "Tipo de Bomba de Inyeccion",
        accessor: "tipoBombaInyeccion",
      },
      { Header: "Marca fábrica de Sistema deInyeccion",
        accessor: "marcaFabricaSistemaInyeccion",
      },
      { Header: "Descripción de Bomba de Inyeccion",
        accessor: "descripcionBombasInyeccion",
      },
      { Header: "Procedencia Bomba de Inyeccion",
        accessor: "procedenciaBombaInyeccion",
      },
      { Header: "Código Original de Bomba de Inyección",
        accessor: "codigoOriginalBombaInyeccion",
      },
      { Header: "Código fábrica de Inyector",
        accessor: "codigoFabricaInyector",
      },
      { Header: "Tipo fábrica de Inyector",
        accessor: "tipoFabricaInyector",
      },
      { Header: "Marca fábrica de Inyector",
        accessor: "marcaFabricaInyector",
      },
      { Header: "Descripción Inyector", accessor: "descripcionInyector" },
      { Header: "Código Original de Inyector",
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
    console.log('Materiales data:',{data})
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


  // OBTENER MARCAS:

  const getMarcas = async () => {
    try {
      const { data } = await axiosRequest(
        'get',
        `/api/mantenimiento/maestro-de-codigos/configuracion/marca?empresaId=${empresaId}`
      );
      // console.log('Marcas obtenidas:', data); 
      setMarcas(data.data); // Guardar las marcas en el estado
    } catch (error) {
      console.error('Error fetching marcas:', error);
    }
  };

  useEffect(() => {
    if (isOpenModal) {
      getMarcas(); // Llamamos a la función para obtener las marcas cuando se abre el modal
      console.log({marcas})
    }
  }, [isOpenModal]); // El useEffect se ejecuta cuando el modal se abre

  console.log('Data de getFormInfo',{formInfo})
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
      materialInfo?.caracteristicaToMaterial?.map(({ caracteristica, valor,isChecked }) => ({
        id: caracteristica.id,
        nombre: caracteristica.descripcion,
        isChecked,
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


  useEffect(() => {
    if (isEdit && updateForm?.familiaId) {
      const currentFamilia = familias?.find((item) => item.id === updateForm.familiaId);
      if (currentFamilia) {
        setSelectedFamilia(currentFamilia.codigo);
        getSubfamilias(currentFamilia.id);
        console.log('La familia actual es: ',currentFamilia,'la subfamilia (edit) es:',updateForm.subfamiliaId)
        console.log('las subfamilias disponibles son: ',subfamilias)
        
        // setCorrelativo(`${currentFamilia.codigo} + `);

        setForm((prevForm) => ({ ...prevForm, familiaId: currentFamilia.id,subFamiliaId:updateForm.subfamiliaId }));
      }
    }
  }, [isEdit, updateForm?.familiaId, familias]);

    useEffect(() => {
      // console.log('Cambiando: ',updateForm?.subfamiliaId)
      setSubsUpdate(subsUpdate+1);
    }, [subfamilias]); // Se ejecuta cada vez que selectedFamilia cambia


//! BUSQUEDA POR FILTROS:

//! Función para alternar la visibilidad de la sección filtros
const [isCustomSearchVisible, setCustomSearchVisible] = useState(false);
const toggleCustomSearch = () => {
  setCustomSearchVisible(!isCustomSearchVisible);
};
//! Estados para cada input de filtros personalizados
const [nombreComercial, setNombreComercial] = useState('');
const [marca, setMarca] = useState('');
const [codigoReferencia, setCodigoReferencia] = useState('');
const [nombreInterno, setNombreInterno] = useState('');
// const [page,setPage] = useState(0);
const [dropdownMateriales, setDropdownMateriales] = useState([]); // Para almacenar los resultados de la API
const [page, setPage] = useState(0);
const [canPreviousPage, setCanPreviousPage] =useState(false);
const { setElementId, setUpdateForm } = useContext(FormContext);

//! onClick busqueda filtrada
const handleSearchMaterials = async () => {
  try {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/materiales?empresaId=${empresaId}&page=${page}&take=${30}&marca=${marca}&codigoReferencia=${codigoReferencia}&nombreComercial=${nombreComercial}&nombreInterno=${nombreInterno}`
    );
    // console.log('page es:',page);
    // console.log('Data filtrada:', data.data);

    const modifiedData = data.data.map(material => ({
      ...material,
      familia: material.familia?.codigo || material.familia, // Solo guarda el valor de 'codigo'
      subFamilia: material.subfamilia?.codigo || material.subfamilia, // Solo guarda el valor de 'codigo'
    }));

    // console.log('Data modificada:', modifiedData);

    setDropdownMateriales(modifiedData); // Almacenar el array modificado
  } catch (error) {
    console.error('Error fetching materials:', error);
  }
};

useEffect(() => {
  handleSearchMaterials();
}, [page]); // Se ejecuta cada vez que cambie `page`


function nextPage(){
  // console.log('Incremento',{page})
  setPage(page+1);
  setCanPreviousPage(true)
}
function prevPage(){
  let newPage = page-1;
  if(newPage<=0){
    newPage=0;
    setCanPreviousPage(false)
  }
  setPage(newPage);
}


  return (
    <>
      <TemplateMaestroCodigos>
        <Title text={"Lista Materiales"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd text={"Nuevo material"} onClick={() => openModal(false)} />
          </div>
        </Title>

        <button type="button" 
        className={`flex justify-center items-center p-1 gap-0 rounded-lg cursor-pointer w-[25%] text-sm
        ${isCustomSearchVisible ? 'bg-orange-500 text-white' : 'bg-secundary text-primary'}
        hover:${isCustomSearchVisible ? 'bg-primary-800' : 'bg-secundary-800'}`}
        onClick={toggleCustomSearch}
      >
        <FilterSearch className="mr-2"/>
        Búsqueda Personalizada
        {isCustomSearchVisible && <span> (Cerrar) </span>}
      </button>

{/* ------------------------------------------ BUSQUEDA PERSONALIZADA ------------------------------- */}
        {isCustomSearchVisible && (
          <>
        <div className="mt-0  bg-gray-100 p-1 rounded-lg"> 
            <div className=" mb-5 grid grid-cols-2 gap-3">
              {/* Input: Marca */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Marca</label>
                <input type="text"  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                 value={marca}
                 onChange={(e) => setMarca(e.target.value)}
                />
              </div>
              {/* Input: Código fabrica/Equiv./Simil */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Código fabrica/Equiv./Simil</label>
                <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
                  value={codigoReferencia}
                  onChange={(e) => setCodigoReferencia(e.target.value)}
                />
              </div>
              {/* Input: Nombre Comercial*/}
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Comercial</label>
                <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={nombreComercial}
                  onChange={(e) => setNombreComercial(e.target.value)}
                  />
              </div>
              {/* Input: Nombre Interno */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Interno</label>
                <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={nombreInterno}
                  onChange={(e) => setNombreInterno(e.target.value)}
                />
              </div>
            </div>

            {/* Botón busqueda filtrada */}

              <button type="button" className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 mt-2"
              onClick={handleSearchMaterials}>
              <SearchNormal1 size={15} className="mr-2"/> Busqueda filtrada 
              </button>

        </div>
      

      {/* Tabla para mostrar los resultados */}
      <div className="mt-4">
              <table className="min-w-full bg-white text-xs">
              <thead>
                <tr>
                  <th className="px-4 py-2 font-bold">#</th>
                  <th className="px-4 py-2 font-bold">Código</th>
                  <th className="px-4 py-2 font-bold">Familia</th>
                  <th className="px-4 py-2 font-bold">Subfamilia</th>
                  <th className="px-4 py-2 font-bold">Correlativo</th>
                  <th className="px-4 py-2 font-bold">Denominación</th>
                  <th className="px-4 py-2 font-bold">Stock</th>
                  <th className="px-4 py-2 font-bold">Código de Fabricante</th>
                  <th className="px-4 py-2 font-bold">Marca</th>
                  <th className="px-4 py-2 font-bold">Nombre Interno</th>
                  <th className="px-4 py-2 font-bold">Nombre Comercial</th>
                </tr>
              </thead>
              <tbody>
                {dropdownMateriales.map((material, index) => (
                  <tr key={index}>
                    <td className="border-t px-4 py-2">{material.id}</td>
                    <td className="border-t px-4 py-2">{material.codigo}</td>
                    <td className="border-t px-4 py-2">{material.familia}</td>
                    <td className="border-t px-4 py-2">{material.subFamilia}</td>
                    <td className="border-t px-4 py-2">{material.correlativo}</td>
                    <td className="border-t px-4 py-2">{material.denominacion}</td>
                    <td className="border-t px-4 py-2">{material.stock}</td>
                    <td className="border-t px-4 py-2">{material.codigoFabricante}</td>
                    <td className="border-t px-4 py-2">{material.marcaId}</td>
                    <td className="border-t px-4 py-2">{material.nombreInterno}</td>
                    <td className="border-t px-4 py-2">{material.nombreComercial}</td>
                    <TableDOptions>
                    <ButtonEdit
                      onClick={() => {

                // Cargar los datos del material seleccionado en el modal
                
                
                setCodigos({
                  aplicacionMaquina: material?.aplicacionDeMaquina ?? [],
                  equivalencia: material?.materialEquivalencia ?? [],
                  reemplazo: material?.materialReemplazo ?? [],
                  similitud: material?.materialSimilitud ?? [],
                });
                setUpdateForm(material); 
                setCorrelativo(material.correlativo);
                setElementId(material.id);
                    openModal(true);
                      }}
                    />
                    <ButtonDelete
                      onClick={() => {
                        setElementId(material.id);
                        setIsOpenModalDelete(true);
                      }}
                    />
                    <ButtonInspect
                      onClick={() => {
                        // console.log('Info de row filtertable',material)
                        openInfoModal();
                        setMaterialInfo(material);
                      }}
                    />
                  </TableDOptions>
                  </tr>
                ))}
              </tbody>
              </table>
              <div className="flex gap-2 justify-end items-center text-xs">

              <button
                className="cursor-pointer text-primary-700 hover:text-primary disabled:text-primary-300"
                onClick={prevPage}
                disabled={!canPreviousPage}  
              >  <ArrowLeft2 />
              </button>   
              <span><strong>{page}</strong>{" "}</span>
              <button
                className="cursor-pointer text-primary-700 hover:text-primary disabled:text-primary-300"
                onClick={nextPage}
                // disabled={!canNextPage}
              > <ArrowRight2 />
              </button>
              
            </div>
                <br className="border-t px-1 black"></br>
        </div>
          </>
        )}


{!isCustomSearchVisible &&(<>  
        {/* Table list */}
        <TableMateriales
          columns={columns}
          data={materiales}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
        </> )}




      </TemplateMaestroCodigos>
      
      {/* Modal agregar */}
      <ModalLg
        title={isEdit ? "Editar Material" : "Nuevo Material"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-2 gap-5">
        <div className="space-y-6">
          <Group title={"Datos del Material"}>
            <GroupInputs>
                {/* <Select
                  label="Familia"
                  value={isEdit ? updateForm?.familiaId : undefined} // Mostrar valor en modo edit
                  onChange={(value) => {
                    const currentFamilia = familias?.find((item) => item.id === Number(value));
                    setSelectedFamilia(currentFamilia.codigo);
                    getSubfamilias(currentFamilia.id);
                    // setCorrelativo(`${currentFamilia.codigo} + `);
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
                </Select> */}

                {/* <Select
                  id='subfamilia-select'
                  label="SubFamilia"
                  value={subsUpdate? updateForm?.subfamiliaId : undefined} // Mostrar valor en modo edición
                  onChange={(value) => {
                    const currentSubFamilia = subfamilias?.find((item) => item.id === Number(value));
                    setForm({ ...form, subFamiliaId: value, nombreComercial: currentSubFamilia?.descripcion || "", nombreInterno: currentSubFamilia?.descripcion || ""  });
                    setCorrelativo(`${selectedFamilia} + ${currentSubFamilia.codigo} + COD.`);
                    // setNombreComercial(currentSubFamilia?.descripcion);
                  }}
                >
                  {subfamilias && subfamilias.length > 0 ? (
                  subfamilias?.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item?.descripcion}
                      </Option>
                    );
                  })

                  ) : (
                    <Option value="">No hay marcas disponibles</Option>
                  )}
                </Select> */}
                  <Input
                    label="Correlativo"
                    disabled
                    value={correlativo}
                    defaultValue={isEdit ? updateForm?.correlativo : undefined}
                  />
            </GroupInputs>
            <GroupInputs>
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
                {/* <Input label={"Marca"}
                  defaultValue={isEdit ? updateForm?.marca : undefined}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      marca: e.target.value,
                    })
                  }
                /> */}
                
                <Select label="Marca"
                  value={isEdit ? updateForm?.marcaId : undefined} // Mostrar valor en modo edición
                  onChange={(value) => {
                    const currentMarca = marcas?.find((item) => item.id === Number(value));
                    setForm({ ...form, marcaId: currentMarca?.id }); // Guardamos marcaId en el formulario
                  }}
                >
                  {marcas && marcas.length > 0 ? (
                    marcas.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.marca}
                      </Option>
                    ))
                  ) : (
                    <Option value="">No hay marcas disponibles</Option>
                  )}
                </Select>


            </GroupInputs>
            <GroupInputs>

              <Input
                label={"Nombre Interno"}
                value={form.nombreInterno}
                defaultValue={isEdit ? updateForm?.nombreInterno : undefined}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nombreInterno: e.target.value,
                  })
                }
              />
              <Input
                label={"Nombre Comercial"}
                value={form.nombreComercial}
                defaultValue={isEdit ? updateForm?.nombreComercial : undefined}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nombreComercial: e.target.value,
                  })
                }
              />

            </GroupInputs>

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
          </div>

              {/* Segunda Columna */}
          <div className="space-y-6">

          
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
                      // (item) => item.caracteristicaId === caracteristica.id
                      (item) => item. caracteristica.id === caracteristica.id
                    );

                    let updatedNombreInterno = form.nombreInterno || "";

                    // Si se selecciona el checkbox
                    if (e.target.checked) {
                      const concatString = `${caracteristica.descripcion} ${newCaracteristicas[caracteristicaIndex]?.valor || ""}`;
                      if (!updatedNombreInterno.includes(concatString)) {
                        updatedNombreInterno += ` ${concatString}`;
                      }
                      if (caracteristicaIndex === -1) {
                        newCaracteristicas.push({
                          // caracteristicaId: caracteristica.id,
                          caracteristica: {id: caracteristica.id},
                          isChecked: true,
                          valor: "",
                        });
                      } else {
                        newCaracteristicas[caracteristicaIndex].isChecked = true;
                      }
                    } else {
                      // Si se deselecciona el checkbox, eliminar la característica del nombre interno
                      const concatString = `${caracteristica.descripcion} ${newCaracteristicas[caracteristicaIndex]?.valor || ""}`;
                      updatedNombreInterno = updatedNombreInterno.replace(` ${concatString}`, "");
                      if (caracteristicaIndex !== -1) {
                        newCaracteristicas[caracteristicaIndex].isChecked = false;
                      }
                    }

                    setCaracteristicasForm([...newCaracteristicas]);
                    setForm({ ...form, nombreInterno: updatedNombreInterno, caracteristicaToMaterial: caracteristicasForm });
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
              // (item) => item.caracteristicaId === caracteristica.id
              (item) => item. caracteristica.id === caracteristica.id
            );
            const concatString = `${caracteristica.descripcion} ${newCaracteristicas[caracteristicaIndex]?.valor || ""}`;
            const newConcatString = `${caracteristica.descripcion} ${e.target.value}`;

            let updatedNombreInterno = form.nombreInterno.replace(
              ` ${concatString}`,
              ` ${newConcatString}`
            );

            if (caracteristicaIndex !== -1) {
              newCaracteristicas[caracteristicaIndex].valor = e.target.value;
            } else {
              newCaracteristicas.push({
                // caracteristicaId: caracteristica.id,
                caracteristica: {id: caracteristica.id},
                valor: e.target.value,
              });
            }

            setCaracteristicasForm([...newCaracteristicas]);
            setForm({ ...form, nombreInterno: updatedNombreInterno, caracteristicaToMaterial: caracteristicasForm });
          }}
          label={"Valor"}
          defaultValue={caracteristica?.valor ?? undefined}
        />
      </div>
    </div>
  ))}
</Group>


            <div className="w-full flex justify-center gap-2">
              <ButtonCancel onClick={closeModal} />
              <ButtonSave onClick={saveData} />
            </div>
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
                  {caracteristicaToMaterialData?.map(({ id, valor, nombre, isChecked }) => {
                    console.log({ id, valor, nombre, isChecked })
                    if (!isChecked) return null; // Si no está marcado, no renderizamos nada

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
