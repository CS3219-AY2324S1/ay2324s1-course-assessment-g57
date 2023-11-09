import Head from 'next/head';
import Nav from './Nav';

type LayoutProps = {
    title?: string;
    user?: any;
    loading?: boolean;
    children: React.ReactNode;
};

const Layout = ({ title, user, loading = false, children }: LayoutProps) => {
    return (
        <>
            <Head>
                <title>{title || 'PeerPrep'}</title>
                <meta
                    name="PeerPrep"
                    content="A collaborative platform for coders to practice technical interviews with their peers."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
            </Head>

            {/* <Header user={user} loading={loading} /> */}

            <div>
                <Nav user={user} loading={loading} />

                <main className="container">
                    <div className="container">{children}</div>
                </main>
            </div>
        </>
    );
};

export default Layout;
