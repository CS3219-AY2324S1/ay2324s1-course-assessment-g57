import type { AppProps } from 'next/app';
import '../../dist/output.css';
import 'bulma/css/bulma.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';

import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';

import { RoomContextProvider } from '@/contexts/RoomContext';

const theme = extendTheme({});

export default function App({ Component, pageProps }: AppProps) {
    const { user } = pageProps;
    return (
        <UserProvider user={user}>
            <RoomContextProvider>
                <ChakraBaseProvider theme={theme}>
                    <Component {...pageProps} />
                </ChakraBaseProvider>
            </RoomContextProvider>
        </UserProvider>
    );
}
