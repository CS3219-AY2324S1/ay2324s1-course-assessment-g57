const MainApp = () => {
    return (
        <>
            <nav className="navbar is-fixed-top" role="navigation" aria-label="main nagivation">
                <div className="navbar-brand">
                    <a className="navbar-item" href="/">
                        <img src="logo.png" alt="PeerPrep: The collaborative way to practice technical interview questions" height="28" />
                        <h1 className="is-size-4 has-text-weight-semibold">PeerPrep</h1>
                    </a>
                </div>

                <div className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="field is-grouped">
                                <p className="control">
                                    <a className="button is-primary">
                                        Sign up
                                    </a>
                                </p>
                                <p className="control">
                                    <a className="button is-light" href="">
                                        Login
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="hero is-primary is-halfheight">
                <div className="hero-body">
                    <div className="container">
                        <div className="column is-two-fifths">
                        <p className="title">
                            The collaborative way to practice technical interview questions
                        </p>
                        <p/>
                        <p className="subtitle">
                            Sign up and start coding with others today!
                        </p>
                        <p>
                        <a className="button is-primary">
                                        Sign up
                                    </a>
                        </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="hero is-large">
                <div className="hero-body">
                    <p className="title">
                        Why choose PeerPrep?
                    </p>
                    <p className="subtitle">
                        Primary subtitle
                    </p>
                </div>
            </section>

            <section className="hero is-primary">
                <div className="hero-body">
                    <p className="title">
                        Primary hero
                    </p>
                    <p className="subtitle">
                        Primary subtitle
                    </p>
                </div>
            </section>
        </>
    );
};

export default MainApp;
