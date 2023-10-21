import type { AppProps } from "next/app";
import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react'
import "../../dist/output.css"
import "bulma/css/bulma.css";
import { UserProvider } from '@auth0/nextjs-auth0/client';

const theme = extendTheme({})

export default function App({ Component, pageProps }: AppProps) {
    const { user } = pageProps;
    return(
        <UserProvider user={user}>
            <ChakraBaseProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraBaseProvider>
        </UserProvider>
    ) 
}
