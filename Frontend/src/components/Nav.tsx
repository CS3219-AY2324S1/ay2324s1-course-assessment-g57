import Link from 'next/link';
import Image from 'next/image';

const navComponent = () => {
    return (
        <>
            <nav
                className="navbar is-fixed-top"
                role="navigation"
                aria-label="main navigation"
            >
                <div className="navbar-brand">
                    <Link className="navbar-item" href="/">
                        <Image
                            src="/assets/trash.svg"
                            width="50"
                            height="50"
                            alt="delete"
                        />
                    </Link>
                </div>

                <div id="navBarMenu" className="navbar-menu">
                    <div className="navbar-start">
                        <Link className="navbar-item" href="/questions">
                            Questions
                        </Link>

                        <Link className="navbar-item" href="/users">
                            Users
                        </Link>

                        <Link className="navbar-item" href="/video">
                            Video
                        </Link>

                        <Link className="navbar-item" href="/code">
                            Code
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default navComponent;
