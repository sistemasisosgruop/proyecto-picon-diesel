import "../styles/globals.css";
import { ThemeProvider } from "@material-tailwind/react";
import LayoutDefault from "../app/components/layouts/LayoutDefault";
import { AuthProvider } from "../contexts/auth.context";
import create from "zustand";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { useRef } from "react";

export const useEmpresaStore = create((set) => ({
  empresaGlobal: { name: "default", id: 0 },
  updateEmpresaGlobal: (data) => set({ data }),
}));

function MyApp({ Component, pageProps }) {
  const queryClient = useRef(new QueryClient());

  return (
    <QueryClientProvider client={queryClient.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <AuthProvider>
          <ThemeProvider>
            <LayoutDefault>
              <Component {...pageProps} />
            </LayoutDefault>
          </ThemeProvider>
        </AuthProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
