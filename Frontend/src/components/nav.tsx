import Link from "next/link";

const navComponent = () => {
    return (
        <>
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    {/* <a className="navbar-item" href="https://bulma.io">
                        <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
                    </a> */}
                </div>

                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-start">
                        <Link className="navbar-item" href="/">
                            Questions
                        </Link>

                        <Link className="navbar-item" href="./pages/users">
                            Users
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default navComponent