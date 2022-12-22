import "../styles/globals.css";
import { ThemeProvider } from "@material-tailwind/react";
import LayoutDefault from "../app/components/layouts/LayoutDefault";
import { AuthProvider } from "../contexts/auth.context";
import { EmpresaProvider } from "../contexts/empresa.context";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <LayoutDefault>
        <AuthProvider>
          <EmpresaProvider>
            <Component {...pageProps} />
          </EmpresaProvider>
        </AuthProvider>
      </LayoutDefault>
    </ThemeProvider>
  );
}

export default MyApp;
