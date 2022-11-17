import "../styles/globals.css";
import { ThemeProvider } from "@material-tailwind/react";
import LayoutDefault from "../app/components/layouts/LayoutDefault";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <LayoutDefault>
        <Component {...pageProps} />
      </LayoutDefault>
    </ThemeProvider>
  );
}

export default MyApp;
