"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthDispatch, useAuthState } from "../../contexts/auth.context";
import { axiosRequest } from "../../app/utils/axios-request";
import { ButtonLogin } from "../../app/components/elements/Buttons";
import { Input } from "@material-tailwind/react";
import { toast } from "react-toastify";                              //* Alertas visuales en interfaz
import { errorProps } from "../../app/utils/alert-config";
import { ToastAlert } from "../../app/components/elements/ToastAlert";

export default function Login() {
  const [user, setuser] = useState({ email: "", password: "" });    //* Estado inicial del usuario
  const router = useRouter();                                       //* Router de NextJs
  const authDispatch = useAuthDispatch();   //! Permite dispatch de acciones login/logout
  const auth = useAuthState();  //! Retorna estado de usuario actual si está autenticado o no

  useEffect(() => {               //* Ejecutado después que el componente se renderiza
    if (auth.isAuthenticated) {   //Verifica que la prop .isAuthenticated = true, (false en defaultUser no logeado)
      router.push("/mantenimiento/datos-empresa");  // if authenticated -> router.push
    }
  }, []);

  const handleLogin = async () => {   //* Ejecutado cuando se apreta botón de login
    try {
      //! Cambiar aqui el endpoint !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      const { data } = await axiosRequest("post", "api/auth/login", user);  // Se hace una solicitud al back y devuelve data, envia los datos alamcenados en user desde el form //Si hay un error en datos de login, habrá error,fin de try 
      authDispatch({ type: "login", token: data?.token });                  // Accede a data solo si existe, else, undefined se pasará a authDispatch
      router.push("/mantenimiento/datos-empresa");
    } catch (error) {
      toast.error(<ToastAlert error={error} />, errorProps);
    }
  };

  return (
    <div className=" w-full flex justify-center items-center bg-primary-800">
      <div className="flex flex-col gap-5 w-72 text-center bg-white rounded-lg shadow-md p-4">
        <h1 className="font-semibold text-xl text-primary-800">Iniciar sesión</h1>
        <Input
          label="Correo electrónico"
          onChange={(e) => {
            setuser({ ...user, email: e.target.value });
          }}
        ></Input>
        <Input
          label="Contraseña"
          type={"password"}
          onChange={(e) => {
            setuser({ ...user, password: e.target.value });
          }}
        ></Input>
        <ButtonLogin onClick={handleLogin} text={"Ingresar"}></ButtonLogin>
      </div>
    </div>
  );
}
