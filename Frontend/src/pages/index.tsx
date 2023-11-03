import Link from 'next/link';
import Image from 'next/image';

const MainApp = () => {
    return (
        <>
            <nav
                className="navbar is-fixed-top"
                role="navigation"
                aria-label="main nagivation"
            >
                <div className="navbar-brand">
                    <a className="navbar-item" href="/">
                        <Image
                            src="/logo.png"
                            alt="PeerPrep: The collaborative way to practice technical interview questions"
                            height="28" width="88"
                        />
                        <h1 className="is-size-4 has-text-weight-semibold">
                            PeerPrep
                        </h1>
                    </a>
                </div>

                <div className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="field is-grouped">
                                <p className="control">
                                    <Link
                                        className="button is-primary"
                                        href="/"
                                    >
                                        Sign Up
                                    </Link>
                                </p>
                                <p className="control">
                                    <Link
                                        className="button is-light"
                                        href="/"
                                    >
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="hero is-link is-halfheight">
                <div className="hero-body">
                    <div className="container">
                        <div className="column is-two-fifths">
                            <p className="title">
                                The collaborative way to practice technical
                                interview questions
                            </p>
                            <p />
                            <p className="subtitle">
                                Sign up and start coding with others today!
                            </p>
                            <p>
                                <a className="button is-primary">Sign up</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="hero is-large">
                <div className="hero-body">
                    <p className="title">Features</p>

                </div>
            </section>

            <section className="hero is-primary">
                <div className="hero-body">
                    <p className="title">Development Team</p>
                    <div className="column">

                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="column is-half">
                    <p>
                        PeerPrep by Group 57, CS3219 AY2324S1 
                    </p>
                </div>
                <div className="content has-text-centered">
                    
                </div>
            </footer>
        </>
    );
};

export default MainApp;
