import { Input,Select,Option } from "@material-tailwind/react";
import { GroupInputs } from "../../../../app/components/elements/Form";
import { useContext, useEffect, useMemo, useState } from "react";
import { ButtonAdd, ButtonCancel, ButtonSave } from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import { Modal, ModalConfirmDelete } from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplatePresupuesto from "../../../../app/components/templates/mantenimiento/TemplatePresupuesto";
import { useModal } from "../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { useQuery } from "react-query";
import * as yup from "yup";
import { toast } from "react-toastify";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { FormContext } from "../../../../contexts/form.context";

const schema = yup.object().shape({
  codigo: yup.string().nullable(),
  definicion: yup.string().required(),
  precio: yup.number().nullable(),
});

export default function TrabajoTerceros() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  let [subfamiliasList,setSubfamiliasList]=useState([]);
  const [subfamilias, setSubfamilias] = useState([]);


  const [form, setForm] = useState({
    familiaId: null,
    subFamiliaId:null,
    tiempoHora:null,
    precioHora:null,
    precioTotal:null,
    codigo: null,
    definicion: null,
    precio: null,
  });

  const { updateForm, elementId, resetInfo, changeData, setChangeData } = useContext(FormContext);

  useEffect(() => {
    // console.log('El update form:',{updateForm})
    setForm(updateForm);
  }, [updateForm]);

  useEffect(() => {
    setForm({
      familiaId: null,
      subFamiliaId:null,
      tiempoHora:null,
      precioHora:null,
      precioTotal:null,
      codigo: null,
      definicion: null,
      precio: null,
    });
  }, [resetInfo]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/presupuesto/trabajo-terceros", {
      ...form,
      empresaId: parseInt(empresaId),
      precio: parseFloat(form.precio),
      precioTotal:0,
      codigo: 123
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/presupuesto/trabajo-terceros/${elementId}`, {
      ...form,
      precio: parseFloat(form.precio),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };
  const deleteData = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/presupuesto/trabajo-terceros/${elementId}`);
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
      familiaId: null,
      subFamiliaId:null,
      tiempoHora:null,
      precioHora:null,
      precioTotal:null,
      codigo: null,
      definicion: null,
      precio: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Definición", accessor: "definicion" },
      { Header: "Precio Total", accessor: "precioTotal" },
      { Header: "Familia", accessor: "subFamilia.familia.descripcion" },
      { Header: "Subfamilia", accessor: "subFamilia.descripcion" },
    ],
    []
  );

  const getServicios = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/presupuesto/trabajo-terceros?empresaId=${empresaId}`
    );
      console.log('DAta',data);
    return data;  
  };
  const { data, refetch } = useQuery("getServicios", getServicios, {
    initialData: {
      data: [],
    },
  });

  const trabajoTerceros = useMemo(() => data?.data, [data?.data]);


  const getFamilias = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/presupuesto/familias?empresaId=${empresaId}`
    );

    return data;
  };
  const { data: familiasResponse } = useQuery("getFamilias", getFamilias, {
    initialData: {
      data: [],
    },
  });
  
  const familias = useMemo(() => familiasResponse?.data, [familiasResponse?.data]);

  const getSubfamiliasAll = async () => {
    try {
      // Verifica que 'familias' tenga datos
      if (!familias || familias.length === 0) {
        console.log('No hay familias disponibles');
        return;
      }
  
      // Mapea las solicitudes de subfamilias por cada familia
      const promises = familias.map(async (familia) => {
        const { data } = await axiosRequest(
          "get", `/api/mantenimiento/presupuesto/familias/subfamilias?familiaId=${familia.id}`
        );
        return { familiaId: familia.id, subfamilias: data?.data || [] };
      });
  
      // Ejecuta todas las solicitudes en paralelo
      const subfamiliasResults = await Promise.all(promises);
  
      // Combina todas las subfamilias en un solo array
      const subfamiliasAll = subfamiliasResults.flatMap(result => result.subfamilias);
  
      console.log('Todas las subfamilias:', subfamiliasAll);
  
      // Si necesitas almacenar el resultado en algún estado
      setSubfamiliasList(subfamiliasAll);
    } catch (error) {
      console.error('Error obteniendo subfamilias:', error);
    }
  };
  
  
  const getSubfamilias = async (familiaId) => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/presupuesto/familias/subfamilias?familiaId=${familiaId}`
    );
    console.log('Subfamilies',data)
    setSubfamilias(data?.data);
  };

  useEffect(()=>{
    getSubfamiliasAll();
  },[])
  
  console.log('Familias:',familias)
  useEffect(()=>{

    console.log('Form cambiando',{form})
    
  },[form])



  useEffect(() => {
    let valorVenta = parseFloat(form?.tiempoHora) || 0;
    let precioHora = parseFloat(form?.precioHora) || 0;
    let precioTot = valorVenta * precioHora;
  
    // Evitar actualizaciones innecesarias
    if (form?.precioTotal !== precioTot) {
      setForm({ ...form, precioTotal: precioTot });
    }
  }, [form.tiempoHora, form.precioHora]);

  return (
    <>
      <TemplatePresupuesto>
        <Title text={"Lista Trabajo terceros"}>
          <div className="flex gap-4">
            <ButtonAdd text={"Nuevo trabajo"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={trabajoTerceros}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplatePresupuesto>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar trabajo" : "Nuevo trabajo"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <Input
            label="Código"
            disabled
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            defaultValue={isEdit ? updateForm?.codigo : undefined}
          />
          <Select
              label="Familia"
              value={isEdit && updateForm?.subFamilia.familia.id !== undefined ? updateForm.subFamilia.familia.id : form?.familiaId || ''}
              onChange={(value) => {
                const currentFamilia = familias?.find((item) => item.id === Number(value));
                getSubfamilias(currentFamilia.id);
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
              value={isEdit && updateForm?.subFamiliaId !== undefined ? updateForm.subFamiliaId : form?.subFamiliaId || ''}
              onChange={(value) => {
                // const currentSubFamilia = subfamilias?.find((item) => item.id === Number(value));
                setForm({ ...form, subFamiliaId: value });
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
            label="Trabajo Tercero"
            onChange={(e) => setForm({ ...form, definicion: e.target.value })}
            defaultValue={isEdit ? updateForm?.definicion : undefined}
          />
          <Input
            label="Tiempo en horas"
            type={"number"}
            onChange={(e) => setForm({ ...form, tiempoHora: e.target.value })}
            defaultValue={isEdit ? updateForm?.tiempoHora : undefined}
          />
          <Input
            label="Precio por Hora"
            type={"number"}
            onChange={(e) => setForm({ ...form, precioHora: e.target.value })}
            defaultValue={isEdit ? updateForm?.precioHora : undefined}
          />
          <GroupInputs>
          Precio total:
          <Input
            label="Precio Total"
            disabled
            type={"number"}
            value={form.precioTotal}
            defaultValue={isEdit ? updateForm?.precioTotal : undefined}
          />
          </GroupInputs>
         

          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={deleteData}
        title={"Eliminar trabajo"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
