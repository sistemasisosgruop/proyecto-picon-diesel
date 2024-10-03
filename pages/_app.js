"use client";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@material-tailwind/react";
import LayoutDefault from "../app/components/layouts/LayoutDefault";
import { AuthProvider } from "../contexts/auth.context";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { useRef } from "react";
import * as yup from "yup";
import { FormProvider } from "../contexts/form.context";
import { ToastContainer } from "react-toastify";
import { MaterialesProvider } from "../contexts/materiales.context";
import { VentaMostradorProvider } from "../contexts/venta-mostrador.context";
import { ProtectedRoute } from "../app/components/routes/ProtectedRoute";
import { VentaServiciosProvider } from "../contexts/venta-servicios.context";

yup.setLocale({
  mixed: {
    required: "campo obligatorio",
    notType: "campo invalido o vacio",
  },
  string: {
    email: "correo invalido",
    min: "Este campo debe tener al menos {min} caracteres",
    max: "Este campo debe tener como máximo {max} caracteres",
  },
  number: {
    min: ({ min }) => `Este campo debe ser mayor o igual a ${min}`,
    max: ({ max }) => `Este campo debe ser menor o igual a ${max}`,
  },
});

function MyApp({ Component, pageProps, router }) {
  const queryClient = useRef(new QueryClient());

  return (
    <QueryClientProvider client={queryClient.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <AuthProvider>
          <ProtectedRoute router={router}>
            <FormProvider>
              <MaterialesProvider>
                <VentaMostradorProvider>
                  <VentaServiciosProvider>
                    <ThemeProvider>
                      <LayoutDefault>
                        <Component {...pageProps} />
                      </LayoutDefault>
                    </ThemeProvider>
                  </VentaServiciosProvider>
                </VentaMostradorProvider>
              </MaterialesProvider>
            </FormProvider>
          </ProtectedRoute>
        </AuthProvider>
      </Hydrate>
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default MyApp;
