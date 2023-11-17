import type { AppProps } from 'next/app';
import '../../dist/output.css';
import 'bulma/css/bulma.css';

import { ChakraBaseProvider, extendTheme } from '@chakra-ui/react';
import { ToastContainer } from 'react-toastify';

const theme = extendTheme({});

export default function App({ Component, pageProps }: AppProps) {
    return (
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
    );
}
