import Link from 'next/link';
import Image from 'next/image';

type NavProps = {
    user?: any;
    loading?: boolean;
};

const Nav = ({ user }: NavProps) => {
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

                <div className="navbar-menu">
                    <div className="navbar-start">
                        <div className="navbar-item">
                            <div className="field is-grouped">
                                {user?.peerprepRoles?.[0] === 'Admin' ? (
                                    <p className="control has-text-weight-medium">
                                        <Link href="/users">Users</Link>
                                    </p>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                        <div className="navbar-item">
                            <div className="field is-grouped">
                                <p className="control has-text-weight-medium">
                                    <Link href="/profile">Profile</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div className="navbar-item">
                            <div className="field is-grouped">
                                <p className="control">
                                    <Link
                                        className="button is-light is-danger"
                                        href="/api/auth/logout"
                                    >
                                        Log Out
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Nav;
