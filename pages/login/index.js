import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthDispatch, useAuthState } from "../../contexts/auth.context";
import { axiosRequest } from "../../app/utils/axios-request";

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
      const { data } = await axiosRequest("POST", "api/auth/login", user);
      authDispatch({ type: "login", token: data?.token });
      router.push("/mantenimiento/datos-empresa");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>LOGIN</h1>
      <h2>username</h2>
      <input
        type="text"
        onChange={(e) => {
          setuser({ ...user, email: e.target.value });
        }}
      />
      <h2>password</h2>
      <input
        type="password"
        onChange={(e) => {
          setuser({ ...user, password: e.target.value });
        }}
      />
      <br></br>
      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
};
