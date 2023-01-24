"use client";
import { Input, Option, Select } from "@material-tailwind/react";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonImportData,
  ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Group, GroupInputs } from "../../../../app/components/elements/Form";
import { Title } from "../../../../app/components/elements/Title";
import { ModalConfirmDelete, ModalLg } from "../../../../app/components/modules/Modal";
import TableComplete from "../../../../app/components/modules/TableComplete";
import TemplateMaestroCodigos from "../../../../app/components/templates/mantenimiento/TemplateMaestroCodigos";
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
  codigoOriginal: yup.string().required(),
  modeloMotor: yup.string().required(),
  numeroCilindros: yup.string().required(),
  codigoFabricaBombaInyeccion: yup.string().required(),
  tipoBombaInyeccion: yup.string().required(),
  codigoOriginalBombaInyeccion: yup.string().required(),
  codigoFabricaInyector: yup.string().required(),
  tipoFabricaInyector: yup.string().required(),
  codigoOriginalInyector: yup.string().required(),
  codigoTobera: yup.string().required(),
  tipoTobera: yup.string().required(),
  fabricaMaquinaId: yup.number().required(),
  modeloMaquinaId: yup.number().required(),
  nombreMaquinaId: yup.number().required(),
  paisId: yup.number().required(),
  marcaMotorId: yup.number().required(),
  motorPaisId: yup.number().required(),
  marcaFabricaSistemaInyeccionId: yup.number().required(),
  descripcionBombaInyeccionId: yup.number().required(),
  marcaFabricaInyectorId: yup.number().required(),
  descripcionInyectorId: yup.number().required(),
  inyectorPaisId: yup.number().required(),
  bombaInyeccionPaisId: yup.number().required(),
});

