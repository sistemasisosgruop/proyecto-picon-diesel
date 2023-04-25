"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthDispatch, useAuthState } from "../../contexts/auth.context";
import { axiosRequest } from "../../app/utils/axios-request";
import { ButtonLogin } from "../../app/components/elements/Buttons";
import { Input } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { errorProps } from "../../app/utils/alert-config";
import { ToastAlert } from "../../app/components/elements/ToastAlert";

export default function Login() {
  const [user, setuser] = useState({ email: "", password: "" });
  const router = useRouter();
  const authDispatch = useAuthDispatch();
  const auth = useAuthState();

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("/mantenimiento/datos-empresa");
    }
  }, []);

  const handleLogin = async () => {
    try {
      const { data } = await axiosRequest("post", "api/auth/login", user);
      authDispatch({ type: "login", token: data?.token });
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
