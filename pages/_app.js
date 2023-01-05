import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@material-tailwind/react";
import LayoutDefault from "../app/components/layouts/LayoutDefault";
import { AuthProvider } from "../contexts/auth.context";
import create from "zustand";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { useRef } from "react";
import * as yup from "yup";
import { FormProvider } from "../contexts/form.context";

export const useEmpresaStore = create((set) => ({
  empresaGlobal: { name: "default", id: 0 },
  updateEmpresaGlobal: (data) => set({ data }),
}));

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

function MyApp({ Component, pageProps }) {
  const queryClient = useRef(new QueryClient());

  return (
    <QueryClientProvider client={queryClient.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <AuthProvider>
          <FormProvider>
            <ThemeProvider>
              <LayoutDefault>
                <Component {...pageProps} />
              </LayoutDefault>
            </ThemeProvider>
          </FormProvider>
        </AuthProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
