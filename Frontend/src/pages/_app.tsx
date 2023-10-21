import type { AppProps } from "next/app";
import "bulma/css/bulma.css";
import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";

import RoomContextProvider from "@/contexts/RoomContext";

const theme = extendTheme({});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RoomContextProvider>
      <ChakraBaseProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraBaseProvider>
    </RoomContextProvider>
  );
}
