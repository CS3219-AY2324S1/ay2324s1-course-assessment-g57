import Link from 'next/link';

const navComponent = () => {
    return (
        <>
            <nav className="navbar">
                <div id="navBarMenu" className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <Link
                                className="button is-danger is-small"
                                href="/dashboard"
                            >
                                Leave Room
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default navComponent;
