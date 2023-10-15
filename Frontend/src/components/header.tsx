import { Popover} from '@headlessui/react'
import Link from "next/link";

type HeaderProps = {
  user?: any;
  loading?: boolean;
}

const Header = ({user, loading}: HeaderProps) => {
  return (
    <header className="bg-white dark:bg-black">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <img className="h-8 w-auto" src="favicon.ico" alt="" />
          </Link>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Link href="/questions" className="text-m font-semibold leading-6 text-gray-900">
            Questions
          </Link>
          <Link href="/users" className="text-m font-semibold leading-6 text-gray-900">
            Users
          </Link>
        </Popover.Group>
        {!loading &&
            (user ? (
              <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-5">
                <Link href="/profile" className="text-m font-semibold leading-6 text-gray-900">Profile</Link>
                <a href="/api/auth/logout" className="text-m font-semibold leading-6 text-gray-900">
                  Log out <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            ) : (
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <a href="/api/auth/login" className="text-m font-semibold leading-6 text-gray-900">
                  Log in <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            ))}
      </nav>
    </header>
  )
}

export default Header