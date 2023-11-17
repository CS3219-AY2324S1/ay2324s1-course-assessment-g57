import type { AppProps } from 'next/app';
import '../../dist/output.css';
import 'bulma/css/bulma.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';

import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';

import { ToastContainer } from 'react-toastify';

const theme = extendTheme({});

export default function App({ Component, pageProps }: AppProps) {
    const { user } = pageProps;
    return (
        <UserProvider user={user}>
            <ChakraBaseProvider theme={theme}>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    limit={2}
                />
                <Component {...pageProps} />
            </ChakraBaseProvider>
        </UserProvider>
    );
}
