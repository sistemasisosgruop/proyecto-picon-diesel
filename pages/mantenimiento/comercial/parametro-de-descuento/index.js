import { Input } from "@material-tailwind/react";
import { useState } from "react";
import {
  ButtonEdit,
  ButtonSave,
} from "../../../../app/components/elements/Buttons";
import { Title } from "../../../../app/components/elements/Title";
import TemplateComercial from "../../../../app/components/templates/mantenimiento/TemplateComercial";
import { axiosRequest } from "../../../../app/utils/axios-request";
import { useLocalStorage } from "../../../../app/hooks/useLocalStorage";
import { useQuery } from "react-query";
import { errorProps, successProps } from "../../../../app/utils/alert-config";
import {  toast } from "react-toastify";
import { ToastAlert } from "../../../../app/components/elements/ToastAlert";

export default function ParametroDescuento() {
  const [isEdit, setIsEdit] = useState(false);
  const [empresaId] = useLocalStorage("empresaId");
  const [form, setForm] = useState({
    de: null,
    a: null,
  });

  const saveData = async () => {
    try {
      if (form.de < 0 || form.a < 0) {
        throw new Error("Los valores no pueden ser negativos");
      }
      await axiosRequest("post", "/api/mantenimiento/parametro-descuento", {
        ...form,
        de: parseFloat(form.de) || undefined,
        a: parseFloat(form.a) || undefined,
        empresaId: parseInt(empresaId),
      });

      toast.success(`🦄 Registro actualizado exitosamente!`, successProps);
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  const getParametro = async () => {
    const { data } = await axiosRequest(
      "get",
      `/api/mantenimiento/parametro-descuento?empresaId=${empresaId}`
    );

    return data;
  };

  const { data } = useQuery("getParametro", getParametro, {
    initialData: {
      data: [],
    },
  });

  return (
    <TemplateComercial>
      <Title text={"Parametro de descuento "}></Title>
      {/* Form */}
      <form className="flex gap-3">
        <p>Rango de descuento</p>
        <Input
          type="number"
          label={data?.data?.de ?? "De"}
          disabled={!isEdit}
          onChange={(e) => setForm({ ...form, de: e.target.value })}
        />
        <p>-</p>
        <Input
          type="number"
          label={data?.data?.a ?? "A"}
          disabled={!isEdit}
          onChange={(e) => setForm({ ...form, a: e.target.value })}
        />
        {isEdit ? (
          <ButtonSave
            onClick={() => {
              setIsEdit(false);
              saveData();
            }}
          />
        ) : (
          <ButtonEdit onClick={() => setIsEdit(true)} />
        )}
      </form>
       
    </TemplateComercial>
  );
}
