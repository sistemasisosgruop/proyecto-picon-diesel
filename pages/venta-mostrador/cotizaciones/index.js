import { ButtonAdd, ButtonSave, ButtonCancel } from "../../../app/components/elements/Buttons";
import { Container } from "../../../app/components/elements/Containers";
import { Title } from "../../../app/components/elements/Title";
import { ModalConfirmDelete, ModalLg } from "../../../app/components/modules/Modal";
import { Group, GroupInputs } from "../../../app/components/elements/Form";
import { Input, Option, Select, Textarea } from "@material-tailwind/react";
import { useModal } from "../../../app/hooks/useModal";
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
import TableComplete from "../../../app/components/modules/TableComplete";
import TableMaterialesForm from "../../../app/components/modules/TableMaterialesForm";
import { Divider } from "../../../app/components/elements/Divider";

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
    const { data } = await axiosRequest("get", `/api/mantenimiento/empresas?adminId=${auth.id}`);

    return data;
  };

  const columns = useMemo(
    () => [
      { Header: "N°", accessor: "id" },
      { Header: "RUC / DNI", accessor: "razonSocial" },
      { Header: "Nombre Cliente", accessor: "nombreCliente" },
      { Header: "Fecha", accessor: "fecha" },
      { Header: "Dias validez", accessor: "diasValidez" },
      { Header: "Forma de pago", accessor: "formaDePago" },
      { Header: "Correo", accessor: "email" },
    ],
    []
  );

  const columnsMateriales = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Codigo interno", accessor: "codigoInterno" },
      { Header: "Cod. Fabrica", accessor: "codigoDeFabrica" },
      { Header: "Marca", accessor: "marca" },
      { Header: "Descripcion", accessor: "descripcion" },
      { Header: "Comentario", accessor: "comentario" },
      { Header: "Cantidad", accessor: "cantidad" },
      { Header: "Vta Unit.", accessor: "ventaUnidad" },
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

  const { data, isLoading, refetch } = useQuery("empresas", getEmpresas, {
    initialData: {
      data: [],
    },
  });

  const updateEmpresa = async () => {
    await schema.validate(empresaForm, { abortEarly: false });
    await axiosRequest("put", `/api/mantenimiento/empresas/${empresaToUpdateId}`, {
      ...empresaForm,
    });

    toast.success(`🦄 Empresa actualizada exitosamente!`, successProps);
  };

  const createEmpresa = async () => {
    await schema.validate(empresaForm, { abortEarly: false });
    const { data } = await axiosRequest("post", "/api/mantenimiento/empresas", {
      ...empresaForm,
      adminId: auth.id,
    });

    toast.success(`🦄 Empresa ${data.nombre} registrada exitosamente!`, successProps);
  };

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

  const deleteEmpresa = async () => {
    try {
      const { data } = await axiosRequest("delete", `/api/mantenimiento/empresas/${elementId}`);
      toast.success(`🦄 Empresa ${data.nombre} eliminada exitosamente!`, successProps);
      setChangeData(!changeData);
      setIsOpenModalDelete(false);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  return (
    <>
      <Container whiteColor={true}>
        <Title text={"Cotizaciones"}>
          <ButtonAdd text={"Nueva cotizacion"} onClick={() => openModal(false)} />
        </Title>

        {/* Table List */}
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          <TableComplete
            columns={columns}
            data={[]}
            openModal={openModal}
            setIsOpenModalDelete={setIsOpenModalDelete}
          />
        )}
      </Container>
      {/* Modal agregar */}
      <ModalLg
        title={isEdit ? "Editar cotizacion" : "Nueva cotizacion"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
          <Group title={"Informacion General"}>
            <GroupInputs>
              <Input label={"N° de cotizacion"} />
              <Input label={"Fecha de cotizacion"} type={"date"} />
              <Input label={"Dias de validez"} />
              <Input label={"Fecha de validez"} type={"date"} />
            </GroupInputs>
            <GroupInputs>
              <Select label="Moneda">
                <Option value={"sol"}>Soles</Option>
                <Option value={"dolar"}>Dolares</Option>
              </Select>
              <Select label="Forma de pago">
                <Option value={"contado"}>contado</Option>
                <Option value={"credito"}>credito</Option>
              </Select>
            </GroupInputs>
            <Select label="Forma de pago">
              <Option value={"interbank"}>interbank</Option>
            </Select>
            <GroupInputs>
              <Select label="Tipo de Cambio">
                <Option value={"sol-dolar"}>3.81</Option>
              </Select>
              <Input label="Estado del documento" />
            </GroupInputs>
          </Group>
          <Group title={"Cliente"}>
            <GroupInputs>
              <Select label="RUC / DNI">
                <Option value={"1"}>cliente 1</Option>
              </Select>
              <Input label="Nombre del cliente" disabled />
            </GroupInputs>
            <GroupInputs>
              <Input label="Telefono" disabled />
              <Input label="Correo" disabled />
              <Input label="Direccion" disabled />
            </GroupInputs>
          </Group>
          <Group title={"Maquina"}>
            <Input label="Aplicacion de la maquina"></Input>
          </Group>
          <Group title={"Responsable"}>
            <GroupInputs>
              <Select label="Rol">
                <Option value={"vendedor"}>Vendedor</Option>
                <Option value={"personal"}>Personal</Option>
              </Select>
              <Select label="Responsable">
                <Option value={"r1"}>responsable 1</Option>
              </Select>
            </GroupInputs>
          </Group>
          <Group title={"Otro"}>
            <Input label="Referencia"></Input>
            <Textarea label="Nota"></Textarea>
          </Group>
          <Group title={"Materiales"}>
            <TableMaterialesForm columns={columnsMateriales} data={[]} />
            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">Subtotal valor venta soles</span>
                </div>
                <div>
                  <Input disabled />
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
                    5%
                  </span>
                </div>
                <div>
                  <Input label="descuento" />
                </div>
              </div>
            </GroupInputs>
            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">Subtotal valor venta neto soles</span>
                </div>
                <div>
                  <Input disabled />
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
                    18%
                  </span>
                </div>
                <div>
                  <Input label="IGV" />
                </div>
              </div>
            </GroupInputs>
            <GroupInputs>
              <div className="flex flex-row justify-end items-center w-full gap-2">
                <div className="flex justify-center items-center">
                  <span className="font-semibold">TOTAL DE COTIZACION SOLES</span>
                </div>
                <div>
                  <Input disabled />
                </div>
              </div>
            </GroupInputs>
            <Divider/>
          </Group>

          <div className="w-full flex justify-center gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave label={"Guardar y enviar"} onClick={saveData} />
          </div>
        </form>
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
