import Link from 'next/link';
import socket from '@/lib/socket';

const TopBar = () => {
    function disconnect() {
        socket.disconnect();
    }

    return (
        <>
            <nav className="navbar">
                <div id="navBarMenu" className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <Link
                                className="button is-danger is-small"
                                href="/dashboard"
                                onClick={disconnect}
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

export default TopBar;
