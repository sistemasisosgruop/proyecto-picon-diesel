import Layout from '../components/layout/Layout';
import '../styles/globals.css'
import { ThemeProvider } from "@material-tailwind/react";

function MyApp({ Component, pageProps }) {
  return (
		<ThemeProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ThemeProvider>
  );
}

export default MyApp
