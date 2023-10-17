import Head from "next/head";
import Header from "./header";
// import NavBar from './Nav'

type LayoutProps = {
  user?: any;
  loading?: boolean;
  children: React.ReactNode;
};

const Layout = ({ user, loading = false, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>PeerPrep</title>
        <meta
          name="description"
          content="auto generated content by chatgpt so this is plagurism 100%"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>

      <Header user={user} loading={loading} />

      {/* <NavBar /> */}
      <main>
        <div className="md:container md:mx-autocontainer mx-auto">{children}</div>
      </main>

      <style jsx>{`
        .container {
          max-width: 42rem;
          margin: 1.5rem auto;
        }
      `}</style>
      <style jsx global>{`
        body {
          margin: 0;
          color: #333;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }
      `}</style>
    </>
  );
};

export default Layout;
