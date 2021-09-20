import "../styles/globals.css";
import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react";
import theme from "../lib/theme"

// const config: ThemeConfig = extendTheme({...theme});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
