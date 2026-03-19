'use client'

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {cn} from "@/lib/utils"
import { Show, SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";
import {useUser} from "@clerk/nextjs"


const navItems = [
    { label: "Library", href: "/" },
    { label: "Add New", href: "/books/new" },
]

const Navbar = () => {
    const pathName = usePathname();
    const { user } = useUser();

    return (
        <header className="w-full fixed z-50 bg-[var(--bg-primary)]">
            <div className="wrapper navbar-height py-4 flex justify-between items-center">
                <Link href="/" className="flex gap-0.5 items-center">
                    <Image
                        src="/assets/logo.png"
                        alt="Chapterchase"
                        width={42}
                        height={26}
                    />
                    <span className="logo-text">Chapterchase</span>
                </Link>

                <nav className="w-fit flex gap-7.5 items-center">
                    {navItems.map(({ label, href }) => {
                        const isActive = pathName === href;

                        return (
                            <Link
                                href={href} key={label}
                                className= {cn('nav-link-base',
                                isActive ? 'nav-link-active' :
                                    'text-black hover:opacity-70')}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="flex items-center gap-3">
                    <Show when="signed-out">
                        <SignInButton />
                        <SignUpButton />
                    </Show>
                    <Show when="signed-in">
                        <UserButton />
                        {user ?. firstName && (
                            <Link href="/subscriptions"
                            className="nav-user-name"
                            >{user.firstName}</Link>
                        )}
                    </Show>
                </div>
            </div>
        </header>
    )
}

export default Navbar;
