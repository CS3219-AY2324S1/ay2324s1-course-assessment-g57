import Link from 'next/link';
import Image from 'next/image';

const Nav = () => {
    return (
        <>
            <nav
                className="navbar is-fixed-top"
                role="navigation"
                aria-label="main navigation"
            >
                <div className="navbar-brand">
                    <Link className="navbar-item" href="/dashboard">
                        <Image
                            src="/logo.png"
                            className="h-8 w-auto sm:h-10 mr-2"
                            width="400"
                            height="400"
                            alt="peerprep logo"
                        />
                        <h1 className="is-size-4 has-text-weight-semibold">
                            PeerPrep
                        </h1>
                    </Link>
                </div>
            </nav>
        </>
    );
};

export default Nav;