export default function Maquinas() {
  const { isOpenModal, isOpenModalDelete, isEdit, setIsOpenModalDelete, closeModal, openModal } =
    useModal();
  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    fabricaMaquinaId: null,
    modeloMaquinaId: null,
    nombreMaquinaId: null,
    paisId: null,
    codigoOriginal: null,
    modeloMotor: null,
    marcaMotorId: null,
    motorPaisId: null,
    numeroCilindros: null,
    codigoFabricaBombaInyeccion: null,
    tipoBombaInyeccion: null,
    marcaFabricaSistemaInyeccionId: null,
    descripcionBombaInyeccionId: null,
    bombaInyeccionPaisId: null,
    codigoOriginalBombaInyeccion: null,
    codigoFabricaInyector: null,
    tipoFabricaInyector: null,
    marcaFabricaInyectorId: null,
    descripcionInyectorId: null,
    inyectorPaisId: null,
    codigoOriginalInyector: null,
    codigoTobera: null,
    tipoTobera: null,
  });
  const {
    updateForm,
    elementId,
    setNeedRefetch,
    setGetPath,
    resetInfo,
    changeData,
    setChangeData,
  } = useContext(FormContext);

  useEffect(() => {
    setForm(updateForm);
  }, [updateForm]);

  useEffect(() => {
    setForm({
      fabricaMaquinaId: null,
      modeloMaquinaId: null,
      nombreMaquinaId: null,
      paisId: null,
      codigoOriginal: null,
      modeloMotor: null,
      marcaMotorId: null,
      motorPaisId: null,
      numeroCilindros: null,
      codigoFabricaBombaInyeccion: null,
      tipoBombaInyeccion: null,
      marcaFabricaSistemaInyeccionId: null,
      descripcionBombaInyeccionId: null,
      bombaInyeccionPaisId: null,
      codigoOriginalBombaInyeccion: null,
      codigoFabricaInyector: null,
      tipoFabricaInyector: null,
      marcaFabricaInyectorId: null,
      descripcionInyectorId: null,
      inyectorPaisId: null,
      codigoOriginalInyector: null,
      codigoTobera: null,
      tipoTobera: null,
    });
  }, [resetInfo]);

  useEffect(() => {
    setGetPath("/api/mantenimiento/maestro-de-codigos/configuracion/maquinas");
    setNeedRefetch(true);

    return () => {
      setNeedRefetch(false);
      setGetPath(null);
    };
  }, []);

  useEffect(() => {
    setForm({
      fabricaMaquinaId: null,
      modeloMaquinaId: null,
      nombreMaquinaId: null,
      paisId: null,
      codigoOriginal: null,
      modeloMotor: null,
      marcaMotorId: null,
      motorPaisId: null,
      numeroCilindros: null,
      codigoFabricaBombaInyeccion: null,
      tipoBombaInyeccion: null,
      marcaFabricaSistemaInyeccionId: null,
      descripcionBombaInyeccionId: null,
      bombaInyeccionPaisId: null,
      codigoOriginalBombaInyeccion: null,
      codigoFabricaInyector: null,
      tipoFabricaInyector: null,
      marcaFabricaInyectorId: null,
      descripcionInyectorId: null,
      inyectorPaisId: null,
      codigoOriginalInyector: null,
      codigoTobera: null,
      tipoTobera: null,
    });
    refetch();
  }, [changeData]);

  const createRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest("post", "/api/mantenimiento/maestro-de-codigos/configuracion/maquinas", {
      ...form,
      empresaId: parseInt(empresaId),
    });

    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };

  const updateRegistro = async () => {
    await schema.validate(form, { abortEarly: false });
    await axiosRequest(
      "put",
      `/api/mantenimiento/maestro-de-codigos/configuracion/maquinas/${elementId}`,
      {
        ...form,
      }
    );
    toast.success(`💾 Registro guardado exitosamente!`, successProps);
  };
  const deleteData = async () => {
    try {
      await axiosRequest(
        "delete",
        `/api/mantenimiento/maestro-de-codigos/configuracion/maquinas/${elementId}`
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
      setChangeData(!changeData);
      closeModal();
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const columns = useMemo(
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

  const getMaquinas = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/maestro-de-codigos/configuracion/maquinas?empresaId=${empresaId}`
    );

    return data;
  };
  const { data: maquinasResponse, refetch } = useQuery("maquinas", getMaquinas, {
    initialData: {
      data: [],
    },
  });
  const data = useMemo(
    () =>
      maquinasResponse?.data?.map((maquina) => {
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
    [maquinasResponse?.data]
  );

  const getFormInfo = async () => {
    const { data } = await axiosRequest("get", `/api/mantenimiento/empresas/info/${empresaId}`);

    return data;
  };
  const { data: formInfo } = useQuery("formInfo", getFormInfo, {
    initialData: {
      data: [],
    },
  });
  const fabricaMaquinas = useMemo(() => formInfo?.data.fabricaMaquina, [formInfo?.data]);
  const modeloMaquinas = useMemo(() => formInfo?.data.modeloMaquina, [formInfo?.data]);
  const nombreMaquinas = useMemo(() => formInfo?.data.nombreMaquina, [formInfo?.data]);
  const paises = useMemo(() => formInfo?.data.paises, [formInfo?.data]);
  const marcaMotores = useMemo(() => formInfo?.data.marcaMotor, [formInfo?.data]);
  const marcaFabricaSistemaInyeccion = useMemo(
    () => formInfo?.data.marcaFabricaSistemaInyeccion,
    [formInfo?.data]
  );
  const descripcionBombasInyeccion = useMemo(
    () => formInfo?.data.descripcionBombaInyeccion,
    [formInfo?.data]
  );
  const marcaFabricaInyector = useMemo(() => formInfo?.data.marcaFabricaInyector, [formInfo?.data]);
  const descripcionInyector = useMemo(() => formInfo?.data.descripcionInyector, [formInfo?.data]);

  return (
    <>
      <TemplateMaestroCodigos>
        <Title text={"Lista Máquinas"}>
          <div className="flex gap-4">
            <ButtonImportData />
            <ButtonAdd text={"Nueva máquina"} onClick={() => openModal(false)} />
          </div>
        </Title>
        {/* Table list */}
        <TableComplete
          columns={columns}
          data={data}
          openModal={openModal}
          setIsOpenModalDelete={setIsOpenModalDelete}
        />
      </TemplateMaestroCodigos>
      {/* Modal agregar */}
      <ModalLg
        title={isEdit ? "Editar Máquina" : "Nueva Máquina"}
        isOpen={isOpenModal}
        closeModal={closeModal}
      >
        {/* Form */}
        <form className="flex flex-col gap-5">
          {/* Datos de la maquina */}
          <Group title={"Datos de la Máquina"}>
            <GroupInputs>
              <Select
                label={"Fábrica Máquina"}
                onChange={(value) => setForm({ ...form, fabricaMaquinaId: value })}
                value={isEdit ? updateForm?.fabricaMaquinaId : undefined}
              >
                {fabricaMaquinas?.map(({ id, fabrica }) => (
                  <Option key={id} value={id}>
                    {fabrica}
                  </Option>
                ))}
              </Select>
              <Select
                label={"Modelo de la Máquina"}
                onChange={(value) => setForm({ ...form, modeloMaquinaId: value })}
                value={isEdit ? updateForm?.modeloMaquinaId : undefined}
              >
                {modeloMaquinas?.map(({ id, modelo }) => (
                  <Option key={id} value={id}>
                    {modelo}
                  </Option>
                ))}
              </Select>
            </GroupInputs>
            <GroupInputs>
              <Select
                label={"Nombre de Máquina"}
                onChange={(value) => setForm({ ...form, nombreMaquinaId: value })}
                value={isEdit ? updateForm?.nombreMaquinaId : undefined}
              >
                {nombreMaquinas?.map(({ id, nombre }) => (
                  <Option key={id} value={id}>
                    {nombre}
                  </Option>
                ))}
              </Select>
              <Select
                label={"Procedencia"}
                onChange={(value) => setForm({ ...form, paisId: value })}
                value={isEdit ? updateForm?.paisId : undefined}
              >
                {paises?.map(({ id, nombre }) => (
                  <Option key={id} value={id}>
                    {nombre}
                  </Option>
                ))}
              </Select>
            </GroupInputs>
          </Group>
          {/* Datos del motor */}
          <Group title={"Datos del Motor"}>
            <GroupInputs>
              <Input
                label={"Código Original del Motor"}
                onChange={(e) => setForm({ ...form, codigoOriginal: e.target.value })}
                defaultValue={isEdit ? updateForm?.codigoOriginal : undefined}
              />
              <Input
                label={"Modelo del Motor"}
                onChange={(e) => setForm({ ...form, modeloMotor: e.target.value })}
                defaultValue={isEdit ? updateForm?.modeloMotor : undefined}
              />
            </GroupInputs>
            <GroupInputs>
              <Select
                label={"Marca del Motor"}
                onChange={(value) => setForm({ ...form, marcaMotorId: value })}
                value={isEdit ? updateForm?.marcaMotorId : undefined}
              >
                {marcaMotores?.map(({ id, marca }) => (
                  <Option key={id} value={id}>
                    {marca}
                  </Option>
                ))}
              </Select>
              <Select
                label={"Procedencia"}
                onChange={(value) => setForm({ ...form, motorPaisId: value })}
                value={isEdit ? updateForm?.motorPaisId : undefined}
              >
                {paises?.map(({ id, nombre }) => (
                  <Option key={id} value={id}>
                    {nombre}
                  </Option>
                ))}
              </Select>
              <Input
                label={"N° de cilindros"}
                onChange={(e) => setForm({ ...form, numeroCilindros: e.target.value })}
                defaultValue={isEdit ? updateForm?.numeroCilindros : undefined}
              />
            </GroupInputs>
          </Group>
          {/* Datos de la Bomba de inyeccion */}
          <Group title={"Datos de la bomba de Inyección"}>
            <GroupInputs>
              <Input
                label={"Código fábrica"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    codigoFabricaBombaInyeccion: e.target.value,
                  })
                }
                defaultValue={isEdit ? updateForm?.codigoFabricaBombaInyeccion : undefined}
              />
              <Input
                label={"Tipo de bomba de inyeccion"}
                onChange={(e) => setForm({ ...form, tipoBombaInyeccion: e.target.value })}
                defaultValue={isEdit ? updateForm?.tipoBombaInyeccion : undefined}
              />
            </GroupInputs>
            <GroupInputs>
              <Select
                label={"Marca fábrica de Sistema de Inyección"}
                onChange={(value) => setForm({ ...form, marcaFabricaSistemaInyeccionId: value })}
                value={isEdit ? updateForm?.marcaFabricaSistemaInyeccionId : undefined}
              >
                {marcaFabricaSistemaInyeccion?.map(({ id, marca }) => (
                  <Option key={id} value={id}>
                    {marca}
                  </Option>
                ))}
              </Select>
              <Select
                label={"Descripción de Bomba de Inyección"}
                onChange={(value) => setForm({ ...form, descripcionBombaInyeccionId: value })}
                value={isEdit ? updateForm?.descripcionBombaInyeccionId : undefined}
              >
                {descripcionBombasInyeccion?.map(({ id, descripcion }) => (
                  <Option key={id} value={id}>
                    {descripcion}
                  </Option>
                ))}
              </Select>
            </GroupInputs>
            <GroupInputs>
              <Select
                label={"Procedencia"}
                value={isEdit ? updateForm?.bombaInyeccionPaisId : undefined}
                onChange={(value) => setForm({ ...form, bombaInyeccionPaisId: value })}
              >
                {paises?.map(({ id, nombre }) => (
                  <Option key={id} value={id}>
                    {nombre}
                  </Option>
                ))}
              </Select>
              <Input
                label={"Código original de Bomba de Inyección"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    codigoOriginalBombaInyeccion: e.target.value,
                  })
                }
                defaultValue={isEdit ? updateForm?.codigoOriginalBombaInyeccion : undefined}
              />
            </GroupInputs>
          </Group>
          {/* Datos del inyector */}
          <Group title={"Datos del Inyector"}>
            <GroupInputs>
              <Input
                label={"Código fábrica"}
                onChange={(e) => setForm({ ...form, codigoFabricaInyector: e.target.value })}
                defaultValue={isEdit ? updateForm?.codigoFabricaInyector : undefined}
              />
              <Input
                label={"Tipo fábrica Inyector"}
                onChange={(e) => setForm({ ...form, tipoFabricaInyector: e.target.value })}
                defaultValue={isEdit ? updateForm?.tipoFabricaInyector : undefined}
              />
            </GroupInputs>
            <GroupInputs>
              <Select
                label={"Marca fábrica del Inyector"}
                value={isEdit ? updateForm?.marcaFabricaInyectorId : undefined}
                onChange={(value) => setForm({ ...form, marcaFabricaInyectorId: value })}
              >
                {marcaFabricaInyector?.map(({ id, marca }) => (
                  <Option key={id} value={id}>
                    {marca}
                  </Option>
                ))}
              </Select>
              <Select
                label={"Descripción del Inyector"}
                value={isEdit ? updateForm?.descripcionInyectorId : undefined}
                onChange={(value) => setForm({ ...form, descripcionInyectorId: value })}
              >
                {descripcionInyector?.map(({ id, descripcion }) => (
                  <Option key={id} value={id}>
                    {descripcion}
                  </Option>
                ))}
              </Select>
            </GroupInputs>
            <GroupInputs>
              <Select
                label={"Procedencia"}
                value={isEdit ? updateForm?.inyectorPaisId : undefined}
                onChange={(value) => setForm({ ...form, inyectorPaisId: value })}
              >
                {paises?.map(({ id, nombre }) => (
                  <Option key={id} value={id}>
                    {nombre}
                  </Option>
                ))}
              </Select>
              <Input
                label={"Código original del Inyector"}
                defaultValue={isEdit ? updateForm?.codigoOriginalInyector : undefined}
                onChange={(e) => setForm({ ...form, codigoOriginalInyector: e.target.value })}
              />
            </GroupInputs>
            <GroupInputs>
              <Input
                label={"Código Tobera"}
                defaultValue={isEdit ? updateForm?.codigoTobera : undefined}
                onChange={(e) => setForm({ ...form, codigoTobera: e.target.value })}
              />
              <Input
                label={"Tipo Tobera"}
                defaultValue={isEdit ? updateForm?.tipoTobera : undefined}
                onChange={(e) => setForm({ ...form, tipoTobera: e.target.value })}
              />
            </GroupInputs>
          </Group>
          <div className="w-full flex justify-end gap-5">
            <ButtonCancel onClick={closeModal} />
            <ButtonSave onClick={saveData} />
          </div>
        </form>
      </ModalLg>
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
