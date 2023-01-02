import { Input } from "@material-tailwind/react";
import { useEffect, useMemo, useState } from "react";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import {
  Modal,
  ModalConfirmDelete,
} from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateComercial from "../../../../app/components/templates/mantenimiento/TemplateComercial";
import { useModal } from "../../../../app/hooks/useModal";
import * as yup from "yup";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { ToastContainer, toast } from "react-toastify";
import { useQuery } from "react-query";

const schemaContado = yup.object().shape({
  nombre: yup.string().required(),
});

const schemaCredito = yup.object().shape({
  nombre: yup.string().required(),
  numeroDeDias: yup.number().min(0).required(),
});

export default function formContadoasDePago() {
  const { setIsOpenModalDelete, isOpenModalDelete } = useModal();
  const [empresaId] = useLocalStorage("empresaId");

  const columnsContado = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre", accessor: "nombre" },
    ],
    []
  );
  const columnsCredito = useMemo(
    () => [
      { Header: "#", accessor: "id" },
      { Header: "Codigo", accessor: "codigo" },
      { Header: "Nombre", accessor: "nombre" },
      { Header: "N° de días", accessor: "numeroDeDias" },
    ],
    []
  );

  const getContado = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/forma-de-pago/contado?empresaId=${empresaId}`
    );

    return data;
  };

  const { data: contadoResponse, refetch: refetchContado } = useQuery(
    "getContado",
    getContado,
    {
      initialData: {
        data: [],
      },
    }
  );

  const getCredito = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/forma-de-pago/credito?empresaId=${empresaId}`
    );

    return data;
  };

  const { data: creditoResponse, refetch: refetchCredito } = useQuery(
    "getCredito",
    getCredito,
    {
      initialData: {
        data: [],
      },
    }
  );

  const dataContado = useMemo(
    () => contadoResponse?.data,
    [contadoResponse?.data]
  );
  const dataCredito = useMemo(
    () => creditoResponse?.data,
    [creditoResponse?.data]
  );

  const [isModalContado, setIsModalContado] = useState(false);
  const [isModalCredito, setIsModalCredito] = useState(false);

  const [isEditContado, setIsEditContado] = useState(false);
  const [isEditCredito, setIsEditCredito] = useState(false);

  const openModalContado = (isEdit) => {
    setIsModalContado(true);
    setIsEditContado(isEdit);
  };
  const openModalCredito = (isEdit) => {
    setIsModalCredito(true);
    setIsEditCredito(isEdit);
  };

  const [formContado, setformContado] = useState({
    nombre: null,
  });
  const [formCredito, setformCredito] = useState({
    nombre: null,
    numeroDeDias: null,
  });
  const [changeData, setChangeData] = useState(false);
  const saveDataContado = async () => {
    try {
      await schemaContado.validate(formContado, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/forma-de-pago/contado", {
        ...formContado,
        empresaId: parseInt(empresaId),
      });

      toast.success(`🦄 Registro guardado exitosamente!`, successProps);
      setChangeData(!changeData);
      setIsModalContado(false);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const saveDataCredito = async () => {
    try {
      await schemaCredito.validate(formCredito, { abortEarly: false });
      await axiosRequest("post", "/api/mantenimiento/forma-de-pago/credito", {
        ...formCredito,
        numeroDeDias: parseInt(formCredito.numeroDeDias),
        empresaId: parseInt(empresaId),
      });

      toast.success(`🦄 Registro guardado exitosamente!`, successProps);
      setChangeData(!changeData);
      setIsModalCredito(false);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  useEffect(() => {
    setformContado({
      nombre: null,
    });
    setformCredito({
      nombre: null,
      numeroDeDias: null,
    });
    refetchContado();
    refetchCredito();
  }, [changeData]);

  return (
    <>
      <TemplateComercial>
        <Title text={"formas de pago"} />
        <div className="flex gap-5">
          <div className="w-1/2 rounded shadow-md p-5">
            <Title text={"Contado"}>
              <ButtonAdd
                text={"Nueva forma de pago"}
                onClick={() => {
                  openModalContado(false);
                }}
              />
            </Title>
            {/* Table list */}
            <TableComplete
              columns={columnsContado}
              data={dataContado}
              openModal={openModalContado}
              setIsOpenModalDelete={setIsOpenModalDelete}
            />
          </div>
          <div className="w-1/2 rounded shadow-md p-5">
            <Title text={"Crédito"}>
              <ButtonAdd
                text={"Nueva forma de pago"}
                onClick={() => {
                  openModalCredito(false);
                }}
              />
            </Title>
            {/* Table list */}
            <TableComplete
              columns={columnsCredito}
              data={dataCredito}
              openModal={openModalCredito}
              setIsOpenModalDelete={setIsOpenModalDelete}
            />
          </div>
        </div>
      </TemplateComercial>
      {/* Modal agregar */}
      <Modal
        title={
          isEditContado
            ? "Editar forma de pago Contado"
            : "Nueva forma de pago Contado"
        }
        isOpen={isModalContado}
        closeModal={() => setIsModalContado(false)}
      >
        {/* formContado */}
        <form className="flex flex-col gap-5">
          <Input
            label="Nombre"
            onChange={(e) =>
              setformContado({ ...formContado, nombre: e.target.value })
            }
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={() => setIsModalContado(false)} />
            <ButtonSave onClick={saveDataContado} />
          </div>
        </form>
      </Modal>

      <Modal
        title={
          isEditCredito
            ? "Editar forma de pago Credito"
            : "Nueva forma de pago Credito"
        }
        isOpen={isModalCredito}
        closeModal={() => setIsModalCredito(false)}
      >
        {/* formCredito */}
        <form className="flex flex-col gap-5">
          <Input
            label="Nombre"
            onChange={(e) =>
              setformCredito({ ...formCredito, nombre: e.target.value })
            }
          />
          <Input
            label="N° de días"
            type="number"
            onChange={(e) =>
              setformCredito({ ...formCredito, numeroDeDias: e.target.value })
            }
          />
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={() => setIsModalCredito(false)} />
            <ButtonSave onClick={saveDataCredito} />
          </div>
        </form>
      </Modal>
      <ToastContainer />
      {/* Modal Eliminar */}
      <ModalConfirmDelete
        title={"Eliminar formContadoa de pago"}
        isOpen={isOpenModalDelete}
        closeModal={() => setIsOpenModalDelete(false)}
      />
    </>
  );
}
