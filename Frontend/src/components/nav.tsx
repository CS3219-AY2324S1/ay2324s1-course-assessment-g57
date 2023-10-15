import Link from "next/link";

type NavBarProps = {
    user?: any;
    loading?: boolean;
}

const navComponent = ({user, loading}: NavBarProps) => {
    return (
        <>
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a className="navbar-item" href="/">
                        <img src="/assets/trash.svg" width="50"/>
                    </a>
                </div>

                <div id="navBarMenu" className="navbar-menu">
                    <div className="navbar-start">
                        <Link className="navbar-item" href="/questions">
                            Questions
                        </Link>

                        <Link className="navbar-item" href="/users">
                            Users
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default navComponent