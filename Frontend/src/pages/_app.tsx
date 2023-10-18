import type { AppProps } from "next/app";
import "bulma/css/bulma.css";
import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraBaseProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraBaseProvider>
    )
    
}
