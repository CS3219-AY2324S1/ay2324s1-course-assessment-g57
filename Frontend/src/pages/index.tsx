import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

const MainApp = () => {
    const { user } = useUser();
    const { push } = useRouter();

    console.log(user);

    if (user) {
        push('/dashboard');
    }

    return (
        <>
            {/* Navbar Section */}
            <nav
                className="navbar is-fixed-top"
                role="navigation"
                aria-label="main nagivation"
            >
                <div className="navbar-brand">
                    <Link className="navbar-item" href="/">
                        <Image
                            src="/logo.png"
                            alt="PeerPrep: The collaborative way to practice technical interview questions"
                            height="28"
                            width="88"
                        />
                        <h1 className="is-size-4 has-text-weight-semibold">
                            PeerPrep
                        </h1>
                    </Link>
                </div>

                <div className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="field is-grouped">
                                <p className="control">
                                    <Link
                                        className="button is-light"
                                        href="/api/auth/login"
                                    >
                                        Login
                                    </Link>
                                </p>
                                <p className="control">
                                    <Link
                                        className="button is-primary"
                                        href="/api/auth/login"
                                    >
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="has-navbar-fixed-top">
                {/* Main Section */}
                <section className="hero is-link is-medium">
                    <div className="hero-body">
                        <div className="container">
                            <div className="columns">
                                <div className="column is-two-fifths">
                                    <p className="title">
                                        The collaborative way to practice
                                        technical interview questions
                                    </p>
                                    <p />
                                    <p className="subtitle">
                                        Sign up and start coding with others
                                        today!
                                    </p>
                                    <p>
                                        <Link
                                            className="button is-primary"
                                            href="/api/auth/login"
                                        >
                                            Sign up
                                        </Link>
                                        &nbsp;
                                        <Link
                                            className="button is-link is-outlined is-inverted"
                                            href="/api/auth/login"
                                        >
                                            Login
                                        </Link>
                                    </p>
                                </div>
                                <div className="column">
                                    <Image
                                        src="/assets/dashboard/main-stock.jpg"
                                        alt="Stock image of a person coding"
                                        sizes="100vw"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                        }}
                                        width={500}
                                        height={300}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features intro */}
                <section className="section">
                    <div className="container">
                        <div className="columns is-centered">
                            <div className="column has-text-centered">
                                <h1 className="is-size-2">Why PeerPrep?</h1>
                                <p className="is-size-4">
                                    Let&lsquo;s take a look at the features that
                                    make PeerPrep your choice for technical
                                    interview preparation.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="hero">
                    <div className="hero-body">
                        <p className="title has-text-centered">Features</p>
                        <div className="container">
                            {/* Row 1 */}
                            <div className="columns is-centered">
                                <div className="column is-half has-text-centered">
                                    <div className="box">
                                        <Image
                                            className="is-inline-block"
                                            src="/assets/dashboard/lang-support.png"
                                            alt="Language support image"
                                            width="400"
                                            height="400"
                                        ></Image>
                                        <h3 className="is-size-3">
                                            Language Support
                                        </h3>
                                        <p>
                                            PeerPrep supports coding in multiple
                                            languages including Python, Java,
                                            C++, C#, Kotlin and Go
                                        </p>
                                    </div>
                                </div>

                                <div className="column is-half has-text-centered">
                                    <div className="box">
                                        <Image
                                            className="is-inline-block"
                                            src="/assets/dashboard/sandbox-stock.jpg"
                                            alt="Coding sandbox image"
                                            width="400"
                                            height="400"
                                        ></Image>
                                        <h3 className="is-size-3">
                                            Coding Sandbox
                                        </h3>
                                        <p>
                                            Work together with others. Determine
                                            your own rules. Work on the
                                            questions you want.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="columns is-centered">
                                <div className="column is-half has-text-centered">
                                    <div className="box">
                                        <Image
                                            className="is-inline-block"
                                            src="/assets/dashboard/video-call-stock2.jpg"
                                            alt="video calling image"
                                            width="400"
                                            height="400"
                                        ></Image>
                                        <h3 className="is-size-3">
                                            Video Calling
                                        </h3>
                                        <p>
                                            Interact and connect with your peer
                                            through video calling. Comunicate
                                            your thoughts virtually
                                        </p>
                                    </div>
                                </div>

                                <div className="column is-half has-text-centered">
                                    <div className="box">
                                        <Image
                                            className="is-inline-block"
                                            src="/assets/dashboard/code-execution-stock.jpg"
                                            alt="Code execution image"
                                            width="400"
                                            height="400"
                                        ></Image>
                                        <h3 className="is-size-3">
                                            Code Execution
                                        </h3>
                                        <p>
                                            Test the results of your
                                            collaborative hardwork included in
                                            your sandbox and see the results in
                                            the editor output
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Development Team Section */}
                <section className="hero is-link is-medium">
                    <div className="hero-body">
                        <p className="title has-text-centered">
                            Development Team
                        </p>
                        <div className="columns">
                            <div className="column">
                                <div className="card">
                                    <div className="card-image">
                                        <figure className="image is-square">
                                            <Image
                                                src="https://avatars.githubusercontent.com/u/45633172"
                                                alt="Owen's profile picture"
                                                height="128"
                                                width="128"
                                            />
                                        </figure>
                                    </div>

                                    <div className="card-content">
                                        <div className="content">
                                            <h1 className="is-size-4">
                                                Tan Teong Yu, Owen
                                            </h1>
                                            User authentication, AWS deployment
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <Link
                                            href="https://github.com/mslevis"
                                            className="card-footer-item"
                                        >
                                            Github
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="column">
                                <div className="card">
                                    <div className="card-image">
                                        <figure className="image is-square">
                                            <Image
                                                src="https://avatars.githubusercontent.com/u/27757912"
                                                alt="Shuimei's profile picture"
                                                height="128"
                                                width="128"
                                            />
                                        </figure>
                                    </div>

                                    <div className="card-content">
                                        <div className="content">
                                            <h1 className="is-size-4">
                                                He Shuimei
                                            </h1>
                                            Frontend development
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <Link
                                            href="https://github.com/shuimeihe"
                                            className="card-footer-item"
                                        >
                                            Github
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="column">
                                <div className="card">
                                    <div className="card-image">
                                        <figure className="image is-square">
                                            <Image
                                                src="https://avatars.githubusercontent.com/u/40551779"
                                                alt="Gibson's profile picture"
                                                height="128"
                                                width="128"
                                            />
                                        </figure>
                                    </div>

                                    <div className="card-content">
                                        <div className="content">
                                            <h1 className="is-size-4">
                                                Gibson
                                            </h1>
                                            Collaborative code editor
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <Link
                                            href="https://github.com/Gibson0918"
                                            className="card-footer-item"
                                        >
                                            Github
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="column">
                                <div className="card">
                                    <div className="card-image">
                                        <figure className="image is-square">
                                            <Image
                                                src="https://avatars.githubusercontent.com/u/95520072"
                                                alt="Daniels's profile picture"
                                                height="128"
                                                width="128"
                                            />
                                        </figure>
                                    </div>

                                    <div className="card-content">
                                        <div className="content">
                                            <h1 className="is-size-4">
                                                Daniel Lim Wei En
                                            </h1>
                                            Video call service
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <Link
                                            href="https://github.com/DanielLimWeiEn"
                                            className="card-footer-item"
                                        >
                                            Github
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="column">
                                <div className="card">
                                    <div className="card-image">
                                        <figure className="image is-square">
                                            <Image
                                                src="https://avatars.githubusercontent.com/u/92283593"
                                                alt="Benjamin's profile picture"
                                                height="128"
                                                width="128"
                                            />
                                        </figure>
                                    </div>

                                    <div className="card-content">
                                        <div className="content">
                                            <h1 className="is-size-4">
                                                Benjamin Sim
                                            </h1>
                                            Matching service
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <Link
                                            href="https://github.com/Benjamin-Sim"
                                            className="card-footer-item"
                                        >
                                            Github
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="footer">
                    <div className="content has-text-centered">
                        <p>
                            <strong>PeerPrep</strong> by Group 57, CS3219
                            AY2324S1
                        </p>
                        <p>
                            View source code on&nbsp;
                            <Link href="https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g57">
                                Github
                            </Link>
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default MainApp;
