import { Input,Select, Option } from "@material-tailwind/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { ButtonAdd, ButtonCancel, ButtonSave } from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import { Modal, ModalConfirmDelete } from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateComercial from "../../../../app/components/templates/mantenimiento/TemplateComercial";
import { useModal } from "../../../../app/hooks/useModal";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useQuery } from "react-query";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import * as yup from "yup";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { toast } from "react-toastify";
import { FormContext } from "../../../../contexts/form.context";

const schema = yup.object().shape({
  monedaOrigenId: yup.string().required(),
  monedaDestinoId: yup.string().required(),
  valorCompra: yup.number().required(),
  valorVenta: yup.number().required(),
  fecha: yup.string().required(),
});

export default function TipoDeCambio() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    monedaOrigenId: null,
    monedaDestinoId: null,
    valorCompra: null,
    valorVenta: null,
    fecha: null,
  });
  const [monedas,setMonedas] = useState([]) 
  const { updateForm, elementId, resetInfo, changeData, setChangeData } = useContext(FormContext);

  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  useEffect(() => {
    setForm({
      monedaOrigenId: null,
      monedaDestinoId: null,
      valorCompra: null,
      valorVenta: null,
      fecha: null,
    });
  }, [resetInfo]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    
    await axiosRequest("post", "/api/mantenimiento/tipo-de-cambio", {
      ...form,
      fecha: new Date(form.fecha).toISOString(),
      valorCompra: parseFloat(form.valorCompra),
      valorVenta: parseFloat(form.valorVenta),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    let {id,monedaDestino, monedaOrigen, ...formAux} = form;
    await axiosRequest("put", `/api/mantenimiento/tipo-de-cambio/${elementId}`, {
      ...formAux,
      fecha: new Date(form.fecha).toISOString(),
      valorCompra: parseFloat(form.valorCompra),
      valorVenta: parseFloat(form.valorVenta),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const deleteData = async () => {
    try {
      await axiosRequest("delete", `/api/mantenimiento/tipo-de-cambio/${elementId}`);
      toast.success(`🗑️ Registro eliminado exitosamente!`, successProps);
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };
  const saveData = async () => {
    try {
      if (isEdit) {
        console.log('Editando')
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
      monedaOrigenId: null,
      monedaDestinoId: null,
      valorCompra: null,
      valorVenta: null,
      fecha: null,
    });
    refetch();
  }, [changeData]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      // { Header: "Codigo", accessor: "codigo" },
      { Header: "De", accessor: "monedaOrigen.nombre" },
      { Header: "A", accessor: "monedaDestino.nombre" },
      { Header: "Valor compra", accessor: "valorCompra" },
      { Header: "Valor venta", accessor: "valorVenta" },
      { Header: "Fecha", accessor: "fecha" },
    ],
    []
  );

  const getTiposCambio = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/tipo-de-cambio`
    );

    return data;
  };

  const { data, refetch } = useQuery("getTiposCambio", getTiposCambio, {
    initialData: {
      data: [],
    },
  });

  const tiposDeCambio = useMemo(
    () =>
      data?.data.map(({ fecha, ...data }) => ({
        ...data,
        fecha: fecha.split("T")[0],
      })),
    [data?.data]
  );


  const getMonedas = async ()=>{
    const {data} =  await axiosRequest(
      "get",
      `/api/mantenimiento/comercial/moneda`
    );
      setMonedas(data.data);
      console.log(data.data)
    return data;
  }
useEffect(()=>{
  getMonedas();
},[])

useEffect(()=>{
  console.log('Cambiando form:',form)
},[form])

  return (
    <>
      <TemplateComercial>
        <Title text={"Lista Tipo de Cambio"}>
          <div className="flex gap-4">
            <ButtonAdd text={"Nuevo tipo de cambio"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={tiposDeCambio}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateComercial>
      {/* Modal agregar */}
      <Modal
        title={isEdit ? "Editar Tipo de cambio" : "Nuevo Tipo de cambio"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          <div className="flex gap-5">

            <Select label="De"
                    value={isEdit ? updateForm?.monedaOrigenId : undefined}
                    onChange={(value) => {
                      setForm({...form, monedaOrigenId: value})
                    }}
                    >
                    {monedas && monedas.length > 0 ? (
                    monedas?.map((item) => {
                        return (
                        <Option key={item.id} value={item.id}>
                            {item?.nombre}
                        </Option>
                        );
                    })
                    ) : (
                        <Option value="">No hay monedas disponibles</Option>
                    )}
              </Select>
              <Select label="A"
                    value={isEdit ? updateForm?.monedaDestinoId : undefined}
                    onChange={(value) => {
                        setForm({...form, monedaDestinoId: value})
                    }}
                    >
                    {monedas && monedas.length > 0 ? (
                    monedas?.map((item) => {
                        return (
                        <Option key={item.id} value={item.id}>
                            {item?.nombre}
                        </Option>
                        );
                    })
                    ) : (
                        <Option value="">No hay monedas disponibles</Option>
                    )}
              </Select>


          </div>
          <div className="flex gap-5">
            <Input
              label="Valor compra"
              type="number"
              onChange={(e) => setForm({ ...form, valorCompra: e.target.value })}
              defaultValue={isEdit ? updateForm?.valorCompra : undefined}
            />
            <Input
              label="Valor venta"
              type="number"
              onChange={(e) => setForm({ ...form, valorVenta: e.target.value })}
              defaultValue={isEdit ? updateForm?.valorVenta : undefined}
            />

          </div>
          <Input
              label="Fecha"
              type="date"
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              defaultValue={isEdit ? updateForm?.fecha : undefined}
            />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </Modal>

      {/* Modal Eliminar */}
      <ModalConfirmDelete
        onClick={deleteData}
        title={"Eliminar Tipo de cambio"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
