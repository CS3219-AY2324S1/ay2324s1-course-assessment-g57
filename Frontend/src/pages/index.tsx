const MainApp = () => {
    return (
        <>
            <nav className="nav">
                <div className="navbar-brand">
                    <a className="navbar-item" href="/">
                        <img src="facicon.ico" width="112"/>
                    </a>
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <a className="button is-primary">
                                <strong>Sign up</strong>
                            </a>
                            <a className="button is-light">
                                Log in
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="hero is-primary is-halfheight">
                <div className="hero-body">
                    <div className="">
                        <p className="title">
                            PeerPrep
                        </p>
                        <p className="subtitle">
                            The collaborative way to practice technical interview questions
                        </p>
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
