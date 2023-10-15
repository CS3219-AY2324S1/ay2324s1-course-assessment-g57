import type { AppProps } from "next/app";
// import "bulma/css/bulma.css";
import "../../dist/output.css"
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function App({ Component, pageProps }: AppProps) {
    const { user } = pageProps;
    return(
        <UserProvider user={user}>
            <Component {...pageProps} />
        </UserProvider>
    ) 
}
