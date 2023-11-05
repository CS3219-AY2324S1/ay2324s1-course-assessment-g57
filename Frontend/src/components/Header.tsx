import { Popover } from '@headlessui/react';
import Link from 'next/link';
import Image from 'next/image';

type HeaderProps = {
    user?: any;
    loading?: boolean;
};

const Header = ({ user, loading }: HeaderProps) => {
    return (
        <header className="bg-white dark:bg-black">
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <Link href="/dashboard" className="-m-1.5 p-1.5">
                        <Image
                            className="h-8 w-auto"
                            src="/logo.png"
                            alt="logo"
                            width="123"
                            height="123"
                        />
                    </Link>
                </div>
                <Popover.Group className="hidden lg:flex lg:gap-x-12">
                    {/* <Link
                        href="/questions"
                        className="text-m font-semibold leading-6 text-gray-900"
                    >
                        Questions
                    </Link> */}
                    {user?.peerprepRoles?.[0] === 'Admin' ? (
                        <Link
                            href="/users"
                            className="text-m font-semibold leading-6 text-gray-900"
                        >
                            Users
                        </Link>
                    ) : (
                        <></>
                    )}
                </Popover.Group>

                {!loading &&
                    (user ? (
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-5">
                            <Link
                                href="/profile"
                                className="text-m font-semibold leading-6 text-gray-900"
                            >
                                Profile
                            </Link>
                            <Link
                                href="/api/auth/logout"
                                className="text-m font-semibold leading-6 text-gray-900"
                            >
                                Log out <span aria-hidden="true">&rarr;</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                            <Link
                                href="/api/auth/login"
                                className="text-m font-semibold leading-6 text-gray-900"
                            >
                                Log in <span aria-hidden="true">&rarr;</span>
                            </Link>
                        </div>
                    ))}
            </nav>
        </header>
    );
};

export default Header;
